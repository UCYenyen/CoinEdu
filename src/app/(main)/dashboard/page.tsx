import { fetchFreeCrypto, getFreeCryptoConfig } from "@/lib/freecrypto"
import { unstable_cache } from "next/cache"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import type { MarketCoin } from "@/types/market"

type FreeCryptoDataItem = {
  symbol: string
  last: string
  last_btc: string
  daily_change_percentage: string
  source_exchange: string
  date: string
}

type FreeCryptoListItem = {
  id?: string
  symbol: string
  name?: string
}

type FreeCryptoDataResponse = {
  status: string | boolean
  symbols?: FreeCryptoDataItem[]
}

type FreeCryptoListResponse = {
  status: string | boolean
  result?: FreeCryptoListItem[]
}

const CHUNK_SIZE = 120
const DASHBOARD_CACHE_SECONDS = 1800

const COIN_NAME_MAP: Record<string, string> = {
  BTC: "Bitcoin",
  ETH: "Ethereum",
  USDT: "Tether",
  BNB: "BNB",
  XRP: "XRP",
  USDC: "USD Coin",
  SOL: "Solana",
  TRX: "TRON",
}

async function getDashboardCoins(): Promise<MarketCoin[]> {
  const { hasConfig } = getFreeCryptoConfig()

  if (!hasConfig) {
    return []
  }

  try {
    const listResponse = await fetchFreeCrypto("getCryptoList")

    if (!listResponse.ok) {
      return []
    }

    const listPayload = (await listResponse.json()) as FreeCryptoListResponse
    const listRows = Array.isArray(listPayload.result) ? listPayload.result : []

    const allSymbols = Array.from(
      new Set(listRows.map((item) => item.symbol).filter(Boolean))
    )

    const symbolNameMap = new Map<string, string>()
    const symbolRankMap = new Map<string, number>()

    listRows.forEach((item, index) => {
      if (!symbolNameMap.has(item.symbol)) {
        symbolNameMap.set(item.symbol, item.name?.trim() || item.symbol)
      }

      if (!symbolRankMap.has(item.symbol)) {
        const parsed = Number(item.id)
        symbolRankMap.set(item.symbol, Number.isFinite(parsed) ? parsed : index + 1)
      }
    })

    const chunks: string[][] = []
    for (let index = 0; index < allSymbols.length; index += CHUNK_SIZE) {
      chunks.push(allSymbols.slice(index, index + CHUNK_SIZE))
    }

    const responses = await Promise.all(
      chunks.map((chunk) => {
        const query = new URLSearchParams({
          symbol: chunk.join(" "),
        })
        return fetchFreeCrypto("getData", query)
      })
    )

    const payloads = await Promise.all(
      responses.map(async (response) => {
        if (!response.ok) {
          return [] as FreeCryptoDataItem[]
        }

        const payload = (await response.json()) as FreeCryptoDataResponse
        return Array.isArray(payload.symbols) ? payload.symbols : []
      })
    )

    const rows = payloads.flat()

    if (rows.length === 0) {
      return []
    }

    const sorted = rows.sort(
      (a, b) =>
        (symbolRankMap.get(a.symbol) ?? Number.MAX_SAFE_INTEGER) -
        (symbolRankMap.get(b.symbol) ?? Number.MAX_SAFE_INTEGER)
    )

    return sorted.map((item, index) => ({
      rank: symbolRankMap.get(item.symbol) ?? index + 1,
      symbol: item.symbol,
      name: symbolNameMap.get(item.symbol) ?? COIN_NAME_MAP[item.symbol] ?? item.symbol,
      price: Number(item.last || 0),
      change24h: Number(item.daily_change_percentage || 0),
      exchange: item.source_exchange || "-",
      updatedAt: item.date || "-",
      lastBtc: Number(item.last_btc || 0),
    }))
  } catch {
    return []
  }
}

const getDashboardCoinsCached = unstable_cache(
  async () => getDashboardCoins(),
  ["dashboard-market-all-coins"],
  {
    revalidate: DASHBOARD_CACHE_SECONDS,
    tags: ["dashboard-market"],
  }
)

export default async function Page() {
  const coins = await getDashboardCoinsCached()

  return (
    <div className="flex flex-1 flex-col">
      <div className="@container/main flex flex-1 flex-col gap-2">
        <div className="flex flex-col gap-4 py-4 md:gap-6 md:py-6">
          <SectionCards data={coins} />
          <div className="px-4 lg:px-6">
            <ChartAreaInteractive data={coins} />
          </div>
          <DataTable data={coins} />
        </div>
      </div>
    </div>
  )
}
