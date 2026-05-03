'use client'

import { ArrowDown, ArrowUp, Plus, Search, X } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'
import { stockSearchResults } from '@/lib/portfolio-data'

interface SearchResultsProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onAddToWatchlist: (symbol: string) => void
  onViewDetails: (symbol: string) => void
}

export function SearchResults({
  searchQuery,
  onSearchChange,
  onAddToWatchlist,
  onViewDetails,
}: SearchResultsProps) {
  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format(value)

  const filteredResults = searchQuery.length > 0
    ? stockSearchResults.filter(
        (stock) =>
          stock.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
          stock.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : stockSearchResults

  return (
    <Card className="bg-card border-border h-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Stock Research</CardTitle>
        <div className="relative mt-2">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search stocks by symbol or name..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-10 pr-10 bg-secondary border-border"
          />
          {searchQuery && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2"
              onClick={() => onSearchChange('')}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Clear search</span>
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">
          {searchQuery ? `Results for "${searchQuery}"` : 'Popular stocks'}
        </p>
        {filteredResults.map((stock) => {
          const isPositive = stock.change >= 0

          return (
            <div
              key={stock.symbol}
              className="flex items-center justify-between rounded-lg border border-border bg-secondary/30 p-4 transition-colors hover:bg-secondary/50"
            >
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-foreground">{stock.symbol}</span>
                  <Badge variant="outline" className="text-xs">
                    {stock.sector}
                  </Badge>
                </div>
                <p className="mt-1 text-sm text-muted-foreground">{stock.name}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-mono font-semibold text-foreground">
                    {formatCurrency(stock.price)}
                  </p>
                  <div className="flex items-center justify-end gap-1">
                    {isPositive ? (
                      <ArrowUp className="h-3 w-3 text-positive" />
                    ) : (
                      <ArrowDown className="h-3 w-3 text-negative" />
                    )}
                    <span
                      className={cn(
                        'text-sm font-mono',
                        isPositive ? 'text-positive' : 'text-negative'
                      )}
                    >
                      {isPositive ? '+' : ''}
                      {formatCurrency(stock.change)}
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onViewDetails(stock.symbol)}
                  >
                    View
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => onAddToWatchlist(stock.symbol)}
                  >
                    <Plus className="h-4 w-4" />
                    <span className="sr-only">Add to watchlist</span>
                  </Button>
                </div>
              </div>
            </div>
          )
        })}
        {filteredResults.length === 0 && (
          <div className="py-8 text-center">
            <Search className="mx-auto h-12 w-12 text-muted-foreground/50" />
            <p className="mt-4 text-lg font-medium text-muted-foreground">No results found</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Try searching for a different symbol or company name
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
