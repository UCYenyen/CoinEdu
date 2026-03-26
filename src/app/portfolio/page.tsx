'use client'

import React, { useState } from 'react'
import { useSession } from '@/lib/auth-client'
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent
} from "@/components/ui/card"
import {
  CoinsIcon,
  PlusIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CoinSelector, type Coin } from "@/components/coin-selector"

export default function PortfolioPage() {
  const { data: session } = useSession()

  const [selectorOpen, setSelectorOpen] = useState(false)
  const [portfolio, setPortfolio] = useState<Coin[]>([])

  const handleSelectCoin = (coin: Coin) => {
    setPortfolio((prev) => {
      if (prev.find((c) => c.id === coin.id)) return prev
      return [...prev, coin]
    })
  }

  if (!session?.user) {
    return <div>Please sign in</div>
  }

  return (
    <section className="flex flex-col gap-6 p-6">

      {/* ─── DASHBOARD CARDS (NEW) ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

        {/* Portfolio Value */}
        <Card className="bg-gradient-to-br from-indigo-500/10 to-background border-indigo-500/20">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CoinsIcon className="size-4" />
              Portfolio Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">$0.00</h2>
            <div className="flex items-center gap-2 text-xs text-green-500 mt-1">
              <TrendingUpIcon className="size-3" />
              +0.00%
            </div>
          </CardContent>
        </Card>

        {/* Total Assets */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              {portfolio.length}
            </h2>
            <p className="text-xs text-muted-foreground">
              Coins tracked
            </p>
          </CardContent>
        </Card>

        {/* Best Performer (placeholder) */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">
              Top Performer
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold">
              {portfolio[0]?.symbol || '--'}
            </h2>
            <div className="flex items-center gap-1 text-green-500 text-xs">
              <TrendingUpIcon className="size-3" />
              +0.00%
            </div>
          </CardContent>
        </Card>

      </div>

      {/* ─── ADD COIN BUTTON ───────────────── */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Portfolio</h2>

        <Button
          size="sm"
          onClick={() => setSelectorOpen(true)}
        >
          <PlusIcon className="mr-1 size-4" />
          Add Coin
        </Button>
      </div>

      {/* ─── PORTFOLIO LIST ───────────────── */}
      <Card>
        <CardContent className="space-y-3 pt-4">
          {portfolio.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No assets yet. Add your first coin 👇
            </p>
          )}

          {portfolio.map((coin) => (
            <div
              key={coin.id}
              className="flex justify-between items-center p-3 rounded-lg hover:bg-muted/50 transition"
            >
              <div className="flex items-center gap-2">
                <span className="font-medium">{coin.name}</span>
                <Badge variant="secondary">{coin.symbol}</Badge>
              </div>

              <div className="text-right">
                <p className="text-sm font-medium">$--</p>
                <p className="text-xs text-green-500">
                  +0.00%
                </p>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* ─── EDUCATION CARD (MATCH DESIGN) ───────────────── */}
      <Card className="bg-gradient-to-br from-indigo-500/10 to-background">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="size-4 text-indigo-400" />
            Learn Portfolio Basics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Understand diversification, risk, and how to build a strong crypto portfolio.
          </p>

          <Button className="mt-3">
            Start Learning
          </Button>
        </CardContent>
      </Card>

      {/* ─── SELECTOR ───────────────── */}
      <CoinSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelectCoin={handleSelectCoin}
      />
    </section>
  )
}