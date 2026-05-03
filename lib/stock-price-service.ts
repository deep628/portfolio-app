'use client'

export interface StockPrice {
  ticker: string
  price: number
  change: number
  changePercent: number
  lastUpdated: Date
  error?: string
}

export interface PriceCache {
  prices: Record<string, StockPrice>
  lastFetchTime: Date | null
}

// In-memory cache
let priceCache: PriceCache = {
  prices: {},
  lastFetchTime: null,
}

// Fetch stock price via our API route (avoids CORS issues)
export async function fetchStockPrice(ticker: string): Promise<StockPrice> {
  try {
    const response = await fetch(`/api/stocks?tickers=${ticker.toUpperCase()}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const priceData = data.prices[ticker.toUpperCase()]

    if (!priceData || priceData.error) {
      throw new Error(priceData?.error || 'No data returned')
    }

    return {
      ticker: ticker.toUpperCase(),
      price: priceData.price,
      change: priceData.change,
      changePercent: priceData.changePercent,
      lastUpdated: new Date(),
    }
  } catch (error) {
    console.error(`Error fetching price for ${ticker}:`, error)
    return {
      ticker: ticker.toUpperCase(),
      price: 0,
      change: 0,
      changePercent: 0,
      lastUpdated: new Date(),
      error: 'Price unavailable',
    }
  }
}

// Fetch multiple stock prices in a single request
export async function fetchMultipleStockPrices(
  tickers: string[]
): Promise<Record<string, StockPrice>> {
  if (tickers.length === 0) {
    return {}
  }

  const uniqueTickers = [...new Set(tickers.map(t => t.toUpperCase()))]

  try {
    const response = await fetch(`/api/stocks?tickers=${uniqueTickers.join(',')}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    const priceMap: Record<string, StockPrice> = {}

    uniqueTickers.forEach(ticker => {
      const priceData = data.prices[ticker]
      if (priceData) {
        priceMap[ticker] = {
          ticker,
          price: priceData.price,
          change: priceData.change,
          changePercent: priceData.changePercent,
          lastUpdated: new Date(data.timestamp),
          error: priceData.error,
        }
      } else {
        priceMap[ticker] = {
          ticker,
          price: 0,
          change: 0,
          changePercent: 0,
          lastUpdated: new Date(),
          error: 'Price unavailable',
        }
      }
    })

    // Update cache
    priceCache = {
      prices: { ...priceCache.prices, ...priceMap },
      lastFetchTime: new Date(),
    }

    return priceMap
  } catch (error) {
    console.error('Error fetching multiple prices:', error)

    // Return error state for all tickers
    const errorMap: Record<string, StockPrice> = {}
    uniqueTickers.forEach(ticker => {
      errorMap[ticker] = {
        ticker,
        price: 0,
        change: 0,
        changePercent: 0,
        lastUpdated: new Date(),
        error: 'Price unavailable',
      }
    })
    return errorMap
  }
}

// Get cached prices
export function getCachedPrices(): PriceCache {
  return priceCache
}

// Get cached price for a single ticker
export function getCachedPrice(ticker: string): StockPrice | null {
  return priceCache.prices[ticker.toUpperCase()] || null
}

// Clear cache
export function clearPriceCache(): void {
  priceCache = {
    prices: {},
    lastFetchTime: null,
  }
}

// Calculate time since last update
export function getTimeSinceUpdate(): string {
  if (!priceCache.lastFetchTime) {
    return 'Never'
  }

  const now = new Date()
  const diff = now.getTime() - priceCache.lastFetchTime.getTime()
  const seconds = Math.floor(diff / 1000)

  if (seconds < 60) {
    return `${seconds} second${seconds !== 1 ? 's' : ''} ago`
  }

  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) {
    return `${minutes} minute${minutes !== 1 ? 's' : ''} ago`
  }

  const hours = Math.floor(minutes / 60)
  return `${hours} hour${hours !== 1 ? 's' : ''} ago`
}
