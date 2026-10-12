# TerveX Backend (Rust + Axum + SQLite)

A runnable backend starter for the TerveX GPU marketplace frontend. It provides a REST API, stores seeded demo listings in SQLite, persists reservation/provider/enterprise requests, and calculates illustrative spot-versus-forward quotes.

> **Prototype limitations:** the seeded providers, inventory, rates, and market metrics are illustrative demo data. This backend does not allocate GPUs, verify providers, charge payments, execute forward contracts, provide escrow, or guarantee an SLA. Requests are saved with `pending_review` status.

## Requirements

- Rust stable toolchain (`rustup` / `cargo`)
- Windows 11 PowerShell, macOS, or Linux

## Run on Windows PowerShell

Open PowerShell in the folder where you extracted this backend (not `C:\Windows\System32`):

```powershell
cd path\to\tervex-backend
cargo run
```

The first run downloads and compiles dependencies and may take a few minutes. SQLite is created automatically at `data\tervex.db`; the six illustrative listings are inserted the first time only. Stop the server with `Ctrl+C`.

Optional configuration: copy `.env.example` to `.env` and set environment variables in your terminal as needed. The current starter reads environment variables directly; it does not automatically parse `.env` files.

```powershell
$env:DATABASE_URL = "sqlite://data/tervex.db"
$env:HOST = "127.0.0.1"
$env:PORT = "3000"
cargo run
```

## API endpoints

Base URL: `http://127.0.0.1:3000/api`

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/health` | Health check |
| GET | `/listings` | List demo listings; supports `model`, `region`, `search`, `limit`, `offset` |
| GET | `/listings/{id}` | Get a listing |
| POST | `/listings` | Add a listing (marks it as non-demo) |
| POST | `/reservations` | Save a spot or forward request as `pending_review` |
| POST | `/providers/applications` | Save provider onboarding application |
| POST | `/enterprise/inquiries` | Save enterprise enquiry |
| POST | `/compute/quote` | Calculate illustrative pricing |
| GET | `/market-metrics` | Return explicitly labelled illustrative metrics |

## Quick tests (PowerShell)

```powershell
Invoke-RestMethod http://127.0.0.1:3000/api/health
Invoke-RestMethod http://127.0.0.1:3000/api/listings
Invoke-RestMethod "http://127.0.0.1:3000/api/listings?model=H100&region=North%20America"
```

Calculate a quote:

```powershell
$body = @{ model = "H100"; gpu_count = 8; hours = 168 } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/api/compute/quote -ContentType "application/json" -Body $body
```

Save a reservation request:

```powershell
$body = @{
  listing_id = "tx-gpu-01"
  mode = "spot"
  cluster_model = "8x H100 SXM5"
  duration = "24 Hours (Immediate)"
  email = "student@example.com"
  gpu_count = 8
  estimated_total = 4300.80
} | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:3000/api/reservations -ContentType "application/json" -Body $body
```

The response should say `pending_review`, not that compute has been allocated.

## Frontend connection

Set the frontend's API base URL to `http://127.0.0.1:3000/api`. The listings response is wrapped as `{ items: [...], count, limit, offset, dataType }`; the listing fields use the frontend's camelCase names (`spotRate`, `forward30dRate`, `availableHours`, `minCommitment`). For the calculator, send `{ "model": "H100", "gpu_count": 8, "hours": 168 }` to `/compute/quote`. Reservation modal submissions should call the relevant POST endpoint and display the API response, including errors, rather than immediately showing a simulated success state.

CORS is permissive for local development. Before production, restrict allowed origins, add authentication/authorization, rate limiting, stronger email validation, secrets management, monitoring, and a real provider/inventory verification workflow.
