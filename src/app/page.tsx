"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Info } from "lucide-react"

// Simple reusable tooltip
function InfoTooltip({ text }: { text: string }) {
  return (
    <div className="group relative cursor-pointer">
      <Info className="size-4 text-muted-foreground" />
      <div className="absolute hidden group-hover:block bg-black text-white text-xs p-2 rounded w-48 -top-10 left-0 z-10">
        {text}
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="flex flex-1 flex-col px-4 py-6 lg:px-6 gap-6">
      
      {/* ─── HEADER ───────────────────────────────────────── */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          Crypto Dashboard
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Learn crypto while tracking the market
        </p>
      </div>

      {/* ─── MARKET OVERVIEW ─────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              Market Cap
              <InfoTooltip text="Total value of all cryptocurrencies combined." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">$2.1T</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              BTC Dominance
              <InfoTooltip text="Percentage of total market cap that Bitcoin holds." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">54%</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-sm">
              Fear & Greed
              <InfoTooltip text="Measures market sentiment. Low = fear, High = greed." />
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-xl font-bold">30 (Fear)</p>
          </CardContent>
        </Card>

      </div>

      {/* ─── TOP COINS ───────────────────────────────────── */}
      <Card>
        <CardHeader>
          <CardTitle>Top Coins</CardTitle>
        </CardHeader>

        <CardContent className="space-y-3">
          
          {[
            { name: "Bitcoin", price: "$69,000", change: "-2%" },
            { name: "Ethereum", price: "$2,800", change: "-4%" },
            { name: "Solana", price: "$140", change: "+5%" },
          ].map((coin) => (
            <div
              key={coin.name}
              className="flex justify-between items-center"
            >
              <span className="font-medium">{coin.name}</span>

              <div className="text-right">
                <p className="text-sm">{coin.price}</p>
                <p
                  className={`text-xs ${
                    coin.change.startsWith("+")
                      ? "text-green-500"
                      : "text-red-500"
                  }`}
                >
                  {coin.change}
                </p>
              </div>
            </div>
          ))}

        </CardContent>
      </Card>

      {/* ─── LEARNING SECTION (YOUR USP) ─────────────────── */}
      <Card className="bg-muted/40">
        <CardHeader>
          <CardTitle>Learn Today</CardTitle>
        </CardHeader>

        <CardContent>
          <p className="text-sm">
            What is Market Cap and why does it matter?
          </p>

          <Button className="mt-3">
            Start Learning
          </Button>
        </CardContent>
      </Card>

    </div>
  )
}