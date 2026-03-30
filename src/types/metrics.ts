export type MetricId = 
  | 'holdings' | 'avgBuy' | 'pnl' 
  | 'globalMarketCap' | 'fearGreed' 
  | 'price' | 'change24h' | 'marketCap' 
  | 'volume' | 'circulatingSupply'

export interface MetricInfoProps {
  title: string
  description: string
  metricId: MetricId
  className?: string
}
