'use client'

import { Card, CardContent } from '@/components/ui/card'
import { TrendingUp, TrendingDown, Wallet, PiggyBank, BarChart3 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PortfolioSummary } from '@/lib/portfolio-store'
import { formatUSD } from '@/lib/portfolio-store'

interface PortfolioSummaryCardProps {
  summary: PortfolioSummary
}

export function PortfolioSummaryCard({ summary }: PortfolioSummaryCardProps) {
  const isPositive = summary.totalPL >= 0

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {/* Total Invested */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Invested</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {formatUSD(summary.totalInvested)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
              <Wallet className="h-6 w-6 text-primary" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Value */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Current Value</p>
              <p className="mt-1 text-2xl font-bold text-foreground">
                {formatUSD(summary.currentValue)}
              </p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10">
              <PiggyBank className="h-6 w-6 text-chart-2" />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Total P&L */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total P&L</p>
              <p
                className={cn(
                  'mt-1 text-2xl font-bold',
                  isPositive ? 'text-positive' : 'text-negative'
                )}
              >
                {isPositive ? '+' : ''}{formatUSD(summary.totalPL)}
              </p>
              <p
                className={cn(
                  'text-sm',
                  isPositive ? 'text-positive' : 'text-negative'
                )}
              >
                {isPositive ? '+' : ''}{summary.totalPLPercent.toFixed(2)}%
              </p>
            </div>
            <div
              className={cn(
                'flex h-12 w-12 items-center justify-center rounded-full',
                isPositive ? 'bg-positive/10' : 'bg-negative/10'
              )}
            >
              {isPositive ? (
                <TrendingUp className="h-6 w-6 text-positive" />
              ) : (
                <TrendingDown className="h-6 w-6 text-negative" />
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* XIRR */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">XIRR (Annualized)</p>
              <p
                className={cn(
                  'mt-1 text-2xl font-bold',
                  summary.xirr >= 0 ? 'text-positive' : 'text-negative'
                )}
              >
                {summary.xirr >= 0 ? '+' : ''}{summary.xirr.toFixed(2)}%
              </p>
              <p className="text-sm text-muted-foreground">Annual Return</p>
            </div>
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-5/10">
              <BarChart3 className="h-6 w-6 text-chart-5" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
