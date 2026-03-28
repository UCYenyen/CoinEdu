import { MarketCapStats, CoinGeckoGlobalData } from "./interfaces";

const API_URL = "https://api.coingecko.com/api/v3/global";
const REFRESH_INTERVAL = 3600;


export async function getFormattedGlobalMarketCapData(): Promise<MarketCapStats> {
    let value = "$$$";
    let changePercentage = 0;

    try {
        const result = await getGlobalCryptoData()
        const rawValue = result.data.total_market_cap.usd
    
        if (rawValue > 0) {
          if (rawValue >= 1e12) value = `$${(rawValue / 1e12).toFixed(2)}T`;
          else if (rawValue >= 1e9) value = `$${(rawValue / 1e9).toFixed(2)}B`;
          else if (rawValue >= 1e6) value = `$${(rawValue / 1e6).toFixed(2)}M`;
          else value = `$${rawValue.toLocaleString("en-US", { maximumFractionDigits: 2 })}`;
        }
        changePercentage = result.data.market_cap_change_percentage_24h_usd
    } catch (error) {
      console.error("Failed to fetch global market cap data:", error);
    }
  
    return {
      value,
      changePercentage,
    };
}

export async function getGlobalCryptoData() : Promise<CoinGeckoGlobalData> {
  const response = await fetch(API_URL, {
    next: { revalidate: REFRESH_INTERVAL }
  });
  
  return await response.json();
}