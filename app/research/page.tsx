'use client'

import { useState, useRef } from 'react'
import { PageLayout } from '@/components/page-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Search,
  TrendingUp,
  TrendingDown,
  Loader2,
  AlertCircle,
  BarChart3,
  Activity,
  Shield,
  Wallet,
  Users,
  Target,
  Building2,
  Scale,
  Sparkles,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import ReactMarkdown from 'react-markdown'

interface StockInfo {
  ticker: string
  name: string
  price: number
  change: number
  changePercent: number
  exchange: string
  sector: string
  industry: string
  marketCap: number
  fiftyTwoWeekHigh: number
  fiftyTwoWeekLow: number
  trailingPE: number
  forwardPE: number
  priceToBook: number
  priceToSales: number
  profitMargin: number
  operatingMargin: number
  returnOnEquity: number
  returnOnAssets: number
  debtToEquity: number
  currentRatio: number
  dividendYield: number
  beta: number
  eps: number
  targetMeanPrice: number
  targetHighPrice: number
  targetLowPrice: number
  numberOfAnalysts: number
  recommendationKey: string
}

function formatUSD(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 2,
  }).format(value)
}

function formatMarketCap(value: number): string {
  if (value >= 1e12) return `$${(value / 1e12).toFixed(2)}T`
  if (value >= 1e9) return `$${(value / 1e9).toFixed(2)}B`
  if (value >= 1e6) return `$${(value / 1e6).toFixed(2)}M`
  return formatUSD(value)
}

function formatPercent(value: number | undefined): string {
  if (value === undefined || isNaN(value)) return 'N/A'
  return `${value.toFixed(2)}%`
}

export default function ResearchPage() {
  const [ticker, setTicker] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [stockInfo, setStockInfo] = useState<StockInfo | null>(null)
  const [error, setError] = useState<string | null>(null)

  // BUG 1 FIX: AI analysis state - now streams from /api/research
  const [aiAnalysis, setAiAnalysis] = useState<string>('')
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)
  const abortRef = useRef<AbortController | null>(null)

  const fetchAIAnalysis = async (info: StockInfo) => {
    // Cancel any in-progress stream
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setIsAnalyzing(true)
    setAiAnalysis('')
    setAiError(null)

    try {
      const response = await fetch('/api/research', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ stockInfo: info }),
        signal: controller.signal,
      })

      if (!response.ok) {
        const errData = await response.json().catch(() => ({}))
        throw new Error(errData.error || `AI analysis failed (${response.status})`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()

      if (!reader) throw new Error('No response stream')

      // Route returns plain text stream — read chunks directly
      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        const chunk = decoder.decode(value, { stream: true })
        if (chunk) setAiAnalysis(prev => prev + chunk)
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === 'AbortError') return
      setAiError(err instanceof Error ? err.message : 'AI analysis failed')
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleSearch = async () => {
    if (!ticker.trim()) return

    setIsLoading(true)
    setError(null)
    setStockInfo(null)
    setAiAnalysis('')
    setAiError(null)

    try {
      const response = await fetch(`/api/stock-info?ticker=${ticker.trim().toUpperCase()}`)
      const data = await response.json()

      if (!response.ok || data.error) {
        setError(data.error || 'Failed to fetch stock data')
        return
      }

      const info: StockInfo = data.stockInfo || data
      setStockInfo(info)

      // Automatically kick off AI analysis after fetching stock data
      fetchAIAnalysis(info)
    } catch {
      setError('Failed to fetch stock data. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <PageLayout
      title="Stock Research"
      description="Research US stocks with AI-powered 7-point financial analysis"
    >
      <div className="space-y-6">
        {/* Search Bar */}
        <Card>
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Enter stock ticker (e.g., AAPL, MSFT, GOOGL, NVDA)"
                  value={ticker}
                  onChange={(e) => setTicker(e.target.value.toUpperCase())}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                  className="pl-10"
                />
              </div>
              <Button onClick={handleSearch} disabled={isLoading || !ticker.trim()}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Fetching...
                  </>
                ) : (
                  'Analyze'
                )}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Error State */}
        {error && (
          <Card className="border-destructive/50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-3 text-destructive">
                <AlertCircle className="h-5 w-5" />
                <p>{error}</p>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Loading Skeleton */}
        {isLoading && (
          <div className="space-y-4">
            <Card>
              <CardHeader><Skeleton className="h-6 w-48" /></CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-20 w-full" />
              </CardContent>
            </Card>
          </div>
        )}

        {/* Results */}
        {stockInfo && (
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Stock Overview */}
            <Card className="lg:col-span-2">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-2xl">{stockInfo.ticker}</CardTitle>
                    <p className="text-muted-foreground">{stockInfo.name}</p>
                    <p className="text-sm text-muted-foreground">{stockInfo.exchange} · {stockInfo.sector}</p>
                  </div>
                  <Badge variant="outline" className="text-sm px-3 py-1">
                    {stockInfo.recommendationKey?.toUpperCase() || 'N/A'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Price */}
                <div className="flex items-baseline gap-4">
                  <span className="text-4xl font-bold">{formatUSD(stockInfo.price)}</span>
                  <span className={cn(
                    'flex items-center gap-1 text-lg font-medium',
                    stockInfo.changePercent >= 0 ? 'text-green-500' : 'text-red-500'
                  )}>
                    {stockInfo.changePercent >= 0 ? <TrendingUp className="h-5 w-5" /> : <TrendingDown className="h-5 w-5" />}
                    {stockInfo.changePercent >= 0 ? '+' : ''}{stockInfo.changePercent?.toFixed(2)}%
                  </span>
                </div>

                {/* Key Metrics */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { label: 'Market Cap', value: formatMarketCap(stockInfo.marketCap) },
                    { label: 'P/E Ratio', value: stockInfo.trailingPE?.toFixed(2) || 'N/A' },
                    { label: 'Dividend Yield', value: formatPercent(stockInfo.dividendYield) },
                    { label: 'Beta', value: stockInfo.beta?.toFixed(2) || 'N/A' },
                  ].map(m => (
                    <div key={m.label} className="space-y-1">
                      <p className="text-sm text-muted-foreground">{m.label}</p>
                      <p className="font-semibold">{m.value}</p>
                    </div>
                  ))}
                </div>

                {/* 52-Week Range */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">52-Week Range</span>
                    <span>{formatUSD(stockInfo.fiftyTwoWeekLow)} – {formatUSD(stockInfo.fiftyTwoWeekHigh)}</span>
                  </div>
                  <Progress
                    value={stockInfo.fiftyTwoWeekHigh > stockInfo.fiftyTwoWeekLow
                      ? ((stockInfo.price - stockInfo.fiftyTwoWeekLow) / (stockInfo.fiftyTwoWeekHigh - stockInfo.fiftyTwoWeekLow)) * 100
                      : 50}
                    className="h-2"
                  />
                </div>

                {/* Analyst Targets */}
                {stockInfo.targetMeanPrice > 0 && (
                  <div className="rounded-lg bg-muted/50 p-4">
                    <h4 className="font-semibold mb-3">Analyst Price Targets ({stockInfo.numberOfAnalysts} analysts)</h4>
                    <div className="grid grid-cols-3 gap-4 text-center">
                      <div>
                        <p className="text-sm text-muted-foreground">Low</p>
                        <p className="font-semibold text-red-500">{formatUSD(stockInfo.targetLowPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">Average</p>
                        <p className="font-semibold">{formatUSD(stockInfo.targetMeanPrice)}</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground">High</p>
                        <p className="font-semibold text-green-500">{formatUSD(stockInfo.targetHighPrice)}</p>
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Financial Metrics */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5" />
                  Key Metrics
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { label: 'EPS', value: stockInfo.eps != null ? formatUSD(stockInfo.eps) : 'N/A', icon: Wallet },
                    { label: 'P/B Ratio', value: stockInfo.priceToBook?.toFixed(2) || 'N/A', icon: Scale },
                    { label: 'P/S Ratio', value: stockInfo.priceToSales?.toFixed(2) || 'N/A', icon: Activity },
                    { label: 'Profit Margin', value: formatPercent(stockInfo.profitMargin), icon: Target },
                    { label: 'ROE', value: formatPercent(stockInfo.returnOnEquity), icon: TrendingUp },
                    { label: 'ROA', value: formatPercent(stockInfo.returnOnAssets), icon: Building2 },
                    { label: 'Debt/Equity', value: stockInfo.debtToEquity?.toFixed(2) || 'N/A', icon: Shield },
                    { label: 'Current Ratio', value: stockInfo.currentRatio?.toFixed(2) || 'N/A', icon: Users },
                    { label: 'Forward P/E', value: stockInfo.forwardPE?.toFixed(2) || 'N/A', icon: BarChart3 },
                    { label: 'Op. Margin', value: formatPercent(stockInfo.operatingMargin), icon: Activity },
                  ].map(m => (
                    <div key={m.label} className="flex items-center justify-between py-1 border-b border-border/50 last:border-0">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <m.icon className="h-3.5 w-3.5" />
                        {m.label}
                      </div>
                      <span className="font-mono text-sm font-semibold">{m.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* AI Analysis Panel — BUG 1 FIX: now streams from /api/research */}
            <Card className="lg:col-span-3">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-yellow-500" />
                  AI 7-Point Analysis
                  {isAnalyzing && (
                    <span className="flex items-center gap-1 text-sm font-normal text-muted-foreground ml-2">
                      <Loader2 className="h-3 w-3 animate-spin" />
                      Analyzing...
                    </span>
                  )}
                </CardTitle>
              </CardHeader>
              <CardContent>
                {aiError && (
                  <div className="flex items-center gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10">
                    <AlertCircle className="h-4 w-4 flex-shrink-0" />
                    <span>{aiError}</span>
                    <Button size="sm" variant="ghost" onClick={() => stockInfo && fetchAIAnalysis(stockInfo)} className="ml-auto">
                      Retry
                    </Button>
                  </div>
                )}
                {(aiAnalysis || isAnalyzing) && !aiError && (
                  <div className="prose prose-sm dark:prose-invert max-w-none">
                    <ReactMarkdown>{aiAnalysis || ' '}</ReactMarkdown>
                    {isAnalyzing && (
                      <span className="inline-block w-2 h-4 bg-primary animate-pulse rounded-sm ml-1 align-middle" />
                    )}
                  </div>
                )}
                {!aiAnalysis && !isAnalyzing && !aiError && (
                  <p className="text-muted-foreground text-sm">AI analysis will appear here after searching for a stock.</p>
                )}
              </CardContent>
            </Card>
          </div>
        )}

        {/* Empty State */}
        {!isLoading && !stockInfo && !error && (
          <Card>
            <CardContent className="py-12">
              <div className="text-center text-muted-foreground">
                <Search className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">Research a Stock</h3>
                <p>Enter any US stock ticker to get live financial data + AI-powered 7-point analysis.</p>
                <p className="text-sm mt-2">Try: AAPL · MSFT · GOOGL · NVDA · AMZN · JPM · XOM</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}
