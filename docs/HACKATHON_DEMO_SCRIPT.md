# TerveX — 3-minute live demo script

## Before judges arrive
- Start the Rust API and the frontend; open the homepage in a fresh browser tab.
- Run `powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1` from the repository root while the API is running.
- Keep the API terminal visible so the judges can see the real service is running.
- Use a disposable `example.test` email and demo-only password. Never show personal credentials or a JWT.
- Say explicitly that the listings, market metrics and rates are simulated demo data.

## Talk track
**0:00–0:25 — Problem**
“AI teams need GPUs for training and inference, but comparing fragmented capacity, regions, memory and pricing can be difficult. TerveX is a marketplace prototype that puts capacity discovery and cost comparison into one workflow.”

**0:25–1:00 — Discovery**
“Here is the marketplace. I can search/filter available GPU configurations and compare model, VRAM, interconnect, region, provider tier and hourly pricing. The current inventory is seeded demo data, so this demonstrates the product flow rather than claiming live provider connectivity.”

**1:00–1:35 — Cost decision**
“I’ll compare spot-style usage with a forward-style estimate. The API calculates GPU-hours and estimated cost. For example, two H100 GPUs for ten hours at the demo spot rate of $2.24 per GPU-hour gives 20 GPU-hours and $44.80. These rates are illustrative, not binding offers.”

**1:35–2:10 — Workflow + account**
“I can create an account and sign in; passwords are stored as Argon2 hashes and the API issues a time-limited JWT. Submitting a reservation records a pending-review request. This version does not actually allocate a GPU, charge a card, or execute a contract.”

**2:10–2:40 — Engineering**
“The UI is React and TypeScript; the API is Rust with Axum and Tokio; SQLx persists listings and requests in SQLite. The frontend and API are separate services, and the repository includes a smoke-test script and CI workflow.”

**2:40–3:00 — Next steps**
“The next production milestones are authenticated provider inventory management, account-owned reservation history, real provider integrations and live availability, then secure provisioning and billing. We have separated what is implemented from what is planned.”

## Fallback if Wi-Fi or a service fails
- Show the architecture and API reference docs.
- Run the smoke test and show its result if the API is up.
- Do not fake a live result; state which component failed and continue with screenshots or a recorded demo prepared by the team.
