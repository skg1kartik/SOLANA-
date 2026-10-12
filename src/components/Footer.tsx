import React from "react"
import { Terminal, Shield, ArrowUpRight } from "lucide-react"

export const Footer: React.FC = () => {
  return (
    <footer className="bg-black/90 border-t border-border pt-16 pb-12 px-6 lg:px-16 text-foreground">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-16">
          {/* Brand Col */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_hsl(119_99%_46%)]" />
              <span className="text-foreground text-xl font-semibold tracking-tight">
                TERVE<span className="text-primary font-bold">X</span>
              </span>
              <span className="text-[10px] uppercase font-mono tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded ml-1">
                GPU.MARKET
              </span>
            </div>
            <p className="text-xs text-muted-foreground font-light leading-relaxed mb-6 max-w-sm">
              The financial-grade marketplace for spot and forward GPU compute. Trade capacity. Lock your pricing. Eliminate AI infrastructure uncertainty.
            </p>

            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-secondary/40 border border-border text-[11px] font-mono text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-primary" />
              <span>Rust Matching Engine: <span className="text-primary">100% Operational</span></span>
            </div>
          </div>

          {/* Links 1: Marketplace */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-foreground font-semibold mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-light">
              <li><a href="#spot-market" className="hover:text-foreground transition-colors">Spot Compute Index</a></li>
              <li><a href="#forward-contracts" className="hover:text-foreground transition-colors">Forward Agreements</a></li>
              <li><a href="#marketplace" className="hover:text-foreground transition-colors">H100 &amp; B200 Clusters</a></li>
              <li><a href="#calculator" className="hover:text-foreground transition-colors">Hedging Simulator</a></li>
              <li><a href="#marketplace" className="hover:text-foreground transition-colors">InfiniBand Topologies</a></li>
            </ul>
          </div>

          {/* Links 2: Architecture & Tech */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-foreground font-semibold mb-4">
              Architecture
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-light">
              <li><a href="#architecture" className="hover:text-foreground transition-colors">Rust &amp; Tokio Backend</a></li>
              <li><a href="#architecture" className="hover:text-foreground transition-colors">Axum API Endpoints</a></li>
              <li><a href="#architecture" className="hover:text-foreground transition-colors">Arbitrum Settlement</a></li>
              <li><a href="#architecture" className="hover:text-foreground transition-colors">Solana Escrow Engine</a></li>
              <li><a href="#architecture" className="hover:text-foreground transition-colors">Hyperliquid Hedging</a></li>
            </ul>
          </div>

          {/* Links 3: Ecosystem */}
          <div>
            <h4 className="text-xs uppercase font-mono tracking-widest text-foreground font-semibold mb-4">
              Community &amp; Code
            </h4>
            <ul className="space-y-2 text-xs text-muted-foreground font-light">
              <li>
                <a href="https://github.com/skg1kartik/TerveX" target="_blank" rel="noreferrer" className="hover:text-foreground transition-colors flex items-center gap-1">
                  GitHub Repository <ArrowUpRight className="w-3 h-3 text-primary" />
                </a>
              </li>
              <li><a href="#how-it-works" className="hover:text-foreground transition-colors">Marketplace Specs</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Provider Node Daemon</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">Security Whitepaper</a></li>
              <li><a href="#" className="hover:text-foreground transition-colors">API Documentation</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-muted-foreground">
          <div>
            &copy; {new Date().getFullYear()} TerveX Technologies. Compute is a resource. Its price and availability can be planned.
          </div>
          <div className="flex items-center gap-6">
            <span className="text-muted-foreground/60">Privacy Policy</span>
            <span className="text-muted-foreground/60">Terms of Service</span>
            <span className="text-muted-foreground/60">Zero-Trust SLA</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
