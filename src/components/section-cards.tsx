"use client"

import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import type { MarketCoin } from "@/types/market"

function formatPrice(value: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString("en-US", {
      maximumFractionDigits: 2,
    })}`
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}`
}

function formatPercent(value: number) {
  return `${value > 0 ? "+" : ""}${value.toFixed(2)}%`
}

export function SectionCards({ data }: { data: MarketCoin[] }) {
  const averageChange =
    data.length > 0
      ? data.reduce((acc, coin) => acc + coin.change24h, 0) / data.length
      : 0

  const topGainer =
    data.length > 0
      ? data.reduce((best, current) =>
          current.change24h > best.change24h ? current : best
        )
      : null

  const topLoser =
    data.length > 0
      ? data.reduce((worst, current) =>
          current.change24h < worst.change24h ? current : worst
        )
      : null

  const btc = data.find((coin) => coin.symbol === "BTC")

  return (
    <div className="grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card">
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>BTC Price</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {btc ? formatPrice(btc.price) : "-"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {btc && btc.change24h >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              {btc ? formatPercent(btc.change24h) : "-"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Live spot price from FreeCrypto API
          </div>
          <div className="text-muted-foreground">
            Updated with latest exchange feed
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top Gainer (24h)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {topGainer ? topGainer.symbol : "-"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingUpIcon />
              {topGainer ? formatPercent(topGainer.change24h) : "-"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Strongest performer in your watchlist
          </div>
          <div className="text-muted-foreground">
            Based on 24h percentage move
          </div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Top Loser (24h)</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {topLoser ? topLoser.symbol : "-"}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              <TrendingDownIcon />
              {topLoser ? formatPercent(topLoser.change24h) : "-"}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Weakest performer in your watchlist
          </div>
          <div className="text-muted-foreground">Track risk and downside pressure</div>
        </CardFooter>
      </Card>
      <Card className="@container/card">
        <CardHeader>
          <CardDescription>Average 24h Change</CardDescription>
          <CardTitle className="text-2xl font-semibold tabular-nums @[250px]/card:text-3xl">
            {formatPercent(averageChange)}
          </CardTitle>
          <CardAction>
            <Badge variant="outline">
              {averageChange >= 0 ? <TrendingUpIcon /> : <TrendingDownIcon />}
              {data.length} coins
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className="flex-col items-start gap-1.5 text-sm">
          <div className="line-clamp-1 flex gap-2 font-medium">
            Overall market mood from tracked assets
          </div>
          <div className="text-muted-foreground">Aligned to CoinMarketCap-style summary cards</div>
        </CardFooter>
      </Card>
    </div>
  )
}
