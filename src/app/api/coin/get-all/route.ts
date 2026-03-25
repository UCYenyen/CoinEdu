import { NextResponse } from 'next/server'
import Coin from '@/types/coin'

interface FreeCryptoCoin {
	id?: string
	name: string
	symbol: string
	logo?: string
}

const API_KEY = process.env.FREECRYPTO_API_KEY || ''
const API_BASE = process.env.FREECRYPTO_API_BASE || ''

export async function GET() {
	if (!API_KEY || !API_BASE) {
		return NextResponse.json(
			{ error: 'Missing FREECRYPTO_API_KEY or FREECRYPTO_API_BASE' },
			{ status: 500 }
		)
	}

	try {
		const response = await fetch(`${API_BASE}/getCryptoList`, {
			method: 'GET',
			headers: {
				Authorization: `Bearer ${API_KEY}`,
				'Content-Type': 'application/json',
			},
			cache: 'no-store',
		})

		if (!response.ok) {
			return NextResponse.json(
				{ error: 'Failed to fetch coin list from upstream provider' },
				{ status: response.status }
			)
		}

		const payload = await response.json()
		const upstreamCoins: FreeCryptoCoin[] = Array.isArray(payload?.result)
			? payload.result
			: []

		console.log('Fetched coins from API:', upstreamCoins.length)

		const coins: Coin[] = upstreamCoins.map((item) => {
			return {
				id: item.id || item.symbol,
				name: item.name?.trim() || item.symbol,
				symbol: item.symbol,
				logo: item.logo,
			}
		})

		return NextResponse.json({ data: coins })
	} catch {
		return NextResponse.json(
			{ error: 'Internal server error while fetching coin list' },
			{ status: 500 }
		)
	}
}
