import { NextRequest, NextResponse } from 'next/server'
import { getYahooSymbol, API_ENDPOINTS } from '@/lib/api-config'

export interface StockInfo {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  currency: string
  exchange: string
  marketCap: number
  peRatio: number | null
  pbRatio: number | null
  dividendYield: number | null
  eps: number | null
  beta: number | null
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  avgVolume: number
  volume: number
  industry: string
  sector: string
  // Additional fundamental data
  trailingPE: number | null
  forwardPE: number | null
  priceToSales: number | null
  priceToBook: number | null
  enterpriseValue: number | null
  profitMargin: number | null
  operatingMargin: number | null
  returnOnEquity: number | null
  returnOnAssets: number | null
  revenueGrowth: number | null
  debtToEquity: number | null
  currentRatio: number | null
  quickRatio: number | null
  totalCash: number | null
  totalDebt: number | null
  freeCashFlow: number | null
  operatingCashFlow: number | null
  targetMeanPrice: number | null
  targetHighPrice: number | null
  targetLowPrice: number | null
  numberOfAnalysts: number | null
  recommendationKey: string | null
}

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const ticker = searchParams.get('ticker')

  if (!ticker) {
    return NextResponse.json(
      { error: 'Ticker parameter is required' },
      { status: 400 }
    )
  }

  const upperTicker = ticker.toUpperCase()
  // Use centralized config for symbol formatting
  const symbol = getYahooSymbol(upperTicker)

  // BUG 3 FIX: use query2 domain + full browser headers to reduce Yahoo Finance blocking
  const YAHOO_HEADERS = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'application/json, text/plain, */*',
    'Accept-Language': 'en-US,en;q=0.9',
    'Accept-Encoding': 'gzip, deflate, br',
    'Referer': 'https://finance.yahoo.com',
    'Origin': 'https://finance.yahoo.com',
  }

  try {
    // Fetch from Yahoo Finance — chart (v8, reliable) + quoteSummary (v10 via query2)
    const [quoteResponse, summaryResponse] = await Promise.all([
      fetch(
        `https://query2.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=5d`,
        { headers: YAHOO_HEADERS }
      ),
      fetch(
        `https://query2.finance.yahoo.com/v10/finance/quoteSummary/${symbol}?modules=price,summaryProfile,summaryDetail,financialData,defaultKeyStatistics,recommendationTrend`,
        { headers: YAHOO_HEADERS }
      ),
    ])

    const quoteData = await quoteResponse.json()
    const summaryData = await summaryResponse.json()

    const chartResult = quoteData?.chart?.result?.[0]
    const quoteSummary = summaryData?.quoteSummary?.result?.[0]

    if (!chartResult) {
      return NextResponse.json(
        { error: 'Stock not found' },
        { status: 404 }
      )
    }

    const meta = chartResult.meta
    const price = quoteSummary?.price || {}
    const summaryDetail = quoteSummary?.summaryDetail || {}
    const financialData = quoteSummary?.financialData || {}
    const defaultKeyStatistics = quoteSummary?.defaultKeyStatistics || {}
    const summaryProfile = quoteSummary?.summaryProfile || {}
    const recommendationTrend = quoteSummary?.recommendationTrend?.trend?.[0] || {}

    const regularMarketPrice = meta.regularMarketPrice || price.regularMarketPrice?.raw || 0
    const previousClose = meta.chartPreviousClose || meta.previousClose || regularMarketPrice
    const change = regularMarketPrice - previousClose
    const changePercent = previousClose > 0 ? (change / previousClose) * 100 : 0

    const stockInfo: StockInfo = {
      ticker: upperTicker,
      name: price.shortName || price.longName || meta.symbol || upperTicker,
      price: regularMarketPrice,
      change,
      changePercent,
      currency: meta.currency || 'USD',
      exchange: meta.exchangeName || 'NASDAQ',
      marketCap: price.marketCap?.raw || summaryDetail.marketCap?.raw || 0,
      peRatio: summaryDetail.trailingPE?.raw || defaultKeyStatistics.trailingPE?.raw || null,
      pbRatio: defaultKeyStatistics.priceToBook?.raw || null,
      dividendYield: summaryDetail.dividendYield?.raw ? summaryDetail.dividendYield.raw * 100 : null,
      eps: defaultKeyStatistics.trailingEps?.raw || null,
      beta: defaultKeyStatistics.beta?.raw || null,
      fiftyTwoWeekHigh: summaryDetail.fiftyTwoWeekHigh?.raw || 0,
      fiftyTwoWeekLow: summaryDetail.fiftyTwoWeekLow?.raw || 0,
      avgVolume: summaryDetail.averageVolume?.raw || 0,
      volume: price.regularMarketVolume?.raw || 0,
      industry: summaryProfile.industry || 'N/A',
      sector: summaryProfile.sector || 'N/A',
      // Fundamental data
      trailingPE: summaryDetail.trailingPE?.raw || null,
      forwardPE: summaryDetail.forwardPE?.raw || null,
      priceToSales: summaryDetail.priceToSalesTrailing12Months?.raw || null,
      priceToBook: defaultKeyStatistics.priceToBook?.raw || null,
      enterpriseValue: defaultKeyStatistics.enterpriseValue?.raw || null,
      profitMargin: financialData.profitMargins?.raw ? financialData.profitMargins.raw * 100 : null,
      operatingMargin: financialData.operatingMargins?.raw ? financialData.operatingMargins.raw * 100 : null,
      returnOnEquity: financialData.returnOnEquity?.raw ? financialData.returnOnEquity.raw * 100 : null,
      returnOnAssets: financialData.returnOnAssets?.raw ? financialData.returnOnAssets.raw * 100 : null,
      revenueGrowth: financialData.revenueGrowth?.raw ? financialData.revenueGrowth.raw * 100 : null,
      debtToEquity: financialData.debtToEquity?.raw || null,
      currentRatio: financialData.currentRatio?.raw || null,
      quickRatio: financialData.quickRatio?.raw || null,
      totalCash: financialData.totalCash?.raw || null,
      totalDebt: financialData.totalDebt?.raw || null,
      freeCashFlow: financialData.freeCashflow?.raw || null,
      operatingCashFlow: financialData.operatingCashflow?.raw || null,
      targetMeanPrice: financialData.targetMeanPrice?.raw || null,
      targetHighPrice: financialData.targetHighPrice?.raw || null,
      targetLowPrice: financialData.targetLowPrice?.raw || null,
      numberOfAnalysts: financialData.numberOfAnalystOpinions?.raw || null,
      recommendationKey: financialData.recommendationKey || null,
    }

    return NextResponse.json({
      stockInfo,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error(`Error fetching stock info for ${ticker}:`, error)
    return NextResponse.json(
      { error: 'Failed to fetch stock information' },
      { status: 500 }
    )
  }
}
