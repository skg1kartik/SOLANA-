import React, { useState } from "react"
import { Navbar } from "@/components/Navbar"
import { HeroSection } from "@/components/HeroSection"
import { MarketTicker } from "@/components/MarketTicker"
import { CoreMechanisms } from "@/components/CoreMechanisms"
import { MarketplaceExplorer, GpuListing } from "@/components/MarketplaceExplorer"
import { HowItWorks } from "@/components/HowItWorks"
import { ArchitectureSection } from "@/components/ArchitectureSection"
import { ComputeCalculator } from "@/components/ComputeCalculator"
import { ProviderEnterpriseSection } from "@/components/ProviderEnterpriseSection"
import { Footer } from "@/components/Footer"
import { ReservationModal } from "@/components/ReservationModal"

export const Index: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"spot" | "forward" | "provider" | "enterprise">("spot")
  const [selectedData, setSelectedData] = useState<any>(null)

  const handleOpenModal = (mode: "spot" | "forward" | "provider" | "enterprise", data?: any) => {
    setModalMode(mode)
    setSelectedData(data || null)
    setModalOpen(true)
  }

  return (
    <div className="bg-hero-bg min-h-screen">
      {/* Floating fixed Navbar */}
      <Navbar onOpenCta={() => handleOpenModal("spot")} />

      {/* Full-screen Dark Hero with 3D Spline background */}
      <HeroSection onOpenTradeModal={(type) => handleOpenModal(type)} />

      {/* Live Financial Market Ticker & Key Metrics */}
      <MarketTicker />

      {/* Spot vs Forward Core Mechanisms */}
      <CoreMechanisms onSelectAction={(type) => handleOpenModal(type)} />

      {/* Interactive GPU Cluster Orderbook Explorer */}
      <MarketplaceExplorer
        onSelectListing={(listing: GpuListing, mode: "spot" | "forward") => {
          handleOpenModal(mode, listing)
        }}
      />

      {/* How It Works & Architecture Flow */}
      <HowItWorks />

      {/* Rust & Blockchain Technology Stack */}
      <ArchitectureSection />

      {/* Interactive Compute Capacity & Forward Hedge Simulator */}
      <ComputeCalculator
        onLockAgreement={(summary) => {
          handleOpenModal("forward", summary)
        }}
      />

      {/* Provider Onboarding & Enterprise Desk */}
      <ProviderEnterpriseSection
        onOpenModal={(mode) => handleOpenModal(mode)}
      />

      {/* Institutional Footer */}
      <Footer />

      {/* Interactive Execution Terminal / Modal */}
      <ReservationModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        initialMode={modalMode}
        initialData={selectedData}
      />
    </div>
  )
}

export default Index
