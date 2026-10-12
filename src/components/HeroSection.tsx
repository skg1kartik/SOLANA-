import React, { Suspense } from "react"

const Spline = React.lazy(() => import("@splinetool/react-spline"))

interface HeroSectionProps {
  onOpenTradeModal?: (type: "spot" | "forward") => void
}

export const HeroSection: React.FC<HeroSectionProps> = ({ onOpenTradeModal }) => {
  const handleScrollTo = (id: string) => {
    const el = document.getElementById(id)
    if (el) {
      el.scrollIntoView({ behavior: "smooth" })
    }
  }

  return (
    <section className="relative min-h-screen flex items-end bg-hero-bg overflow-hidden">
      {/* Spline 3D Background (absolute, full-size) */}
      <div className="absolute inset-0">
        <Suspense fallback={<div className="absolute inset-0 bg-hero-bg flex items-center justify-center text-muted-foreground/40 font-mono text-sm">Initializing 3D Compute Core...</div>}>
          <Spline
            scene="https://prod.spline.design/Slk6b8kz3LRlKiyk/scene.splinecode"
            className="w-full h-full"
          />
        </Suspense>
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black/30 z-[1] pointer-events-none" />

      {/* Gradient subtle vignette to blend with bottom content */}
      <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-hero-bg via-hero-bg/70 to-transparent z-[2] pointer-events-none" />

      {/* Content container */}
      <div className="relative z-10 pointer-events-none w-full max-w-[90%] sm:max-w-md lg:max-w-2xl px-6 md:px-10 pb-10 md:pb-10 pt-32">
        {/* Live Network Status Badge */}
        <div 
          className="opacity-0 animate-fade-up inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/50 border border-primary/30 backdrop-blur-md mb-4 text-[11px] font-mono tracking-wider text-primary"
          style={{ animationDelay: "0.1s" }}
        >
          <span className="w-2 h-2 rounded-full bg-primary animate-ping" />
          <span>GPU ORDERBOOK ACTIVE &bull; 8,420 CLUSTERS ONLINE</span>
        </div>

        {/* Heading (delay 0.2s) */}
        <h1
          className="opacity-0 animate-fade-up text-[clamp(3rem,8vw,6rem)] font-bold leading-[1.05] tracking-[-0.05em] text-foreground mb-2 md:mb-4 uppercase"
          style={{ animationDelay: "0.2s" }}
        >
          TERVEX <span className="text-primary">AI</span>
        </h1>

        {/* Subheading (delay 0.4s) */}
        <p
          className="opacity-0 animate-fade-up text-foreground/80 text-[clamp(1.125rem,2.5vw,1.875rem)] font-light mb-3 md:mb-6"
          style={{ animationDelay: "0.4s" }}
        >
          Trade GPU compute. Lock your price. Secure your capacity.
        </p>

        {/* Description (delay 0.55s) */}
        <p
          className="opacity-0 animate-fade-up text-muted-foreground text-[clamp(0.875rem,1.5vw,1.25rem)] font-light mb-4 md:mb-8"
          style={{ animationDelay: "0.55s" }}
        >
          The financial-market marketplace for spot and forward GPU compute. Connect high-performance clusters with AI builders, researchers, and enterprises. Instant discovery, zero-slippage pricing, and verifiable settlement.
        </p>

        {/* Two CTA buttons (delay 0.7s) */}
        <div
          className="opacity-0 animate-fade-up flex flex-wrap gap-3 font-bold"
          style={{ animationDelay: "0.7s" }}
        >
          <button
            onClick={() => {
              if (onOpenTradeModal) onOpenTradeModal("spot")
              else handleScrollTo("marketplace")
            }}
            className="bg-primary text-primary-foreground px-6 py-3 md:px-8 md:py-4 text-sm rounded-sm cursor-pointer hover:brightness-110 transition-all active:scale-[0.97] pointer-events-auto uppercase tracking-wider"
          >
            Explore Marketplace
          </button>
          <button
            onClick={() => {
              if (onOpenTradeModal) onOpenTradeModal("forward")
              else handleScrollTo("forward-contracts")
            }}
            className="bg-white text-background px-6 py-3 md:px-8 md:py-4 text-sm rounded-sm cursor-pointer hover:brightness-90 transition-all active:scale-[0.97] pointer-events-auto uppercase tracking-wider"
          >
            Forward Contracts
          </button>
        </div>

        {/* Trust line (delay 0.85s) */}
        <p
          className="opacity-0 animate-fade-up text-muted-foreground/60 text-xs font-light mt-4 md:mt-6"
          style={{ animationDelay: "0.85s" }}
        >
          Spot & Forward Marketplace &bull; Rust &amp; Tokio Engine &bull; Arbitrum &amp; Solana Settlement &bull; 99.98% SLA
        </p>
      </div>
    </section>
  )
}

export default HeroSection
