import { NextResponse } from 'next/server'
import { API_ENDPOINTS, MARKET_INDICES } from '@/lib/api-config'

export const dynamic = 'force-dynamic'

interface YahooFinanceQuote {
  chart: {
    result: Array<{
      meta: {
        regularMarketPrice: number
        previousClose: number
        symbol: string
        shortName: string
      }
    }> | null
    error: {
      code: string
      description: string
    } | null
  }
}

interface IndexData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  error?: string
}

async function fetchIndex(symbol: string, name: string): Promise<IndexData> {
  try {
    const url = `${API_ENDPOINTS.YAHOO_FINANCE_CHART}/${symbol}`
    
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/json, text/plain, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': 'https://finance.yahoo.com',
        'Origin': 'https://finance.yahoo.com',
      },
      next: { revalidate: 60 } // Cache for 60 seconds
    })

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`)
    }

    const data: YahooFinanceQuote = await response.json()

    if (data.chart.error || !data.chart.result || data.chart.result.length === 0) {
      throw new Error(data.chart.error?.description || 'No data')
    }

    const meta = data.chart.result[0].meta
    const price = meta.regularMarketPrice
    const previousClose = meta.previousClose
    const change = price - previousClose
    const changePercent = (change / previousClose) * 100

    return {
      symbol,
      name,
      price,
      change,
      changePercent
    }
  } catch (error) {
    console.error(`Error fetching ${symbol}:`, error)
    return {
      symbol,
      name,
      price: 0,
      change: 0,
      changePercent: 0,
      error: 'Failed to fetch'
    }
  }
}

export async function GET() {
  const indices = await Promise.all([
    fetchIndex(MARKET_INDICES.SP500.symbol, MARKET_INDICES.SP500.name),
    fetchIndex(MARKET_INDICES.DOW.symbol, MARKET_INDICES.DOW.name),
    fetchIndex(MARKET_INDICES.NASDAQ.symbol, MARKET_INDICES.NASDAQ.name)
  ])

  return NextResponse.json({
    indices,
    updatedAt: new Date().toISOString()
  })
}
