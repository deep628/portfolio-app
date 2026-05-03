'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip'
import { Trash2, TrendingUp, TrendingDown, AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { Holding } from '@/lib/portfolio-store'
import { formatUSD, formatUSDWithDecimals } from '@/lib/portfolio-store'
import type { StockPrice } from '@/lib/stock-price-service'

interface HoldingsTableProps {
  holdings: Holding[]
  onRemoveHolding: (id: string) => void
  totalValue: number
  prices?: Record<string, StockPrice>
}

export function HoldingsTable({
  holdings,
  onRemoveHolding,
  totalValue,
  prices = {},
}: HoldingsTableProps) {
  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold text-foreground">
          Holdings ({holdings.length})
        </CardTitle>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent border-border">
                <TableHead className="text-muted-foreground">Stock</TableHead>
                <TableHead className="text-right text-muted-foreground">Qty</TableHead>
                <TableHead className="text-right text-muted-foreground">Avg Buy</TableHead>
                <TableHead className="text-right text-muted-foreground">Current</TableHead>
                <TableHead className="text-right text-muted-foreground">Value</TableHead>
                <TableHead className="text-right text-muted-foreground">P&L</TableHead>
                <TableHead className="text-right text-muted-foreground">Weight</TableHead>
                <TableHead className="w-12"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {holdings.map((holding) => {
                const priceData = prices[holding.ticker.toUpperCase()]
                const hasError = priceData?.error
                const isLoading = !priceData && Object.keys(prices).length === 0

                const investedValue = holding.quantity * holding.avgBuyPrice
                const currentValue = holding.quantity * holding.currentPrice
                const pl = currentValue - investedValue
                const plPercent = ((holding.currentPrice - holding.avgBuyPrice) / holding.avgBuyPrice) * 100
                const weight = totalValue > 0 ? (currentValue / totalValue) * 100 : 0
                const isPositive = pl >= 0

                // Daily change from real-time data
                const dailyChange = priceData?.change || 0
                const dailyChangePercent = priceData?.changePercent || 0

                return (
                  <TableRow
                    key={holding.id}
                    className="border-border hover:bg-muted/50 transition-colors"
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted font-semibold text-sm text-foreground">
                          {holding.ticker.slice(0, 2)}
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{holding.ticker}</p>
                          <p className="text-xs text-muted-foreground truncate max-w-[120px]">
                            {holding.name}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium text-foreground">
                      {holding.quantity}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatUSDWithDecimals(holding.avgBuyPrice)}
                    </TableCell>
                    <TableCell className="text-right">
                      {isLoading ? (
                        <Skeleton className="h-5 w-20 ml-auto" />
                      ) : hasError ? (
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <div className="flex items-center justify-end gap-1 text-muted-foreground">
                                <AlertCircle className="h-3.5 w-3.5 text-amber-500" />
                                <span className="text-xs">Unavailable</span>
                              </div>
                            </TooltipTrigger>
                            <TooltipContent>
                              <p>Unable to fetch live price. Using last known price.</p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      ) : (
                        <div className="flex flex-col items-end">
                          <span className="font-medium text-foreground">
                            {formatUSDWithDecimals(holding.currentPrice)}
                          </span>
                          {dailyChange !== 0 && (
                            <span
                              className={cn(
                                'text-xs',
                                dailyChange >= 0 ? 'text-positive' : 'text-negative'
                              )}
                            >
                              {dailyChange >= 0 ? '+' : ''}
                              {dailyChangePercent.toFixed(2)}%
                            </span>
                          )}
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isLoading ? (
                        <Skeleton className="h-5 w-24 ml-auto" />
                      ) : (
                        <span className="font-medium text-foreground">
                          {formatUSD(currentValue)}
                        </span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isLoading ? (
                        <div className="flex flex-col items-end gap-1">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-5 w-14" />
                        </div>
                      ) : (
                        <div className="flex flex-col items-end gap-0.5">
                          <span
                            className={cn(
                              'flex items-center gap-1 font-medium',
                              isPositive ? 'text-positive' : 'text-negative'
                            )}
                          >
                            {isPositive ? (
                              <TrendingUp className="h-3.5 w-3.5" />
                            ) : (
                              <TrendingDown className="h-3.5 w-3.5" />
                            )}
                            {formatUSD(Math.abs(pl))}
                          </span>
                          <Badge
                            variant="secondary"
                            className={cn(
                              'text-xs px-1.5',
                              isPositive
                                ? 'bg-positive/10 text-positive'
                                : 'bg-negative/10 text-negative'
                            )}
                          >
                            {isPositive ? '+' : ''}{plPercent.toFixed(2)}%
                          </Badge>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      {isLoading ? (
                        <Skeleton className="h-6 w-14 ml-auto" />
                      ) : (
                        <Badge variant="outline" className="font-medium">
                          {weight.toFixed(1)}%
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8 text-muted-foreground hover:text-negative"
                        onClick={() => onRemoveHolding(holding.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                )
              })}
              {holdings.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={8}
                    className="h-24 text-center text-muted-foreground"
                  >
                    No holdings yet. Add your first stock to get started.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  )
}
