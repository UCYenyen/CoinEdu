"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

import type { MarketCoin } from "@/types/market"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from "@/components/ui/chart"

const chartConfig = {
  change: {
    label: "24h Change",
    color: "var(--primary)",
  },
} satisfies ChartConfig

export function ChartAreaInteractive({ data }: { data: MarketCoin[] }) {
  const chartData = React.useMemo(
    () =>
      data.map((coin) => ({
        symbol: coin.symbol,
        change: Number(coin.change24h.toFixed(2)),
      })),
    [data]
  )

  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Market Momentum (24h)</CardTitle>
        <CardDescription>
          Watchlist performance snapshot, inspired by CoinMarketCap market board
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2 pt-2 sm:px-6 sm:pt-4">
        <ChartContainer config={chartConfig} className="aspect-auto h-60 w-full">
          <BarChart data={chartData}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="symbol"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
            />
            <YAxis tickFormatter={(value) => `${value}%`} width={46} />
            <ChartTooltip
              cursor={false}
              content={
                <ChartTooltipContent
                  formatter={(value) => [`${value}%`, "24h"]}
                  indicator="dot"
                />
              }
            />
            <Bar dataKey="change" radius={6} fill="var(--color-change)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}
