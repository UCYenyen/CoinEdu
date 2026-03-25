export const FREECRYPTO_ENDPOINTS = [
  'getCryptoList',
  'getData',
  'getTop',
  'getDataCurrency',
  'getPerformance',
  'getVolatility',
  'getATHATL',
  'getFearGreed',
  'getTechnicalAnalysis',
  'getBreakouts',
  'getCorrelation',
  'getSupportResistance',
  'getMARibbon',
  'getBollinger',
  'getExchange',
  'getConversion',
  'getHistory',
  'getTimeframe',
  'getOHLC',
  'getNews',
] as const

export type FreeCryptoEndpoint = (typeof FREECRYPTO_ENDPOINTS)[number]

const API_KEY = process.env.FREECRYPTO_API_KEY || ''
const API_BASE = process.env.FREECRYPTO_API_BASE || ''

export function isFreeCryptoEndpoint(endpoint: string): endpoint is FreeCryptoEndpoint {
  return FREECRYPTO_ENDPOINTS.includes(endpoint as FreeCryptoEndpoint)
}

export function getFreeCryptoConfig() {
  return {
    apiKey: API_KEY,
    apiBase: API_BASE,
    hasConfig: Boolean(API_KEY && API_BASE),
  }
}

export async function fetchFreeCrypto(
  endpoint: FreeCryptoEndpoint,
  searchParams?: URLSearchParams
) {
  const url = new URL(`${API_BASE}/${endpoint}`)

  if (searchParams) {
    for (const [key, value] of searchParams.entries()) {
      url.searchParams.append(key, value)
    }
  }

  return fetch(url.toString(), {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${API_KEY}`,
      'Content-Type': 'application/json',
    },
    cache: 'no-store',
  })
}
