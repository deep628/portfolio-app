'use client'

import { ArrowDown, ArrowUp, ChevronRight } from 'lucide-react'
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
import { cn } from '@/lib/utils'
import type { Stock } from '@/lib/portfolio-data'

interface HoldingsTableProps {
  holdings: Stock[]
  onStockClick: (stock: Stock) => void
}

export function HoldingsTable({ holdings, onStockClick }: HoldingsTableProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value)

  const formatNumber = (value: number) =>
    new Intl.NumberFormat('en-US').format(value)

  return (
    <Card className="bg-card border-border">
      <CardHeader className="flex flex-row items-center justify-between pb-4">
        <CardTitle className="text-lg font-semibold">Holdings</CardTitle>
        <Button variant="ghost" size="sm" className="text-primary">
          View All <ChevronRight className="ml-1 h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="p-0">
        <Table>
          <TableHeader>
            <TableRow className="border-border hover:bg-transparent">
              <TableHead className="text-muted-foreground">Symbol</TableHead>
              <TableHead className="text-muted-foreground">Shares</TableHead>
              <TableHead className="text-right text-muted-foreground">Price</TableHead>
              <TableHead className="text-right text-muted-foreground">Change</TableHead>
              <TableHead className="text-right text-muted-foreground">Market Value</TableHead>
              <TableHead className="text-right text-muted-foreground">Gain/Loss</TableHead>
              <TableHead className="text-muted-foreground">Sector</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {holdings.map((stock) => {
              const marketValue = stock.currentPrice * stock.shares
              const costBasis = stock.avgCost * stock.shares
              const gain = marketValue - costBasis
              const gainPercent = ((marketValue - costBasis) / costBasis) * 100
              const isPositive = stock.change >= 0
              const isGainPositive = gain >= 0

              return (
                <TableRow
                  key={stock.symbol}
                  className="cursor-pointer border-border hover:bg-accent/50"
                  onClick={() => onStockClick(stock)}
                >
                  <TableCell>
                    <div>
                      <p className="font-semibold text-foreground">{stock.symbol}</p>
                      <p className="text-sm text-muted-foreground">{stock.name}</p>
                    </div>
                  </TableCell>
                  <TableCell className="font-mono text-foreground">
                    {formatNumber(stock.shares)}
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground">
                    {formatCurrency(stock.currentPrice)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      {isPositive ? (
                        <ArrowUp className="h-3 w-3 text-positive" />
                      ) : (
                        <ArrowDown className="h-3 w-3 text-negative" />
                      )}
                      <span
                        className={cn(
                          'font-mono',
                          isPositive ? 'text-positive' : 'text-negative'
                        )}
                      >
                        {isPositive ? '+' : ''}
                        {stock.changePercent.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-right font-mono text-foreground">
                    {formatCurrency(marketValue)}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex flex-col items-end">
                      <span
                        className={cn(
                          'font-mono',
                          isGainPositive ? 'text-positive' : 'text-negative'
                        )}
                      >
                        {formatCurrency(gain)}
                      </span>
                      <span
                        className={cn(
                          'text-sm font-mono',
                          isGainPositive ? 'text-positive' : 'text-negative'
                        )}
                      >
                        {isGainPositive ? '+' : ''}
                        {gainPercent.toFixed(2)}%
                      </span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className="bg-accent text-accent-foreground">
                      {stock.sector}
                    </Badge>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
