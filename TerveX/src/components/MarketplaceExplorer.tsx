import React, { useState, useMemo, useEffect } from "react"
import { api } from "@/lib/api"
import { Search, Filter, Server, MapPin, Zap, Calendar, ShieldCheck, ArrowUpRight, Cpu } from "lucide-react"

export interface GpuListing {
  id: string
  model: string
  count: number
  vram: string
  interconnect: string
  region: string
  location: string
  datacenter: string
  spotRate: number
  forward30dRate: number
  availableHours: number
  tier: "Tier IV" | "Tier III+" | "Tier III"
  provider: string
  verified: boolean
  minCommitment: string
}

interface MarketplaceExplorerProps {
  onSelectListing?: (listing: GpuListing, mode: "spot" | "forward") => void
}

export const MarketplaceExplorer: React.FC<MarketplaceExplorerProps> = ({ onSelectListing }) => {
  const [listings, setListings] = useState<GpuListing[]>([])
  const [loading, setLoading] = useState(true)
  const [apiError, setApiError] = useState("")
  useEffect(() => {
    let active = true
    api.getListings().then((result) => { if (active) { setListings(result.items); setApiError("") } })
      .catch((error: Error) => { if (active) setApiError(error.message) })
      .finally(() => { if (active) setLoading(false) })
    return () => { active = false }
  }, [])

  const [selectedModel, setSelectedModel] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredListings = useMemo(() => {
    return listings.filter((item) => {
      const matchModel = selectedModel === "all" || item.model.toLowerCase().includes(selectedModel.toLowerCase())
      const matchRegion = selectedRegion === "all" || item.region === selectedRegion
      const matchSearch =
        searchQuery === "" ||
        item.model.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.provider.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.interconnect.toLowerCase().includes(searchQuery.toLowerCase())
      return matchModel && matchRegion && matchSearch
    })
  }, [listings, selectedModel, selectedRegion, searchQuery])

  return (
    <section id="marketplace" className="py-24 px-6 lg:px-16 bg-hero-bg/95 relative border-t border-border">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
          <div>
            <div className="text-primary font-mono text-xs uppercase tracking-widest mb-3 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              LIVE ORDERBOOK DISCOVERY
            </div>
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight text-foreground uppercase">
              GPU Cluster <span className="text-primary">Marketplace</span>
            </h2>
          </div>
          <div className="text-muted-foreground text-sm font-light max-w-md">
            Browse illustrative GPU listings and submit spot or forward compute requests for review. Inventory and provider details are seeded demo data.
          </div>
        </div>

        {apiError && <div role="alert" className="mb-5 rounded-lg border border-destructive/40 bg-destructive/10 px-4 py-3 text-sm text-foreground">{apiError}</div>}
        {loading && <div className="mb-5 rounded-lg border border-border bg-secondary/30 px-4 py-3 text-sm text-muted-foreground">Loading GPU listings from the TerveX backend…</div>}
        {!loading && !apiError && <div className="mb-5 text-[11px] font-mono uppercase tracking-wider text-muted-foreground">Seeded demo inventory — not live or verified availability</div>}

        {/* Filters and Search Bar */}
        <div className="bg-secondary/30 p-4 rounded-xl border border-border mb-8 flex flex-col lg:flex-row items-stretch lg:items-center gap-4">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-muted-foreground absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Filter by GPU, interconnect, provider, or location..."
              className="w-full pl-10 pr-4 py-2 bg-black/40 border border-border rounded-lg text-sm text-foreground placeholder:text-muted-foreground/60 focus:outline-none focus:border-primary transition-colors font-mono"
            />
          </div>

          {/* Model Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono shrink-0">Model:</span>
            <select
              value={selectedModel}
              onChange={(e) => setSelectedModel(e.target.value)}
              className="bg-black/40 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono cursor-pointer"
            >
              <option value="all">All Models</option>
              <option value="H100">NVIDIA H100</option>
              <option value="B200">NVIDIA B200</option>
              <option value="A100">NVIDIA A100</option>
              <option value="GH200">GH200 Grace Hopper</option>
              <option value="L40S">NVIDIA L40S</option>
            </select>
          </div>

          {/* Region Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-muted-foreground uppercase tracking-wider font-mono shrink-0">Region:</span>
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="bg-black/40 border border-border rounded-lg px-3 py-2 text-xs text-foreground focus:outline-none focus:border-primary font-mono cursor-pointer"
            >
              <option value="all">Global (All Regions)</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
              <option value="Asia-Pacific">Asia-Pacific</option>
            </select>
          </div>

          {/* Active Results Count */}
          <div className="px-3 py-2 rounded bg-primary/10 border border-primary/20 text-primary text-xs font-mono font-medium tracking-wider text-center shrink-0">
            {filteredListings.length} NODES MATCHED
          </div>
        </div>

        {/* Listings Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {!loading && !apiError && filteredListings.length === 0 && <div className="col-span-full rounded-xl border border-border p-8 text-center text-sm text-muted-foreground">No GPU listings match these filters.</div>}
          {filteredListings.map((listing) => (
            <div
              key={listing.id}
              className="rounded-xl border border-border bg-secondary/20 hover:border-primary/50 transition-all duration-300 p-6 flex flex-col justify-between group hover:shadow-[0_4px_24px_rgba(0,0,0,0.5)]"
            >
              <div>
                {/* Top Badge Row */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-[11px] font-mono text-muted-foreground bg-white/5 px-2 py-0.5 rounded border border-white/5">
                    <Server className="w-3 h-3 text-primary" />
                    <span>{listing.count}x {listing.model.split(" ")[1]} Cluster</span>
                  </div>
                  <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                    {listing.tier}
                  </span>
                </div>

                {/* Title & VRAM */}
                <h3 className="text-lg font-bold text-foreground mb-1 group-hover:text-primary transition-colors flex items-center justify-between">
                  <span>{listing.model}</span>
                </h3>
                <div className="text-xs text-muted-foreground font-mono mb-4">{listing.vram}</div>

                {/* Specs List */}
                <div className="space-y-2 mb-6 text-xs text-muted-foreground border-y border-border py-3">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{listing.location} &bull; {listing.datacenter}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Cpu className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate">{listing.interconnect}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-3.5 h-3.5 text-primary shrink-0" />
                    <span className="truncate font-mono">{listing.provider} ({listing.verified ? "Demo listing" : "Unverified"})</span>
                  </div>
                </div>

                {/* Dual Pricing: Spot vs Forward */}
                <div className="grid grid-cols-2 gap-3 mb-6 bg-black/40 p-3 rounded-lg border border-border">
                  <div>
                    <div className="text-[10px] uppercase font-mono text-muted-foreground flex items-center gap-1">
                      <Zap className="w-3 h-3 text-white" /> Spot Rate
                    </div>
                    <div className="text-lg font-bold font-mono text-foreground">
                      ${listing.spotRate.toFixed(2)}<span className="text-[10px] font-normal text-muted-foreground">/hr</span>
                    </div>
                    <div className="text-[10px] text-muted-foreground/70 font-mono">Immediate burst</div>
                  </div>

                  <div className="border-l border-border pl-3">
                    <div className="text-[10px] uppercase font-mono text-primary flex items-center gap-1">
                      <Calendar className="w-3 h-3 text-primary" /> Fwd 30-Day
                    </div>
                    <div className="text-lg font-bold font-mono text-primary">
                      ${listing.forward30dRate.toFixed(2)}<span className="text-[10px] font-normal text-muted-foreground">/hr</span>
                    </div>
                    <div className="text-[10px] text-primary/70 font-mono">Save ~{Math.round(((listing.spotRate - listing.forward30dRate) / listing.spotRate) * 100)}%</div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-2">
                <button
                  onClick={() => onSelectListing && onSelectListing(listing, "spot")}
                  className="flex-1 py-2 px-3 rounded bg-secondary/80 hover:bg-secondary text-foreground text-xs font-semibold uppercase tracking-wider border border-border transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98]"
                >
                  Spot Reserve
                </button>
                <button
                  onClick={() => onSelectListing && onSelectListing(listing, "forward")}
                  className="flex-1 py-2 px-3 rounded bg-primary hover:brightness-110 text-primary-foreground text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1 cursor-pointer active:scale-[0.98]"
                >
                  Forward Lock <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default MarketplaceExplorer
