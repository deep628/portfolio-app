'use client'

import { ArrowDown, ArrowUp, DollarSign, Percent, TrendingUp, Wallet } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface PortfolioSummaryProps {
  totalValue: number
  totalGain: number
  totalGainPercent: number
  dayChange: number
  dayChangePercent: number
}

export function PortfolioSummary({
  totalValue,
  totalGain,
  totalGainPercent,
  dayChange,
  dayChangePercent,
}: PortfolioSummaryProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value)

  const formatPercent = (value: number) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

  const summaryCards = [
    {
      title: 'Total Value',
      value: formatCurrency(totalValue),
      icon: Wallet,
      description: 'Portfolio value',
    },
    {
      title: 'Total Gain/Loss',
      value: formatCurrency(totalGain),
      change: formatPercent(totalGainPercent),
      isPositive: totalGain >= 0,
      icon: DollarSign,
      description: 'All time',
    },
    {
      title: "Today's Change",
      value: formatCurrency(dayChange),
      change: formatPercent(dayChangePercent),
      isPositive: dayChange >= 0,
      icon: TrendingUp,
      description: 'Daily P/L',
    },
    {
      title: 'Return Rate',
      value: formatPercent(totalGainPercent),
      isPositive: totalGainPercent >= 0,
      icon: Percent,
      description: 'Total return',
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {summaryCards.map((card) => (
        <Card key={card.title} className="bg-card border-border">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-sm font-medium text-muted-foreground">{card.title}</p>
              <card.icon className="h-4 w-4 text-muted-foreground" />
            </div>
            <div className="mt-2">
              <p
                className={cn(
                  'text-2xl font-bold',
                  card.isPositive !== undefined
                    ? card.isPositive
                      ? 'text-positive'
                      : 'text-negative'
                    : 'text-foreground'
                )}
              >
                {card.value}
              </p>
              {card.change && (
                <div className="mt-1 flex items-center gap-1">
                  {card.isPositive ? (
                    <ArrowUp className="h-3 w-3 text-positive" />
                  ) : (
                    <ArrowDown className="h-3 w-3 text-negative" />
                  )}
                  <span
                    className={cn(
                      'text-sm font-medium',
                      card.isPositive ? 'text-positive' : 'text-negative'
                    )}
                  >
                    {card.change}
                  </span>
                  <span className="text-sm text-muted-foreground">{card.description}</span>
                </div>
              )}
              {!card.change && (
                <p className="mt-1 text-sm text-muted-foreground">{card.description}</p>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
