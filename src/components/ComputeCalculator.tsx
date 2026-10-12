import React, { useState } from "react"
import { Calculator, ArrowRight, ShieldCheck, Check, Sparkles, TrendingDown } from "lucide-react"

interface ComputeCalculatorProps {
  onLockAgreement?: (summary: { model: string; gpus: number; hours: number; total: number; savings: number }) => void
}

export const ComputeCalculator: React.FC<ComputeCalculatorProps> = ({ onLockAgreement }) => {
  const [model, setModel] = useState<"H100" | "B200" | "A100" | "L40S">("H100")
  const [gpuCount, setGpuCount] = useState<number>(8)
  const [hours, setHours] = useState<number>(168) // 1 week default

  const rates: Record<string, { name: string; spot: number; forward: number }> = {
    H100: { name: "NVIDIA H100 SXM5 80GB", spot: 2.24, forward: 1.95 },
    B200: { name: "NVIDIA B200 NVL 192GB", spot: 3.85, forward: 3.40 },
    A100: { name: "NVIDIA A100 SXM4 80GB", spot: 1.15, forward: 0.94 },
    L40S: { name: "NVIDIA L40S 48GB", spot: 0.82, forward: 0.68 },
  }

  const selectedRate = rates[model]
  const spotTotal = gpuCount * hours * selectedRate.spot
  const forwardTotal = gpuCount * hours * selectedRate.forward
  const savings = spotTotal - forwardTotal
  const savingsPercent = Math.round((savings / spotTotal) * 100)

  return (
    <section id="calculator" className="py-24 px-6 lg:px-16 bg-hero-bg relative border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-primary font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              CAPACITY &amp; BUDGET HEDGING SIMULATOR
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
              Forward Compute <span className="text-primary">Calculator</span>
            </h2>
          </div>
          <p className="text-muted-foreground text-sm font-light max-w-md">
            Model your training workload or inference scale. Compare volatile unhedged spot projections against fixed forward agreements.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Controls Column */}
          <div className="lg:col-span-7 bg-secondary/30 p-8 rounded-xl border border-border flex flex-col justify-between">
            <div className="space-y-6">
              {/* Select GPU Architecture */}
              <div>
                <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground block mb-3">
                  1. Select GPU Architecture
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(["H100", "B200", "A100", "L40S"] as const).map((m) => (
                    <button
                      key={m}
                      onClick={() => setModel(m)}
                      className={`py-3 px-2 rounded-lg border text-xs font-mono font-bold transition-all cursor-pointer ${
                        model === m
                          ? "bg-primary text-primary-foreground border-primary shadow-[0_0_15px_rgba(34,197,94,0.3)]"
                          : "bg-black/40 text-foreground border-border hover:border-border/80"
                      }`}
                    >
                      {m}
                    </button>
                  ))}
                </div>
                <div className="text-xs text-muted-foreground font-mono mt-2 flex items-center justify-between">
                  <span>Selected: {selectedRate.name}</span>
                  <span className="text-primary font-bold">${selectedRate.forward.toFixed(2)}/GPU-hr locked</span>
                </div>
              </div>

              {/* Slider: Number of GPUs */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                    2. Cluster GPU Count
                  </label>
                  <span className="text-sm font-mono font-bold text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {gpuCount} GPUs ({gpuCount / 8 >= 1 ? `${gpuCount / 8}x 8-GPU Node` : "Partial Node"})
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="64"
                  step="1"
                  value={gpuCount}
                  onChange={(e) => setGpuCount(Number(e.target.value))}
                  className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                  <span>1 GPU</span>
                  <span>8 (1 Node)</span>
                  <span>32 (4 Nodes)</span>
                  <span>64 (8 Nodes)</span>
                </div>
              </div>

              {/* Slider: Workload Duration */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs uppercase font-mono tracking-wider text-muted-foreground">
                    3. Planned Duration (Hours)
                  </label>
                  <span className="text-sm font-mono font-bold text-primary px-2.5 py-0.5 rounded bg-primary/10 border border-primary/20">
                    {hours} Hours ({Math.round(hours / 24)} Days)
                  </span>
                </div>
                <input
                  type="range"
                  min="24"
                  max="720"
                  step="24"
                  value={hours}
                  onChange={(e) => setHours(Number(e.target.value))}
                  className="w-full h-2 bg-black/60 rounded-lg appearance-none cursor-pointer accent-primary"
                />
                <div className="flex justify-between text-[10px] font-mono text-muted-foreground mt-1">
                  <span>24h (1 Day)</span>
                  <span>168h (1 Week)</span>
                  <span>336h (2 Weeks)</span>
                  <span>720h (1 Month)</span>
                </div>
              </div>
            </div>

            {/* Total GPU Hours Badge */}
            <div className="pt-6 border-t border-border mt-6 flex items-center justify-between text-xs font-mono">
              <span className="text-muted-foreground">Total Compute Units:</span>
              <span className="text-foreground font-bold font-mono">
                {(gpuCount * hours).toLocaleString()} GPU-Hours
              </span>
            </div>
          </div>

          {/* Pricing & Comparison Card */}
          <div className="lg:col-span-5 rounded-xl border border-primary/40 bg-secondary/40 p-8 flex flex-col justify-between shadow-[0_0_30px_rgba(0,0,0,0.6)] relative overflow-hidden">
            <div className="absolute top-0 right-0 p-6 opacity-10 pointer-events-none">
              <Calculator className="w-36 h-36 text-primary" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-6">
                <span className="text-xs font-mono uppercase tracking-wider text-primary font-bold px-2 py-1 rounded bg-primary/10 border border-primary/20">
                  ESTIMATED QUOTE
                </span>
                <span className="text-xs font-mono text-muted-foreground">Currency: USD</span>
              </div>

              {/* Forward Locked Price */}
              <div className="mb-6">
                <div className="text-xs uppercase font-mono text-muted-foreground mb-1">
                  Forward Agreement Rate (Guaranteed)
                </div>
                <div className="text-4xl md:text-5xl font-bold font-mono text-primary">
                  ${forwardTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </div>
                <div className="text-xs text-muted-foreground/80 font-mono mt-1">
                  ${selectedRate.forward.toFixed(2)}/hr fixed &bull; Zero spot spike risk
                </div>
              </div>

              {/* Unhedged Spot Comparison */}
              <div className="bg-black/50 p-4 rounded-lg border border-border mb-6 space-y-3 font-mono text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground">Unhedged Spot Proj:</span>
                  <span className="text-foreground line-through">
                    ${spotTotal.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
                <div className="flex items-center justify-between border-t border-white/5 pt-2">
                  <span className="text-primary font-bold flex items-center gap-1">
                    <TrendingDown className="w-3.5 h-3.5" /> Hedging Cost Savings:
                  </span>
                  <span className="text-primary font-bold">
                    ${savings.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ({savingsPercent}%)
                  </span>
                </div>
              </div>

              {/* Guarantees */}
              <div className="space-y-2 mb-8">
                {[
                  "100% Guaranteed cluster availability on delivery date",
                  "No preemption or eviction risk during execution",
                  "InfiniBand interconnect & NVLink health verified before start",
                  "Automated settlement via smart contract escrow"
                ].map((item, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-muted-foreground">
                    <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Lock Agreement Button */}
            <button
              onClick={() => {
                if (onLockAgreement) {
                  onLockAgreement({
                    model: selectedRate.name,
                    gpus: gpuCount,
                    hours: hours,
                    total: forwardTotal,
                    savings: savings
                  })
                }
              }}
              className="w-full py-4 rounded bg-primary text-primary-foreground text-sm font-bold uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.3)]"
            >
              Lock Forward Agreement <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ComputeCalculator
