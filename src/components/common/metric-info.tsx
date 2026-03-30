'use client'

import React, { useState } from 'react'
import { Info, Sparkles, Loader2 } from 'lucide-react'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

import { MetricId, MetricInfoProps } from "@/types/metrics"

const PROMPTS: Record<MetricId, string> = {
  holdings: "Explain what 'Holdings' means in a crypto portfolio. Include how total value is calculated (quantity * current price) and why it's important to track. Format the response in a structured way with sections like 'Definition', 'Calculation', and 'Why it matters'. Use bullet points.",
  avgBuy: "Explain what 'Average Buy Price' (Avg. Buy) means in crypto investing. Explain the weighted average calculation (Total Spent / Total Quantity) and why it helps investors understand their break-even point. Format the response in a structured way with sections like 'Definition', 'Calculation (The Math)', and 'Strategic Importance'. Use bullet points.",
  pnl: "Explain 'Profit and Loss' (P&L) in a crypto portfolio. Distinguish between Unrealized P&L (paper gains/losses) and Realized P&L (after selling). Explain how it's calculated relative to the Average Buy Price. Format the response in a structured way with sections like 'Definition', 'Unrealized vs Realized', and 'Calculation'. Use bullet points.",
  globalMarketCap: "Explain 'Global Crypto Market Cap'. Explain that it's the total USD value of all digital assets currently in existence. Discuss why it's used as a barometer for the health of the entire crypto economy. Format in a structured way with 'Definition', 'Significance', and 'How it changes'. Use bullet points.",
  fearGreed: "Explain the 'Crypto Fear & Greed Index'. Describe the scale (0-100), what 'Extreme Fear' means (potential buying opportunity) and what 'Extreme Greed' means (the market is due for a correction). Explain the psychology behind it. Format with 'Overview', 'The Scale', and 'Investor Sentiment'.",
  price: "Explain how 'Crypto Prices' are determined in a decentralized market. Discuss the role of supply and demand across various exchanges and how market-wide prices are aggregated. Format with 'Basics', 'Price Discovery', and 'Volatility'.",
  change24h: "Explain '24-hour Price Change (%)'. Why is this window the standard for crypto? Discuss how it reflects short-term sentiment but shouldn't be the only factor in long-term decisions. Format with 'Definition', 'Market Perspective', and 'Contextual Advice'.",
  marketCap: "Explain a single coin's 'Market Cap'. How it's calculated (Price * Circulating Supply). Explain why Market Cap is often a better indicator of success/stability than just Price alone. Format with 'Definition', 'The Formula', and 'Market Cap vs Price'.",
  volume: "Explain 'Trading Volume (24h)'. What does high volume vs low volume say about a coin's liquidity and investor interest? Explain why it's a key momentum indicator. Format with 'Definition', 'Liquidity Insights', and 'Market Interest'.",
  circulatingSupply: "Explain 'Circulating Supply'. How does it differ from 'Total Supply' or 'Max Supply'? Why is it the standard for calculating Market Cap? Discuss inflation and scarcity. Format with 'Definition', 'Supply Dynamics', and 'Investor Considerations'."
}

export function MetricInfo({ title, description, metricId, className }: MetricInfoProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [aiResponse, setAiResponse] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const handleAskAI = async (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsLoading(true)
    setIsDialogOpen(true)
    
    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [
            {
              role: 'user',
              content: PROMPTS[metricId]
            }
          ]
        })
      })
      
      const data = await response.json()
      if (data.reply) {
        setAiResponse(data.reply)
      } else {
        setAiResponse("Sorry, I couldn't generate a response at this time.")
      }
    } catch (error) {
      console.error("AI Fetch Error:", error)
      setAiResponse("Failed to connect to the AI assistant.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <div className={cn("inline-flex items-center gap-1.5", className)}>
        <span>{title}</span>
        <Tooltip delayDuration={300}>
          <TooltipTrigger asChild>
            <button 
              className="inline-flex items-center justify-center rounded-full text-muted-foreground/60 hover:text-primary hover:bg-primary/10 p-0.5 transition-all cursor-help"
              onClick={(e) => e.stopPropagation()}
            >
              <Info className="size-3" />
            </button>
          </TooltipTrigger>
          <TooltipContent 
            side="top"
            className="bg-popover text-popover-foreground border border-border p-4 w-fit max-w-[280px] shadow-2xl glow-primary rounded-xl z-60"
          >
            <div className="space-y-4">
              <div className="space-y-1.5">
                <div className="font-bold text-sm text-foreground flex items-center gap-2">
                  <div className="size-5 rounded-full bg-primary/10 flex items-center justify-center">
                    <Info className="size-3 text-primary" />
                  </div>
                  {title}
                </div>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {description}
                </p>
              </div>
              <Button 
                size="sm" 
                variant="default"
                className="w-full text-xs h-8 gap-2 shadow-sm font-semibold active:scale-[0.98] transition-transform"
                onClick={handleAskAI}
              >
                <Sparkles className="size-3.5" />
                Ask AI Assistant
              </Button>
            </div>
          </TooltipContent>
        </Tooltip>
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-lg glass-panel border-none shadow-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl font-bold">
              <div className="size-8 rounded-full bg-primary/20 flex items-center justify-center">
                <Sparkles className="size-5 text-primary" />
              </div>
              Understanding {title}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground/80 mt-1">
              Deep dive explanation powered by CoinEdu AI Assistant.
            </DialogDescription>
          </DialogHeader>

          <div className="mt-6 min-h-[120px] max-h-[60vh] overflow-y-auto pr-4 custom-scrollbar">
            {isLoading ? (
              <div className="flex flex-col items-center justify-center py-16 gap-4">
                <div className="relative">
                  <div className="absolute inset-0 blur-xl bg-primary/20 animate-pulse" />
                  <Loader2 className="size-10 animate-spin text-primary relative" />
                </div>
                <div className="text-center space-y-1">
                  <p className="text-sm font-medium">Consulting CoinEdu AI...</p>
                  <p className="text-xs text-muted-foreground opacity-60">Gathering financial insights for you</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
                {aiResponse?.split('\n').map((line, i) => {
                    const trimmed = line.trim();
                    if (!trimmed) return <div key={i} className="h-2" />;
                    
                    if (trimmed.startsWith('#') || (trimmed.endsWith(':') && trimmed.length < 50)) {
                        return (
                          <h4 key={i} className="text-sm uppercase tracking-wider font-bold text-primary mt-6 mb-3 border-b border-primary/10 pb-1">
                            {trimmed.replace(/^[#\s]+/, '')}
                          </h4>
                        );
                    }
                    if (trimmed.startsWith('-') || trimmed.startsWith('*')) {
                        return (
                            <div key={i} className="flex gap-3 ml-1 group">
                                <div className="mt-1.5 size-1.5 rounded-full bg-primary/40 group-hover:bg-primary transition-colors shrink-0" />
                                <p className="text-sm text-foreground/90 leading-relaxed">
                                  {trimmed.substring(1).trim()}
                                </p>
                            </div>
                        );
                    }
                    return <p key={i} className="text-sm text-foreground/80 leading-relaxed indent-0">{trimmed}</p>;
                })}
              </div>
            )}
          </div>
          
          {!isLoading && (
            <div className="mt-8 flex justify-end">
              <Button 
                onClick={() => setIsDialogOpen(false)}
                className="px-8 shadow-glow-primary active:scale-95 transition-transform"
              >
                Close Explanation
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
