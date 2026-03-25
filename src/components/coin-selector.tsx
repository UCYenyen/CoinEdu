'use client'

import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Loader2 } from 'lucide-react'

export interface Coin {
  id: string
  name: string
  symbol: string
  logo?: string
}

interface CoinSelectorProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSelectCoin: (coin: Coin) => void
}

export function CoinSelector({
  open,
  onOpenChange,
  onSelectCoin,
}: CoinSelectorProps) {
  const [coins, setCoins] = useState<Coin[]>([])
  const [filteredCoins, setFilteredCoins] = useState<Coin[]>([])
  const [loading, setLoading] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    if (open && coins.length === 0) {
      fetchCoins()
    }
  }, [open])

  const fetchCoins = async () => {
    setLoading(true)
    try {
      const response = await fetch('/api/coin/get-all', {
        method: 'GET',
        cache: 'no-store',
      })

      if (!response.ok) {
        throw new Error('Failed to fetch coins')
      }

      const data = await response.json()

      const coinsList: Coin[] = data.data || []

      setCoins(coinsList)
      setFilteredCoins(coinsList)
    } catch (error) {
      console.error('Error fetching coins:', error)
      // Fallback to popular coins if API fails
      setCoins(fallbackCoins)
      setFilteredCoins(fallbackCoins)
    } finally {
      setLoading(false)
    }
  }

  const handleSearch = (query: string) => {
    setSearchQuery(query)
    const filtered = coins.filter(
      (coin) =>
        coin.name.toLowerCase().includes(query.toLowerCase()) ||
        coin.symbol.toLowerCase().includes(query.toLowerCase())
    )
    setFilteredCoins(filtered)
  }

  const handleSelectCoin = (coin: Coin) => {
    onSelectCoin(coin)
    onOpenChange(false)
    setSearchQuery('')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='w-full max-w-md'>
        <DialogHeader>
          <DialogTitle>Select Coin</DialogTitle>
          <DialogDescription className='sr-only'>
            Search and choose a cryptocurrency from the available list.
          </DialogDescription>
        </DialogHeader>

        <div className='flex flex-col gap-4'>
          <Input
            placeholder='Search'
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className='w-full'
          />

          <ScrollArea className='h-100 w-full pr-4'>
            {loading ? (
              <div className='flex h-full items-center justify-center'>
                <Loader2 className='h-6 w-6 animate-spin text-muted-foreground' />
              </div>
            ) : filteredCoins.length === 0 ? (
              <div className='flex h-full items-center justify-center text-sm text-muted-foreground'>
                No coins found
              </div>
            ) : (
              <div className='space-y-2'>
                {filteredCoins.map((coin) => (
                  <button
                    key={coin.id}
                    onClick={() => handleSelectCoin(coin)}
                    className='w-full rounded-lg px-4 py-3 transition-colors hover:bg-accent active:bg-accent/80 flex items-center justify-between group'
                  >
                    <div className='flex items-center gap-3'>
                      {coin.logo ? (
                        <img
                          src={coin.logo}
                          alt={coin.symbol}
                          className='h-8 w-8 rounded-full'
                        />
                      ) : (
                        <div className='h-8 w-8 rounded-full bg-muted flex items-center justify-center text-xs font-semibold'>
                          {coin.symbol.substring(0, 2)}
                        </div>
                      )}
                      <div className='flex flex-col items-start'>
                        <span className='font-medium text-sm'>{coin.name}</span>
                        <span className='text-xs text-muted-foreground'>
                          {coin.symbol}
                        </span>
                      </div>
                    </div>
                    <svg
                      className='h-5 w-5 text-muted-foreground transition-transform group-hover:translate-x-1'
                      fill='none'
                      stroke='currentColor'
                      viewBox='0 0 24 24'
                    >
                      <path
                        strokeLinecap='round'
                        strokeLinejoin='round'
                        strokeWidth={2}
                        d='M9 5l7 7-7 7'
                      />
                    </svg>
                  </button>
                ))}
              </div>
            )}
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  )
}

// Fallback coins in case API fails
const fallbackCoins: Coin[] = [
  { id: '1', name: 'Bitcoin', symbol: 'BTC' },
  { id: '2', name: 'Ethereum', symbol: 'ETH' },
  { id: '3', name: 'Tether', symbol: 'USDT' },
  { id: '4', name: 'Binance Coin', symbol: 'BNB' },
  { id: '5', name: 'XRP', symbol: 'XRP' },
  { id: '6', name: 'USD Coin', symbol: 'USDC' },
  { id: '7', name: 'Solana', symbol: 'SOL' },
  { id: '8', name: 'Cardano', symbol: 'ADA' },
]
