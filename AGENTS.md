# Matter Atlas working rules

- Keep this repository independent from GS-API, GS-Cortex, and the main Gold Shore site.
- Preserve `src/worker.mjs` and `src/elements.mjs` from the imported scaffold. The deployed Worker predates this scaffold and must be backed up before a release.
- Bundle the essential 118-element dataset; the explorer must work without API credentials or provider requests.
- Separate scientific period/group from detached chart coordinates. Preserve source qualifiers, including predicted states. Never turn unavailable measurements into zero.
- Run `npm run check` and `npm run test:e2e` before proposing release.
- CI validates only; it must not deploy or modify DNS, Access, secrets, or GS-API.
- Production, DNS, and Access work was explicitly authorized in the November 4, 2026 continuation. Limit any release to the existing Matter Atlas Worker and `matter.goldshore.ai`; inspect and record rollback state first. Preserve all unrelated protections. GS-API remains out of scope.
