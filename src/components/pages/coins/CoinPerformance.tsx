import { CoinDetailResponse } from "@/features/coins/interfaces";
import { formatCurrency } from "../../../features/coins/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function CoinPerformance({ coin }: { coin: CoinDetailResponse }) {
  const currentPrice = coin.market_data.current_price?.usd || 0;
  const low24h = coin.market_data.low_24h?.usd || 0;
  const high24h = coin.market_data.high_24h?.usd || 0;
  
  const ath = coin.market_data.ath?.usd || 0;
  const athChange = coin.market_data.ath_change_percentage?.usd || 0;
  const athDate = coin.market_data.ath_date?.usd;
  
  const atl = coin.market_data.atl?.usd || 0;
  const atlChange = coin.market_data.atl_change_percentage?.usd || 0;
  const atlDate = coin.market_data.atl_date?.usd;

  // Calculate position in range
  const range = high24h - low24h;
  const position = range > 0 ? ((currentPrice - low24h) / range) * 100 : 50;

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    const d = new Date(dateString);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  return (
    <Card className="shadow-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-lg">Price Performance (24h)</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-2">
          <div className="flex justify-between text-sm font-medium">
            <div className="flex flex-col">
              <span className="text-muted-foreground">Low</span>
              <span>{formatCurrency(low24h)}</span>
            </div>
            <div className="flex flex-col items-end">
              <span className="text-muted-foreground">High</span>
              <span>{formatCurrency(high24h)}</span>
            </div>
          </div>
          <div className="w-full bg-secondary h-2.5 rounded-full relative overflow-hidden">
             <div className="absolute top-0 left-0 bottom-0 bg-gradient-to-r from-red-500 via-yellow-500 to-green-500 w-full" />
             <div 
               className="absolute top-[0px] bottom-[0px] w-1.5 bg-background shadow-md z-10 rounded-full transition-all duration-500" 
               style={{ left: `calc(${Math.min(Math.max(position, 0), 100)}% - 3px)` }} 
             />
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full">
          <div className="flex-1 flex flex-col gap-1 p-3 bg-muted/50 rounded-lg min-w-0">
             <span className="text-sm font-medium text-muted-foreground truncate">All Time High</span>
             <span className="text-lg font-bold truncate">{formatCurrency(ath)}</span>
             <div className="flex flex-col text-xs mt-1">
               <span className={`font-semibold ${athChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                 {athChange.toFixed(2)}%
               </span>
               <span className="text-muted-foreground truncate">{formatDate(athDate)}</span>
             </div>
          </div>
          <div className="flex-1 flex flex-col gap-1 p-3 bg-muted/50 rounded-lg min-w-0">
             <span className="text-sm font-medium text-muted-foreground truncate">All Time Low</span>
             <span className="text-lg font-bold truncate">{formatCurrency(atl)}</span>
             <div className="flex flex-col text-xs mt-1">
               <span className={`font-semibold ${atlChange >= 0 ? "text-green-500" : "text-red-500"}`}>
                 {atlChange >= 0 ? "+" : ""}{atlChange.toFixed(2)}%
               </span>
               <span className="text-muted-foreground truncate">{formatDate(atlDate)}</span>
             </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
