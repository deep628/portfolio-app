'use client'

import { useState } from 'react'
import { AlertTriangle, ArrowRight, Check, TrendingDown, TrendingUp, Sparkles, Send, Loader2 } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import type { AssetAllocation } from '@/lib/portfolio-data'
import ReactMarkdown from 'react-markdown'

interface RebalancingToolProps {
  allocations: AssetAllocation[]
  totalValue: number
  holdings?: unknown
}

interface RebalanceRecommendation {
  sector: string
  currentValue: number
  targetValue: number
  difference: number
  action: 'Buy' | 'Sell' | 'Hold'
  color: string
}

const COLORS = [
  'oklch(0.72 0.19 145)',
  'oklch(0.65 0.20 200)',
  'oklch(0.70 0.18 65)',
  'oklch(0.60 0.22 25)',
  'oklch(0.70 0.15 280)',
  'oklch(0.5 0 0)',
]

export function RebalancingTool({ allocations, totalValue, holdings }: RebalancingToolProps) {
  const [targetAllocations, setTargetAllocations] = useState<Record<string, number>>(
    Object.fromEntries(allocations.map((a) => [a.sector, a.target]))
  )

  // BUG 1 FIX: AI chat state wired to /api/rebalance
  const [chatInput, setChatInput] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAiLoading, setIsAiLoading] = useState(false)
  const [aiError, setAiError] = useState<string | null>(null)

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)

  const recommendations: RebalanceRecommendation[] = allocations.map((allocation, index) => {
    const currentValue = (allocation.value / 100) * totalValue
    const target = targetAllocations[allocation.sector] || allocation.target
    const targetValue = (target / 100) * totalValue
    const difference = targetValue - currentValue
    let action: 'Buy' | 'Sell' | 'Hold' = 'Hold'
    if (Math.abs(difference) > totalValue * 0.01) {
      action = difference > 0 ? 'Buy' : 'Sell'
    }
    return { sector: allocation.sector, currentValue, targetValue, difference, action, color: COLORS[index % COLORS.length] }
  })

  const totalTargetAllocation = Object.values(targetAllocations).reduce((a, b) => a + b, 0)
  const isValidAllocation = Math.abs(totalTargetAllocation - 100) < 0.1
  const needsRebalancing = recommendations.some((r) => r.action !== 'Hold')

  const handleTargetChange = (sector: string, value: number) => {
    setTargetAllocations((prev) => ({ ...prev, [sector]: value }))
  }

  // BUG 1 FIX: actual AI call to /api/rebalance with streaming
  const askAI = async (overrideMessage?: string) => {
    const message = overrideMessage || chatInput.trim()
    if (!message) return

    setIsAiLoading(true)
    setAiResponse('')
    setAiError(null)
    setChatInput('')

    // Build context including current sector recommendations
    const portfolioContext = {
      holdings,
      allocations,
      recommendations: recommendations.map(r => ({
        sector: r.sector,
        action: r.action,
        amount: Math.abs(r.difference).toFixed(0),
        currentPct: ((r.currentValue / totalValue) * 100).toFixed(1),
        targetPct: (targetAllocations[r.sector] || 0).toFixed(1),
      })),
      totalValue,
      userGoal: message,
    }

    try {
      const response = await fetch('/api/rebalance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', content: message }],
          holdings: portfolioContext,
        }),
      })

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || `Request failed (${response.status})`)
      }

      const reader = response.body?.getReader()
      const decoder = new TextDecoder()
      if (!reader) throw new Error('No response stream')

      while (true) {
        const { done, value } = await reader.read()
        if (done) break
        // toTextStreamResponse() emits raw text — append directly
        setAiResponse(prev => prev + decoder.decode(value, { stream: true }))
      }
    } catch (err: unknown) {
      setAiError(err instanceof Error ? err.message : 'AI request failed')
    } finally {
      setIsAiLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <Card className="bg-card border-border">
        <CardHeader className="flex flex-row items-center justify-between pb-4">
          <div>
            <CardTitle className="text-lg font-semibold">Rebalancing Tool</CardTitle>
            <p className="mt-1 text-sm text-muted-foreground">
              Adjust target allocations and get AI-powered recommendations
            </p>
          </div>
          <Badge
            variant="outline"
            className={cn(
              needsRebalancing
                ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500'
                : 'bg-green-500/10 text-green-500 border-green-500'
            )}
          >
            {needsRebalancing ? (
              <><AlertTriangle className="mr-1 h-3 w-3" />Rebalance Needed</>
            ) : (
              <><Check className="mr-1 h-3 w-3" />Balanced</>
            )}
          </Badge>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Sliders */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                Target Allocations
              </h3>
              <span className={cn('text-sm font-mono', isValidAllocation ? 'text-muted-foreground' : 'text-destructive')}>
                Total: {totalTargetAllocation.toFixed(1)}%
              </span>
            </div>
            {allocations.map((allocation, index) => (
              <div key={allocation.sector} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="h-3 w-3 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                    <span className="text-sm font-medium text-foreground">{allocation.sector}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Current: {allocation.value.toFixed(1)}%</span>
                    <ArrowRight className="h-3 w-3 text-muted-foreground" />
                    <span className="text-sm font-mono font-medium text-foreground">
                      {targetAllocations[allocation.sector]?.toFixed(0) || allocation.target}%
                    </span>
                  </div>
                </div>
                <Slider
                  value={[targetAllocations[allocation.sector] || allocation.target]}
                  onValueChange={(value) => handleTargetChange(allocation.sector, value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
            ))}
          </div>

          {/* Sector recommendations */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
              Recommended Actions
            </h3>
            {recommendations.filter((r) => r.action !== 'Hold').map((rec) => (
              <div key={rec.sector} className="flex items-center justify-between rounded-lg bg-secondary/50 p-3">
                <div className="flex items-center gap-3">
                  {rec.action === 'Buy' ? (
                    <TrendingUp className="h-5 w-5 text-green-500" />
                  ) : (
                    <TrendingDown className="h-5 w-5 text-red-500" />
                  )}
                  <div>
                    <p className="font-medium text-foreground">{rec.sector}</p>
                    <p className="text-sm text-muted-foreground">
                      {rec.action === 'Buy' ? 'Underweight' : 'Overweight'} by{' '}
                      {Math.abs((rec.difference / totalValue) * 100).toFixed(1)}%
                    </p>
                  </div>
                </div>
                <p className={cn('font-mono font-semibold', rec.action === 'Buy' ? 'text-green-500' : 'text-red-500')}>
                  {rec.action} {formatCurrency(Math.abs(rec.difference))}
                </p>
              </div>
            ))}
            {!needsRebalancing && (
              <div className="flex items-center justify-center gap-2 rounded-lg bg-green-500/10 p-4 text-green-500">
                <Check className="h-5 w-5" />
                <span className="font-medium">Portfolio is within target allocations</span>
              </div>
            )}
          </div>

          {/* Quick AI Prompt Buttons */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide flex items-center gap-2">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              Ask AI Advisor
            </h3>
            <div className="flex flex-wrap gap-2">
              {[
                'Reduce my tech concentration',
                'What should I sell first for tax efficiency?',
                'How can I improve diversification?',
                'Suggest a rebalancing plan for this portfolio',
              ].map((prompt) => (
                <Button
                  key={prompt}
                  variant="outline"
                  size="sm"
                  onClick={() => askAI(prompt)}
                  disabled={isAiLoading}
                  className="text-xs"
                >
                  {prompt}
                </Button>
              ))}
            </div>
          </div>

          {/* Chat Input */}
          <div className="flex gap-2">
            <Textarea
              placeholder="Ask the AI advisor anything about rebalancing your portfolio..."
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault()
                  askAI()
                }
              }}
              className="resize-none"
              rows={2}
            />
            <Button onClick={() => askAI()} disabled={isAiLoading || !chatInput.trim()} size="icon" className="h-auto">
              {isAiLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>

          {!isValidAllocation && (
            <p className="text-center text-sm text-destructive">Target allocations must total 100%</p>
          )}
        </CardContent>
      </Card>

      {/* AI Response Panel */}
      {(aiResponse || isAiLoading || aiError) && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-base">
              <Sparkles className="h-4 w-4 text-yellow-500" />
              AI Advisor Response
              {isAiLoading && <Loader2 className="h-4 w-4 animate-spin ml-1 text-muted-foreground" />}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {aiError && (
              <div className="flex items-center gap-2 text-destructive text-sm p-3 rounded-lg bg-destructive/10">
                <AlertTriangle className="h-4 w-4" />
                <span>{aiError}</span>
                <Button size="sm" variant="ghost" onClick={() => askAI(chatInput || 'Analyze my portfolio')} className="ml-auto">
                  Retry
                </Button>
              </div>
            )}
            {aiResponse && (
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown>{aiResponse}</ReactMarkdown>
                {isAiLoading && (
                  <span className="inline-block w-2 h-4 bg-primary animate-pulse rounded-sm ml-1 align-middle" />
                )}
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}
