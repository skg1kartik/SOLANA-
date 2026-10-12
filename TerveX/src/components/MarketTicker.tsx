import React from "react"
import { Cpu, Activity, ShieldCheck, Zap } from "lucide-react"

export const MarketTicker: React.FC = () => {
  const tickerItems = [
    { model: "NVIDIA H100 SXM5", spot: "$2.24/hr", forward: "$1.95/hr", region: "US-East" },
    { model: "NVIDIA B200 NVL", spot: "$3.85/hr", forward: "$3.40/hr", region: "EU-West" },
    { model: "NVIDIA A100 SXM4", spot: "$1.15/hr", forward: "$0.94/hr", region: "US-Central" },
    { model: "NVIDIA GH200 Grace Hopper", spot: "$3.10/hr", forward: "$2.70/hr", region: "AP-East" },
    { model: "NVIDIA L40S 48GB", spot: "$0.82/hr", forward: "$0.68/hr", region: "EU-Central" },
    { model: "NVIDIA H100 PCIe", spot: "$1.88/hr", forward: "$1.60/hr", region: "US-West" },
  ]

  return (
    <div className="relative z-20 border-y border-border bg-black/60 backdrop-blur-xl">
      <div className="px-6 py-2 text-center text-[10px] font-mono uppercase tracking-wider text-amber-300/80 border-b border-white/5">Illustrative demo metrics and prices — not live marketplace telemetry</div>
      {/* Metrics Row */}
      <div className="max-w-7xl mx-auto px-6 py-6 grid grid-cols-2 md:grid-cols-4 gap-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Cpu className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Illustrative GPU Capacity</div>
            <div className="text-xl font-bold font-mono text-foreground">12,480 <span className="text-xs font-normal text-muted-foreground">GPUs</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Activity className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Illustrative 24h Volume</div>
            <div className="text-xl font-bold font-mono text-foreground">$2,840,000 <span className="text-xs text-muted-foreground font-normal font-mono">illustrative</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <Zap className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Prototype API</div>
            <div className="text-xl font-bold font-mono text-foreground">Rust API <span className="text-xs font-normal text-primary">Prototype</span></div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-lg bg-primary/10 border border-primary/20 text-primary">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs uppercase tracking-wider text-muted-foreground">Illustrative SLA Target</div>
            <div className="text-xl font-bold font-mono text-foreground">99.5% <span className="text-xs font-normal text-muted-foreground">Target only</span></div>
          </div>
        </div>
      </div>

      {/* Streaming Ticker Marquee */}
      <div className="overflow-x-auto py-3 px-6 flex items-center gap-8 no-scrollbar font-mono text-xs">
        <div className="flex items-center gap-2 text-primary font-semibold uppercase tracking-wider shrink-0">
          <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
          DEMO PRICE INDEX:
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

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default MarketTicker
