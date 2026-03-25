import { NextResponse } from 'next/server'
import {
  fetchFreeCrypto,
  getFreeCryptoConfig,
  isFreeCryptoEndpoint,
} from '@/lib/freecrypto'

export async function GET(
  request: Request,
  { params }: { params: Promise<{ endpoint: string }> }
) {
  const { endpoint } = await params

  if (!isFreeCryptoEndpoint(endpoint)) {
    return NextResponse.json(
      {
        error: `Unsupported endpoint: ${endpoint}`,
      },
      { status: 404 }
    )
  }

  const { hasConfig } = getFreeCryptoConfig()

  if (!hasConfig) {
    return NextResponse.json(
      { error: 'Missing FREECRYPTO_API_KEY or FREECRYPTO_API_BASE' },
      { status: 500 }
    )
  }

  try {
    const url = new URL(request.url)
    const response = await fetchFreeCrypto(endpoint, url.searchParams)
    const payload = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        {
          error: 'Failed to fetch data from FreeCrypto API',
          upstream: payload,
        },
        { status: response.status }
      )
    }

    return NextResponse.json(payload)
  } catch {
    return NextResponse.json(
      { error: 'Internal server error while proxying FreeCrypto API' },
      { status: 500 }
    )
  }
}
