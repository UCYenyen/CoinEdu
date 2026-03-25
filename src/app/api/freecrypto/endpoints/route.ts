import { NextResponse } from 'next/server'
import { FREECRYPTO_ENDPOINTS } from '@/lib/freecrypto'

export async function GET() {
  return NextResponse.json({
    data: FREECRYPTO_ENDPOINTS,
  })
}
