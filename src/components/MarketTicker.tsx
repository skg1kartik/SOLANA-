import React from "react"
import { TrendingUp, TrendingDown, Cpu, Activity, ShieldCheck, Zap } from "lucide-react"

export const MarketTicker: React.FC = () => {
  const tickerItems = [
    { model: "NVIDIA H100 SXM5", spot: "$2.28/hr", forward: "$1.95/hr", change: "+2.4%", up: true, region: "US-East" },
    { model: "NVIDIA B200 192GB", spot: "$3.90/hr", forward: "$3.45/hr", change: "-0.8%", up: false, region: "EU-West" },
    { model: "NVIDIA A100 80GB SXM", spot: "$1.20/hr", forward: "$0.98/hr", change: "+1.1%", up: true, region: "US-Central" },
    { model: "NVIDIA GH200 NVL", spot: "$3.15/hr", forward: "$2.75/hr", change: "+3.6%", up: true, region: "AP-East" },
    { model: "NVIDIA L40S 48GB", spot: "$0.85/hr", forward: "$0.69/hr", change: "-1.2%", up: false, region: "US-West" },
    { model: "NVIDIA RTX 4090 24GB", spot: "$0.42/hr", forward: "$0.34/hr", change: "+0.5%", up: true, region: "EU-Central" },
  ]

  return (
    <div className="relative z-20 border-y border-border bg-black/60 backdrop-blur-xl">
      {/* Metrics Row */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Active Compute Capacity</div>
            <div className="text-xl font-bold font-mono text-foreground">1,248,500 <span className="text-xs font-normal text-muted-foreground">GPU-Hrs</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">24h Contract Volume</div>
            <div className="text-xl font-bold font-mono text-foreground">$3,842,150 <span className="text-xs text-primary font-normal font-mono">+18.4%</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Order Matching Engine</div>
            <div className="text-xl font-bold font-mono text-foreground">&lt; 140 &micro;s <span className="text-xs font-normal text-primary">Rust Async</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">SLA Guaranteed Delivery</div>
            <div className="text-xl font-bold font-mono text-foreground">99.98% <span className="text-xs font-normal text-muted-foreground">Verifiable</span></div>
          </div>
        </div>
      </div>

      {/* Streaming Ticker Marquee */}
      <div className="overflow-x-auto py-3 px-6 flex items-center gap-8 no-scrollbar font-mono text-xs">
        <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider shrink-0">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          LIVE BENCHMARK INDEX:
        </div>

        <div className="flex items-center gap-8 shrink-0">
          {tickerItems.map((item, idx) => (
            <div key={idx} className="flex items-center gap-3 bg-secondary/30 px-3 py-1.5 rounded border border-white/5">
              <span className="text-foreground font-medium">{item.model}</span>
              <span className="text-muted-foreground text-[10px] bg-white/5 px-1.5 py-0.5 rounded">{item.region}</span>
              <div className="flex items-center gap-1.5">
                <span className="text-white font-bold">{item.spot}</span>
                <span className="text-muted-foreground/60 text-[10px]">spot</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-primary font-bold">{item.forward}</span>
                <span className="text-muted-foreground/60 text-[10px]">fwd-30d</span>
              </div>
              <span className={`flex items-center gap-0.5 ${item.up ? "text-primary" : "text-destructive"}`}>
                {item.up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                {item.change}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketTicker
