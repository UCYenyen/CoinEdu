"use client"

import { Card, CardContent } from "@/components/ui/card"
import { ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface FearGreedCardProps {
  value: number
  classification: string
  className?: string
}

export function FearGreedCard({
  value,
  classification,
  className,
}: FearGreedCardProps) {
  // SVG Math setup
  const cx = 100
  const cy = 100
  const r = 80
  const strokeWidth = 12

  // Total length of semi-circle arc
  const arcLength = Math.PI * r
  
  // 5 segments, 4 gaps
  const gap = 4
  const numSegments = 5
  const segmentLength = (arcLength - gap * (numSegments - 1)) / numSegments

  const segments = [
    { color: "#ef4444" }, // Red
    { color: "#f97316" }, // Orange
    { color: "#eab308" }, // Yellow
    { color: "#84cc16" }, // Light Green
    { color: "#22c55e" }, // Green
  ]

  // Calculate dot position dynamically
  const normalizedValue = Math.max(0, Math.min(100, value))
  const angle = Math.PI * (1 - normalizedValue / 100)
  const dotX = cx + r * Math.cos(angle)
  const dotY = cy - r * Math.sin(angle)

  return (
    <Card className={cn("overflow-hidden border bg-card text-card-foreground p-0 py-0", className)}>
      <CardContent className="p-4 flex flex-col gap-0 flex-1">
        <div className="flex items-center text-sm font-semibold text-muted-foreground hover:text-foreground cursor-pointer transition-colors w-fit">
          Fear & Greed <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
        </div>
        
        <div className="relative w-full flex justify-center items-center mt-0">
          <svg viewBox="0 0 200 120" className="w-[80%] max-w-[200px] drop-shadow-sm">
            {segments.map((seg, i) => {
              const offset = (segmentLength + gap) * i
              return (
                <path
                  key={i}
                  d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                  fill="none"
                  stroke={seg.color}
                  strokeWidth={strokeWidth}
                  strokeLinecap="round"
                  strokeDasharray={`${segmentLength} ${arcLength}`}
                  strokeDashoffset={-offset}
                />
              )
            })}
            
            {/* Value & Classification texts in center */}
            <text
              x={cx}
              y={cy - 10}
              textAnchor="middle"
              className="fill-foreground font-bold text-3xl tabular-nums"
            >
              {value}
            </text>
            <text
              x={cx}
              y={cy + 10}
              textAnchor="middle"
              className="fill-muted-foreground font-medium text-xs"
            >
              {classification}
            </text>

            {/* Indicator Dot */}
            <circle
              cx={dotX}
              cy={dotY}
              r={7}
              fill="white"
              stroke="#1e293b" // Match dark background slightly
              strokeWidth={3}
              className="drop-shadow-md transition-all duration-1000 ease-out"
            />
          </svg>
        </div>
      </CardContent>
    </Card>
  )
}
