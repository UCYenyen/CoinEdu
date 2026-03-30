import { CoinDetailResponse } from "@/features/coins/interfaces";
import { formatCurrency, formatNumber, formatPercent } from "../../../features/coins/utils";
import { TrendingUp, TrendingDown } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

interface CoinHeaderProps {
  coin: CoinDetailResponse;
}

export function CoinHeader({ coin }: CoinHeaderProps) {
  const currentPrice = coin.market_data.current_price?.usd || 0;
  const priceChange1y = coin.market_data.price_change_percentage_1y || 0;
  const isPositive = priceChange1y >= 0;

  return (
    <Card className="flex flex-col border-none shadow-none bg-transparent px-5">
      <CardContent className="p-0 flex flex-col gap-2">
        <div className="flex items-center gap-3">
          {coin.image?.small && (
            <img src={coin.image.small} alt={coin.name} className="w-10 h-10 rounded-full" />
          )}
          <h1 className="text-3xl font-bold">{coin.name}</h1>
          <Badge variant="outline" className="text-sm font-semibold uppercase text-muted-foreground">
            {coin.symbol}
          </Badge>
          <Badge className="ml-2 bg-secondary text-secondary-foreground hover:bg-secondary">
            Rank #{coin.market_cap_rank}
          </Badge>
        </div>

        <div className="flex items-end gap-3 mt-2">
          <span className="text-4xl font-extrabold tracking-tight">
            {formatCurrency(currentPrice)}
          </span>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm text-muted-foreground">1y Price Change</span>
            <div
              className={`flex items-center gap-1 text-sm font-medium ${
                isPositive ? "text-green-500" : "text-red-500"
              }`}
            >
              {isPositive ? <TrendingUp className="w-4 h-4" /> : <TrendingDown className="w-4 h-4" />}
              {Math.abs(priceChange1y).toFixed(2)}%
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
