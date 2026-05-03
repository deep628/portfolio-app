'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { cn } from '@/lib/utils'
import {
  LayoutDashboard,
  Search,
  Newspaper,
  Settings,
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

export function MobileNav() {
  const pathname = usePathname()

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-border bg-card/95 backdrop-blur">
      <ul className="flex items-center justify-around py-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <li key={item.href}>
              <Link
                href={item.href}
                className={cn(
                  'flex flex-col items-center gap-1 px-3 py-2 text-xs font-medium transition-colors',
                  isActive
                    ? 'text-primary'
                    : 'text-muted-foreground hover:text-foreground'
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
  )
}
