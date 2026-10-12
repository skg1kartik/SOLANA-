import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"

interface NavbarProps {
  onOpenCta?: () => void
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenCta }) => {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 40)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const navLinks = [
    { name: "Spot Market", href: "#spot-market" },
    { name: "Forward Contracts", href: "#forward-contracts" },
    { name: "Live Listings", href: "#marketplace" },
    { name: "How It Works", href: "#how-it-works" },
    { name: "Architecture", href: "#architecture" },
    { name: "Calculator", href: "#calculator" },
  ]

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-8 lg:px-16 py-5 transition-all duration-300 ${
        scrolled ? "bg-black/80 backdrop-blur-md border-b border-white/5 py-4" : "bg-transparent"
      }`}
    >
      {/* Left: Logo */}
      <a href="#" className="flex items-center gap-2 group cursor-pointer">
        <div className="w-2.5 h-2.5 rounded-full bg-primary animate-pulse shadow-[0_0_12px_hsl(119_99%_46%)]" />
        <span className="text-foreground text-xl font-semibold tracking-tight">
          TERVE<span className="text-primary font-bold">X</span>
        </span>
        <span className="text-[10px] uppercase font-mono tracking-widest text-primary/80 bg-primary/10 border border-primary/20 px-1.5 py-0.5 rounded ml-1">
          GPU.MARKET
        </span>
      </a>

      {/* Center: Nav links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => (
          <a
            key={link.name}
            href={link.href}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors uppercase tracking-widest font-medium"
          >
            {link.name}
          </a>
        ))}
      </div>

      {/* Right: CTA button */}
      <div>
        <Button
          variant="navCta"
          size="lg"
          onClick={onOpenCta}
          className="hidden md:inline-flex rounded-lg uppercase text-xs tracking-widest px-6"
        >
          Launch Terminal
        </Button>
      </div>
    </nav>
  )
}

export default Navbar
