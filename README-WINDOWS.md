# TerveX — Hackathon Demo

**GPU compute discovery and cost-estimation marketplace prototype.** This repository combines a React/TypeScript frontend with a Rust/Axum API and SQLite persistence.

> **Demo honesty:** the GPU listings, market metrics and prices are illustrative seeded data. Quote calculations are not binding offers. Reservation submissions are saved as `pending_review`; the app does not provision hardware, charge payments, run escrow or execute contracts.

## Features in this prototype
- GPU listing exploration and search/filter support.
- Indicative spot-style vs forward-style cost estimation.
- Reservation requests, provider applications and enterprise inquiries stored in SQLite.
- Account registration/login, Argon2 password hashing and 24-hour JWT sessions.
- Rust REST API, API smoke-test script, Docker Compose option, and GitHub Actions CI.
- Hackathon pitch, architecture, API, demo script, judge Q&A and release checklists in `docs/`.

## Option A — Run locally on Windows

### Requirements
- Node.js 22 or newer (Node 22 recommended).
- Rust stable toolchain (install through rustup; ensure `cargo` is available in PowerShell).

### 1. Start the API
Open PowerShell window 1 from the extracted project root:

```powershell
cd .\tervex-backend
$env:JWT_SECRET = "local-demo-secret-change-this-to-a-random-string-123456789"
cargo run
```

Keep the terminal open. The API listens on `http://127.0.0.1:3000`. The first run compiles Rust dependencies.

Test health from a second terminal:

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
```

### 2. Start the frontend
Open PowerShell window 2 at the extracted project root:

```powershell
cd .\TerveX
npm ci
npm run dev
```

Open the Vite URL printed in the terminal (usually `http://localhost:5173`). The frontend defaults to `http://127.0.0.1:3000/api`. If your API is hosted elsewhere, set `VITE_API_BASE_URL` before building/running.

### 3. Run the smoke test
From the extracted project root, with the API running:

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1
```

### If port 3000 is already in use
Stop the other API terminal with `Ctrl+C`. Or set a different backend port and matching frontend `VITE_API_BASE_URL`; the frontend URL must match the port.

## Option B — Docker Compose

Install Docker Desktop, then from the project root:

```powershell
Copy-Item .env.docker.example .env
notepad .env
```

Replace `JWT_SECRET` with a unique random secret of 32+ characters, save, then run:

```powershell
docker compose up --build
```

Open `http://localhost:8080`; API is available at `http://localhost:3000/api`. Stop with `Ctrl+C` and run `docker compose down` when finished. Persistent demo database data is kept in the Compose volume. The Docker web build embeds the API URL `http://localhost:3000/api`, intended for local judging on the same machine.

## Submission documentation
- `docs/PITCH_AND_SUBMISSION.md` — pitch, problem, solution and fields to complete.
- `docs/HACKATHON_DEMO_SCRIPT.md` — 3-minute talk track and fallback.
- `docs/TECHNICAL_ARCHITECTURE.md` — system design and current request lifecycle.
- `docs/API_REFERENCE.md` — API endpoints and examples.
- `docs/JUDGE_QA.md` — likely judge questions and honest answers.
- `docs/TESTING_CHECKLIST.md` — smoke/manual/release checks.
- `docs/SECURITY_AND_LIMITATIONS.md` — current safeguards and production gaps.
- `docs/RELEASE_CHECKLIST.md` — final submission checklist.

## Current limitations (important)
This is a hackathon prototype, not a production GPU marketplace. Provider listings are not yet protected by server-side role authorization, reservation requests are not tied to an authenticated owner, and live provider APIs, scheduling, payments, escrow, SLA enforcement, monitoring and production security hardening are not implemented. See `docs/SECURITY_AND_LIMITATIONS.md`.

## Suggested demo order
1. Open marketplace and explain the seeded data.
2. Search/filter a GPU option.
3. Calculate a spot vs forward estimate and explain the illustrative rates.
4. Register/sign in.
5. Submit a reservation and point out `pending_review`.
6. Explain the React → Rust API → SQLite architecture and next milestones.

Before submitting, complete the team-specific fields and verify the organizer's exact submission requirements.
