'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  fetchMultipleStockPrices,
  getCachedPrices,
  getTimeSinceUpdate,
  type StockPrice,
} from '@/lib/stock-price-service'

interface UseStockPricesResult {
  prices: Record<string, StockPrice>
  isLoading: boolean
  isRefreshing: boolean
  lastUpdated: string
  error: string | null
  refresh: () => Promise<void>
}

export function useStockPrices(
  tickers: string[],
  autoRefreshInterval: number = 60000 // 60 seconds
): UseStockPricesResult {
  const [prices, setPrices] = useState<Record<string, StockPrice>>({})
  const [isLoading, setIsLoading] = useState(true)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('Never')
  const [error, setError] = useState<string | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)
  const updateIntervalRef = useRef<NodeJS.Timeout | null>(null)

  // Fetch prices
  const fetchPrices = useCallback(async (isInitialLoad: boolean = false) => {
    if (tickers.length === 0) {
      setIsLoading(false)
      return
    }

    if (isInitialLoad) {
      setIsLoading(true)
    } else {
      setIsRefreshing(true)
    }
    setError(null)

    try {
      const fetchedPrices = await fetchMultipleStockPrices(tickers)
      setPrices(fetchedPrices)
      setLastUpdated(getTimeSinceUpdate())
    } catch (err) {
      setError('Failed to fetch stock prices')
      console.error('[v0] Error fetching prices:', err)
    } finally {
      setIsLoading(false)
      setIsRefreshing(false)
    }
  }, [tickers])

  // Initial fetch
  useEffect(() => {
    // Check cache first
    const cache = getCachedPrices()
    if (cache.lastFetchTime) {
      const cachedPrices: Record<string, StockPrice> = {}
      let hasCachedData = false
      
      tickers.forEach(ticker => {
        const cached = cache.prices[ticker.toUpperCase()]
        if (cached) {
          cachedPrices[ticker.toUpperCase()] = cached
          hasCachedData = true
        }
      })

      if (hasCachedData) {
        setPrices(cachedPrices)
        setLastUpdated(getTimeSinceUpdate())
        setIsLoading(false)
      }
    }

    // Fetch fresh data
    fetchPrices(true)
  }, [fetchPrices, tickers])

  // Auto-refresh interval
  useEffect(() => {
    if (autoRefreshInterval > 0) {
      intervalRef.current = setInterval(() => {
        fetchPrices(false)
      }, autoRefreshInterval)
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [autoRefreshInterval, fetchPrices])

  // Update "last updated" text every second
  useEffect(() => {
    updateIntervalRef.current = setInterval(() => {
      setLastUpdated(getTimeSinceUpdate())
    }, 1000)

    return () => {
      if (updateIntervalRef.current) {
        clearInterval(updateIntervalRef.current)
      }
    }
  }, [])

  // Manual refresh
  const refresh = useCallback(async () => {
    await fetchPrices(false)
  }, [fetchPrices])

  return {
    prices,
    isLoading,
    isRefreshing,
    lastUpdated,
    error,
    refresh,
  }
}
