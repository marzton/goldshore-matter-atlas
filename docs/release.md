# Release and rollback

## Scope and authorization

The November 4 continuation authorizes the first PR. A subsequent explicit user approval includes Matter Atlas production, DNS, and Access work. GS-API remains excluded. Release only to the existing `goldshore-matter-atlas` Worker in Gold Shore Labs and the designated `matter.goldshore.ai` hostname. CI has no deployment or infrastructure permissions.

## Verified release — November 4, 2026

- Canonical HTTPS app: https://matter.goldshore.ai (200, correct title, public without credentials).
- PR: https://github.com/marzton/goldshore-matter-atlas/pull/1, open and unmerged.
- Runtime source commit: `cc6a54323df4086acb384bb411c2898e2d67a7ff`.
- Active version: `56b3cdc0-06e0-46e3-819c-b4aedc502196`, 100% on the existing Worker; deployment `b224380d-a6c9-4c63-8ca6-dcf76ee9ef2b`.
- Validated version preview: https://56b3cdc0-goldshore-matter-atlas.goldshore.workers.dev.
- Custom Domain: `24ec56cf1a20bcd26a14144df47c7c670b32598f`; managed DNS record `6345cac3f0a798539305ff674d4cc581`. Public A/AAAA resolution and HTTPS checked.
- Validation: lint, type-check, build, 13 Node contract tests, 29 Vitest tests, and 8 desktop/mobile Chromium browser tests. Browser checks passed in preview and on the canonical hostname, with the two documented inherited GTM CSP blocks classified separately from unexpected application errors. Axe found no violations in the tested views.
- The 118-record API response matches the saved pre-release body exactly. Invalid atomic number returns 404; POST remains 405; HTML CSP nonces differ per response.
- All 27 Access applications and policies match the canonicalized pre-release snapshot (68,575 bytes; diagnostic checksum `c3202d26`). No Access mutation or GS-API change was needed.
- Existing Google Tag Gateway configuration is unchanged. The only zone configuration addition is the exact-host Zaraz exclusion described below.

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
- Remove only the Matter Atlas Zaraz exclusion rule `60b66d4e5c304e8da5247223cda84c3f` from the `http_config_settings` ruleset `6c437486c174472e8106c86b00c32530` if reverting the hostname. No entrypoint existed before this release; remove that ruleset only if it still contains exclusively this owned rule. Preserve any later concurrent additions.
- Restore this Worker's preview setting to disabled if the release is abandoned. Do not change other Workers or Access applications.
- Validate `/health`, `/api/v1/elements` (118 records), and `/api/v1/elements/119` (404) after rollback.

## Limits

No live GS-API integration, physical-property dataset, or scientific model is included. No production cost promise is made; monitor actual Worker requests and asset traffic. Server-side static asset routing adds Worker invocations to apply consistent security headers. Chromium desktop/mobile emulation is covered; Safari/Firefox and a manual screen-reader audit remain future checks.

Minor follow-up from independent review: the condition editor marks both inputs invalid when their shared validation fails. Separate field-level validation hints can improve this feedback without changing conversion or rejection behavior.

## Inherited Google Tag Gateway limitation

Live-domain validation found a separate zone-wide Google Tag Gateway injecting two inline GTM snippets before the application. [Cloudflare documents that this feature cannot be excluded by hostname or Configuration Rules](https://developers.cloudflare.com/google-tag-gateway/#zone-level-configuration). The host-scoped Zaraz exclusion does not control this separate product.

The explorer keeps its strict CSP and blocks both GTM snippets. They produce two expected browser console policy messages. No application script is blocked; all interactive checks pass. The browser suite records only these exact known script hashes as expected blocked injections on `matter.goldshore.ai`, while any other console error remains a failure. Workers.dev previews have no such messages. Zone-wide tag configuration is preserved because changing it would affect other Gold Shore hosts, including the excluded GS-API scope.

Ruling: accept and disclose these two blocked external-injection messages while keeping the application and domain operational. Cost: browser developer tools retain this known noise until the zone owner changes the broader gateway setup. Do not weaken the application's CSP or broaden this task to zone-wide tracking changes to hide it.
