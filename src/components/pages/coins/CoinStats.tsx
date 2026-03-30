import { CoinDetailResponse } from "@/features/coins/interfaces";
import { formatCurrency, formatNumber, formatPercent } from "../../../features/coins/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

interface CoinStatsProps {
  coin: CoinDetailResponse;
}

export function CoinStats({ coin }: CoinStatsProps) {
  const md = coin.market_data;
  
  const marketCap = md.market_cap?.usd || 0;
  const marketCapChange = md.market_cap_change_percentage_24h || 0;
  
  const volume = md.total_volume?.usd || 0;
  // Fallback to price_change_percentage_24h if volume change isn't available
  const volumeChange = md.price_change_percentage_24h || 0; 
  
  const volToMcap = marketCap > 0 ? (volume / marketCap) * 100 : 0;
  const fdv = md.fully_diluted_valuation?.usd || 0;
  
  const circulating = md.circulating_supply || 0;
  const total = md.total_supply || md.max_supply || circulating;
  const max = md.max_supply || null;
  
  const supplyProgress = total > 0 ? (circulating / total) * 100 : 100;

  const renderStatRow = (label: string, value: string, percentChange?: number, isProgress?: boolean) => (
    <div className="flex flex-col py-3 space-y-1 w-full border-b last:border-0 border-border">
      <div className="flex items-center justify-between w-full">
        <span className="text-sm font-medium text-muted-foreground">{label}</span>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-sm">{value}</span>
          {percentChange !== undefined && (
            <span className={`text-xs font-semibold ${percentChange >= 0 ? "text-green-500" : "text-red-500"}`}>
              {percentChange >= 0 ? "+" : ""}{percentChange.toFixed(2)}%
            </span>
          )}
        </div>
      </div>
      {isProgress && (
        <div className="w-full bg-secondary h-1.5 rounded-full mt-2 overflow-hidden">
          <div 
            className="bg-primary h-full rounded-full" 
            style={{ width: `${Math.min(supplyProgress, 100)}%` }}
          />
        </div>
      )}
    </div>
  );

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Market Stats</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col">
        {renderStatRow("Market Cap", formatCurrency(marketCap), marketCapChange)}
        {renderStatRow("Volume (24h)", formatCurrency(volume), volumeChange)}
        {renderStatRow("Volume / Market Cap (24h)", `${volToMcap.toFixed(2)}%`)}
        {renderStatRow("Fully Diluted Valuation", formatCurrency(fdv))}
        <Separator className="my-2" />
        {renderStatRow("Circulating Supply", formatNumber(circulating), undefined, true)}
        {renderStatRow("Total Supply", formatNumber(total))}
        {renderStatRow("Max Supply", max ? formatNumber(max) : "∞")}
      </CardContent>
    </Card>
  );
}
