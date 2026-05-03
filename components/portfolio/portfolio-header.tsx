'use client'

import { Bell, Search, Settings, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

interface PortfolioHeaderProps {
  unreadAlerts: number
  onAlertsClick: () => void
  searchQuery: string
  onSearchChange: (query: string) => void
}

export function PortfolioHeader({
  unreadAlerts,
  onAlertsClick,
  searchQuery,
  onSearchChange,
}: PortfolioHeaderProps) {
  return (
    <header className="border-b border-border bg-card px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <TrendingUp className="h-5 w-5 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-foreground">PortfolioTrack Pro</h1>
            <p className="text-sm text-muted-foreground">Real-time portfolio management</p>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative w-80">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search stocks, symbols..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="pl-10 bg-secondary border-border"
            />
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onAlertsClick}
            className="relative"
          >
            <Bell className="h-5 w-5" />
            {unreadAlerts > 0 && (
              <Badge
                className="absolute -right-1 -top-1 h-5 w-5 rounded-full bg-destructive p-0 text-xs"
              >
                {unreadAlerts}
              </Badge>
            )}
            <span className="sr-only">View alerts</span>
          </Button>

          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
            <span className="sr-only">Settings</span>
          </Button>
        </div>
      </div>
    </header>
  )
}
