'use client'

import { useState, useEffect, useCallback } from 'react'
import { PageLayout } from '@/components/page-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Newspaper,
  TrendingUp,
  TrendingDown,
  Minus,
  ExternalLink,
  Clock,
  Filter,
  RefreshCw,
  BarChart3,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { getHoldings, type Holding } from '@/lib/portfolio-store'

interface NewsArticle {
  id: string
  headline: string
  summary: string
  source: string
  url: string
  publishedAt: string
  sentiment: 'positive' | 'negative' | 'neutral'
  tickers: string[]
  imageUrl: string | null
}

interface IndexData {
  symbol: string
  name: string
  price: number
  change: number
  changePercent: number
  error?: string
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / (1000 * 60))
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else {
    return `${diffDays}d ago`
  }
}

function formatLastUpdated(seconds: number): string {
  if (seconds < 60) {
    return `${seconds}s ago`
  } else if (seconds < 3600) {
    return `${Math.floor(seconds / 60)}m ago`
  } else {
    return `${Math.floor(seconds / 3600)}h ago`
  }
}

function formatNumber(num: number): string {
  return num.toLocaleString('en-US', { maximumFractionDigits: 2 })
}

// Market Pulse Component
function MarketPulse({ 
  indices, 
  loading, 
  lastUpdated 
}: { 
  indices: IndexData[]
  loading: boolean
  lastUpdated: number
}) {
  if (loading && indices.length === 0) {
    return (
      <Card className="bg-card border-border">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Market Pulse
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-muted/50">
                <div className="space-y-2">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-6 w-32" />
                </div>
                <Skeleton className="h-6 w-24" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <BarChart3 className="h-5 w-5 text-primary" />
            Market Pulse
          </CardTitle>
          <Badge variant="outline" className="text-xs font-normal">
            <Clock className="h-3 w-3 mr-1" />
            Updated {formatLastUpdated(lastUpdated)}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {indices.map((index) => (
            <div 
              key={index.symbol} 
              className={cn(
                "flex items-center justify-between p-4 rounded-lg",
                index.error 
                  ? "bg-muted/50" 
                  : index.change >= 0 
                    ? "bg-positive/5 border border-positive/20" 
                    : "bg-negative/5 border border-negative/20"
              )}
            >
              <div>
                <p className="text-sm text-muted-foreground">{index.name}</p>
                {index.error ? (
                  <p className="text-lg font-semibold text-muted-foreground">Unavailable</p>
                ) : (
                  <p className="text-2xl font-bold text-foreground">
                    {formatNumber(index.price)}
                  </p>
                )}
              </div>
              {!index.error && (
                <div className={cn(
                  "flex items-center gap-1 px-3 py-1.5 rounded-full text-sm font-medium",
                  index.change >= 0 
                    ? "bg-positive/10 text-positive" 
                    : "bg-negative/10 text-negative"
                )}>
                  {index.change >= 0 ? (
                    <TrendingUp className="h-4 w-4" />
                  ) : (
                    <TrendingDown className="h-4 w-4" />
                  )}
                  <span>
                    {index.change >= 0 ? '+' : ''}{index.change.toFixed(2)} ({index.changePercent.toFixed(2)}%)
                  </span>
                </div>
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

// News Card Skeleton
function NewsCardSkeleton() {
  return (
    <Card className="bg-card border-border">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Skeleton className="h-10 w-10 rounded-full shrink-0" />
          <div className="flex-1 space-y-3">
            <Skeleton className="h-5 w-full" />
            <Skeleton className="h-4 w-3/4" />
            <div className="flex items-center gap-3">
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-24" />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

// Group news by ticker
function groupNewsByTicker(articles: NewsArticle[]): Record<string, NewsArticle[]> {
  const grouped: Record<string, NewsArticle[]> = {}
  
  articles.forEach(article => {
    article.tickers.forEach(ticker => {
      if (!grouped[ticker]) {
        grouped[ticker] = []
      }
      // Avoid duplicates
      if (!grouped[ticker].find(a => a.id === article.id)) {
        grouped[ticker].push(article)
      }
    })
  })
  
  return grouped
}

export default function NewsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [articles, setArticles] = useState<NewsArticle[]>([])
  const [indices, setIndices] = useState<IndexData[]>([])
  const [loading, setLoading] = useState(true)
  const [indicesLoading, setIndicesLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(0)
  const [indicesLastUpdated, setIndicesLastUpdated] = useState(0)
  const [filter, setFilter] = useState<'all' | 'grouped'>('all')
  const [sentimentFilter, setSentimentFilter] = useState<'all' | 'positive' | 'negative' | 'neutral'>('all')
  const [refreshing, setRefreshing] = useState(false)

  // Fetch indices
  const fetchIndices = useCallback(async () => {
    try {
      setIndicesLoading(true)
      const response = await fetch('/api/indices')
      if (response.ok) {
        const data = await response.json()
        setIndices(data.indices)
        setIndicesLastUpdated(0)
      }
    } catch (error) {
      console.error('Failed to fetch indices:', error)
    } finally {
      setIndicesLoading(false)
    }
  }, [])

  // Fetch news
  const fetchNews = useCallback(async (tickers: string[]) => {
    if (tickers.length === 0) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      const tickersParam = tickers.join(',')
      const response = await fetch(`/api/news?tickers=${encodeURIComponent(tickersParam)}`)
      
      if (response.ok) {
        const data = await response.json()
        setArticles(data.articles || [])
        setLastUpdated(0)
      }
    } catch (error) {
      console.error('Failed to fetch news:', error)
    } finally {
      setLoading(false)
    }
  }, [])

  // Load holdings and fetch data
  useEffect(() => {
    const storedHoldings = getHoldings()
    setHoldings(storedHoldings)
    
    const tickers = storedHoldings.map(h => h.ticker)
    fetchNews(tickers)
    fetchIndices()
  }, [fetchNews, fetchIndices])

  // Auto-refresh news every 5 minutes
  useEffect(() => {
    const tickers = holdings.map(h => h.ticker)
    
    const newsInterval = setInterval(() => {
      fetchNews(tickers)
    }, 5 * 60 * 1000) // 5 minutes

    const indicesInterval = setInterval(() => {
      fetchIndices()
    }, 60 * 1000) // 1 minute for indices

    return () => {
      clearInterval(newsInterval)
      clearInterval(indicesInterval)
    }
  }, [holdings, fetchNews, fetchIndices])

  // Update "last updated" counter
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(prev => prev + 1)
      setIndicesLastUpdated(prev => prev + 1)
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  // Manual refresh
  const handleRefresh = async () => {
    setRefreshing(true)
    const tickers = holdings.map(h => h.ticker)
    await Promise.all([fetchNews(tickers), fetchIndices()])
    setRefreshing(false)
  }

  const portfolioTickers = holdings.map((h) => h.ticker)

  // Filter articles
  const filteredArticles = articles.filter(article => {
    if (sentimentFilter !== 'all' && article.sentiment !== sentimentFilter) {
      return false
    }
    return true
  })

  const groupedNews = groupNewsByTicker(filteredArticles)

  return (
    <PageLayout
      title="Financial News"
      description="Latest news about your portfolio stocks"
    >
      <div className="space-y-6">
        {/* Market Pulse */}
        <MarketPulse 
          indices={indices} 
          loading={indicesLoading} 
          lastUpdated={indicesLastUpdated}
        />

        {/* Filters & Controls */}
        <Card className="bg-card border-border">
          <CardContent className="p-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">View:</span>
              </div>
              <div className="flex gap-2">
                <Button
                  variant={filter === 'all' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('all')}
                >
                  All News
                </Button>
                <Button
                  variant={filter === 'grouped' ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => setFilter('grouped')}
                >
                  By Stock
                </Button>
              </div>

              <Separator orientation="vertical" className="h-6" />

              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sentiment:</span>
              </div>
              <div className="flex gap-2">
                {(['all', 'positive', 'neutral', 'negative'] as const).map((sentiment) => (
                  <Button
                    key={sentiment}
                    variant={sentimentFilter === sentiment ? 'secondary' : 'ghost'}
                    size="sm"
                    onClick={() => setSentimentFilter(sentiment)}
                    className="capitalize"
                  >
                    {sentiment}
                  </Button>
                ))}
              </div>

              <div className="ml-auto flex items-center gap-3">
                <Badge variant="outline" className="text-xs font-normal">
                  <Clock className="h-3 w-3 mr-1" />
                  News updated {formatLastUpdated(lastUpdated)}
                </Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleRefresh}
                  disabled={refreshing}
                >
                  <RefreshCw className={cn("h-4 w-4 mr-1", refreshing && "animate-spin")} />
                  Refresh
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Portfolio Tickers */}
        {holdings.length > 0 && (
          <div className="flex flex-wrap gap-2">
            <span className="text-sm text-muted-foreground py-1">Tracking:</span>
            {portfolioTickers.map((ticker) => (
              <Badge key={ticker} variant="secondary">
                {ticker}
              </Badge>
            ))}
          </div>
        )}

        {/* Loading State */}
        {loading && articles.length === 0 && (
          <div className="space-y-4">
            {[1, 2, 3, 4].map((i) => (
              <NewsCardSkeleton key={i} />
            ))}
          </div>
        )}

        {/* Grouped View */}
        {!loading && filter === 'grouped' && (
          <div className="space-y-6">
            {Object.entries(groupedNews).map(([ticker, tickerArticles]) => (
              <div key={ticker}>
                <div className="flex items-center gap-2 mb-3">
                  <Badge variant="default" className="text-sm">
                    {ticker}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {tickerArticles.length} article{tickerArticles.length !== 1 ? 's' : ''}
                  </span>
                </div>
                <div className="space-y-3 pl-4 border-l-2 border-border">
                  {tickerArticles.slice(0, 5).map((article) => (
                    <NewsCard 
                      key={article.id} 
                      article={article} 
                      portfolioTickers={portfolioTickers}
                      compact
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* All News View */}
        {!loading && filter === 'all' && (
          <div className="space-y-4">
            {filteredArticles.map((article) => (
              <NewsCard 
                key={article.id} 
                article={article} 
                portfolioTickers={portfolioTickers}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && articles.length === 0 && (
          <Card className="bg-card border-border">
            <CardContent className="py-16 text-center">
              <Newspaper className="mx-auto h-12 w-12 text-muted-foreground/50" />
              <h3 className="mt-4 text-lg font-semibold text-foreground">No News Found</h3>
              <p className="mt-2 text-muted-foreground">
                {holdings.length === 0
                  ? 'Add stocks to your portfolio to see relevant news.'
                  : 'No news articles found for your portfolio stocks.'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  )
}

// News Card Component
function NewsCard({ 
  article, 
  portfolioTickers,
  compact = false
}: { 
  article: NewsArticle
  portfolioTickers: string[]
  compact?: boolean
}) {
  return (
    <Card className={cn(
      "bg-card border-border hover:border-primary/50 transition-colors",
      compact && "bg-card/50"
    )}>
      <CardContent className={cn("p-6", compact && "p-4")}>
        <div className="flex items-start gap-4">
          {/* Sentiment Icon */}
          {!compact && (
            <div
              className={cn(
                'flex h-10 w-10 shrink-0 items-center justify-center rounded-full',
                article.sentiment === 'positive' && 'bg-positive/10',
                article.sentiment === 'negative' && 'bg-negative/10',
                article.sentiment === 'neutral' && 'bg-muted'
              )}
            >
              {article.sentiment === 'positive' && (
                <TrendingUp className="h-5 w-5 text-positive" />
              )}
              {article.sentiment === 'negative' && (
                <TrendingDown className="h-5 w-5 text-negative" />
              )}
              {article.sentiment === 'neutral' && (
                <Minus className="h-5 w-5 text-muted-foreground" />
              )}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-4">
              <h3 className={cn(
                "font-semibold text-foreground leading-tight",
                compact && "text-sm"
              )}>
                {article.headline}
              </h3>
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </div>

            {!compact && (
              <p className="mt-2 text-sm text-muted-foreground line-clamp-2">
                {article.summary}
              </p>
            )}

            <div className={cn(
              "flex flex-wrap items-center gap-3",
              compact ? "mt-2" : "mt-3"
            )}>
              {/* Tickers */}
              {!compact && (
                <>
                  <div className="flex gap-1.5">
                    {article.tickers.map((ticker) => (
                      <Badge
                        key={ticker}
                        variant="outline"
                        className={cn(
                          'text-xs',
                          portfolioTickers.includes(ticker) &&
                            'border-primary text-primary'
                        )}
                      >
                        {ticker}
                      </Badge>
                    ))}
                  </div>
                  <Separator orientation="vertical" className="h-4" />
                </>
              )}

              {/* Source & Time */}
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span>{article.source}</span>
                <span>•</span>
                <Clock className="h-3 w-3" />
                <span>{formatTimeAgo(article.publishedAt)}</span>
              </div>

              {/* Sentiment Badge */}
              <Badge
                className={cn(
                  'text-xs ml-auto',
                  article.sentiment === 'positive' && 'bg-positive/10 text-positive hover:bg-positive/20',
                  article.sentiment === 'negative' && 'bg-negative/10 text-negative hover:bg-negative/20',
                  article.sentiment === 'neutral' && 'bg-muted text-muted-foreground hover:bg-muted'
                )}
              >
                {article.sentiment.charAt(0).toUpperCase() + article.sentiment.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
