'use client'

import { useState, useEffect } from 'react'
import { PageLayout } from '@/components/page-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Separator } from '@/components/ui/separator'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import {
  User,
  Bell,
  Shield,
  Trash2,
  Download,
  Upload,
  CheckCircle,
} from 'lucide-react'
import { getHoldings, saveHoldings, defaultHoldings, type Holding } from '@/lib/portfolio-store'

export default function SettingsPage() {
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [notifications, setNotifications] = useState({
    priceAlerts: true,
    newsAlerts: true,
    rebalanceReminders: false,
    weeklyReport: true,
  })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    setHoldings(getHoldings())
  }, [])

  const handleExportData = () => {
    const data = {
      holdings,
      exportDate: new Date().toISOString(),
      version: '1.0',
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)
        if (data.holdings && Array.isArray(data.holdings)) {
          saveHoldings(data.holdings)
          setHoldings(data.holdings)
          setSaved(true)
          setTimeout(() => setSaved(false), 3000)
        }
      } catch (error) {
        console.error('Failed to import data:', error)
      }
    }
    reader.readAsText(file)
  }

  const handleResetData = () => {
    saveHoldings(defaultHoldings)
    setHoldings(defaultHoldings)
  }

  const handleClearData = () => {
    saveHoldings([])
    setHoldings([])
  }

  return (
    <PageLayout
      title="Settings"
      description="Manage your preferences and data"
    >
    <div className="max-w-3xl mx-auto space-y-6">
      {saved && (
        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 rounded-lg bg-positive px-4 py-3 text-primary-foreground shadow-lg">
          <CheckCircle className="h-5 w-5" />
          <span>Data imported successfully!</span>
        </div>
      )}

      {/* Profile Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5 text-primary" />
            Profile Settings
          </CardTitle>
          <CardDescription>
            Manage your account information
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">Display Name</Label>
              <Input id="name" placeholder="Your name" defaultValue="Investor" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="your@email.com" />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Currency</Label>
            <div className="flex items-center gap-2">
              <Badge variant="secondary" className="text-sm">INR (Indian Rupee)</Badge>
              <span className="text-sm text-muted-foreground">
                All values displayed in Indian Rupees
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Notification Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-primary" />
            Notification Preferences
          </CardTitle>
          <CardDescription>
            Choose what notifications you want to receive
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            {
              id: 'priceAlerts',
              label: 'Price Alerts',
              description: 'Get notified when stocks hit your target prices',
            },
            {
              id: 'newsAlerts',
              label: 'News Alerts',
              description: 'Receive breaking news about your portfolio stocks',
            },
            {
              id: 'rebalanceReminders',
              label: 'Rebalance Reminders',
              description: 'Monthly reminders to review portfolio allocation',
            },
            {
              id: 'weeklyReport',
              label: 'Weekly Report',
              description: 'Weekly summary of portfolio performance',
            },
          ].map((item) => (
            <div key={item.id} className="flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground">{item.label}</p>
                <p className="text-sm text-muted-foreground">{item.description}</p>
              </div>
              <Switch
                checked={notifications[item.id as keyof typeof notifications]}
                onCheckedChange={(checked) =>
                  setNotifications((prev) => ({ ...prev, [item.id]: checked }))
                }
              />
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Data Management */}
      <Card className="bg-card border-border">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            Data Management
          </CardTitle>
          <CardDescription>
            Export, import, or reset your portfolio data
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex flex-wrap gap-4">
            <Button variant="outline" onClick={handleExportData}>
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <div className="relative">
              <input
                type="file"
                accept=".json"
                onChange={handleImportData}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <Button variant="outline">
                <Upload className="mr-2 h-4 w-4" />
                Import Data
              </Button>
            </div>
          </div>

          <Separator />

          <div className="space-y-4">
            <div>
              <h4 className="font-medium text-foreground">Portfolio Summary</h4>
              <p className="text-sm text-muted-foreground mt-1">
                You have {holdings.length} holdings stored locally
              </p>
            </div>

            <div className="flex flex-wrap gap-4">
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="outline">
                    Reset to Demo Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Reset to Demo Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will replace your current portfolio with demo holdings. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleResetData}>
                      Reset
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive">
                    <Trash2 className="mr-2 h-4 w-4" />
                    Clear All Data
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear All Data?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your portfolio holdings. This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearData}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* About */}
      <Card className="bg-card border-border">
        <CardContent className="py-6">
          <div className="text-center text-sm text-muted-foreground">
            <p>PortfolioTrack Pro v1.0</p>
            <p className="mt-1">
              Your portfolio data is stored locally in your browser using localStorage.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
    </PageLayout>
  )
}
