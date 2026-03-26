'use client'

import React, { useState, useEffect } from 'react'
import { useSession } from '@/lib/auth-client'
import { Badge } from "@/components/ui/badge"
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { PlusIcon, CoinsIcon, AlertCircle, Loader2 } from "lucide-react"
import { CoinSelector, type Coin } from "@/components/coin-selector"

export default function PortfolioPage() {
  const { data: session } = useSession()
  const [selectorOpen, setSelectorOpen] = useState(false)
  const [selectedCoin, setSelectedCoin] = useState<Coin | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSelectCoin = (coin: Coin) => {
    setSelectedCoin(coin)
    console.log('Selected coin:', coin)
    // TODO: Add transaction to database
  }

  if (!session?.user) {
    return (
      <div className="flex flex-1 items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>Sign in to Manage Portfolio</CardTitle>
            <CardDescription>
              You need to be signed in to track your cryptocurrency portfolio.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Button asChild className="w-full">
              <a href="/sign-in">Sign In</a>
            </Button>
          </CardFooter>
        </Card>
      </div>
    )
  }

  return (
    <section className='flex w-full h-full flex-col gap-4 py-4 px-2'>
      {/* Portfolio Value Card */}
      <div className='flex w-full gap-4'>
        <Card className='flex-1'>
          <CardHeader>
            <CardTitle className='flex justify-between items-center gap-2 text-sm font-medium'>
              <div className='flex gap-2 items-center'>
                <CoinsIcon />
                Total Portfolio Value
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSelectorOpen(true)}
                disabled={loading}
              >
                <PlusIcon />
                <span className="hidden lg:inline">Add Transaction</span>
              </Button>
            </CardTitle>
            <CardDescription className='text-xs text-muted-foreground'>
              Your current total portfolio value across all assets.
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <div>
              <h1 className='text-2xl font-bold'>$0.00</h1>
              <p className='text-xs text-muted-foreground mt-1'>
                Not tracking yet - add your first transaction to get started
              </p>
            </div>
          </CardFooter>
        </Card>
      </div>

      {/* Info Card */}
      <Card className='bg-muted/50'>
        <CardHeader>
          <CardTitle className='text-base flex items-center gap-2'>
            <AlertCircle className='size-5 text-primary' />
            Coming Soon
          </CardTitle>
        </CardHeader>
        <CardFooter>
          <p className='text-sm text-muted-foreground'>
            Portfolio tracking features are being built. You can add coins now, and full analytics will be available soon.
          </p>
        </CardFooter>
      </Card>

      {/* Selected Coin Display */}
      {selectedCoin && (
        <Card>
          <CardHeader>
            <CardTitle className='text-base'>Selected Coin</CardTitle>
          </CardHeader>
          <CardFooter>
            <div className='flex items-center gap-2'>
              <span className='font-medium'>{selectedCoin.name}</span>
              <Badge variant='secondary'>{selectedCoin.symbol}</Badge>
            </div>
          </CardFooter>
        </Card>
      )}

      {/* Coin Selector Dialog */}
      <CoinSelector
        open={selectorOpen}
        onOpenChange={setSelectorOpen}
        onSelectCoin={handleSelectCoin}
      />
    </section>
  )
}