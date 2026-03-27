'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription
} from "@/components/ui/card"
import {
  CoinsIcon,
  PlusIcon,
  TrendingUpIcon,
  TrendingDownIcon,
  AlertCircle,
  BookOpenIcon,
  Loader2,
  InfoIcon,
  TrashIcon,
  DollarSignIcon,
  PercentIcon
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { CoinSelector, type Coin } from "@/components/coin-selector"
import { toast } from "sonner"
import type { MarketCoin } from "@/types/market"

interface PortfolioCoin extends Coin {
  currentPrice?: number
  priceChange24h?: number
  portfolio: {
    amount: number
    purchasePrice: number
  }
}

export default function PortfolioPage() {
  const { data: session } = useSession()

  const [selectorOpen, setSelectorOpen] = useState(false)
  const [portfolio, setPortfolio] = useState<PortfolioCoin[]>([])
  const [priceData, setPriceData] = useState<Record<string, MarketCoin>>({})
  const [loading, setLoading] = useState(true)
  const [editingCoin, setEditingCoin] = useState<string | null>(null)
  const [amounts, setAmounts] = useState<Record<string, { amount: string; purchasePrice: string }>>({})

  // Fetch real-time price data from FreeCrypto API
  useEffect(() => {
    if (portfolio.length === 0) {
      setLoading(false)
      return
    }

    const fetchPrices = async () => {
      try {
        setLoading(true)
        const symbols = portfolio.map((c) => c.symbol).join(',')
        const response = await fetch(`/api/prices?symbols=${symbols}`)

        if (!response.ok) throw new Error('Failed to fetch prices')

        const data = await response.json()
        setPriceData(data)
      } catch (error) {
        console.error('Error fetching prices:', error)
        toast.error('Failed to load price data')
      } finally {
        setLoading(false)
      }
    }

    fetchPrices()
    const interval = setInterval(fetchPrices, 30000) // Refresh every 30s
    return () => clearInterval(interval)
  }, [portfolio])

  const handleSelectCoin = (coin: Coin) => {
    if (portfolio.find((c) => c.id === coin.id)) {
      toast.info(`${coin.name} is already in your portfolio`)
      return
    }

    const newCoin: PortfolioCoin = {
      ...coin,
      portfolio: { amount: 0, purchasePrice: 0 },
    }

    setPortfolio((prev) => [...prev, newCoin])
    setAmounts((prev) => ({
      ...prev,
      [coin.id]: { amount: '', purchasePrice: '' },
    }))
    toast.success(`Added ${coin.name} to portfolio`)
  }

  const handleRemoveCoin = (coinId: string) => {
    const coin = portfolio.find((c) => c.id === coinId)
    setPortfolio((prev) => prev.filter((c) => c.id !== coinId))
    setAmounts((prev) => {
      const newAmounts = { ...prev }
      delete newAmounts[coinId]
      return newAmounts
    })
    toast.success(`Removed ${coin?.name} from portfolio`)
  }

  const handleSaveAmount = (coinId: string) => {
    const amount = amounts[coinId]
    if (!amount?.amount || !amount?.purchasePrice) {
      toast.error('Please enter both amount and purchase price')
      return
    }

    setPortfolio((prev) =>
      prev.map((c) =>
        c.id === coinId
          ? {
              ...c,
              portfolio: {
                amount: parseFloat(amount.amount),
                purchasePrice: parseFloat(amount.purchasePrice),
              },
            }
          : c
      )
    )

    setEditingCoin(null)
    toast.success('Portfolio updated')
  }

  // Calculate portfolio metrics
  const totalValue = portfolio.reduce((sum, coin) => {
    const price = priceData[coin.symbol]?.price || coin.portfolio.purchasePrice
    return sum + coin.portfolio.amount * price
  }, 0)

  const totalCost = portfolio.reduce(
    (sum, coin) => sum + coin.portfolio.amount * coin.portfolio.purchasePrice,
    0
  )

  const portfolioGain = totalValue - totalCost
  const portfolioGainPercent = totalCost > 0 ? (portfolioGain / totalCost) * 100 : 0

  const bestPerformer = portfolio.reduce(
    (best, coin) => {
      const change = priceData[coin.symbol]?.change24h || 0
      return change > (best?.change || 0) ? { ...coin, change } : best
    },
    null as (PortfolioCoin & { change: number }) | null
  )

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center p-6">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign in to Your Portfolio</CardTitle>
            <CardDescription>
              Track your crypto holdings and watch them grow
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <a href="/sign-in">Sign In</a>
            </Button>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <section className="flex flex-col gap-6 p-6">

      {/* ─── BEGINNER TIP BANNER ───────────────── */}
      <Card className="bg-gradient-to-r from-amber-500/10 to-orange-500/10 border-amber-500/20">
        <CardContent className="flex items-start gap-3 pt-4">
          <AlertCircle className="size-5 text-amber-600 mt-0.5 flex-shrink-0" />
          <div>
            <p className="font-semibold text-sm mb-1">💡 Beginner Tip</p>
            <p className="text-xs text-muted-foreground">
              Start small! When adding coins to your portfolio, input the amount you own and the price you paid. This helps you track your investment performance over time.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* ─── PORTFOLIO METRICS ───────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

        {/* Portfolio Value */}
        <Card className="bg-gradient-to-br from-primary/10 to-background">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <DollarSignIcon className="size-4 text-primary" />
              Total Value
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">
              ${totalValue.toFixed(2)}
            </h2>
            <p className="text-xs text-muted-foreground mt-1">
              Current market value
            </p>
          </CardContent>
        </Card>

        {/* Total Gain/Loss */}
        <Card className={`bg-gradient-to-br ${
          portfolioGain >= 0
            ? 'from-green-500/10 to-background'
            : 'from-red-500/10 to-background'
        }`}>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUpIcon className={`size-4 ${portfolioGain >= 0 ? 'text-green-500' : 'text-red-500'}`} />
              Total Gain/Loss
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className={`text-2xl font-bold ${portfolioGain >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              ${portfolioGain.toFixed(2)}
            </h2>
            <p className={`text-xs mt-1 ${portfolioGain >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {portfolioGainPercent >= 0 ? '+' : ''}{portfolioGainPercent.toFixed(2)}%
            </p>
          </CardContent>
        </Card>

        {/* Coins Owned */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <CoinsIcon className="size-4" />
              Assets
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-2xl font-bold">{portfolio.length}</h2>
            <p className="text-xs text-muted-foreground mt-1">
              Different coins
            </p>
          </CardContent>
        </Card>

        {/* Best Performer */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <TrendingUpIcon className="size-4 text-green-500" />
              Top Gainer (24h)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-semibold">
              {bestPerformer?.symbol || '--'}
            </h2>
            <p className={`text-xs mt-1 ${(bestPerformer?.change || 0) >= 0 ? 'text-green-500' : 'text-red-500'}`}>
              {bestPerformer ? (bestPerformer.change >= 0 ? '+' : '') + bestPerformer.change.toFixed(2) + '%' : '--'}
            </p>
          </CardContent>
        </Card>

      </div>

      {/* ADD COIN BUTTON */}
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Your Holdings</h2>
        <Button
          size="sm"
          onClick={() => setSelectorOpen(true)}
        >
          <PlusIcon className="mr-1 size-4" />
          Add Coin
        </Button>
      </div>

      {/* PORTFOLIO LIST WITH REAL DATA */}
      <Card>
        <CardContent className="space-y-3 pt-4">
          {portfolio.length === 0 ? (
            <div className="text-center py-8">
              <CoinsIcon className="size-12 mx-auto text-muted-foreground mb-3 opacity-30" />
              <p className="text-sm text-muted-foreground mb-4">
                No coins in your portfolio yet
              </p>
              <p className="text-xs text-muted-foreground mb-4">
                Click "Add Coin" to track your first cryptocurrency holdings
              </p>
            </div>
          ) : loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="size-5 animate-spin text-primary" />
            </div>
          ) : (
            portfolio.map((coin) => {
              const price = priceData[coin.symbol]?.price || coin.portfolio.purchasePrice
              const change = priceData[coin.symbol]?.change24h || 0
              const currentValue = coin.portfolio.amount * price
              const gainLoss = currentValue - coin.portfolio.amount * coin.portfolio.purchasePrice
              const gainLossPercent = coin.portfolio.purchasePrice > 0 
                ? (gainLoss / (coin.portfolio.amount * coin.portfolio.purchasePrice)) * 100 
                : 0

              return (
                <div
                  key={coin.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/50 transition"
                >
                  {editingCoin === coin.id ? (
                    // Edit mode
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <h3 className="font-semibold">{coin.name}</h3>
                          <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                        </div>
                        <Badge variant="secondary">{coin.symbol}</Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div>
                          <label className="text-xs font-medium">Amount</label>
                          <input
                            type="number"
                            step="0.00000001"
                            placeholder="e.g. 0.5"
                            value={amounts[coin.id]?.amount || ''}
                            onChange={(e) =>
                              setAmounts((prev) => ({
                                ...prev,
                                [coin.id]: {
                                  ...prev[coin.id],
                                  amount: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-2 py-1 rounded border border-input text-sm"
                          />
                        </div>
                        <div>
                          <label className="text-xs font-medium">Purchase Price ($)</label>
                          <input
                            type="number"
                            step="0.01"
                            placeholder="e.g. 45000"
                            value={amounts[coin.id]?.purchasePrice || ''}
                            onChange={(e) =>
                              setAmounts((prev) => ({
                                ...prev,
                                [coin.id]: {
                                  ...prev[coin.id],
                                  purchasePrice: e.target.value,
                                },
                              }))
                            }
                            className="w-full px-2 py-1 rounded border border-input text-sm"
                          />
                        </div>
                      </div>

                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={() => handleSaveAmount(coin.id)}
                        >
                          Save
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={() => setEditingCoin(null)}
                        >
                          Cancel
                        </Button>
                      </div>
                    </div>
                  ) : (
                    // Display mode
                    <>
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <h3 className="font-semibold">{coin.name}</h3>
                          <p className="text-xs text-muted-foreground">{coin.symbol}</p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="secondary">{coin.symbol}</Badge>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="size-8 text-destructive hover:text-destructive"
                            onClick={() => handleRemoveCoin(coin.id)}
                          >
                            <TrashIcon className="size-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs mb-3">
                        <div className="bg-muted/50 p-2 rounded">
                          <p className="text-muted-foreground">Amount</p>
                          <p className="font-semibold">{coin.portfolio.amount}</p>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <p className="text-muted-foreground">Current Price</p>
                          <p className="font-semibold">${price.toFixed(2)}</p>
                        </div>
                        <div className="bg-muted/50 p-2 rounded">
                          <p className="text-muted-foreground">Current Value</p>
                          <p className="font-semibold">${currentValue.toFixed(2)}</p>
                        </div>
                        <div className={`p-2 rounded ${gainLoss >= 0 ? 'bg-green-500/10' : 'bg-red-500/10'}`}>
                          <p className="text-muted-foreground">Gain/Loss</p>
                          <p className={`font-semibold ${gainLoss >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                            {gainLoss >= 0 ? '+' : ''}${gainLoss.toFixed(2)}
                          </p>
                        </div>
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-border/50">
                        <div className={`flex items-center gap-1 text-xs ${change >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                          {change >= 0 ? <TrendingUpIcon className="size-3" /> : <TrendingDownIcon className="size-3" />}
                          <span>{change >= 0 ? '+' : ''}{change.toFixed(2)}% (24h)</span>
                        </div>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => setEditingCoin(coin.id)}
                        >
                          Edit
                        </Button>
                      </div>
                    </>
                  )}
                </div>
              )
            })
          )}
        </CardContent>
      </Card>

      {/* EDUCATIONAL SECTION */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Main Education Card */}
        <Card className="bg-gradient-to-br from-primary/10 to-background md:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpenIcon className="size-5 text-primary" />
              Understanding Your Portfolio
            </CardTitle>
            <CardDescription>
              Key metrics explained for beginners
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-3 gap-4">
              <div className="border-l-2 border-primary pl-3">
                <h4 className="font-semibold text-sm mb-1">Current Value</h4>
                <p className="text-xs text-muted-foreground">
                  What your coins are worth right now at today's market prices. Changes every second!
                </p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <h4 className="font-semibold text-sm mb-1">Gain/Loss</h4>
                <p className="text-xs text-muted-foreground">
                  The difference between what you paid and what it's worth now. Positive = profit! 📈
                </p>
              </div>
              <div className="border-l-2 border-primary pl-3">
                <h4 className="font-semibold text-sm mb-1">24h Change</h4>
                <p className="text-xs text-muted-foreground">
                  How much the price changed in the last 24 hours. Helps spot market trends.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <InfoIcon className="size-4" />
              💡 Beginner Tips
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p>✓ Start with small amounts you can afford to lose</p>
            <p>✓ Diversify across multiple cryptocurrencies</p>
            <p>✓ Don't panic sell during price dips</p>
            <p>✓ Keep learning to improve your strategy</p>
          </CardContent>
        </Card>

        {/* Risk Warning */}
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardHeader>
            <CardTitle className="text-sm flex items-center gap-2">
              <AlertCircle className="size-4 text-amber-600" />
              ⚠️ Risk Disclosure
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-xs">
            <p>• Crypto is highly volatile and risky</p>
            <p>• Only invest what you can afford to lose</p>
            <p>• Past performance ≠ future results</p>
            <p>• Do your own research (DYOR)</p>
          </CardContent>
        </Card>
      </div>

      {/* SELECTOR */}
      <CoinSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelectCoin={handleSelectCoin}
      />
    </section>
  )
}