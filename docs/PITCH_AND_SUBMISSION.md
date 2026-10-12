# TerveX — Hackathon Submission Pack

## One-line pitch
**TerveX helps AI teams compare GPU compute options and estimate spot-style versus forward-style costs through one marketplace workflow.**

## Problem
GPU capacity and pricing can be fragmented across providers. Teams must compare model, memory, region, interconnect, availability and commitment length before selecting infrastructure.

## Proposed solution
A single discovery and decision interface for GPU listings, a cost estimator, buyer reservation requests, and provider/enterprise onboarding. The current prototype demonstrates the core interaction with a Rust API and SQLite persistence.

## Target users
- ML engineers and research teams estimating GPU needs.
- Startups comparing infrastructure options before committing budget.
- GPU infrastructure providers interested in publishing capacity.
- Enterprise teams evaluating longer-duration compute commitments.

## What is implemented in this repository
- React + TypeScript marketplace UI.
- Rust + Axum JSON API backed by SQLite.
- Searchable/filterable seeded GPU listings.
- Indicative spot/forward quote endpoint.
- Reservation, provider application and enterprise inquiry persistence.
- Account registration/login with Argon2 password hashes and 24-hour JWTs.
- Local setup guide, Docker configuration, API docs, smoke tests and GitHub Actions CI.

## What is not implemented yet
No live provider inventory, GPU scheduling/provisioning, payment collection, escrow, smart-contract execution, verified SLA enforcement, real-time telemetry or production-grade account authorization. The product's metrics and seeded listings are illustrative.

## Differentiation hypothesis
TerveX combines capacity discovery with a buyer-facing cost comparison and forward-style commitment concept. This is a product hypothesis to validate with GPU buyers/providers—not a claim of proven savings or a live liquidity network.

## Success metrics to validate after the hackathon
- Time for a user to compare three viable GPU options.
- Quote completion rate.
- Reservation request conversion.
- Provider onboarding completion.
- Difference between estimated and provider-confirmed cost/availability once integrations exist.

## Suggested 30-second pitch
“TerveX is a GPU compute marketplace prototype for AI teams. It brings GPU model, VRAM, region, interconnect and pricing into one discovery flow, then estimates spot-style versus forward-style costs before a user submits a request. We built a React/TypeScript frontend and Rust/Axum API with SQLite persistence and basic JWT-based accounts. The demo is intentionally transparent: inventory and prices are simulated, and requests are saved for review rather than pretending to provision hardware. Our next milestone is provider-owned live inventory and authenticated reservation management.”

## Team submission fields — complete before uploading
- Team name: [FILL IN]
- Team members and roles: [FILL IN]
- Hackathon track: [FILL IN]
- Public repository: [ADD URL]
- Live demo URL: [ADD URL OR “LOCAL DEMO”]
- Demo video: [ADD URL IF REQUIRED]
- Problem/solution summary: adapt the sections above to the organizer's word limit.
- Third-party assets/APIs: list the original UI assets and any services the team actually uses; do not claim integrations that are not in the repository.
