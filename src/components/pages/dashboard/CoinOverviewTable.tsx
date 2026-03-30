"use client"

import { useRouter } from "next/navigation"
// import * as React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { CoinGeckoMarketData } from "@/features/dashboard/all-coin-overview/interfaces"
import { cn } from "@/lib/utils"
import { MetricInfo } from "@/components/common/metric-info"
import React from "react"

interface CoinOverviewTableProps {
  coins: CoinGeckoMarketData[]
}

const PAGE_SIZE = 12

export function CoinOverviewTable({ coins }: CoinOverviewTableProps) {
  const router = useRouter()
  const [page, setPage] = React.useState(1)

  const totalPages = Math.max(1, Math.ceil(coins.length / PAGE_SIZE))

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginatedCoins = React.useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE
    return coins.slice(startIndex, startIndex + PAGE_SIZE)
  }, [coins, page])

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: val < 1 ? 4 : 2,
    }).format(val)
  }

  const formatNumber = (val: number) => {
    if (val === undefined || val === null) return "-"
    return val.toLocaleString("en-US")
  }

  return (
    <div className="border-y bg-transparent text-card-foreground shadow-sm">
      <div className="overflow-x-auto">
        <Table className="">
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="w-12.5">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">
                <MetricInfo title="Price" description="Current market price per token." metricId="price" className="justify-end" />
              </TableHead>
              <TableHead className="text-right">
                <MetricInfo title="24h %" description="Price change percentage in the last 24 hours." metricId="change24h" className="justify-end" />
              </TableHead>
              <TableHead className="text-right">
                <MetricInfo title="Market Cap" description="Total market value of the coin's circulating supply." metricId="marketCap" className="justify-end" />
              </TableHead>
              <TableHead className="text-right">
                <MetricInfo title="Volume (24h)" description="Total value traded in the last 24 hours." metricId="volume" className="justify-end" />
              </TableHead>
              <TableHead className="text-right">
                <MetricInfo title="Circulating Supply" description="Amount of tokens currently available to the public." metricId="circulatingSupply" className="justify-end" />
              </TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coins && coins.length > 0 ? (
              paginatedCoins.map((coin) => {
                const prev24h = coin.price_change_percentage_24h
                const isPositive = prev24h !== undefined && prev24h !== null && prev24h >= 0

                return (
                  <TableRow 
                    key={coin.id}
                    className="cursor-pointer hover:bg-muted/50 transition-colors"
                    onClick={() => router.push(`/coins/${coin.id}`)}
                  >
                    <TableCell className="font-medium text-muted-foreground w-[50px]">
                      {coin.market_cap_rank}
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        {coin.image && (
                          <img 
                            src={coin.image} 
                            alt={coin.name || "Coin logo"} 
                            className="w-6 h-6 rounded-full"
                          />
                        )}
                        <div className="font-medium">{coin.name}</div>
                        <div className="text-muted-foreground text-xs uppercase">
                          {coin.symbol}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {coin.current_price !== undefined && coin.current_price !== null 
                        ? formatCurrency(coin.current_price) 
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {prev24h !== undefined && prev24h !== null ? (
                        <div
                          className={cn(
                            "flex items-center justify-end font-medium",
                            isPositive ? "text-green-500" : "text-red-500"
                          )}
                        >
                          <span className="text-[10px] mr-1">{isPositive ? "▲" : "▼"}</span>
                          {Math.abs(prev24h).toFixed(2)}%
                        </div>
                      ) : (
                        <span className="text-muted-foreground">-</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      ${formatNumber(coin.market_cap)}
                    </TableCell>
                    <TableCell className="text-right">
                      ${formatNumber(coin.total_volume)}
                    </TableCell>
                    <TableCell className="text-right whitespace-nowrap">
                      {formatNumber(coin.circulating_supply)}{" "}
                      <span className="uppercase text-muted-foreground text-xs ml-1">{coin.symbol}</span>
                    </TableCell>
                  </TableRow>
                )
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-6 text-muted-foreground">
                  No coins found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      {coins.length > 0 && (
        <div className="flex items-center justify-between border-t px-4 py-3">
          <p className="text-sm text-muted-foreground">
            Showing {(page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, coins.length)} of {coins.length}
          </p>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.max(1, current - 1))}
              disabled={page === 1}
            >
              Previous
            </Button>
            <span className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((current) => Math.min(totalPages, current + 1))}
              disabled={page === totalPages}
            >
              Next
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
