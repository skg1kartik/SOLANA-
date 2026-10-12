# Security, Privacy and Prototype Limitations

## Current safeguards
- Passwords are hashed with Argon2 rather than stored as plain text.
- JWTs expire after 24 hours.
- SQL queries use SQLx bind parameters for user-provided values in the main data flows.
- Request inputs have basic length/range validation.

## Required before a public production launch
1. Require a unique, secret `JWT_SECRET` (32+ characters; use a secret manager in hosted environments). Never deploy the development fallback.
2. Restrict CORS to trusted origins; require HTTPS.
3. Add rate limiting and abuse protection to registration/login and form endpoints.
4. Add email verification, password reset, session revocation and account deletion. Review whether HttpOnly Secure SameSite cookies are preferable to localStorage JWTs.
5. Enforce provider role checks on listing creation and ownership checks on all provider/user resources. The current listing creation endpoint is not production-authorized.
6. Link requests to authenticated users; restrict access to request records and add audit logs.
7. Add automated tests, dependency scanning, backups, database migration discipline, structured logs and monitoring.
8. Perform security review and privacy/legal review before accepting real customer data or payments.

## Product truthfulness
- Listings and market metrics are seeded/simulated.
- Prices are fixed illustrative estimates. They are not provider-confirmed and are not binding.
- Reservations are stored as `pending_review`; there is no real allocation, payment, escrow or contract execution.
- Provider application is a form submission, not a verified provider onboarding process.

This document is not a security audit or legal advice.
