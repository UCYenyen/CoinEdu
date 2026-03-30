"use client";

import React, { useState, useEffect } from "react";
import { useSession } from "@/lib/auth-client";
import { useParams } from "next/navigation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, TrendingUpIcon, TrendingDownIcon, PlusIcon, Star, Share2 } from "lucide-react";
import { getPortfolioHoldings } from "@/features/portfolio/actions/transaction-actions";
import { TransactionModal } from "@/features/portfolio/components/transaction-modal";

export default function CoinDetailPage() {
  const { slug } = useParams() as { slug: string };
  const symbol = slug.toUpperCase();
  const { data: session } = useSession();

  const [coinData, setCoinData] = useState<any>(null);
  const [holding, setHolding] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchCoinData = async () => {
    try {
      // Re-use our freecryptoapi via the built-in route
      const response = await fetch(`/api/prices?symbols=${symbol}`);
      if (response.ok) {
        const data = await response.json();
        setCoinData(data[symbol]); 
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchHoldings = async () => {
    if (!session?.user?.id) return;
    try {
      const res = await getPortfolioHoldings(session.user.id);
      if (res.success) {
         const found = res.holdings.find(h => h.coinSymbol.toUpperCase() === symbol);
         setHolding(found || null);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchCoinData(), fetchHoldings()]);
      setLoading(false);
    };

    init();
    const interval = setInterval(fetchCoinData, 30000); // 30s live refresh
    return () => clearInterval(interval);
  }, [slug, session]);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-32">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  const currentPrice = coinData?.price || 0;
  const change24h = coinData?.change || 0;
  
  // Calculate PnL if holding exists
  const totalValue = holding ? holding.totalQuantity * currentPrice : 0;
  const pnl = holding ? totalValue - holding.totalSpent : 0;

  return (
    <section className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        {/* Header Left (CMC style) */}
        <div className="space-y-2">
           <div className="flex items-center gap-3">
             <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center font-bold">
               {symbol.substring(0, 3)}
             </div>
             <h1 className="text-3xl font-bold flex items-center gap-2">
               {symbol} <span className="text-lg text-muted-foreground bg-muted px-2 py-0.5 rounded ml-1">#1</span>
             </h1>
             <div className="flex gap-2 ml-4">
               <Button variant="secondary" size="icon" className="h-8 w-8"><Star className="w-4 h-4"/></Button>
               <Button variant="secondary" size="icon" className="h-8 w-8"><Share2 className="w-4 h-4"/></Button>
             </div>
           </div>

           <div className="flex items-center gap-4 pt-2">
             <div className="text-4xl font-bold">${currentPrice.toLocaleString(undefined, {minimumFractionDigits: 2, maximumFractionDigits: 6})}</div>
             <Badge variant="outline" className={`text-sm px-2 py-1 ${change24h >= 0 ? 'border-green-500/30 bg-green-500/10 text-green-500' : 'border-red-500/30 bg-red-500/10 text-red-500'}`}>
                {change24h >= 0 ? '▲' : '▼'} {Math.abs(change24h).toFixed(2)}% (1d)
             </Badge>
           </div>
        </div>

        {/* Header Right / Portfolio Quick actions */}
        <div className="flex items-center gap-2">
           <Button onClick={() => setModalOpen(true)} className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg">
             <PlusIcon className="w-4 h-4 mr-2" />
             Add Transaction
           </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
         {/* Main Chart Column */}
         <div className="lg:col-span-2 space-y-6">
            <Card className="shadow-lg border-primary/10 overflow-hidden bg-[#131722]">
              <CardContent className="p-0 h-[500px]">
                {/* Embedded TradingView Advanced Chart */}
                <iframe
                  src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_1&symbol=${symbol}USD&interval=D&symboledit=1&saveimage=1&toolbarbg=131722&studies=%5B%5D&theme=dark&style=1&timezone=Etc%2FUTC&studies_overrides=%7B%7D&overrides=%7B%7D&enabled_features=%5B%5D&disabled_features=%5B%5D&locale=en`}
                  style={{ width: "100%", height: "100%", border: "none" }}
                  title="TradingView Chart"
                />
              </CardContent>
            </Card>

            {/* CMC style Market Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Market Cap</p>
                  <p className="font-semibold text-sm">--</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Volume (24h)</p>
                  <p className="font-semibold text-sm">--</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Circulating Supply</p>
                  <p className="font-semibold text-sm">-- {symbol}</p>
                </CardContent>
              </Card>
              <Card className="bg-muted/30">
                <CardContent className="p-4 text-center">
                  <p className="text-xs text-muted-foreground mb-1">Max Supply</p>
                  <p className="font-semibold text-sm">--</p>
                </CardContent>
              </Card>
            </div>
         </div>

         {/* Sidebar / Holdings details */}
         <div className="space-y-6">
            <Card className="shadow-xl bg-gradient-to-br from-primary/5 to-background border-primary/20">
               <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-2">
                    Your {symbol} Holdings
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  {holding ? (
                    <div className="space-y-4">
                       <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border">
                         <span className="text-sm text-muted-foreground">Quantity</span>
                         <span className="font-bold">{holding.totalQuantity.toLocaleString()} {symbol}</span>
                       </div>
                       <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border">
                         <span className="text-sm text-muted-foreground">Average Buy Price</span>
                         <span className="font-mono text-sm">${holding.avgBuyPrice.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:4})}</span>
                       </div>
                       <div className="flex justify-between items-center bg-background/50 p-3 rounded-lg border">
                         <span className="text-sm text-muted-foreground">Total Spent</span>
                         <span className="font-mono text-sm">${holding.totalSpent.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</span>
                       </div>

                       <div className="pt-4 border-t">
                          <p className="text-sm text-muted-foreground mb-1">Current Value</p>
                          <h3 className="text-2xl font-bold">${totalValue.toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})}</h3>
                          
                          <div className={`flex items-center gap-1 mt-2 text-sm font-medium ${pnl >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                             {pnl >= 0 ? <TrendingUpIcon className="w-4 h-4"/> : <TrendingDownIcon className="w-4 h-4"/>}
                             {pnl >= 0 ? '+' : '-'}${Math.abs(pnl).toLocaleString(undefined, {minimumFractionDigits:2, maximumFractionDigits:2})} 
                             ({holding.totalSpent > 0 ? (Math.abs(pnl) / holding.totalSpent * 100).toFixed(2) : 0}%)
                          </div>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center py-8 px-4 opacity-70">
                       <p className="text-sm mb-4">You do not own any {symbol} in your portfolio yet.</p>
                       <Button variant="outline" size="sm" onClick={() => setModalOpen(true)}>Add your first transaction</Button>
                    </div>
                  )}
               </CardContent>
            </Card>

            <Card className="shadow-lg">
              <CardHeader className="pb-3">
                 <CardTitle className="text-base">About {symbol}</CardTitle>
              </CardHeader>
              <CardContent>
                 <p className="text-sm text-muted-foreground leading-relaxed">
                   {symbol} is tracked live via FreeCryptoAPI. Its price is purely market-driven derived from real-time global trade volume.
                   The above chart utilizes a TradingView plugin rendering standard candlestick performance spanning UTC boundaries.
                 </p>
              </CardContent>
            </Card>
         </div>
      </div>

      <TransactionModal 
        open={modalOpen} 
        onOpenChange={setModalOpen} 
        userId={session?.user?.id || ""} 
        defaultCoin={{ id: symbol, symbol, name: symbol }}
        onSuccess={fetchHoldings}
      />
    </section>
  );
}
