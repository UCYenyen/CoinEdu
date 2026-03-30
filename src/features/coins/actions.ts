"use server"

import { CoinDetailResponse } from "./interfaces"

const API_URL = "https://api.coingecko.com/api/v3/coins/"
const REFRESH_INTERVAL = 900;


export async function getCoinDetails(coinName: string): Promise<CoinDetailResponse | null> {
  if (!coinName) return null;

  try {
    // using query params to filter unnecessary data and improve efficiency (rules requirement)
    const res = await fetch(
      `${API_URL}${coinName}?localization=false&tickers=false&community_data=false&developer_data=false&sparkline=false`,
      {
        next: { revalidate: REFRESH_INTERVAL },
      }
    );

    if (!res.ok) {
      if (res.status === 404) {
        return null; // Handle unavailable coin gracefully
      }
      throw new Error(`Failed to fetch details for coin: ${coinName}`);
    }

    const data: CoinDetailResponse = await res.json();
    return data;
  } catch (error) {
    console.error(`Error fetching coin details for ${coinName}:`, error);
    return null;
  }
}
