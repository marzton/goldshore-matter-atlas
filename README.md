# Gold Shore Matter Atlas

[Live explorer](https://matter.goldshore.ai) · [First implementation PR](https://github.com/marzton/goldshore-matter-atlas/pull/1)

A public, read-only explorer for all 118 elements. React and TypeScript power a searchable periodic table, family/state filters, source-linked details, and a comparison workspace. Essential records are bundled locally; browsing makes no provider or GS-API requests.

```sh
npm ci
npm run dev
```

Requires Node.js 22.22.2 or later 22.x, Node 24.15+ (CI uses Node 24), or Node 26+. `npm run build` produces `dist/`; `npm run preview` serves that build locally.

```sh
npm run check
npx playwright install chromium
npm run test:e2e
```

Validation includes the imported scaffold's tests, API preservation tests against the original deployed Worker, typed data and React interaction tests, and desktop/mobile Chromium browser tests with axe accessibility checks. CI validates changes and does not deploy.

The first release covers identity, electron configuration, family, and source-qualified standard state. Temperature/pressure inputs normalize comparison context; condition-specific phase, density, and viscosity remain **not loaded**. This release has no helium-4 model, fabricated phase boundaries, or live scientific API integration.

| Path                                 | Purpose                                                                        |
| ------------------------------------ | ------------------------------------------------------------------------------ |
| `src/web/`                           | React application and typed element model                                      |
| `src/web/data/pubchem-elements.json` | Attributed, dated factual snapshot                                             |
| `src/worker.mjs`, `src/elements.mjs` | Unchanged Google Drive scaffold                                                |
| `src/legacy-worker.mjs`              | Source downloaded from the existing deployed MVP before release                |
| `src/release-worker.mjs`             | Static frontend routing with delegation to the original Worker for APIs/errors |
| `tests/`                             | Browser and deployment contract tests                                          |

The existing `goldshore-matter-atlas` Worker in Gold Shore Labs is the release target. Its original version remains available for rollback. Production/domain/Access work was explicitly authorized during this continuation; GS-API remains out of scope. The PR is opened for review and is not merged automatically.

- [Architecture](docs/architecture.md)
- [Sources and dataset limitations](docs/sources-and-licenses.md)
- [Release and rollback](docs/release.md)
- [Imported project specification](docs/BUILD_PLAN.md)
- [Implementation plan](docs/superpowers/plans/2026-11-04-element-explorer.md)
