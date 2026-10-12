# Test and Demo Checklist

## Automated smoke test
1. Start API at `http://127.0.0.1:3000`.
2. From repository root run: `powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1`.
3. Confirm all checks pass. This tests API availability, listings, quote arithmetic, registration, protected account lookup and reservation persistence.

## Manual frontend acceptance checklist
- [ ] Homepage loads without a blank screen or console errors.
- [ ] Marketplace shows seeded demo listings and search/filter controls work.
- [ ] A listing detail/selection can be used to open the reservation flow.
- [ ] Quote calculator updates estimates for supported models/counts/hours.
- [ ] Sign-up accepts a valid new email and an 8+ character password.
- [ ] Sign-in works with the created account; invalid credentials show an error.
- [ ] Refresh preserves a valid session; sign-out clears the local token.
- [ ] Reservation request returns a pending-review confirmation.
- [ ] Provider application and enterprise inquiry forms return clear feedback.
- [ ] Demo data and non-binding pricing are clearly explained to users/judges.
- [ ] Layout remains usable at laptop and mobile widths.

## Negative tests to run before judging
- [ ] Duplicate registration should show an understandable error.
- [ ] Unsupported GPU model should return a validation error.
- [ ] Invalid/expired bearer token should not authenticate.
- [ ] API stopped: UI should show a helpful service error rather than a blank page.
- [ ] Invalid listing ID should return 404.

## Release checks
- [ ] `npm ci && npm run build && npm run lint` passes in `TerveX/`.
- [ ] `cargo fmt --all -- --check && cargo check && cargo test` passes in `tervex-backend/`.
- [ ] Team fills the submission fields in `PITCH_AND_SUBMISSION.md`.
- [ ] No real secrets, `.env`, SQLite database, `node_modules`, `target` or build outputs are committed.
- [ ] Team confirms licensing of UI assets and dependencies before publishing.
