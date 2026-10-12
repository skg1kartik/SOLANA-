import React from "react"
import { Terminal, Shield, Database, Cpu, Layers, Link as LinkIcon, Lock, Check } from "lucide-react"

export const ArchitectureSection: React.FC = () => {
  const stackItems = [
    {
      name: "Rust & Tokio",
      role: "Asynchronous Execution Engine",
      desc: "Sub-millisecond order matching and low-overhead concurrency built for millions of concurrent state changes without garbage collection pauses.",
      badge: "Core Backend"
    },
    {
      name: "Axum Framework",
      role: "High-Throughput API Gateway",
      desc: "Ergonomic, memory-safe REST & WebSocket endpoints delivering ultra-low latency compute quotes and booking requests.",
      badge: "Routing & Transport"
    },
    {
      name: "Arbitrum & Solana",
      role: "Cryptographic Settlement",
      desc: "Auditable smart contracts, escrow deposits, and zero-trust compute fulfillment proofs with minimal gas footprints.",
      badge: "Settlement Layer"
    },
    {
      name: "Hyperliquid Integration",
      role: "Decentralized Hedging Protocol",
      desc: "Financial derivative and forward curve primitives allowing GPU providers and buyers to hedge compute token volatility.",
      badge: "Financial Market"
    },
    {
      name: "PostgreSQL & SQLite",
      role: "Relational Ledger Storage",
      desc: "ACID-compliant storage supporting audit trails, multi-tenant reservations, and immutable GPU-hour ledger tracking.",
      badge: "Data Layer"
    },
    {
      name: "Financial Precision Engine",
      role: "Fixed-Precision Math",
      desc: "Representing monetary amounts using integer minor units (nano-cents) preventing floating-point precision loss.",
      badge: "Ledger Safety"
    }
  ]

  const principles = [
    { title: "Modularity", desc: "Listings, orders, reservations, and settlement operate as independent, decoupled services." },
    { title: "Reliability", desc: "Guaranteed protection against double-booking, race conditions, and orphaned allocations." },
    { title: "Transparency", desc: "No hidden egress markups. Real-time GPU telemetry, power status, and benchmark logs." },
    { title: "Financial Precision", desc: "Microsecond accounting with cryptographic verification for every completed GPU-second." }
  ]

  return (
    <section id="architecture" className="py-24 px-6 lg:px-16 bg-hero-bg/95 relative border-t border-border">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <div className="text-primary font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              SYSTEM DESIGN &amp; TECHNOLOGY STACK
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
              Engineered in <span className="text-primary">Rust</span> for Mission-Critical Compute
            </h2>
          </div>
          <p className="text-muted-foreground text-sm font-light max-w-md">
            Architected to eliminate race conditions in GPU reservation management and ensure institutional-grade settlement integrity.
          </p>
        </div>

        {/* Tech Stack Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16">
          {stackItems.map((item, idx) => (
            <div
              key={idx}
              className="p-6 rounded-xl border border-border bg-secondary/20 hover:border-primary/40 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-xs font-mono font-bold text-primary px-2.5 py-1 rounded bg-primary/10 border border-primary/20">
                  {item.badge}
                </span>
                <Terminal className="w-4 h-4 text-muted-foreground/60" />
              </div>
              <h3 className="text-lg font-bold text-foreground mb-1">{item.name}</h3>
              <div className="text-xs font-mono text-muted-foreground mb-3">{item.role}</div>
              <p className="text-xs text-muted-foreground font-light leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        {/* Architecture Principles Bar */}
        <div className="rounded-xl border border-border bg-black/60 p-8">
          <div className="text-xs font-mono uppercase tracking-widest text-primary mb-6 flex items-center gap-2">
            <Shield className="w-4 h-4 text-primary" />
            CORE ENGINEERING PRINCIPLES
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {principles.map((p, idx) => (
              <div key={idx} className="border-l-2 border-primary/40 pl-4">
                <h4 className="text-sm font-bold text-foreground mb-1">{p.title}</h4>
                <p className="text-xs text-muted-foreground font-light leading-relaxed">{p.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default ArchitectureSection
