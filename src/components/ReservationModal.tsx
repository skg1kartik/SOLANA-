import React, { useState } from "react"
import { X, CheckCircle2, ShieldCheck, Zap, Calendar, Cpu, ArrowRight } from "lucide-react"

interface ReservationModalProps {
  isOpen: boolean
  onClose: () => void
  initialMode?: "spot" | "forward" | "provider" | "enterprise"
  initialData?: any
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  isOpen,
  onClose,
  initialMode = "spot",
  initialData
}) => {
  const [mode, setMode] = useState<"spot" | "forward" | "provider" | "enterprise">(initialMode)
  const [submitted, setSubmitted] = useState(false)
  const [email, setEmail] = useState("")
  const [clusterSize, setClusterSize] = useState("8x H100 SXM5")
  const [duration, setDuration] = useState("168 Hours (1 Week)")

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitted(true)
  }

  const handleReset = () => {
    setSubmitted(false)
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
      <div 
        className="bg-secondary/90 border border-primary/40 rounded-xl w-full max-w-lg p-6 sm:p-8 relative shadow-[0_0_50px_rgba(0,0,0,0.8)]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-muted-foreground hover:text-foreground p-1 rounded-lg bg-black/40 border border-border"
        >
          <X className="w-5 h-5" />
        </button>

        {submitted ? (
          <div className="text-center py-8">
            <div className="w-16 h-16 rounded-full bg-primary/20 border border-primary flex items-center justify-center text-primary mx-auto mb-4 animate-bounce">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold uppercase text-foreground mb-2">
              Agreement Initialized
            </h3>
            <p className="text-xs text-muted-foreground font-mono mb-6 max-w-sm mx-auto">
              Your request has been routed to the TerveX matching engine. A confirmation dispatch with cryptographically signed SLA terms has been queued for: <span className="text-primary font-bold">{email || "client@domain.ai"}</span>.
            </p>
            <div className="p-4 rounded-lg bg-black/60 border border-border font-mono text-xs text-left mb-6 space-y-2">
              <div className="text-primary flex items-center justify-between">
                <span>ORDERBOOK STATUS:</span> <span>PENDING MATCH</span>
              </div>
              <div className="text-muted-foreground flex items-center justify-between">
                <span>EXECUTION ENGINE:</span> <span>Rust Tokio Async</span>
              </div>
              <div className="text-muted-foreground flex items-center justify-between">
                <span>SETTLEMENT:</span> <span>Verifiable Escrow</span>
              </div>
            </div>
            <button
              onClick={handleReset}
              className="w-full py-3 rounded bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:brightness-110 cursor-pointer"
            >
              Done &bull; Return to Terminal
            </button>
          </div>
        ) : (
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse" />
              <span className="text-xs font-mono uppercase tracking-widest text-primary">
                TERVEX EXECUTION TERMINAL
              </span>
            </div>

            <h3 className="text-2xl font-bold uppercase text-foreground mb-2">
              {mode === "spot" && "Reserve Spot Compute"}
              {mode === "forward" && "Lock Forward Agreement"}
              {mode === "provider" && "Register GPU Cluster"}
              {mode === "enterprise" && "Enterprise Capacity Desk"}
            </h3>

            <p className="text-xs text-muted-foreground font-light mb-6">
              Connect to institutional GPU capacity. Guaranteed zero preemption and verifiable hardware SLA.
            </p>

            {/* Mode Selector Tabs */}
            <div className="grid grid-cols-4 gap-1 p-1 bg-black/40 rounded-lg border border-border mb-6 text-[11px] font-mono">
              <button
                type="button"
                onClick={() => setMode("spot")}
                className={`py-1.5 rounded transition-all cursor-pointer ${mode === "spot" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Spot
              </button>
              <button
                type="button"
                onClick={() => setMode("forward")}
                className={`py-1.5 rounded transition-all cursor-pointer ${mode === "forward" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Forward
              </button>
              <button
                type="button"
                onClick={() => setMode("provider")}
                className={`py-1.5 rounded transition-all cursor-pointer ${mode === "provider" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Provider
              </button>
              <button
                type="button"
                onClick={() => setMode("enterprise")}
                className={`py-1.5 rounded transition-all cursor-pointer ${mode === "enterprise" ? "bg-primary text-primary-foreground font-bold" : "text-muted-foreground hover:text-foreground"}`}
              >
                Enterprise
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                  Workload Cluster Model
                </label>
                <select
                  value={clusterSize}
                  onChange={(e) => setClusterSize(e.target.value)}
                  className="w-full bg-black/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-none"
                >
                  <option value="8x H100 SXM5">8x NVIDIA H100 SXM5 (640GB HBM3, InfiniBand)</option>
                  <option value="8x B200 NVL">8x NVIDIA B200 NVL (1.5TB HBM3e, NVLink 5)</option>
                  <option value="8x A100 SXM4">8x NVIDIA A100 80GB (640GB HBM2e)</option>
                  <option value="1x GH200 Grace Hopper">1x GH200 Grace Hopper (576GB Coherent)</option>
                  <option value="4x L40S 48GB">4x NVIDIA L40S 48GB (PCIe)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                  Agreement Duration / Target Window
                </label>
                <select
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  className="w-full bg-black/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-none"
                >
                  <option value="24 Hours (Immediate)">24 Hours (Immediate Burst)</option>
                  <option value="168 Hours (1 Week)">168 Hours (1 Week Committed)</option>
                  <option value="336 Hours (2 Weeks)">336 Hours (2 Weeks Forward)</option>
                  <option value="720 Hours (30 Days)">720 Hours (30 Days Forward Lock)</option>
                  <option value="Quarterly (90 Days)">90 Days (Enterprise Foundation)</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-mono uppercase tracking-wider text-muted-foreground block mb-1">
                  Work Email / Public Key
                </label>
                <input
                  type="email"
                  required
                  placeholder="builder@ai-research.org or 0x..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-black/50 border border-border rounded-lg px-3 py-2 text-xs text-foreground font-mono focus:border-primary focus:outline-none"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-3.5 rounded bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:brightness-110 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  Submit Order to Matching Engine <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> SOC2 Verified
                </span>
                <span>Zero Preemption SLA</span>
                <span>Rust Engine &bull; Sub-ms</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservationModal
