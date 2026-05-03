'use client'

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import type { AssetAllocation as AssetAllocationType } from '@/lib/portfolio-data'

interface AssetAllocationProps {
  allocations: AssetAllocationType[]
}

const COLORS = [
  'oklch(0.72 0.19 145)',
  'oklch(0.65 0.20 200)',
  'oklch(0.70 0.18 65)',
  'oklch(0.60 0.22 25)',
  'oklch(0.70 0.15 280)',
  'oklch(0.5 0 0)',
]

export function AssetAllocation({ allocations }: AssetAllocationProps) {
  const chartData = allocations.map((item, index) => ({
    name: item.sector,
    value: item.value,
    color: COLORS[index % COLORS.length],
  }))

  const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: Array<{ name: string; value: number }> }) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-lg border border-border bg-card px-3 py-2 shadow-lg">
          <p className="font-medium text-foreground">{payload[0].name}</p>
          <p className="text-sm text-muted-foreground">{payload[0].value.toFixed(1)}%</p>
        </div>
      )
    }
    return null
  }

  return (
    <Card className="bg-card border-border">
      <CardHeader>
        <CardTitle className="text-lg font-semibold">Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Pie Chart */}
          <div className="h-[250px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={chartData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={2}
                  dataKey="value"
                >
                  {chartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} stroke="transparent" />
                  ))}
                </Pie>
                <Tooltip content={<CustomTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Allocation List */}
          <div className="space-y-4">
            {allocations.map((item, index) => {
              const deviation = item.value - item.target
              const isOverweight = deviation > 0

              return (
                <div key={item.sector} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div
                        className="h-3 w-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-sm font-medium text-foreground">{item.sector}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <span className="font-mono text-foreground">{item.value.toFixed(1)}%</span>
                      <span className="text-muted-foreground">/</span>
                      <span className="text-muted-foreground">{item.target}%</span>
                      {Math.abs(deviation) > 2 && (
                        <span
                          className={`font-mono text-xs ${
                            isOverweight ? 'text-warning' : 'text-positive'
                          }`}
                        >
                          ({isOverweight ? '+' : ''}
                          {deviation.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="relative">
                    <Progress
                      value={(item.value / Math.max(item.value, item.target)) * 100}
                      className="h-2 bg-muted"
                    />
                    {/* Target marker */}
                    <div
                      className="absolute top-0 h-2 w-0.5 bg-foreground/50"
                      style={{
                        left: `${(item.target / Math.max(item.value, item.target)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
