'use client'

import { AppSidebar } from './app-sidebar'
import { MobileNav } from './mobile-nav'

interface PageLayoutProps {
  children: React.ReactNode
  title: string
  description: string
}

export function PageLayout({ children, title, description }: PageLayoutProps) {
  return (
    <div className="flex min-h-screen bg-background">
      <AppSidebar />
      <main className="flex-1 overflow-auto pb-20 lg:pb-0">
        <header className="sticky top-0 z-10 border-b border-border bg-card/95 backdrop-blur px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-foreground">{title}</h1>
              <p className="text-sm text-muted-foreground">{description}</p>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-positive animate-pulse" />
              Market Open
            </div>
          </div>
        </header>
        <div className="p-6">{children}</div>
      </main>
      <MobileNav />
    </div>
  )
}
