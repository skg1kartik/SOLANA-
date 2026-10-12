# Likely Hackathon Judge Questions — Suggested Answers

**What problem are you solving?**
GPU capacity discovery and price comparison are fragmented. TerveX prototypes a common discovery and cost-estimation flow.

**Is this connected to real GPUs?**
Not yet. The listings and metrics are seeded illustrative data. Provider integrations and real-time capacity verification are planned milestones.

**Can it actually provision a GPU?**
No. It persists reservation requests with a pending-review status. Scheduling, provider credentials, isolation and provisioning are not implemented.

**How is the estimate calculated?**
GPU count × requested hours × the model's fixed illustrative per-GPU-hour rate. The API returns spot and forward estimates and marks them as demo pricing.

**How do you store passwords?**
The backend uses Argon2 password hashing and issues a signed JWT that expires after 24 hours. This is prototype authentication; production requires more controls.

**Why Rust?**
Rust provides memory safety and strong type checking; Axum/Tokio provide an asynchronous API foundation. It is a design choice, not a benchmark claim.

**Why SQLite?**
It keeps the hackathon demo simple and reproducible with minimal setup. A production multi-tenant marketplace would likely move to a managed relational database with migrations, backups and operational monitoring.

**How would you prevent fake listings?**
The current prototype does not yet verify providers. A production design would require provider identity checks, inventory attestations, periodic availability checks and a moderation/audit process.

**How would you prevent double-booking?**
Not implemented yet. The production scheduler would need transactional capacity reservations, idempotency keys, expiration/lease handling and provider-side confirmation.

**How do you make money?**
Potential future models include a transaction fee or provider subscription, but this requires user/provider validation and should not be presented as established revenue.

**What is the next milestone?**
Provider-owned authenticated listing management, user-owned request history, then a real provider integration with verified availability and provisioning.
