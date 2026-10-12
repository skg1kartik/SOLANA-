import React, { useEffect, useState } from "react"
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
import { AuthPanel } from "@/components/AuthPanel"
import { authApi, AUTH_TOKEN_KEY, type AuthUser } from "@/lib/api"

export const Index: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<"spot" | "forward" | "provider" | "enterprise">("spot")
  const [selectedData, setSelectedData] = useState<any>(null)
  const [authOpen, setAuthOpen] = useState(false)
  const [authUser, setAuthUser] = useState<AuthUser | null>(null)

  useEffect(() => {
    const token = localStorage.getItem(AUTH_TOKEN_KEY)
    if (!token) return
    authApi.me(token).then(({ user }) => { setAuthUser(user) }).catch(() => {
      localStorage.removeItem(AUTH_TOKEN_KEY)
    })
  }, [])

  const handleSignOut = () => {
    localStorage.removeItem(AUTH_TOKEN_KEY)
    setAuthUser(null)
  }

  const handleOpenModal = (mode: "spot" | "forward" | "provider" | "enterprise", data?: any) => {
    setModalMode(mode)
    setSelectedData(data || null)
    setModalOpen(true)
  }

  return (
    <div className="bg-hero-bg min-h-screen">
      {/* Floating fixed Navbar */}
      <Navbar onOpenCta={() => handleOpenModal("spot")} onOpenAuth={() => setAuthOpen(true)} user={authUser} />

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
      <AuthPanel
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        user={authUser}
        onAuthenticated={(user, token) => { setAuthUser(user) }}
        onSignOut={handleSignOut}
      />

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
