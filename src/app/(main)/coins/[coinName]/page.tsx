import { getCoinDetails } from "@/features/coins/actions";
import { notFound } from "next/navigation";
import { CoinHeader } from "@/components/pages/coins/CoinHeader";
import { CoinStats } from "@/components/pages/coins/CoinStats";
import { CoinInfo } from "@/components/pages/coins/CoinInfo";
import { CoinPerformance } from "@/components/pages/coins/CoinPerformance";
import { TradingViewChart } from "@/components/pages/coins/TradingViewChart";
import { 
  Breadcrumb, 
  BreadcrumbItem, 
  BreadcrumbLink, 
  BreadcrumbList, 
  BreadcrumbPage, 
  BreadcrumbSeparator 
} from "@/components/ui/breadcrumb";
import Link from "next/link";

export default async function CoinsPage({ params }: { params: Promise<{ coinName: string }> }) {
  const resolvedParams = await params;
  const coin = await getCoinDetails(resolvedParams.coinName);
  
  if (!coin) {
    notFound();
  }

  return (
    <div className="flex flex-col gap-6 p-4 md:p-8 max-w-[1600px] mx-auto w-full">
      <Breadcrumb>
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Home</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink asChild>
              <Link href="/">Coins</Link>
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbPage className="font-semibold text-primary">{coin.name}</BreadcrumbPage>
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div className="flex flex-col xl:flex-row gap-8 w-full mt-2">
        {/* Left Side */}
        <div className="flex flex-col gap-8 flex-1 w-full xl:max-w-2xl 2xl:max-w-3xl">
          <CoinHeader coin={coin} />
          
          <div className="flex flex-col md:flex-row xl:flex-col gap-6 w-full">
            <div className="flex-[1.2] w-full">
              <CoinStats coin={coin} />
            </div>
            <div className="flex-1 flex flex-col gap-6 w-full">
              <CoinPerformance coin={coin} />
              <CoinInfo coin={coin} />
            </div>
          </div>
        </div>

        {/* Right Side */}
        <div className="flex-[1.5] w-full xl:sticky xl:top-8 h-auto xl:h-[calc(100vh-8rem)] min-h-[500px]">
          <TradingViewChart symbol={coin.symbol} />
        </div>
      </div>
    </div>
  );
}