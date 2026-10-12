# Contributing to TerveX

Thanks for helping improve TerveX. For a hackathon project, keep changes small, reviewable and honest about the prototype status.

## Development workflow
1. Create a branch for one focused change.
2. Run the frontend with `cd TerveX; npm ci; npm run dev`.
3. Run the backend with `cd tervex-backend; cargo run`.
4. Run `powershell -ExecutionPolicy Bypass -File .\scripts\smoke-test.ps1` from the repository root.
5. Before opening a pull request, run `npm run build` and `npm run lint` in `TerveX`, and `cargo check` / `cargo test` in `tervex-backend`.
6. Update relevant docs and explicitly label any mock/demo data.

## Pull request checklist
- [ ] Explain the user problem and the change.
- [ ] Include reproduction/testing steps.
- [ ] Avoid committing secrets, local databases, build output or personal data.
- [ ] Do not describe simulated capacity/pricing as live.
- [ ] Note security implications for authentication, roles, reservations or provider listings.

## Licensing
The project team should agree on a repository license and verify third-party asset rights before publishing. See `LICENSE-DECISION.md`.
