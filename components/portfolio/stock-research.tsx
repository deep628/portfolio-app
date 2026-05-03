'use client'

import { useState } from 'react'
import {
  ArrowDown,
  ArrowUp,
  BarChart2,
  Building2,
  Calendar,
  DollarSign,
  ExternalLink,
  FileText,
  Newspaper,
  Percent,
  Target,
  TrendingDown,
  TrendingUp,
  Users,
  Volume2,
  X,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Progress } from '@/components/ui/progress'
import { cn } from '@/lib/utils'
import {
  analystRatings,
  stockNews,
  fundamentalData,
  priceTargets,
  type Stock,
  type AnalystRating,
  type StockNews,
  type FundamentalData,
  type PriceTarget,
} from '@/lib/portfolio-data'

interface StockResearchProps {
  stock: Stock | null
  onClose: () => void
}

export function StockResearch({ stock, onClose }: StockResearchProps) {
  const [activeTab, setActiveTab] = useState('overview')

  if (!stock) {
    return (
      <Card className="bg-card border-border h-full">
        <CardContent className="flex h-full items-center justify-center p-6">
          <div className="text-center">
            <BarChart2 className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">
              Select a stock to view research
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              Click on any holding to see detailed analysis, analyst reports, and news
            </p>
          </div>
        </CardContent>
      </Card>
    )
  }

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value)

  const formatLargeNumber = (value: number) =>
    new Intl.NumberFormat('en-US', {
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(value)

  const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(1)}%`

  const ratings = analystRatings[stock.symbol] || []
  const news = stockNews[stock.symbol] || []
  const fundamentals = fundamentalData[stock.symbol]
  const targets = priceTargets[stock.symbol]

  const marketValue = stock.currentPrice * stock.shares
  const costBasis = stock.avgCost * stock.shares
  const unrealizedGain = marketValue - costBasis
  const unrealizedGainPercent = ((marketValue - costBasis) / costBasis) * 100

  const getRatingColor = (rating: AnalystRating['rating']) => {
    switch (rating) {
      case 'Strong Buy':
        return 'bg-positive/20 text-positive border-positive/30'
      case 'Buy':
        return 'bg-positive/10 text-positive border-positive/20'
      case 'Hold':
        return 'bg-warning/10 text-warning border-warning/20'
      case 'Sell':
        return 'bg-negative/10 text-negative border-negative/20'
      case 'Strong Sell':
        return 'bg-negative/20 text-negative border-negative/30'
    }
  }

  const getSentimentColor = (sentiment: StockNews['sentiment']) => {
    switch (sentiment) {
      case 'positive':
        return 'bg-positive/10 text-positive'
      case 'neutral':
        return 'bg-muted text-muted-foreground'
      case 'negative':
        return 'bg-negative/10 text-negative'
    }
  }

  const formatTimeAgo = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)

    if (diffHours < 1) return 'Just now'
    if (diffHours < 24) return `${diffHours}h ago`
    if (diffDays === 1) return 'Yesterday'
    return `${diffDays}d ago`
  }

  return (
    <Card className="bg-card border-border h-full flex flex-col overflow-hidden">
      <CardHeader className="flex flex-row items-start justify-between pb-3 shrink-0">
        <div>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
              <span className="text-lg font-bold text-primary">{stock.symbol.charAt(0)}</span>
            </div>
            <div>
              <CardTitle className="text-xl">{stock.symbol}</CardTitle>
              <p className="text-sm text-muted-foreground">{stock.name}</p>
            </div>
          </div>
        </div>
        <Button variant="ghost" size="icon" onClick={onClose}>
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </Button>
      </CardHeader>

      {/* Price Header */}
      <div className="px-6 pb-4 shrink-0">
        <div className="flex items-end gap-3">
          <span className="text-3xl font-bold text-foreground">
            {formatCurrency(stock.currentPrice)}
          </span>
          <div
            className={cn(
              'flex items-center gap-1 rounded-full px-2 py-1 text-sm font-medium',
              stock.change >= 0 ? 'bg-positive/10 text-positive' : 'bg-negative/10 text-negative'
            )}
          >
            {stock.change >= 0 ? <ArrowUp className="h-3 w-3" /> : <ArrowDown className="h-3 w-3" />}
            {stock.change >= 0 ? '+' : ''}
            {formatCurrency(stock.change)} ({stock.changePercent.toFixed(2)}%)
          </div>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col overflow-hidden">
        <TabsList className="mx-6 shrink-0 grid grid-cols-4 bg-muted/50">
          <TabsTrigger value="overview" className="text-xs">Overview</TabsTrigger>
          <TabsTrigger value="analysts" className="text-xs">Analysts</TabsTrigger>
          <TabsTrigger value="news" className="text-xs">News</TabsTrigger>
          <TabsTrigger value="fundamentals" className="text-xs">Fundamentals</TabsTrigger>
        </TabsList>

        <ScrollArea className="flex-1">
          <div className="p-6 pt-4">
            {/* Overview Tab */}
            <TabsContent value="overview" className="mt-0 space-y-5">
              {/* Position Summary */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Your Position
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Shares</p>
                    <p className="text-lg font-semibold text-foreground">{stock.shares}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Avg Cost</p>
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(stock.avgCost)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Market Value</p>
                    <p className="text-lg font-semibold text-foreground">{formatCurrency(marketValue)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Unrealized P/L</p>
                    <p
                      className={cn(
                        'text-lg font-semibold',
                        unrealizedGain >= 0 ? 'text-positive' : 'text-negative'
                      )}
                    >
                      {formatCurrency(unrealizedGain)}
                      <span className="ml-1 text-sm">({unrealizedGainPercent.toFixed(1)}%)</span>
                    </p>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* Price Target Summary */}
              {targets && (
                <>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Analyst Price Target
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">Average Target</span>
                        <div className="flex items-center gap-2">
                          <span className="text-lg font-bold text-foreground">
                            {formatCurrency(targets.averageTarget)}
                          </span>
                          <span
                            className={cn(
                              'text-sm font-medium',
                              targets.averageTarget > stock.currentPrice ? 'text-positive' : 'text-negative'
                            )}
                          >
                            ({((targets.averageTarget - stock.currentPrice) / stock.currentPrice * 100).toFixed(1)}%)
                          </span>
                        </div>
                      </div>
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-muted-foreground">
                          <span>Low: {formatCurrency(targets.lowTarget)}</span>
                          <span>High: {formatCurrency(targets.highTarget)}</span>
                        </div>
                        <div className="relative h-2 rounded-full bg-muted">
                          <div
                            className="absolute h-full rounded-full bg-gradient-to-r from-negative via-warning to-positive"
                            style={{ width: '100%' }}
                          />
                          <div
                            className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-foreground shadow-md"
                            style={{
                              left: `${Math.min(100, Math.max(0, ((stock.currentPrice - targets.lowTarget) / (targets.highTarget - targets.lowTarget)) * 100))}%`,
                            }}
                          />
                        </div>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        Based on {targets.numberOfAnalysts} analyst ratings
                      </p>
                    </div>
                  </div>

                  <Separator className="bg-border" />
                </>
              )}

              {/* Key Metrics */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Key Metrics
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                    <Building2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Market Cap</p>
                      <p className="font-semibold text-foreground">{stock.marketCap}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                    <Percent className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">P/E Ratio</p>
                      <p className="font-semibold text-foreground">{stock.peRatio.toFixed(1)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                    <DollarSign className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Dividend</p>
                      <p className="font-semibold text-foreground">{formatCurrency(stock.dividend)}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3 rounded-lg bg-secondary/50 p-3">
                    <Volume2 className="h-5 w-5 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Volume</p>
                      <p className="font-semibold text-foreground">{formatLargeNumber(stock.volume)}</p>
                    </div>
                  </div>
                </div>
              </div>

              <Separator className="bg-border" />

              {/* 52 Week Range */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  52 Week Range
                </h3>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">{formatCurrency(stock.yearLow)}</span>
                    <span className="text-muted-foreground">{formatCurrency(stock.yearHigh)}</span>
                  </div>
                  <div className="relative h-2 rounded-full bg-muted">
                    <div
                      className="absolute h-full rounded-full bg-primary"
                      style={{
                        width: `${((stock.currentPrice - stock.yearLow) / (stock.yearHigh - stock.yearLow)) * 100}%`,
                      }}
                    />
                    <div
                      className="absolute top-1/2 h-4 w-1 -translate-y-1/2 rounded-full bg-foreground"
                      style={{
                        left: `${((stock.currentPrice - stock.yearLow) / (stock.yearHigh - stock.yearLow)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* Sector Badge */}
              <div className="flex items-center gap-2">
                <Badge variant="secondary" className="bg-accent">
                  <TrendingUp className="mr-1 h-3 w-3" />
                  {stock.sector}
                </Badge>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2">
                <Button className="flex-1 bg-positive hover:bg-positive/90 text-positive-foreground">
                  Buy
                </Button>
                <Button variant="outline" className="flex-1 border-destructive text-destructive hover:bg-destructive/10">
                  Sell
                </Button>
              </div>
            </TabsContent>

            {/* Analysts Tab */}
            <TabsContent value="analysts" className="mt-0 space-y-5">
              {/* Rating Distribution */}
              {targets && (
                <>
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Analyst Consensus
                    </h3>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          <span className="text-lg font-bold">{formatCurrency(targets.averageTarget)}</span>
                        </div>
                        <span
                          className={cn(
                            'text-sm font-medium px-2 py-1 rounded-full',
                            targets.averageTarget > stock.currentPrice
                              ? 'bg-positive/10 text-positive'
                              : 'bg-negative/10 text-negative'
                          )}
                        >
                          {targets.averageTarget > stock.currentPrice ? (
                            <span className="flex items-center gap-1">
                              <TrendingUp className="h-3 w-3" />
                              {((targets.averageTarget - stock.currentPrice) / stock.currentPrice * 100).toFixed(1)}% upside
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <TrendingDown className="h-3 w-3" />
                              {Math.abs((targets.averageTarget - stock.currentPrice) / stock.currentPrice * 100).toFixed(1)}% downside
                            </span>
                          )}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-xs text-muted-foreground">Low</p>
                          <p className="font-semibold">{formatCurrency(targets.lowTarget)}</p>
                        </div>
                        <div className="rounded-lg bg-primary/10 p-2 border border-primary/20">
                          <p className="text-xs text-muted-foreground">Average</p>
                          <p className="font-semibold text-primary">{formatCurrency(targets.averageTarget)}</p>
                        </div>
                        <div className="rounded-lg bg-muted/50 p-2">
                          <p className="text-xs text-muted-foreground">High</p>
                          <p className="font-semibold">{formatCurrency(targets.highTarget)}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Rating Breakdown */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      {targets.numberOfAnalysts} Analyst Ratings
                    </h3>
                    <div className="space-y-2">
                      {[
                        { label: 'Strong Buy', count: targets.strongBuy, color: 'bg-positive' },
                        { label: 'Buy', count: targets.buy, color: 'bg-positive/70' },
                        { label: 'Hold', count: targets.hold, color: 'bg-warning' },
                        { label: 'Sell', count: targets.sell, color: 'bg-negative/70' },
                        { label: 'Strong Sell', count: targets.strongSell, color: 'bg-negative' },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <span className="w-20 text-xs text-muted-foreground">{item.label}</span>
                          <div className="flex-1">
                            <Progress
                              value={(item.count / targets.numberOfAnalysts) * 100}
                              className="h-2"
                              indicatorClassName={item.color}
                            />
                          </div>
                          <span className="w-8 text-xs font-medium text-right">{item.count}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-border" />
                </>
              )}

              {/* Individual Analyst Reports */}
              <div>
                <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <FileText className="h-4 w-4" />
                  Recent Analyst Reports
                </h3>
                {ratings.length > 0 ? (
                  <div className="space-y-3">
                    {ratings.map((rating, index) => (
                      <div
                        key={index}
                        className="rounded-lg border border-border bg-secondary/30 p-4 space-y-3"
                      >
                        <div className="flex items-start justify-between">
                          <div>
                            <p className="font-semibold text-foreground">{rating.firm}</p>
                            <p className="text-xs text-muted-foreground">{rating.analyst}</p>
                          </div>
                          <Badge className={cn('border', getRatingColor(rating.rating))}>
                            {rating.rating}
                          </Badge>
                        </div>

                        <div className="flex items-center gap-4">
                          <div>
                            <p className="text-xs text-muted-foreground">Price Target</p>
                            <div className="flex items-center gap-2">
                              <span className="font-semibold">{formatCurrency(rating.priceTarget)}</span>
                              {rating.priceTarget !== rating.previousTarget && (
                                <span
                                  className={cn(
                                    'text-xs',
                                    rating.priceTarget > rating.previousTarget
                                      ? 'text-positive'
                                      : 'text-negative'
                                  )}
                                >
                                  {rating.priceTarget > rating.previousTarget ? (
                                    <span className="flex items-center gap-0.5">
                                      <ArrowUp className="h-3 w-3" />
                                      from {formatCurrency(rating.previousTarget)}
                                    </span>
                                  ) : (
                                    <span className="flex items-center gap-0.5">
                                      <ArrowDown className="h-3 w-3" />
                                      from {formatCurrency(rating.previousTarget)}
                                    </span>
                                  )}
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Calendar className="h-3 w-3" />
                            {rating.date}
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {rating.summary}
                        </p>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="mx-auto h-8 w-8 text-muted-foreground/50" />
                    <p className="mt-2 text-sm text-muted-foreground">No analyst reports available</p>
                  </div>
                )}
              </div>
            </TabsContent>

            {/* News Tab */}
            <TabsContent value="news" className="mt-0 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
                  <Newspaper className="h-4 w-4" />
                  Latest News
                </h3>
              </div>

              {news.length > 0 ? (
                <div className="space-y-3">
                  {news.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-lg border border-border bg-secondary/30 p-4 space-y-2 hover:bg-secondary/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h4 className="font-medium text-foreground leading-snug group-hover:text-primary transition-colors">
                          {item.headline}
                        </h4>
                        <ExternalLink className="h-4 w-4 text-muted-foreground shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {item.summary}
                      </p>

                      <div className="flex items-center gap-3">
                        <Badge className={cn('text-xs', getSentimentColor(item.sentiment))}>
                          {item.sentiment.charAt(0).toUpperCase() + item.sentiment.slice(1)}
                        </Badge>
                        <span className="text-xs text-muted-foreground">{item.source}</span>
                        <span className="text-xs text-muted-foreground">{formatTimeAgo(item.timestamp)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Newspaper className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">No recent news available</p>
                </div>
              )}
            </TabsContent>

            {/* Fundamentals Tab */}
            <TabsContent value="fundamentals" className="mt-0 space-y-5">
              {fundamentals ? (
                <>
                  {/* Income Statement */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Income Statement (TTM)
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Revenue</p>
                        <p className="font-semibold">{formatLargeNumber(fundamentals.revenue)}</p>
                        <p className={cn('text-xs', fundamentals.revenueGrowth >= 0 ? 'text-positive' : 'text-negative')}>
                          {formatPercent(fundamentals.revenueGrowth)} YoY
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Net Income</p>
                        <p className="font-semibold">{formatLargeNumber(fundamentals.netIncome)}</p>
                        <p className={cn('text-xs', fundamentals.netIncomeGrowth >= 0 ? 'text-positive' : 'text-negative')}>
                          {formatPercent(fundamentals.netIncomeGrowth)} YoY
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">EPS</p>
                        <p className="font-semibold">{formatCurrency(fundamentals.eps)}</p>
                        <p className={cn('text-xs', fundamentals.epsGrowth >= 0 ? 'text-positive' : 'text-negative')}>
                          {formatPercent(fundamentals.epsGrowth)} YoY
                        </p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Free Cash Flow</p>
                        <p className="font-semibold">{formatLargeNumber(fundamentals.freeCashFlow)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Margins */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Profitability
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Gross Margin', value: fundamentals.grossMargin },
                        { label: 'Operating Margin', value: fundamentals.operatingMargin },
                        { label: 'Net Margin', value: fundamentals.netMargin },
                      ].map((item) => (
                        <div key={item.label} className="flex items-center gap-3">
                          <span className="w-32 text-sm text-muted-foreground">{item.label}</span>
                          <div className="flex-1">
                            <Progress value={item.value} className="h-2" />
                          </div>
                          <span className="w-14 text-sm font-medium text-right">{item.value.toFixed(1)}%</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Returns & Efficiency */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Returns & Efficiency
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Return on Equity</p>
                        <p className="font-semibold">{fundamentals.roe.toFixed(1)}%</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Return on Assets</p>
                        <p className="font-semibold">{fundamentals.roa.toFixed(1)}%</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Valuation */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Valuation Metrics
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">P/E Ratio</p>
                        <p className="font-semibold">{stock.peRatio.toFixed(1)}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Price to Book</p>
                        <p className="font-semibold">{fundamentals.priceToBook.toFixed(1)}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Price to Sales</p>
                        <p className="font-semibold">{fundamentals.priceToSales.toFixed(1)}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Book Value</p>
                        <p className="font-semibold">{formatCurrency(fundamentals.bookValue)}</p>
                      </div>
                    </div>
                  </div>

                  <Separator className="bg-border" />

                  {/* Financial Health */}
                  <div>
                    <h3 className="mb-3 text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                      Financial Health
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Debt to Equity</p>
                        <p className="font-semibold">{fundamentals.debtToEquity.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3">
                        <p className="text-xs text-muted-foreground">Current Ratio</p>
                        <p className="font-semibold">{fundamentals.currentRatio.toFixed(2)}</p>
                      </div>
                      <div className="rounded-lg bg-secondary/50 p-3 col-span-2">
                        <p className="text-xs text-muted-foreground">Beta (Volatility)</p>
                        <p className="font-semibold">{fundamentals.beta.toFixed(2)}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                          {fundamentals.beta > 1.2 ? 'Higher volatility than market' : fundamentals.beta < 0.8 ? 'Lower volatility than market' : 'Similar volatility to market'}
                        </p>
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-8">
                  <BarChart2 className="mx-auto h-8 w-8 text-muted-foreground/50" />
                  <p className="mt-2 text-sm text-muted-foreground">Fundamental data not available</p>
                </div>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </Card>
  )
}
