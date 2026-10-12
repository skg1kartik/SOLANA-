import React, { useState } from "react"
import { Zap, CalendarClock, ArrowRight, ShieldCheck, CheckCircle2, DollarSign, Clock, Layers } from "lucide-react"

interface CoreMechanismsProps {
  onSelectAction?: (type: "spot" | "forward") => void
}

export const CoreMechanisms: React.FC<CoreMechanismsProps> = ({ onSelectAction }) => {
  const [activeTab, setActiveTab] = useState<"spot" | "forward">("spot")

  return (
    <section id="spot-market" className="py-24 px-6 lg:px-16 bg-hero-bg relative">
      {/* Background ambient glow */}
      <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-96 h-96 bg-primary/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-primary font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              FINANCIAL-GRADE COMPUTE MECHANISMS
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
              One Marketplace. <br />
              <span className="text-gradient-primary">Two Ways To Transact.</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-sm md:text-base max-w-md font-light">
            TerveX bridges immediate burst compute with deterministic future capacity agreements. Remove volatility and eliminate downtime.
          </p>
        </div>

        {/* Mechanism Selector Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          {/* Card 1: Spot Compute */}
          <div 
            className={`rounded-xl border transition-all duration-300 p-8 flex flex-col justify-between relative overflow-hidden ${
              activeTab === "spot" 
                ? "bg-secondary/40 border-primary/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]" 
                : "bg-secondary/20 border-border hover:border-border/80"
            }`}
            onClick={() => setActiveTab("spot")}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <Zap className="w-32 h-32 text-primary" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Zap className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono font-medium tracking-wider bg-white/5 border border-white/10 text-primary">
                  IMMEDIATE EXECUTION
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                1. ⚡ Spot Compute
              </h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed mb-6">
                Direct access to currently available GPU capacity for instant or near-term workloads at real-time supply and demand pricing.
              </p>

              <div className="space-y-3 mb-8">
                <div className="text-xs uppercase tracking-wider text-foreground/70 font-semibold mb-2">Ideal Workloads:</div>
                {[
                  "AI experimentation & active prototyping",
                  "Large Language Model & vision inference",
                  "Short-duration model fine-tuning & training",
                  "Bursty, non-deterministic compute spikes",
                  "Dynamic batch processing without long commitments"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground font-light">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between">
              <div>
                <div className="text-[11px] text-muted-foreground font-mono">Pricing Model</div>
                <div className="text-sm font-semibold text-foreground">Dynamic Hourly Spot Index</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (onSelectAction) onSelectAction("spot")
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-primary text-primary-foreground text-xs font-bold uppercase tracking-wider hover:brightness-110 transition-all cursor-pointer"
              >
                Launch Spot <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>

          {/* Card 2: Forward Compute */}
          <div 
            id="forward-contracts"
            className={`rounded-xl border transition-all duration-300 p-8 flex flex-col justify-between relative overflow-hidden ${
              activeTab === "forward" 
                ? "bg-secondary/40 border-primary/50 shadow-[0_0_30px_rgba(34,197,94,0.1)]" 
                : "bg-secondary/20 border-border hover:border-border/80"
            }`}
            onClick={() => setActiveTab("forward")}
          >
            <div className="absolute top-0 right-0 p-6 opacity-10">
              <CalendarClock className="w-32 h-32 text-primary" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <CalendarClock className="w-6 h-6" />
                </div>
                <span className="px-3 py-1 rounded text-xs font-mono font-medium tracking-wider bg-white/5 border border-white/10 text-primary">
                  HEDGED CAPACITY AGREEMENT
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3 flex items-center gap-2">
                2. 📅 Forward Compute
              </h3>
              <p className="text-muted-foreground text-sm font-light leading-relaxed mb-6">
                Enables buyers and providers to agree on dedicated cluster capacity and price for future delivery windows. Lock your budget, eliminate price spikes.
              </p>

              <div className="space-y-3 mb-8">
                <div className="text-xs uppercase tracking-wider text-foreground/70 font-semibold mb-2">Ideal Workloads:</div>
                {[
                  "Scheduled large-scale foundation model pre-training",
                  "Enterprise mission-critical AI roadmaps",
                  "Quarterly academic & institute research programs",
                  "Long-running workloads requiring guaranteed uptime",
                  "Predictable quarterly compute capital budget planning"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground font-light">
                    <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-6 border-t border-border flex items-center justify-between">
              <div>
                <div className="text-[11px] text-muted-foreground font-mono">Pricing Model</div>
                <div className="text-sm font-semibold text-foreground">Fixed Locked Contract Rate</div>
              </div>
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  if (onSelectAction) onSelectAction("forward")
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded bg-white text-background text-xs font-bold uppercase tracking-wider hover:brightness-90 transition-all cursor-pointer"
              >
                Lock Forward <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Key comparison benefits banner */}
        <div className="rounded-xl border border-border bg-secondary/30 p-6 md:p-8 grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex items-start gap-4">
            <div className="p-2 rounded bg-primary/10 text-primary shrink-0">
              <DollarSign className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Financial Predictability</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Forward contracts allow AI developers to hedge against GPU shortages and hyperscaler price gouging months ahead.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 rounded bg-primary/10 text-primary shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Guaranteed Allocation</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Reserve multi-node NVLink clusters ahead of time. Providers commit physical capacity backed by contract penalties.
              </p>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <div className="p-2 rounded bg-primary/10 text-primary shrink-0">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-foreground mb-1">Provider Revenue Maximization</h4>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">
                Data centers monetize upcoming idle cycles and forward commitments to ensure steady operational margins.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default CoreMechanisms
