import React, { useState } from "react"
import { UploadCloud, Search, FileSignature, CheckCircle, ArrowRight, Sparkles } from "lucide-react"

export const HowItWorks: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0)

  const steps = [
    {
      step: "01",
      title: "Providers List GPUs",
      icon: UploadCloud,
      desc: "Infrastructure providers publish available clusters detailing GPU models, interconnect bandwidth, data center tier, regions, available hours, and spot vs forward reserve pricing.",
      details: ["Automatic node hardware verification", "Real-time telemetry & latency ping", "Set floor price & forward curve discount"]
    },
    {
      step: "02",
      title: "Buyers Explore Listings",
      icon: Search,
      desc: "AI research teams and developers filter compute by architecture (H100 SXM5, B200, GH200), physical location, InfiniBand fabric, and competitive pricing metrics.",
      details: ["Instant multi-region filter", "Zero hidden egress fees", "Direct interconnect topology inspection"]
    },
    {
      step: "03",
      title: "Select Agreement Type",
      icon: FileSignature,
      desc: "Choose between instantaneous Spot Compute for immediate inference & fine-tuning or lock Forward Compute agreements for future training runs at a guaranteed price.",
      details: ["Spot: Instant provisioning in <60s", "Forward: Cryptographic price lock for 7 to 90 days", "Hedging against market capacity crunches"]
    },
    {
      step: "04",
      title: "Execute & Settle",
      icon: CheckCircle,
      desc: "High-throughput Rust execution engine coordinates the reservation. Delivery verification logs GPU-hour execution proofs, settled via transparent financial smart contracts.",
      details: ["Auditable hardware uptime proof", "Penalty-backed provider fulfillment SLA", "Instant on-chain or fiat clearing"]
    }
  ]

  return (
    <section id="how-it-works" className="py-24 px-6 lg:px-16 bg-hero-bg relative border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="text-primary font-mono text-xs uppercase tracking-widest mb-3 inline-flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            END-TO-END MARKETPLACE ARCHITECTURE
          </div>
          <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground uppercase mb-4">
            How The Compute <span className="text-primary">Market Works</span>
          </h2>
          <p className="text-muted-foreground text-sm md:text-base font-light">
            Connecting enterprise GPU owners with AI engineers through a transparent, high-efficiency financial protocol.
          </p>
        </div>

        {/* 4 Interactive Flow Steps */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {steps.map((item, idx) => {
            const IconComponent = item.icon
            const isSelected = activeStep === idx
            return (
              <div
                key={idx}
                onClick={() => setActiveStep(idx)}
                className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer relative ${
                  isSelected
                    ? "bg-secondary/40 border-primary shadow-[0_0_24px_rgba(34,197,94,0.15)]"
                    : "bg-secondary/15 border-border hover:border-border/80"
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`text-2xl font-mono font-bold ${isSelected ? "text-primary" : "text-muted-foreground/40"}`}>
                    {item.step}
                  </div>
                  <div className={`p-2 rounded-lg ${isSelected ? "bg-primary text-primary-foreground" : "bg-white/5 text-muted-foreground"}`}>
                    <IconComponent className="w-5 h-5" />
                  </div>
                </div>

                <h3 className="text-lg font-bold text-foreground mb-2">{item.title}</h3>
                <p className="text-xs text-muted-foreground font-light leading-relaxed mb-4">{item.desc}</p>

                <div className="space-y-1.5 pt-3 border-t border-border">
                  {item.details.map((detail, dIdx) => (
                    <div key={dIdx} className="text-[11px] text-muted-foreground/80 flex items-center gap-1.5">
                      <span className="w-1 h-1 rounded-full bg-primary shrink-0" />
                      <span>{detail}</span>
                    </div>
                  ))}
                </div>
              </div>
            )
          })}
        </div>

        {/* Example Real-World Scenario Walkthrough */}
        <div className="rounded-xl border border-border bg-black/60 p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
            <Sparkles className="w-40 h-40 text-primary" />
          </div>

          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-mono mb-4">
              <Sparkles className="w-3.5 h-3.5" />
              CASE STUDY: FOUNDATION MODEL TRAINING RUN
            </div>
            <h3 className="text-2xl font-bold text-foreground mb-3 uppercase">
              How a Startup Saves 35% on a 500 GPU-Hour Training Run
            </h3>
            <p className="text-sm text-muted-foreground font-light leading-relaxed mb-6">
              An AI startup planning to fine-tune a 70B parameter model next month needs 500 GPU-hours of H100 SXM5 compute. Instead of praying for spot availability at peak cloud pricing ($3.20/hr), they execute a <strong>TerveX 30-Day Forward Agreement</strong> at $1.95/hr, securing their dedicated cluster and saving over $625 while guaranteeing zero scheduling delays.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
              <div className="p-3 rounded bg-secondary/30 border border-border">
                <div className="text-muted-foreground text-[10px]">Unhedged Spot Risk</div>
                <div className="text-lg font-bold text-destructive">$1,600.00</div>
                <div className="text-[10px] text-muted-foreground">Subject to capacity crunches</div>
              </div>
              <div className="p-3 rounded bg-secondary/30 border border-border">
                <div className="text-muted-foreground text-[10px]">TerveX Forward Contract</div>
                <div className="text-lg font-bold text-primary">$975.00</div>
                <div className="text-[10px] text-primary">Fixed rate &amp; reserved node</div>
              </div>
              <div className="p-3 rounded bg-primary/10 border border-primary/20">
                <div className="text-primary text-[10px]">Total Guaranteed Capital Saved</div>
                <div className="text-lg font-bold text-primary font-mono">$625.00 (39%)</div>
                <div className="text-[10px] text-primary/80">Zero SLA compromise</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default HowItWorks
