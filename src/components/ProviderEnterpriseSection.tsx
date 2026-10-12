import React from "react"
import { Building2, Server, ShieldCheck, ArrowRight, Coins, BarChart3, Users, Network } from "lucide-react"

interface ProviderEnterpriseProps {
  onOpenModal?: (mode: "provider" | "enterprise") => void
}

export const ProviderEnterpriseSection: React.FC<ProviderEnterpriseProps> = ({ onOpenModal }) => {
  return (
    <section className="py-24 px-6 lg:px-16 bg-hero-bg/95 relative border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Box 1: For GPU Infrastructure Providers */}
          <div className="rounded-xl border border-border bg-secondary/20 p-8 flex flex-col justify-between hover:border-primary/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Server className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20">
                  BECOME A VALIDATED PROVIDER
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3 uppercase">
                Monetize Idle GPU Capacity &amp; Secure Future Revenue
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                Are you an AI data center, cloud provider, or enterprise with excess H100/A100 capacity? List your compute on TerveX to unlock instantaneous liquidity and pre-sell upcoming compute through forward contract agreements.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Coins className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">Pre-sell upcoming quarterly capacity with guaranteed forward contract payouts</span>
                </div>
                <div className="flex items-start gap-3">
                  <BarChart3 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">Automated node health monitoring, InfiniBand telemetry, and cluster benchmarking</span>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">Arbitrum/Solana smart contract escrows protect against unpaid reservations</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenModal && onOpenModal("provider")}
              className="w-full py-3.5 rounded bg-secondary hover:bg-secondary/80 text-foreground text-xs font-bold uppercase tracking-wider border border-border hover:border-primary/40 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              List Your GPU Cluster <ArrowRight className="w-4 h-4 text-primary" />
            </button>
          </div>

          {/* Box 2: For AI Startups & Enterprise Workloads */}
          <div className="rounded-xl border border-border bg-secondary/20 p-8 flex flex-col justify-between hover:border-primary/40 transition-all duration-300">
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="w-12 h-12 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
                  <Building2 className="w-6 h-6" />
                </div>
                <span className="text-xs font-mono uppercase tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded border border-primary/20">
                  ENTERPRISE AI TEAMS
                </span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-3 uppercase">
                Predictable Compute For Enterprise Model Training
              </h3>
              <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
                Avoid hyperscaler lock-in and unpredictable billing surges. Secure bespoke forward compute agreements with multi-region redundancy, guaranteed SLA tiers, and custom settlement terms.
              </p>

              <div className="space-y-3 mb-8">
                <div className="flex items-start gap-3">
                  <Network className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">Direct multi-node bare-metal clusters with 3.2 Tbps InfiniBand Quantum-2 fabric</span>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">Dedicated infrastructure engineering support &amp; custom multi-quarter reservations</span>
                </div>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                  <span className="text-xs text-muted-foreground">SOC2 Type II, ISO 27001, and HIPAA compliant Tier IV data centers</span>
                </div>
              </div>
            </div>

            <button
              onClick={() => onOpenModal && onOpenModal("enterprise")}
              className="w-full py-3.5 rounded bg-primary hover:brightness-110 text-primary-foreground text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              Contact Enterprise Desk <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ProviderEnterpriseSection
