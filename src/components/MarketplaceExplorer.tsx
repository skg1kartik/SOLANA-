import React, { useState, useMemo } from "react"
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

const INITIAL_LISTINGS: GpuListing[] = [
  {
    id: "tx-gpu-01",
    model: "NVIDIA H100 SXM5",
    count: 8,
    vram: "80GB HBM3 (640GB Total)",
    interconnect: "3.2 Tbps Quantum-2 InfiniBand / 900 GB/s NVLink",
    region: "North America",
    location: "US-East (Virginia)",
    datacenter: "Equinix DC11",
    spotRate: 2.24,
    forward30dRate: 1.95,
    availableHours: 4200,
    tier: "Tier IV",
    provider: "ApexCompute Infrastructure",
    verified: true,
    minCommitment: "1 Hour (Spot) / 168 Hrs (Fwd)",
  },
  {
    id: "tx-gpu-02",
    model: "NVIDIA B200 NVL",
    count: 8,
    vram: "192GB HBM3e (1.5TB Total)",
    interconnect: "Dual 800 Gbps OSFP / NVLink 5.0 (1.8 TB/s)",
    region: "Europe",
    location: "EU-West (Dublin)",
    datacenter: "Digital Realty DUB1",
    spotRate: 3.85,
    forward30dRate: 3.40,
    availableHours: 1840,
    tier: "Tier IV",
    provider: "Helios Cloud GmbH",
    verified: true,
    minCommitment: "4 Hours (Spot) / 336 Hrs (Fwd)",
  },
  {
    id: "tx-gpu-03",
    model: "NVIDIA A100 SXM4",
    count: 8,
    vram: "80GB HBM2e (640GB Total)",
    interconnect: "1.6 Tbps HDR InfiniBand / 600 GB/s NVLink",
    region: "North America",
    location: "US-Central (Texas)",
    datacenter: "CyrusOne DFW",
    spotRate: 1.15,
    forward30dRate: 0.94,
    availableHours: 12500,
    tier: "Tier III+",
    provider: "TerraCore Datacenters",
    verified: true,
    minCommitment: "1 Hour (Spot) / 72 Hrs (Fwd)",
  },
  {
    id: "tx-gpu-04",
    model: "NVIDIA GH200 Grace Hopper",
    count: 1,
    vram: "96GB HBM3 + 480GB LPDDR5X",
    interconnect: "NVLink-C2C 900 GB/s Coherent Memory",
    region: "Asia-Pacific",
    location: "AP-East (Tokyo)",
    datacenter: "NTT Communications TY5",
    spotRate: 3.10,
    forward30dRate: 2.70,
    availableHours: 2900,
    tier: "Tier IV",
    provider: "Tokyo SuperCluster Ltd",
    verified: true,
    minCommitment: "2 Hours (Spot) / 120 Hrs (Fwd)",
  },
  {
    id: "tx-gpu-05",
    model: "NVIDIA L40S",
    count: 4,
    vram: "48GB GDDR6 (192GB Total)",
    interconnect: "PCIe Gen 4 x16 / 100 GbE Dual RoCE",
    region: "Europe",
    location: "EU-Central (Frankfurt)",
    datacenter: "Interxion FRA1",
    spotRate: 0.82,
    forward30dRate: 0.68,
    availableHours: 8700,
    tier: "Tier III+",
    provider: "Kaiser AI Hosting",
    verified: true,
    minCommitment: "1 Hour (Spot) / 48 Hrs (Fwd)",
  },
  {
    id: "tx-gpu-06",
    model: "NVIDIA H100 PCIe",
    count: 4,
    vram: "80GB HBM2e (320GB Total)",
    interconnect: "Dual 400 Gbps ConnectX-7",
    region: "North America",
    location: "US-West (Oregon)",
    datacenter: "Flexential PDX",
    spotRate: 1.88,
    forward30dRate: 1.60,
    availableHours: 5100,
    tier: "Tier III",
    provider: "Cascades Compute Co",
    verified: true,
    minCommitment: "1 Hour (Spot) / 72 Hrs (Fwd)",
  },
]

interface MarketplaceExplorerProps {
  onSelectListing?: (listing: GpuListing, mode: "spot" | "forward") => void
}

export const MarketplaceExplorer: React.FC<MarketplaceExplorerProps> = ({ onSelectListing }) => {
  const [selectedModel, setSelectedModel] = useState<string>("all")
  const [selectedRegion, setSelectedRegion] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState<string>("")

  const filteredListings = useMemo(() => {
    return INITIAL_LISTINGS.filter((item) => {
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
  }, [selectedModel, selectedRegion, searchQuery])

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
            Directly reserve instant spot nodes or submit cryptographic forward capacity agreements with vetted Tier III &amp; IV infrastructure providers.
          </div>
        </div>

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
                    <span className="truncate font-mono">{listing.provider} (Verified)</span>
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
