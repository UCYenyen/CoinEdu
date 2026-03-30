interface TradingViewChartProps {
  symbol: string;
}

export function TradingViewChart({ symbol }: TradingViewChartProps) {
  // Trading view usually requires the pair to be something like BTCUSD or BINANCE:BTCUSDT.
  // We'll use the crypto symbol + USD to match most tradingview charts.
  const tvSymbol = `${symbol.toUpperCase()}USD`;
  
  return (
    <div className="w-full h-[500px] lg:h-full lg:min-h-[600px] bg-secondary/10 rounded-xl overflow-hidden border border-border shadow-sm">
      <iframe 
        id="tradingview_chart" 
        src={`https://s.tradingview.com/widgetembed/?frameElementId=tradingview_chart&symbol=${tvSymbol}&interval=D&hidesidetoolbar=0&symboledit=1&saveimage=1&toolbarbg=f1f3f6&theme=dark&style=1&timezone=Etc%2FUTC&locale=en`} 
        style={{ width: "100%", height: "100%", border: "none" }}
        title="TradingView Chart"
      />
    </div>
  );
}
