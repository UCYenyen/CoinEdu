"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { ArrowRightIcon, TrendingUpIcon } from "lucide-react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const holdings = [
  {
    symbol: "B",
    name: "Bitcoin",
    ticker: "BTC",
    amount: "0.15 BTC",
    value: "$9,500.00",
    pl: "+$240.00",
    plPct: "+2.5%",
    positive: true,
  },
  {
    symbol: "E",
    name: "Ethereum",
    ticker: "ETH",
    amount: "0.82 ETH",
    value: "$1,920.00",
    pl: "+$124.50",
    plPct: "+6.1%",
    positive: true,
  },
  {
    symbol: "S",
    name: "Solana",
    ticker: "SOL",
    amount: "12.5 SOL",
    value: "$1,030.00",
    pl: "-$14.30",
    plPct: "-1.2%",
    positive: false,
  },
]

const assets = [
  { value: "btc", label: "Bitcoin (BTC)" },
  { value: "eth", label: "Ethereum (ETH)" },
  { value: "sol", label: "Solana (SOL)" },
]

export default function Page() {
  const [tradeMode, setTradeMode] = useState<"buy" | "sell">("buy")
  const [amount, setAmount] = useState("")
  const [selectedAsset, setSelectedAsset] = useState("btc")

  const selectedAssetLabel =
    assets.find((a) => a.value === selectedAsset)?.label.split(" (")[0] ?? "Bitcoin"

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="grid flex-1 gap-4 px-4 py-4 md:gap-6 md:py-6 lg:px-6 xl:grid-cols-[minmax(0,1fr)_360px]">

          <div className="space-y-4 md:space-y-6">
            <h2 className="text-lg font-semibold tracking-tight">
              Portfolio Simulation
            </h2>

            <Card className="bg-gradient-to-b from-card to-card/80">
              <CardContent className="p-6">
                <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Total Portfolio Value
                </p>
                <p className="mt-2 text-5xl font-semibold tabular-nums tracking-tight">
                  $12,450.00
                </p>
                <p className="mt-1 flex items-center gap-1 text-sm font-semibold text-secondary">
                  <TrendingUpIcon className="size-4" />
                  +$450.20 (3.75%)
                </p>
                <div className="mt-6 flex items-end justify-between">
                  <div className="flex gap-8">
                    <div>
                      <p className="text-xs text-muted-foreground">Available Cash</p>
                      <p className="text-xl font-semibold tabular-nums">$2,550.00</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Active Quests</p>
                      <p className="text-xl font-semibold">3</p>
                    </div>
                  </div>
                  <Button>
                    Trade Now <ArrowRightIcon className="size-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Holdings table */}
            <div>
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-base font-semibold">Holdings</h3>
                <Button variant="ghost" size="sm" className="text-xs text-muted-foreground">
                  View All Assets
                </Button>
              </div>
              <Card>
                <CardContent className="p-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        {["Coin", "Amount", "Value", "P/L (24H)"].map((h) => (
                          <TableHead key={h}>{h}</TableHead>
                        ))}
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {holdings.map((holding) => (
                        <TableRow key={holding.ticker}>
                          <TableCell>
                            <div className="flex items-center gap-3">
                              <div className="flex size-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold">
                                {holding.symbol}
                              </div>
                              <div>
                                <p className="font-medium">{holding.name}</p>
                                <p className="text-xs text-muted-foreground">{holding.ticker}</p>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell className="tabular-nums text-muted-foreground">
                            {holding.amount}
                          </TableCell>
                          <TableCell className="tabular-nums font-medium">
                            {holding.value}
                          </TableCell>
                          <TableCell>
                            <p
                              className={`tabular-nums font-semibold ${
                                holding.positive ? "text-secondary" : "text-destructive"
                              }`}
                            >
                              {holding.pl}
                            </p>
                            <p
                              className={`text-xs tabular-nums ${
                                holding.positive ? "text-secondary/70" : "text-destructive/70"
                              }`}
                            >
                              {holding.plPct}
                            </p>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </div>
          </div>

          <div className="space-y-4">

            {/* Market Pulse */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">Market Pulse</CardTitle>
                  <Badge className="bg-secondary/20 text-secondary hover:bg-secondary/20 text-xs font-semibold uppercase tracking-wider">
                    Bullish
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-5">
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">BTC Dominance</span>
                    <span className="font-semibold">52.4%</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div className="h-full rounded-full bg-primary" style={{ width: "52.4%" }} />
                  </div>
                </div>
                <div>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Fear &amp; Greed</span>
                    <span className="font-semibold text-tertiary">74 (Greed)</span>
                  </div>
                  <div className="h-1.5 overflow-hidden rounded-full bg-gradient-to-r from-destructive via-tertiary to-secondary" />
                </div>
                <p className="text-center text-xs text-muted-foreground">
                  Next rebalance in 14h 22m
                </p>
              </CardContent>
            </Card>

            {/* Quick Trade */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Trade</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">

                {/* Buy / Sell toggle */}
                <div className="grid grid-cols-2 rounded-lg bg-muted p-1">
                  <Button
                    variant={tradeMode === "buy" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-md"
                    onClick={() => setTradeMode("buy")}
                  >
                    Buy
                  </Button>
                  <Button
                    variant={tradeMode === "sell" ? "default" : "ghost"}
                    size="sm"
                    className="rounded-md"
                    onClick={() => setTradeMode("sell")}
                  >
                    Sell
                  </Button>
                </div>

                {/* Asset selector */}
                <div className="space-y-1.5">
                  <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                    Select Asset
                  </p>
                  <Select value={selectedAsset} onValueChange={setSelectedAsset}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {assets.map((a) => (
                        <SelectItem key={a.value} value={a.value}>
                          {a.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Amount input */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Amount
                    </p>
                    <p className="text-xs text-muted-foreground">Max: 0.045 BTC</p>
                  </div>
                  <div className="flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2">
                    <Input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      className="border-0 bg-transparent p-0 text-right text-lg font-semibold shadow-none focus-visible:ring-0"
                    />
                    <span className="shrink-0 text-sm font-medium text-muted-foreground">
                      BTC
                    </span>
                  </div>
                </div>

                {/* Price breakdown */}
                <div className="space-y-2 rounded-lg border border-border bg-muted/40 p-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Current Price</span>
                    <span className="font-medium tabular-nums">$64,328.15</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">Transaction Fee</span>
                    <span className="font-medium tabular-nums">$2.40</span>
                  </div>
                  <div className="flex items-center justify-between border-t border-border pt-2">
                    <span className="font-semibold">Total Cost</span>
                    <span className="font-semibold tabular-nums text-primary">$0.00</span>
                  </div>
                </div>

                <Button className="w-full">
                  {tradeMode === "buy"
                    ? `Buy ${selectedAssetLabel}`
                    : `Sell ${selectedAssetLabel}`}
                </Button>
              </CardContent>
            </Card>
          </div>

        </div>
      </div>
    </div>
  )
}
