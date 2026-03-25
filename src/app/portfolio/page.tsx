'use client'

import React, { useState } from 'react'

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
import { Button } from "@/components/ui/button"
import { PlusIcon, CoinsIcon } from "lucide-react"
import { CoinSelector, type Coin } from "@/components/coin-selector"

export default function PortfolioPage() {
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null)

  const handleSelectCoin = (coin: Coin) => {
    setSelectedCoin(coin)
    console.log('Selected coin:', coin)
  }

  return (
    <section className='flex w-full h-full flex-col gap-4 py-4 px-2'>
      <div className='flex w-full gap-4'>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='flex justify-between items-center gap-2 text-sm font-medium'>
              <div className='flex gap-2 items-center'>
                <CoinsIcon />
                Total Portfolio Value
              </div>
              <Button variant="outline" size="sm" onClick={() => setSelectorOpen(true)}>
                <PlusIcon
                />
                <span className="hidden lg:inline">Add Transaction</span>
              </Button>
            </CardTitle>
            <CardDescription className='text-xs text-muted-foreground'>
              Your current total portfolio value across all assets.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <h1 className='text-2xl font-bold'>$0.00</h1>
          </CardFooter>
        </Card>
      </div>

      {selectedCoin && (
        <Card>
          <CardHeader>
            <CardTitle>Selected Coin</CardTitle>
          </CardHeader>
          <CardFooter>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>{selectedCoin.name}</span>
              <Badge variant='secondary'>{selectedCoin.symbol}</Badge>
            </div>
          </CardFooter>
        </Card>
      )}

      <CoinSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelectCoin={handleSelectCoin}
      />
    </section>
  )
}
