import { FearGreedCard } from "@/components/pages/dashboard/FearGreedCard"
import { StatCard } from "@/components/pages/dashboard/StatCard";
import { CoinOverviewTable } from "@/components/pages/dashboard/CoinOverviewTable";
import { getFearGreedData } from "@/features/dashboard/fear-n-greed/actions";
import { getFormattedGlobalMarketCapData } from "@/features/dashboard/global-market-cap/actions";
import { getAllCoinOverviewData } from "@/features/dashboard/all-coin-overview/actions";

export default async function Dashboard() {
  const [marketCapStats, fearGreedData, coins] = await Promise.all([
    getFormattedGlobalMarketCapData(),
    getFearGreedData(),
    getAllCoinOverviewData()
  ]);

  const { value, changePercentage } = marketCapStats;

  return (
    <div className="p-6 space-y-6">
      <div className="flex flex-wrap items-stretch gap-4">
        <div className="min-w-[250px] w-80">
          <StatCard
            title="Global Market Cap"
            value={value}
            changePercentage={changePercentage}
            className="h-full"
          ></StatCard>
        </div>
        <div className="min-w-[250px] w-80">
          <FearGreedCard 
            value={fearGreedData.value} 
            classification={fearGreedData.classification} 
            className="h-full"
          />
        </div>
      </div>
      
      {/* Coin Overview Table */}
      <div>
        <CoinOverviewTable coins={coins} />
      </div>
    </div>
  )
}
