'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageLayout } from '@/components/page-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { RefreshCw, TrendingUp, TrendingDown, DollarSign, Wallet, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'

// Types
interface Holding {
  id: string
  ticker: string
  name: string
  quantity: number
  avgBuyPrice: number
  currentPrice: number
}

interface StockPrice {
  price: number
  change: number
  changePercent: number
}

// Default US stock holdings
const DEFAULT_HOLDINGS: Holding[] = [
  { id: '1', ticker: 'AAPL', name: 'Apple Inc.', quantity: 50, avgBuyPrice: 145.00, currentPrice: 178.85 },
  { id: '2', ticker: 'MSFT', name: 'Microsoft Corporation', quantity: 30, avgBuyPrice: 320.50, currentPrice: 378.91 },
  { id: '3', ticker: 'GOOGL', name: 'Alphabet Inc.', quantity: 40, avgBuyPrice: 125.00, currentPrice: 141.80 },
  { id: '4', ticker: 'NVDA', name: 'NVIDIA Corporation', quantity: 15, avgBuyPrice: 450.00, currentPrice: 875.38 },
  { id: '5', ticker: 'JPM', name: 'JPMorgan Chase & Co.', quantity: 25, avgBuyPrice: 165.00, currentPrice: 195.42 },
  { id: '6', ticker: 'AMZN', name: 'Amazon.com Inc.', quantity: 20, avgBuyPrice: 155.00, currentPrice: 178.25 },
]

function formatUSD(amount: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
  }).format(amount)
}

export default function DashboardPage() {
  const [holdings, setHoldings] = useState<Holding[]>(DEFAULT_HOLDINGS)
  const [prices, setPrices] = useState<Record<string, StockPrice>>({})
  const [isLoading, setIsLoading] = useState(false)
  const [lastUpdated, setLastUpdated] = useState<string>('Not yet')

  // Fetch real prices from API
  const fetchPrices = useCallback(async () => {
    setIsLoading(true)
    const tickers = DEFAULT_HOLDINGS.map(h => h.ticker).join(',')
    
    try {
      const response = await fetch(`/api/stocks?tickers=${tickers}`)
      if (response.ok) {
        const data = await response.json()
        const pricesData = data.prices || data
        setPrices(pricesData)
        
        // Update holdings with real prices
        setHoldings(prev => prev.map(h => {
          const priceData = pricesData[h.ticker]
          if (priceData && priceData.price > 0) {
            return { ...h, currentPrice: priceData.price }
          }
          return h
        }))
        
        setLastUpdated(new Date().toLocaleTimeString())
      }
    } catch (error) {
      console.error('Error fetching prices:', error)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Fetch prices on mount
  useEffect(() => {
    fetchPrices()
  }, [fetchPrices])

  // Calculate portfolio summary
  const totalInvested = holdings.reduce((sum, h) => sum + h.quantity * h.avgBuyPrice, 0)
  const currentValue = holdings.reduce((sum, h) => sum + h.quantity * h.currentPrice, 0)
  const totalPL = currentValue - totalInvested
  const totalPLPercent = totalInvested > 0 ? (totalPL / totalInvested) * 100 : 0

  return (
    <PageLayout title="Portfolio Dashboard" description="Track your US stock investments">
      {/* Header Actions */}
      <div className="flex items-center justify-end gap-3 mb-6">
        <Badge variant="outline">Last updated: {lastUpdated}</Badge>
        <Button onClick={fetchPrices} disabled={isLoading} size="sm">
          <RefreshCw className={cn("h-4 w-4 mr-2", isLoading && "animate-spin")} />
          Refresh
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Invested</CardTitle>
            <Wallet className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUSD(totalInvested)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Current Value</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatUSD(currentValue)}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total P&L</CardTitle>
            {totalPL >= 0 ? (
              <TrendingUp className="h-4 w-4 text-green-500" />
            ) : (
              <TrendingDown className="h-4 w-4 text-red-500" />
            )}
          </CardHeader>
          <CardContent>
            <div className={cn("text-2xl font-bold", totalPL >= 0 ? "text-green-500" : "text-red-500")}>
              {formatUSD(totalPL)}
            </div>
            <p className={cn("text-xs", totalPL >= 0 ? "text-green-500" : "text-red-500")}>
              {totalPL >= 0 ? '+' : ''}{totalPLPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Holdings</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{holdings.length}</div>
            <p className="text-xs text-muted-foreground">stocks in portfolio</p>
          </CardContent>
        </Card>
      </div>

      {/* Holdings Table */}
      <Card>
        <CardHeader>
          <CardTitle>Your Holdings</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Stock</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Avg Price</TableHead>
                <TableHead className="text-right">Current</TableHead>
                <TableHead className="text-right">Value</TableHead>
                <TableHead className="text-right">P&L</TableHead>
                <TableHead className="text-right">Weight</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const value = holding.quantity * holding.currentPrice
                const invested = holding.quantity * holding.avgBuyPrice
                const pl = value - invested
                const plPercent = (pl / invested) * 100
                const weight = (value / currentValue) * 100
                const priceData = prices[holding.ticker]

                return (
                  <TableRow key={holding.id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded bg-primary/10 flex items-center justify-center">
                          <span className="text-xs font-bold text-primary">
                            {holding.ticker.slice(0, 2)}
                          </span>
                        </div>
                        <div>
                          <div className="font-medium">{holding.ticker}</div>
                          <div className="text-sm text-muted-foreground">{holding.name}</div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{holding.quantity}</TableCell>
                    <TableCell className="text-right">{formatUSD(holding.avgBuyPrice)}</TableCell>
                    <TableCell className="text-right">
                      <div>
                        {formatUSD(holding.currentPrice)}
                        {priceData && (
                          <div className={cn("text-xs", priceData.changePercent >= 0 ? "text-green-500" : "text-red-500")}>
                            {priceData.changePercent >= 0 ? '+' : ''}{priceData.changePercent.toFixed(2)}%
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatUSD(value)}</TableCell>
                    <TableCell className="text-right">
                      <div className={cn("font-medium", pl >= 0 ? "text-green-500" : "text-red-500")}>
                        {formatUSD(pl)}
                      </div>
                      <div className={cn("text-xs", pl >= 0 ? "text-green-500" : "text-red-500")}>
                        {pl >= 0 ? '+' : ''}{plPercent.toFixed(2)}%
                      </div>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {weight.toFixed(1)}%
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </PageLayout>
  )
}
