"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MetricInfo } from "@/components/common/metric-info"
import { MetricId } from "@/types/metrics"

interface StatCardProps {
  title: string
  value: string | number
  metricId?: MetricId // Explicitly using MetricId for type safety
  changePercentage?: number
  className?: string
}

// Component to show title, value and change percentage
// without graph

export function StatCard({
  title,
  value,
  changePercentage,
  className,
}: StatCardProps) {
  const isPositive = changePercentage !== undefined && changePercentage >= 0

  // Map title to metricId
  const metricId = title === "Global Market Cap" ? "globalMarketCap" : "marketCap"

  return (
    <Card className={cn("overflow-hidden border bg-card text-card-foreground p-0 py-0 h-full", className)}>
      <CardContent className="p-4 flex flex-col h-full gap-2">
        <div className="flex items-center text-sm font-semibold text-muted-foreground transition-colors w-full justify-start">
          <MetricInfo 
            title={title} 
            description="The total value of all coins in the crypto market."
            metricId={metricId}
          />
        </div>
        
        <div className="flex-1 flex flex-col items-center justify-center">
          <div className="flex items-center gap-2 group">
            <div className="text-2xl font-bold tracking-tight">{value}</div>
            {changePercentage !== undefined && (
              <div
                className={cn(
                  "flex items-center text-sm font-medium",
                  isPositive ? "text-green-500" : "text-red-500"
                )}
              >
                <span className="text-[10px] mr-1">{isPositive ? "▲" : "▼"}</span>
                {Math.abs(changePercentage).toFixed(2)}%
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
