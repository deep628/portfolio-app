'use client'

import { useState } from 'react'
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { PortfolioPerformance } from '@/lib/portfolio-data'

interface PerformanceChartProps {
  data: PortfolioPerformance[]
}

const timeRanges = ['1W', '1M', '3M', '6M', '1Y', 'ALL'] as const

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [selectedRange, setSelectedRange] = useState<(typeof timeRanges)[number]>('1Y')

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean
    payload?: Array<{ name: string; value: number; color: string }>
    label?: string
  }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card px-4 py-3 shadow-lg">
          <p className="mb-2 text-sm font-medium text-foreground">{label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="h-2 w-2 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span className="text-muted-foreground">{entry.name}:</span>
              <span className="font-mono font-medium text-foreground">
                {formatCurrency(entry.value)}
              </span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  // Calculate performance metrics
  const startValue = data[0]?.value || 0
  const endValue = data[data.length - 1]?.value || 0
  const totalReturn = ((endValue - startValue) / startValue) * 100

  const benchmarkStart = data[0]?.benchmark || 0
  const benchmarkEnd = data[data.length - 1]?.benchmark || 0
  const benchmarkReturn = ((benchmarkEnd - benchmarkStart) / benchmarkStart) * 100

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <div>
          <CardTitle className="text-lg font-semibold">Portfolio Performance</CardTitle>
          <div className="mt-1 flex items-center gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-primary" />
              <span className="text-muted-foreground">Portfolio</span>
              <span
                className={cn(
                  'font-mono font-medium',
                  totalReturn >= 0 ? 'text-positive' : 'text-negative'
                )}
              >
                {totalReturn >= 0 ? '+' : ''}
                {totalReturn.toFixed(2)}%
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-2 w-2 rounded-full bg-muted-foreground" />
              <span className="text-muted-foreground">S&P 500</span>
              <span
                className={cn(
                  'font-mono font-medium',
                  benchmarkReturn >= 0 ? 'text-positive' : 'text-negative'
                )}
              >
                {benchmarkReturn >= 0 ? '+' : ''}
                {benchmarkReturn.toFixed(2)}%
              </span>
            </div>
          </div>
        </div>
        <div className="flex gap-1">
          {timeRanges.map((range) => (
            <Button
              key={range}
              variant={selectedRange === range ? 'secondary' : 'ghost'}
              size="sm"
              onClick={() => setSelectedRange(range)}
              className={cn(
                'h-8 px-3 text-xs',
                selectedRange === range && 'bg-primary text-primary-foreground'
              )}
            >
              {range}
            </Button>
          ))}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="portfolioGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.72 0.19 145)" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="oklch(0.72 0.19 145)" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="benchmarkGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="oklch(0.5 0 0)" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="oklch(0.5 0 0)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="oklch(0.28 0.02 250)" />
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.60 0 0)', fontSize: 12 }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fill: 'oklch(0.60 0 0)', fontSize: 12 }}
                tickFormatter={(value) => `$${(value / 1000).toFixed(0)}k`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Area
                type="monotone"
                dataKey="benchmark"
                name="S&P 500"
                stroke="oklch(0.5 0 0)"
                strokeWidth={2}
                fill="url(#benchmarkGradient)"
              />
              <Area
                type="monotone"
                dataKey="value"
                name="Portfolio"
                stroke="oklch(0.72 0.19 145)"
                strokeWidth={2}
                fill="url(#portfolioGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )
}
