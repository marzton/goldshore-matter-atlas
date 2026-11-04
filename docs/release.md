# Release and rollback

## Scope and authorization

The November 4 continuation authorizes the first PR. A subsequent explicit user approval includes Matter Atlas production, DNS, and Access work. GS-API remains excluded. Release only to the existing `goldshore-matter-atlas` Worker in Gold Shore Labs and the designated `matter.goldshore.ai` hostname. CI has no deployment or infrastructure permissions.

## Recorded initial state

- Worker: `goldshore-matter-atlas`, existing isolated MVP; compatibility date `2026-11-04`, no bindings or compatibility flags.
- Workers.dev: enabled at `goldshore-matter-atlas.goldshore.workers.dev`; version previews initially disabled.
- Original active version: `a04d5e4e-94d5-4079-a741-904bb6fdb27a` (100%). Original deployment: `013fbdf5-182b-4a51-a932-0351e4f7071b`.
- Downloaded original Worker source before any mutation; retained in `src/legacy-worker.mjs` and a local multipart backup.
- No initial DNS record or Worker custom domain for `matter.goldshore.ai`.
- Access inspection found no application targeting Matter Atlas or a `*.goldshore.ai` catch-all. Existing API, admin, trading, and agent applications stay intact. A public hostname does not need a new bypass policy in this configuration.

## Controlled deployment

1. Run `npm ci`, `npm run check`, and `npm run test:e2e` against built assets. Record the source commit.
2. Upload only the three built HTML/CSS/JS assets with the documented Workers Static Assets direct-upload API. Use its scoped upload JWT for file bytes; never put account credentials in the repository or client bundle.
3. Upload a new version to the existing Worker, with `src/release-worker.mjs` as main module, `src/legacy-worker.mjs` as an additional module, an `ASSETS` binding, unchanged compatibility date/flags, and `assets.config.run_worker_first: true`.
4. Enable preview URLs only for this public scientific Worker. Validate the new version's preview: application interactions, CSP, 118 records, original API payloads, health, invalid IDs, 404s, and method rejection.
5. Activate the approved version on the existing Worker. Attach exactly `matter.goldshore.ai` as a Workers Custom Domain after rechecking DNS and route conflicts. The Custom Domain manages its DNS record and certificate; do not add a parallel route or wildcard record.
6. Validate the canonical HTTPS hostname without credentials. Confirm the pre-existing protected applications and policies are unchanged. Do not merge the PR automatically.

Use the connected Cloudflare API for account operations. The available local CLI token was invalid during inspection; it must not be printed, copied into code, or used as a reason to alter unrelated credentials.

## Rollback

- Redeploy original version `a04d5e4e-94d5-4079-a741-904bb6fdb27a` at 100% using the Worker Deployments API. Its original embedded MVP UI and API return together; no database rollback is involved.
- If reverting the hostname connection, detach only the newly added exact `matter.goldshore.ai` Custom Domain. Verify its managed DNS record is removed. Initial state had no record to restore.
- Restore this Worker's preview setting to disabled if the release is abandoned. Do not change other Workers or Access applications.
- Validate `/health`, `/api/v1/elements` (118 records), and `/api/v1/elements/119` (404) after rollback.

## Limits

No live GS-API integration, physical-property dataset, or scientific model is included. No production cost promise is made; monitor actual Worker requests and asset traffic. Server-side static asset routing adds Worker invocations to apply consistent security headers. Chromium desktop/mobile emulation is covered; Safari/Firefox and a manual screen-reader audit remain future checks.
