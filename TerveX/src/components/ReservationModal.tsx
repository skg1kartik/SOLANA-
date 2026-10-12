import React, { useEffect, useState } from "react"
import { api } from "@/lib/api"
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
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState("")
  const [confirmation, setConfirmation] = useState("")

  useEffect(() => {
    if (isOpen) {
      setMode(initialMode); setSubmitted(false); setSubmitError(""); setConfirmation("")
      const modelText = String(initialData?.model || "")
      if (modelText.includes("B200")) setClusterSize("8x B200 NVL")
      else if (modelText.includes("A100")) setClusterSize("8x A100 SXM4")
      else if (modelText.includes("GH200")) setClusterSize("1x GH200 Grace Hopper")
      else if (modelText.includes("L40S")) setClusterSize("4x L40S 48GB")
      else if (modelText.includes("H100")) setClusterSize("8x H100 SXM5")
      if (initialData?.hours) {
        const h = Number(initialData.hours)
        setDuration(h <= 24 ? "24 Hours (Immediate)" : h <= 168 ? "168 Hours (1 Week)" : h <= 336 ? "336 Hours (2 Weeks)" : "720 Hours (30 Days)")
      }
    }
  }, [isOpen, initialMode])

  if (!isOpen) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    setSubmitError("")
    try {
      const base = { cluster_model: clusterSize, duration, email }
      let result: { id: string; status: string; message: string }
      if (mode === "provider") result = await api.createProviderApplication(base)
      else if (mode === "enterprise") result = await api.createEnterpriseInquiry(base)
      else {
        const gpuCount = Number(clusterSize.match(/^(\d+)/)?.[1] || 1)
        const hours = Number(duration.match(/^(\d+)/)?.[1] || 168)
        result = await api.createReservation({
          ...base, mode, listing_id: initialData?.id, gpu_count: gpuCount,
          estimated_total: initialData?.total ?? undefined,
        })
      }
      setConfirmation(`${result.message} Reference: ${result.id}`)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error instanceof Error ? error.message : "Submission failed. Please try again.")
    } finally { setSubmitting(false) }
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
              Request Submitted
            </h3>
            <p className="text-xs text-muted-foreground font-mono mb-6 max-w-sm mx-auto">
              <span className="text-primary font-bold">{email}</span><br />{confirmation}
            </p>
            <div className="p-4 rounded-lg bg-black/60 border border-border font-mono text-xs text-left mb-6 space-y-2">
              <div className="text-primary flex items-center justify-between">
                <span>REQUEST STATUS:</span> <span>PENDING REVIEW</span>
              </div>
              <div className="text-muted-foreground flex items-center justify-between">
                <span>DATABASE:</span> <span>Saved to SQLite</span>
              </div>
              <div className="text-muted-foreground flex items-center justify-between">
                <span>GPU ALLOCATION:</span> <span>Not performed</span>
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
              Submit a request for review. This prototype does not yet allocate GPUs, execute contracts, or process payments.
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

              {submitError && <p role="alert" className="text-sm text-red-400 rounded border border-red-500/30 bg-red-500/10 p-3">{submitError}</p>}
              <div className="pt-2">
                <button
                  type="submit" disabled={submitting}
                  className="w-full py-3.5 rounded bg-primary text-primary-foreground font-bold text-xs uppercase tracking-wider hover:brightness-110 disabled:opacity-60 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_20px_rgba(34,197,94,0.3)]"
                >
                  {submitting ? "Submitting…" : "Submit Request for Review"} <ArrowRight className="w-4 h-4" />
                </button>
              </div>

              <div className="flex items-center justify-between text-[10px] font-mono text-muted-foreground pt-1">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-primary" /> Prototype
                </span>
                <span>Pending Review</span>
                <span>Rust API</span>
              </div>
            </form>
          </div>
        )}
      </div>
    </div>
  )
}

export default ReservationModal
