'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Search,
  Newspaper,
  Settings,
  TrendingUp,
} from 'lucide-react'

const navItems = [
  {
    label: 'Dashboard',
    href: '/',
    icon: LayoutDashboard,
  },
  {
    label: 'Research',
    href: '/research',
    icon: Search,
  },
  {
    label: 'News',
    href: '/news',
    icon: Newspaper,
  },
  {
    label: 'Settings',
    href: '/settings',
    icon: Settings,
  },
]

export function AppSidebar() {
  const pathname = usePathname()

  return (
    <aside className="hidden lg:flex w-64 flex-col border-r border-border bg-card">
      {/* Logo */}
      <div className="flex items-center gap-3 px-6 py-5 border-b border-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
          <TrendingUp className="h-5 w-5 text-primary-foreground" />
        </div>
        <div>
          <h1 className="font-semibold text-foreground">PortfolioTrack</h1>
          <p className="text-xs text-muted-foreground">Investment Manager</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:bg-accent hover:text-foreground'
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              </li>
            )
          })}
        </ul>
      </nav>

      {/* Footer */}
      <div className="border-t border-border px-4 py-4">
        <div className="rounded-lg bg-muted/50 p-4">
          <div className="flex items-center gap-2 text-sm">
            <span className="inline-block h-2 w-2 rounded-full bg-positive animate-pulse" />
            <span className="text-muted-foreground">Market Open</span>
          </div>
          <p className="mt-1 text-xs text-muted-foreground">
            Last updated: Just now
          </p>
        </div>
      </div>
    </aside>
  )
}
