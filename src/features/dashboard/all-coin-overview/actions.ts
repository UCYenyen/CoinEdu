import { CoinGeckoMarketData } from "./interfaces";

const API_URL = "https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&order=market_cap_desc&per_page=100&page=1&sparkline=false&price_change_percentage=24h";
const REFRESH_INTERVAL = 3600;


export async function getAllCoinOverviewData(): Promise<CoinGeckoMarketData[]> {
    try {
        const response = await fetch(API_URL, {
            next: { revalidate: REFRESH_INTERVAL }
        });
        const result = await response.json();
        return result;
    } catch (error) {
        console.error("Failed to fetch all coin overview data:", error);
        return [];
    }
}