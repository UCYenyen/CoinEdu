"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { Line, LineChart } from "recharts"
import { ChartContainer } from "@/components/ui/chart"
import { cn } from "@/lib/utils"

interface GraphStatCardProps {
  title: string
  value: string
  changePercentage: number
  data: { value: number }[]
  className?: string
}

// Component to show title, value and change percentage
// with graph

export function GraphStatCard({
  title,
  value,
  changePercentage,
  data,
  className,
}: GraphStatCardProps) {
  const isPositive = changePercentage >= 0
  const chartConfig = {
    value: {
      color: isPositive ? "#22c55e" : "#ef4444",
    },
  }

  return (
    <Card className={cn("overflow-hidden border bg-card text-card-foreground p-0 py-0", className)}>
      <CardContent className="p-4 flex flex-col gap-2 flex-1">
        <div className="flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors w-fit">
          {title} <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
        </div>
        
        <div className="flex items-end gap-2">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          <div
            className={cn(
              "flex items-center text-sm font-medium pb-1",
              isPositive ? "text-green-500" : "text-red-500"
            )}
          >
            <span className="text-[10px] mr-0.5">{isPositive ? "▲" : "▼"}</span>
            {Math.abs(changePercentage)}%
          </div>
        </div>
        
        <div className="h-[40px] w-full mt-2">
          <ChartContainer config={chartConfig} className="h-full w-full !aspect-auto">
            <LineChart data={data} margin={{ top: 5, right: 0, left: 0, bottom: 0 }} style={{ pointerEvents: "none" }}>
              <Line
                type="monotone"
                dataKey="value"
                stroke="var(--color-value)"
                strokeWidth={2}
                dot={false}
                activeDot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ChartContainer>
        </div>
      </CardContent>
    </Card>
  )
}
