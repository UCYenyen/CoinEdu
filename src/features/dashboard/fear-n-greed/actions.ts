import { FearGreedData } from "./interfaces";

const API_URL="https://api.alternative.me/fng/?limit=1"
const REFRESH_INTERVAL = 300;


export async function getFearGreedData(): Promise<FearGreedData> {
  try {
    const res = await fetch(API_URL, {
      next: { revalidate: REFRESH_INTERVAL },
    });
    if (res.ok) {
      const json = await res.json();
      if (json && json.data && json.data.length > 0) {
        return {
          value: parseInt(json.data[0].value, 10),
          classification: json.data[0].value_classification,
        };
      }
    }
  } catch (error) {
    console.error("Failed to fetch Fear & Greed data:", error);
  }

  return { value: 50, classification: "Neutral" };
}
