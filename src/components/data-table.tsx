"use client"

import * as React from "react"
import { SearchIcon } from "lucide-react"

import type { MarketCoin } from "@/types/market"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"

const PAGE_SIZE = 8

function formatPrice(value: number) {
  if (value >= 1000) {
    return `$${value.toLocaleString("en-US", { maximumFractionDigits: 2 })}`
  }

  return `$${value.toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  })}`
}

function formatPercent(value: number) {
  const fixed = value.toFixed(2)
  return `${value > 0 ? "+" : ""}${fixed}%`
}

function formatUpdatedAt(value: string) {
  if (!value || value === "-") {
    return "-"
  }

  return value.slice(11, 16)
}

export function DataTable({ data }: { data: MarketCoin[] }) {
  const [search, setSearch] = React.useState("")
  const [network, setNetwork] = React.useState("all")
  const [page, setPage] = React.useState(1)

  const exchanges = React.useMemo(
    () => Array.from(new Set(data.map((coin) => coin.exchange).filter(Boolean))),
    [data]
  )

  const filtered = React.useMemo(() => {
    const query = search.trim().toLowerCase()

    return data.filter((coin) => {
      const matchesSearch =
        query.length === 0 ||
        coin.symbol.toLowerCase().includes(query) ||
        coin.name.toLowerCase().includes(query)

      const matchesNetwork = network === "all" || coin.exchange === network

      return matchesSearch && matchesNetwork
    })
  }, [data, network, search])

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))

  React.useEffect(() => {
    setPage(1)
  }, [search, network])

  React.useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, totalPages])

  const paginated = React.useMemo(() => {
    const startIndex = (page - 1) * PAGE_SIZE
    return filtered.slice(startIndex, startIndex + PAGE_SIZE)
  }, [filtered, page])

  return (
    <Card className="mx-4 lg:mx-6">
      <CardHeader className="gap-4 sm:flex-row sm:items-center sm:justify-between">
        <CardTitle>Crypto Market</CardTitle>
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
          <div className="relative">
            <SearchIcon className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Search coin"
              className="w-full pl-8 sm:w-60"
            />
          </div>
          <Select value={network} onValueChange={setNetwork}>
            <SelectTrigger className="w-full sm:w-44">
              <SelectValue placeholder="All Networks" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Networks</SelectItem>
              {exchanges.map((exchange) => (
                <SelectItem key={exchange} value={exchange}>
                  {exchange}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-12">#</TableHead>
                <TableHead>Name</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">1h %</TableHead>
                <TableHead className="text-right">24h %</TableHead>
                <TableHead className="text-right">7d %</TableHead>
                <TableHead className="text-right">BTC Pair</TableHead>
                <TableHead>Network</TableHead>
                <TableHead className="text-right">Updated</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={9} className="h-20 text-center text-muted-foreground">
                    No coins found.
                  </TableCell>
                </TableRow>
              ) : (
                paginated.map((coin) => (
                  <TableRow key={coin.symbol}>
                    <TableCell>{coin.rank}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold">{coin.name}</span>
                        <span className="text-muted-foreground">{coin.symbol}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {formatPrice(coin.price)}
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">-</TableCell>
                    <TableCell className="text-right">
                      <Badge variant="outline" className="tabular-nums">
                        <span
                          className={
                            coin.change24h >= 0 ? "text-emerald-500" : "text-red-500"
                          }
                        >
                          {formatPercent(coin.change24h)}
                        </span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right text-muted-foreground">-</TableCell>
                    <TableCell className="text-right tabular-nums">
                      {coin.lastBtc.toFixed(8)}
                    </TableCell>
                    <TableCell className="capitalize">{coin.exchange}</TableCell>
                    <TableCell className="text-right text-muted-foreground">
                      {formatUpdatedAt(coin.updatedAt)}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
        <div className="mt-4 flex items-center justify-between">
          <p className="text-sm text-muted-foreground">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}-
            {Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length}
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
      </CardContent>
    </Card>
  )
}
