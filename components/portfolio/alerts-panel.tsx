'use client'

import { useState } from 'react'
import {
  AlertTriangle,
  Bell,
  BellOff,
  Check,
  ChevronRight,
  Clock,
  DollarSign,
  Newspaper,
  Plus,
  RefreshCw,
  Volume2,
  X,
} from 'lucide-react'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import type { Alert } from '@/lib/portfolio-data'

interface AlertsPanelProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  alerts: Alert[]
  onMarkAsRead: (id: string) => void
  onDismiss: (id: string) => void
  onAddAlert: (alert: Omit<Alert, 'id' | 'timestamp' | 'read'>) => void
}

const alertTypeIcons = {
  price: DollarSign,
  volume: Volume2,
  rebalance: RefreshCw,
  news: Newspaper,
}

const alertTypeLabels = {
  price: 'Price Alert',
  volume: 'Volume Alert',
  rebalance: 'Rebalance',
  news: 'News',
}

const priorityColors = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-warning/10 text-warning',
  high: 'bg-destructive/10 text-destructive',
}

export function AlertsPanel({
  open,
  onOpenChange,
  alerts,
  onMarkAsRead,
  onDismiss,
  onAddAlert,
}: AlertsPanelProps) {
  const [showAddAlert, setShowAddAlert] = useState(false)
  const [newAlert, setNewAlert] = useState({
    type: 'price' as Alert['type'],
    symbol: '',
    message: '',
    priority: 'medium' as Alert['priority'],
  })

  const formatTimeAgo = (date: Date) => {
    const seconds = Math.floor((Date.now() - date.getTime()) / 1000)
    if (seconds < 60) return 'Just now'
    const minutes = Math.floor(seconds / 60)
    if (minutes < 60) return `${minutes}m ago`
    const hours = Math.floor(minutes / 60)
    if (hours < 24) return `${hours}h ago`
    return `${Math.floor(hours / 24)}d ago`
  }

  const handleAddAlert = () => {
    if (newAlert.symbol && newAlert.message) {
      onAddAlert(newAlert)
      setNewAlert({
        type: 'price',
        symbol: '',
        message: '',
        priority: 'medium',
      })
      setShowAddAlert(false)
    }
  }

  const unreadAlerts = alerts.filter((a) => !a.read)
  const readAlerts = alerts.filter((a) => a.read)

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-[400px] bg-card border-border">
        <SheetHeader>
          <div className="flex items-center justify-between">
            <SheetTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Alerts
              {unreadAlerts.length > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadAlerts.length}
                </Badge>
              )}
            </SheetTitle>
            <Button variant="outline" size="sm" onClick={() => setShowAddAlert(!showAddAlert)}>
              <Plus className="mr-1 h-4 w-4" />
              Add Alert
            </Button>
          </div>
          <SheetDescription>
            Stay updated with price movements, volume changes, and portfolio insights.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Add Alert Form */}
          {showAddAlert && (
            <div className="rounded-lg border border-border bg-secondary/30 p-4 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-medium text-foreground">Create Alert</h3>
                <Button variant="ghost" size="sm" onClick={() => setShowAddAlert(false)}>
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-2">
                    <Label htmlFor="alert-type">Type</Label>
                    <Select
                      value={newAlert.type}
                      onValueChange={(value: Alert['type']) =>
                        setNewAlert((prev) => ({ ...prev, type: value }))
                      }
                    >
                      <SelectTrigger id="alert-type" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="price">Price</SelectItem>
                        <SelectItem value="volume">Volume</SelectItem>
                        <SelectItem value="rebalance">Rebalance</SelectItem>
                        <SelectItem value="news">News</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="alert-priority">Priority</Label>
                    <Select
                      value={newAlert.priority}
                      onValueChange={(value: Alert['priority']) =>
                        setNewAlert((prev) => ({ ...prev, priority: value }))
                      }
                    >
                      <SelectTrigger id="alert-priority" className="bg-background">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="low">Low</SelectItem>
                        <SelectItem value="medium">Medium</SelectItem>
                        <SelectItem value="high">High</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert-symbol">Symbol</Label>
                  <Input
                    id="alert-symbol"
                    placeholder="e.g., AAPL"
                    value={newAlert.symbol}
                    onChange={(e) =>
                      setNewAlert((prev) => ({ ...prev, symbol: e.target.value.toUpperCase() }))
                    }
                    className="bg-background"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="alert-message">Condition/Message</Label>
                  <Input
                    id="alert-message"
                    placeholder="e.g., Price above $200"
                    value={newAlert.message}
                    onChange={(e) => setNewAlert((prev) => ({ ...prev, message: e.target.value }))}
                    className="bg-background"
                  />
                </div>

                <Button onClick={handleAddAlert} className="w-full">
                  Create Alert
                </Button>
              </div>
            </div>
          )}

          {/* Unread Alerts */}
          {unreadAlerts.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                New ({unreadAlerts.length})
              </h3>
              {unreadAlerts.map((alert) => {
                const Icon = alertTypeIcons[alert.type]
                return (
                  <div
                    key={alert.id}
                    className="relative rounded-lg border border-primary/30 bg-primary/5 p-4"
                  >
                    <div className="absolute right-2 top-2 flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onMarkAsRead(alert.id)}
                      >
                        <Check className="h-3 w-3" />
                        <span className="sr-only">Mark as read</span>
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={() => onDismiss(alert.id)}
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Dismiss</span>
                      </Button>
                    </div>
                    <div className="flex items-start gap-3">
                      <div
                        className={cn(
                          'flex h-8 w-8 items-center justify-center rounded-full',
                          priorityColors[alert.priority]
                        )}
                      >
                        <Icon className="h-4 w-4" />
                      </div>
                      <div className="flex-1 pr-14">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-foreground">{alert.symbol}</span>
                          <Badge variant="outline" className="text-xs">
                            {alertTypeLabels[alert.type]}
                          </Badge>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Read Alerts */}
          {readAlerts.length > 0 && (
            <div className="space-y-3">
              <Separator className="bg-border" />
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Earlier
              </h3>
              {readAlerts.map((alert) => {
                const Icon = alertTypeIcons[alert.type]
                return (
                  <div
                    key={alert.id}
                    className="relative rounded-lg border border-border bg-secondary/30 p-4 opacity-60 hover:opacity-100 transition-opacity"
                  >
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-2 top-2 h-6 w-6"
                      onClick={() => onDismiss(alert.id)}
                    >
                      <X className="h-3 w-3" />
                      <span className="sr-only">Dismiss</span>
                    </Button>
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-muted">
                        <Icon className="h-4 w-4 text-muted-foreground" />
                      </div>
                      <div className="flex-1 pr-8">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-foreground">{alert.symbol}</span>
                        </div>
                        <p className="mt-1 text-sm text-muted-foreground">{alert.message}</p>
                        <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(alert.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {alerts.length === 0 && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <BellOff className="h-12 w-12 text-muted-foreground/50" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">No alerts yet</p>
              <p className="mt-1 text-sm text-muted-foreground">
                Create price or volume alerts to stay informed
              </p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}
