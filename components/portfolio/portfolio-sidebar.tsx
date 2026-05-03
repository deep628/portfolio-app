'use client'

import { BarChart3, Bell, Briefcase, Home, PieChart, RefreshCw, Search, Settings, TrendingUp } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

type Tab = 'dashboard' | 'research' | 'rebalance' | 'alerts'

interface PortfolioSidebarProps {
  activeTab: Tab
  onTabChange: (tab: Tab) => void
  unreadAlerts: number
}

const navItems = [
  { id: 'dashboard' as Tab, label: 'Dashboard', icon: Home },
  { id: 'research' as Tab, label: 'Research', icon: Search },
  { id: 'rebalance' as Tab, label: 'Rebalance', icon: RefreshCw },
  { id: 'alerts' as Tab, label: 'Alerts', icon: Bell },
]

export function PortfolioSidebar({ activeTab, onTabChange, unreadAlerts }: PortfolioSidebarProps) {
  return (
    <TooltipProvider delayDuration={0}>
      <aside className="flex h-full w-16 flex-col items-center border-r border-border bg-sidebar py-4">
        {/* Logo */}
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary mb-6">
          <TrendingUp className="h-5 w-5 text-primary-foreground" />
        </div>

        {/* Navigation */}
        <nav className="flex flex-1 flex-col items-center gap-2">
          {navItems.map((item) => (
            <Tooltip key={item.id}>
              <TooltipTrigger asChild>
                <Button
                  variant={activeTab === item.id ? 'secondary' : 'ghost'}
                  size="icon"
                  className={cn(
                    'relative h-10 w-10',
                    activeTab === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground'
                  )}
                  onClick={() => onTabChange(item.id)}
                >
                  <item.icon className="h-5 w-5" />
                  {item.id === 'alerts' && unreadAlerts > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-destructive text-[10px] text-destructive-foreground">
                      {unreadAlerts}
                    </span>
                  )}
                  <span className="sr-only">{item.label}</span>
                </Button>
              </TooltipTrigger>
              <TooltipContent side="right">
                <p>{item.label}</p>
              </TooltipContent>
            </Tooltip>
          ))}
        </nav>

        {/* Bottom Actions */}
        <div className="flex flex-col items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-10 w-10">
                <Settings className="h-5 w-5" />
                <span className="sr-only">Settings</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent side="right">
              <p>Settings</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </aside>
    </TooltipProvider>
  )
}
