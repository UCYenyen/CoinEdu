"use client"

import { useRouter } from "next/navigation"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { CoinGeckoMarketData } from "@/features/dashboard/all-coin-overview/interfaces"
import { cn } from "@/lib/utils"

interface CoinOverviewTableProps {
  coins: CoinGeckoMarketData[]
}

export function CoinOverviewTable({ coins }: CoinOverviewTableProps) {
  const router = useRouter()

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
              <TableHead className="w-[50px]">#</TableHead>
              <TableHead>Name</TableHead>
              <TableHead className="text-right">Price</TableHead>
              <TableHead className="text-right">24h %</TableHead>
              <TableHead className="text-right">Market Cap</TableHead>
              <TableHead className="text-right">Volume (24h)</TableHead>
              <TableHead className="text-right">Circulating Supply</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {coins && coins.length > 0 ? (
              coins.map((coin) => {
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
    </div>
  )
}
