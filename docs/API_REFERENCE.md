# TerveX API Reference

Default local base URL: `http://127.0.0.1:3000/api`

All request bodies are JSON. Errors generally use `{ "error": "message" }`.

| Method | Route | Purpose |
|---|---|---|
| GET | `/health` | API liveness |
| GET | `/listings?search=H100&region=Europe&limit=10&offset=0` | Filter/paginate GPU listings |
| GET | `/listings/{id}` | Retrieve one listing |
| POST | `/compute/quote` | Indicative spot/forward cost estimate |
| POST | `/reservations` | Save a reservation request as pending review |
| POST | `/providers/applications` | Save a provider application |
| POST | `/enterprise/inquiries` | Save an enterprise inquiry |
| GET | `/market-metrics` | Illustrative demo metrics |
| POST | `/auth/register` | Create user/provider account |
| POST | `/auth/login` | Sign in and receive JWT |
| GET | `/auth/me` | Validate bearer token and return account |

## Quote example
`POST /compute/quote`
```json
{ "model": "H100", "gpu_count": 2, "hours": 10 }
```
For the current illustrative H100 spot rate of `$2.24/GPU-hour`, the spot estimate is `$44.80`; the response includes `demoPricing: true`. Forward estimates use a separate fixed illustrative rate.

## Registration example
`POST /auth/register`
```json
{ "name": "Demo User", "email": "demo@example.com", "password": "DemoPass123!", "role": "user" }
```
Roles supported by the current registration route: `user`, `provider`. Use `Authorization: Bearer <token>` for `/auth/me`. Do not commit or share tokens.

## Important API limitations
- Public inventory and metrics are seeded demo content.
- Reservation submission is not GPU provisioning; it only saves a pending request.
- The current listing creation route is a prototype and must be protected with provider authorization before any public deployment.
- CORS is currently permissive for local demonstration; production origins should be allow-listed.
- Authentication lacks rate limiting, email verification, password reset, and refresh/revocation support.
