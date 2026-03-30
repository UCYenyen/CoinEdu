"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"
import { MetricInfo } from "@/components/common/metric-info"

interface StatCardProps {
  title: string
  value: string | number
  metricId?: any // Using any for now to allow flexible titles, or I can map it
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
    <Card className={cn("overflow-hidden border bg-card text-card-foreground p-0 py-0", className)}>
      <CardContent className="p-4 flex flex-col gap-2 flex-1 justify-center">
        <div className="flex items-center text-sm font-semibold text-muted-foreground transition-colors w-fit">
          <MetricInfo 
            title={title} 
            description="The total value of all coins in the crypto market."
            metricId={metricId as any}
          />
        </div>
        
        <div className="flex items-end gap-2 mt-1">
          <div className="text-2xl font-bold tracking-tight">{value}</div>
          {changePercentage !== undefined && (
            <div
              className={cn(
                "flex items-center text-sm font-medium pb-1",
                isPositive ? "text-green-500" : "text-red-500"
              )}
            >
              <span className="text-[10px] mr-1">{isPositive ? "▲" : "▼"}</span>
              {Math.abs(changePercentage).toFixed(2)}%
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
