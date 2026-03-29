'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { Card, CardContent } from "@/components/ui/card"
import {
  CoinsIcon,
  PlusIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  Loader2,
  ChevronRight,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import type { MarketCoin } from "@/types/market"
import { TransactionModal } from "@/features/portfolio/components/transaction-modal"
import { getPortfolioHoldings } from "@/features/portfolio/actions/transaction-actions"
import { cn } from "@/lib/utils"

interface Holding {
  coinId: string
  coinSymbol: string
  totalQuantity: number
  totalSpent: number
  avgBuyPrice: number
}

export default function PortfolioPage() {
  const { data: session } = useSession()

  const [modalOpen, setModalOpen] = useState(false)
  const [holdings, setHoldings] = useState<Holding[]>([])
  const [priceData, setPriceData] = useState<Record<string, MarketCoin>>({})
  const [loading, setLoading] = useState(true)

  const fetchHoldings = async () => {
    if (!session?.user?.id) return
    setLoading(true)
    const result = await getPortfolioHoldings(session.user.id)
    if (result.success) setHoldings(result.holdings)
    setLoading(false)
  }

  useEffect(() => {
    fetchHoldings()
  }, [session])

  useEffect(() => {
    if (holdings.length === 0) return

    const fetchPrices = async () => {
      try {
        const symbols = holdings.map((h) => h.coinSymbol).join(',')
        const response = await fetch(`/api/prices?symbols=${symbols}`)
        if (!response.ok) throw new Error('Failed to fetch prices')
        const data = await response.json()
        setPriceData(data)
      } catch {
        toast.error('Failed to load price data')
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000)
    return () => clearInterval(interval)
  }, [holdings])

  const totalValue = holdings.reduce((sum, h) => {
    const price = priceData[h.coinSymbol]?.price || h.avgBuyPrice
    return sum + h.totalQuantity * price
  }, 0)

  const totalCost = holdings.reduce((sum, h) => sum + h.totalSpent, 0)
  const portfolioGain = totalValue - totalCost
  const portfolioGainPercent = totalCost > 0 ? (portfolioGain / totalCost) * 100 : 0
  const isUp = portfolioGain >= 0

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center h-full p-6">
        <Card className="glass-card border-none max-w-sm w-full text-center p-8 space-y-4">
          <CoinsIcon className="size-12 mx-auto text-primary opacity-60" />
          <h2 className="text-xl font-bold">Track Your Portfolio</h2>
          <p className="text-sm text-muted-foreground">Sign in to track your crypto holdings and performance.</p>
          <Button asChild className="w-full">
            <a href="/sign-in">Sign In</a>
          </Button>
        </Card>
      </div>
    )
  }

  return (
    <div className="p-6 space-y-6">

      {/* ── Summary Stats ── */}
      <div className="flex flex-wrap items-stretch gap-4">
        {/* Total Value */}
        <div className="min-w-[220px]">
          <Card className="overflow-hidden border bg-card p-0 h-full">
            <CardContent className="p-4 flex flex-col gap-1 justify-center">
              <div className="flex items-center text-sm font-semibold text-muted-foreground">
                Portfolio Value <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
              </div>
              <div className="text-2xl font-bold tracking-tight mt-1">
                ${totalValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Profit / Loss */}
        <div className="min-w-[220px]">
          <Card className="overflow-hidden border bg-card p-0 h-full">
            <CardContent className="p-4 flex flex-col gap-1 justify-center">
              <div className="flex items-center text-sm font-semibold text-muted-foreground">
                All-time P&L <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
              </div>
              <div className="flex items-end gap-2 mt-1">
                <div className={cn("text-2xl font-bold tracking-tight", isUp ? "text-green-500" : "text-red-500")}>
                  {isUp ? '+' : '-'}${Math.abs(portfolioGain).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className={cn("flex items-center text-sm font-medium pb-1", isUp ? "text-green-500" : "text-red-500")}>
                  <span className="text-[10px] mr-1">{isUp ? '▲' : '▼'}</span>
                  {Math.abs(portfolioGainPercent).toFixed(2)}%
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Assets */}
        <div className="min-w-[160px]">
          <Card className="overflow-hidden border bg-card p-0 h-full">
            <CardContent className="p-4 flex flex-col gap-1 justify-center">
              <div className="flex items-center text-sm font-semibold text-muted-foreground">
                Assets <ChevronRight className="h-4 w-4 ml-1 opacity-50" />
              </div>
              <div className="text-2xl font-bold tracking-tight mt-1">{holdings.length}</div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* ── Holdings Table ── */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">Your Holdings</h2>
          <Button size="sm" onClick={() => setModalOpen(true)}>
            <PlusIcon className="mr-1.5 size-4" />
            Add Transaction
          </Button>
        </div>

        <Card className="overflow-hidden border bg-card p-0">
          {loading ? (
            <div className="flex justify-center py-16">
              <Loader2 className="size-8 animate-spin text-primary" />
            </div>
          ) : holdings.length === 0 ? (
            <div className="text-center py-16 px-6">
              <CoinsIcon className="size-14 mx-auto text-muted-foreground mb-3 opacity-20" />
              <h3 className="text-base font-semibold mb-1">No holdings yet</h3>
              <p className="text-sm text-muted-foreground mb-5">
                Add your first buy transaction to start tracking your portfolio.
              </p>
              <Button size="sm" onClick={() => setModalOpen(true)}>
                <PlusIcon className="mr-1.5 size-4" /> Add Transaction
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border text-muted-foreground text-xs uppercase">
                    <th className="text-left px-5 py-3 font-semibold">Asset</th>
                    <th className="text-right px-5 py-3 font-semibold">Price</th>
                    <th className="text-right px-5 py-3 font-semibold">Holdings</th>
                    <th className="text-right px-5 py-3 font-semibold">Avg. Buy</th>
                    <th className="text-right px-5 py-3 font-semibold">P&L</th>
                    <th className="px-5 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {holdings.map((h) => {
                    const price = priceData[h.coinSymbol]?.price || h.avgBuyPrice
                    const change24h = priceData[h.coinSymbol]?.change24h || 0
                    const value = h.totalQuantity * price
                    const pnl = value - h.totalSpent
                    const pnlPct = h.totalSpent > 0 ? (pnl / h.totalSpent) * 100 : 0
                    const up = pnl >= 0

                    return (
                      <tr
                        key={h.coinId}
                        className="hover:bg-muted/30 transition-colors cursor-pointer"
                        onClick={() => (window.location.href = `/coin/${h.coinSymbol.toLowerCase()}`)}
                      >
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="size-8 rounded-full bg-primary/15 text-primary flex items-center justify-center font-bold text-xs">
                              {h.coinSymbol.substring(0, 3)}
                            </div>
                            <div>
                              <div className="font-semibold">{h.coinSymbol}</div>
                            </div>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="font-medium tabular-nums">
                            ${price.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                          </div>
                          <div className={cn("text-xs flex items-center justify-end gap-0.5", change24h >= 0 ? "text-green-500" : "text-red-500")}>
                            {change24h >= 0 ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
                            {Math.abs(change24h).toFixed(2)}%
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className="font-medium tabular-nums">${value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</div>
                          <div className="text-xs text-muted-foreground tabular-nums">
                            {h.totalQuantity.toLocaleString(undefined, { maximumFractionDigits: 8 })} {h.coinSymbol}
                          </div>
                        </td>

                        <td className="px-5 py-4 text-right text-muted-foreground tabular-nums">
                          ${h.avgBuyPrice.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
                        </td>

                        <td className="px-5 py-4 text-right">
                          <div className={cn("font-medium tabular-nums", up ? "text-green-500" : "text-red-500")}>
                            {up ? '+' : '-'}${Math.abs(pnl).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                          </div>
                          <div className={cn("text-xs", up ? "text-green-500" : "text-red-500")}>
                            {up ? '+' : ''}{pnlPct.toFixed(2)}%
                          </div>
                        </td>

                        <td className="px-5 py-4">
                          <ChevronRight className="size-4 text-muted-foreground ml-auto" />
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>
      </div>

      <TransactionModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        userId={session?.user?.id || ''}
        onSuccess={fetchHoldings}
      />
    </div>
  )
}