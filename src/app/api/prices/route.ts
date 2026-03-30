import { NextRequest, NextResponse } from "next/server"
import { fetchFreeCrypto } from "@/lib/freecrypto"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl
    const symbols = searchParams.get("symbols") // BTC,ETH,SOL

    if (!symbols) {
      return NextResponse.json(
        { error: "Symbols required" },
        { status: 400 }
      )
    }

    const params = new URLSearchParams({
      symbol: symbols,
    })

    const res = await fetchFreeCrypto("getData", params, {
      noStore: true,
    })

    const data = await res.json()

    // ⚠️ adapt based on actual API response
    const formatted: Record<string, any> = {}

    for (const coin of data.data || []) {
      formatted[coin.symbol] = {
        price: coin.price,
        change24h: coin.percent_change_24h,
      }
    }

    return NextResponse.json(formatted)
  } catch (err) {
    return NextResponse.json(
      { error: "Failed to fetch prices" },
      { status: 500 }
    )
  }
}