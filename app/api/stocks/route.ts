import { NextRequest, NextResponse } from 'next/server'
import { getYahooSymbol, API_ENDPOINTS } from '@/lib/api-config'

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const tickers = searchParams.get('tickers')

  if (!tickers) {
    return NextResponse.json(
      { error: 'Tickers parameter is required' },
      { status: 400 }
    )
  }

  const tickerList = tickers.split(',').map(t => t.trim().toUpperCase())
  const results: Record<string, {
    ticker: string
    price: number
    change: number
    changePercent: number
    error?: string
  }> = {}

  await Promise.all(
    tickerList.map(async (ticker) => {
      try {
        // Use centralized config for symbol formatting
        const symbol = getYahooSymbol(ticker)

        const response = await fetch(
          `${API_ENDPOINTS.YAHOO_FINANCE_CHART}/${symbol}?interval=1d&range=1d`,
          {
            headers: {
              'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
              'Accept': 'application/json, text/plain, */*',
              'Accept-Language': 'en-US,en;q=0.9',
              'Referer': 'https://finance.yahoo.com',
              'Origin': 'https://finance.yahoo.com',
            },
            next: { revalidate: 30 }, // Cache for 30 seconds on server
          }
        )

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`)
        }

        const data = await response.json()
        const result = data?.chart?.result?.[0]

        if (!result) {
          throw new Error('No data')
        }

        const meta = result.meta
        const regularMarketPrice = meta.regularMarketPrice
        const previousClose = meta.chartPreviousClose || meta.previousClose || regularMarketPrice
        const change = regularMarketPrice - previousClose
        const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0

        results[ticker] = {
          ticker,
          price: regularMarketPrice,
          change,
          changePercent,
        }
      } catch (error) {
        console.error(`Error fetching ${ticker}:`, error)
        results[ticker] = {
          ticker,
          price: 0,
          change: 0,
          changePercent: 0,
          error: 'Price unavailable',
        }
      }
    })
  )

  return NextResponse.json({
    prices: results,
    timestamp: new Date().toISOString(),
  })
}
