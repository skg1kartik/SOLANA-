# How to Run TerveX

This project is a full-screen dark landing page and marketplace portal for **TerveX** (The Marketplace for Spot and Forward GPU Compute), built with **React**, **Vite**, **TypeScript**, **Tailwind CSS**, **shadcn/ui**, and an embedded interactive **Spline 3D** scene.

---

## ⚡ Prerequisites

Ensure you have Node.js and npm installed on your machine:
- **Node.js**: v18.0.0 or higher (v20+ recommended)
- **npm**: v9.0.0 or higher

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
Clone the repository (if not already local) and install the packages:

```bash
npm install --legacy-peer-deps
```

> **Note:** `--legacy-peer-deps` ensures seamless peer dependency resolution between `@splinetool/react-spline` and the latest React packages.

---

### 2. Run the Development Server
Launch the local Vite development server with hot module reloading (HMR):

```bash
npm run dev
```

The application will be running at:
```
http://localhost:5173/
```
Or accessible via local network:
```
http://127.0.0.1:5173/
```

---

### 3. Build for Production
To compile and bundle TypeScript and assets for production:

```bash
npm run build
```

This generates an optimized production bundle inside the `dist/` directory.

---

### 4. Preview Production Build Locally
To test the production build locally before deployment:

```bash
npm run preview
```

---

## 🛠️ Tech Stack & Key Libraries

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vite.dev/) + [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with customized dark theme tokens and `tailwindcss-animate`
- **Typography**: Google Fonts [Sora](https://fonts.google.com/specimen/Sora) (300, 400, 500, 600, 700)
- **3D Interactive Scene**: [`@splinetool/react-spline`](https://spline.design/) embedded background core
- **UI & Variants**: `class-variance-authority`, `clsx`, `tailwind-merge`, and custom shadcn/ui components
- **Icons**: `lucide-react`

---

## 🧭 Project Architecture

```
TerveX/
├── index.html                   # HTML entry point with Sora Google Fonts preconnect
├── package.json                 # Project dependencies & scripts
├── postcss.config.js            # PostCSS configuration
├── tailwind.config.js           # Tailwind theme configuration (HSL tokens & animations)
├── tsconfig.json                # TypeScript root configuration
├── tsconfig.app.json            # Vite client TypeScript compiler settings
├── vite.config.ts               # Vite configuration with @ path alias
├── run.md                       # Project run instructions
├── src/
│   ├── main.tsx                 # Application entry point
│   ├── App.tsx                  # Root App component
│   ├── index.css                # Base stylesheet with HSL color variables
│   ├── lib/
│   │   └── utils.ts             # Tailwind class merger utility
│   ├── components/
│   │   ├── Navbar.tsx           # Floating fixed navigation bar with navCta variant
│   │   ├── HeroSection.tsx      # Full-screen dark hero with 3D Spline background & fluid typography
│   │   ├── MarketTicker.tsx     # Real-time streaming GPU benchmark index & network metrics
│   │   ├── CoreMechanisms.tsx   # Spot vs Forward compute mechanisms deep dive
│   │   ├── MarketplaceExplorer.tsx # Interactive live GPU cluster orderbook & filters
│   │   ├── HowItWorks.tsx       # 4-step marketplace flow & foundation training case study
│   │   ├── ArchitectureSection.tsx # High-throughput Rust, Tokio, Axum, Arbitrum/Solana stack
│   │   ├── ComputeCalculator.tsx# Interactive capacity planning & forward hedging simulator
│   │   ├── ProviderEnterpriseSection.tsx # Infrastructure provider onboarding & enterprise desk
│   │   ├── ReservationModal.tsx # Interactive terminal modal for instant order submissions
│   │   ├── Footer.tsx           # Institutional footer with live network status
│   │   └── ui/
│   │       └── button.tsx       # shadcn/ui Button with navCta, hero, and heroOutline variants
│   └── pages/
│       └── Index.tsx            # Full homepage wrapper assembling all components
```
