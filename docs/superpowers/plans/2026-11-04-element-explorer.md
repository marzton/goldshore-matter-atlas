# Matter Atlas Explorer Implementation Plan

> **For agentic workers:** Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Import the supplied scaffold, build the tested React/TypeScript 118-element explorer, and open the first PR.

**Architecture:** Vite builds an independently served static React application. A bundled PubChem factual snapshot supplies identity, family, electron configuration, and source-qualified standard state. The imported Worker remains unchanged; no GS-API integration is required.

**Tech Stack:** React, TypeScript, Vite, Vitest, Testing Library, Playwright, axe.

**Spec:** `docs/BUILD_PLAN.md`, scoped by the November 4 continuation and subsequent approval for Matter Atlas production/DNS/Access work.

## Global Constraints

- Preserve the existing Worker and its APIs; back up deployment state before any release.
- GS-API and other Gold Shore services remain out of scope.
- All 118 elements work from bundled data without external requests.
- No invented physical measurements, phase boundaries, or inferred isotope behavior.
- CI runs validation only; no credentials, paid resources, or automatic deployment.

## Review Focus

- Detached rows are periods 6/7, with no invented chemical group for f-block records.
- Expected standard states remain explicitly predicted, including Oganesson.
- Search trims whitespace, supports common spelling aliases, and combines filters.
- Comparison input rejects nonfinite/negative temperatures and nonpositive pressures; no simulated measurements.
- Mobile selection and keyboard focus remain reachable even with filters and empty results.

### Task 1: Scaffold and typed baseline

**Files:** Preserve `src/worker.mjs`, `src/elements.mjs`, `tests.mjs`; add `src/web/data/*`, `src/web/elements.ts`, `src/web/elements.test.ts`.

**Interfaces:** `ElementRecord`, `elements`, `filterElements(elements, query, family, state)`, `parseConditions(temperature, temperatureUnit, pressure, pressureUnit)`.

- [x] Import the exact scaffold and run its three baseline tests.
- [x] Write and run failing tests for 118 identities, unique layout, scientific periods, aliases, prediction labels, filters, and unit validation.
- [x] Implement the typed, immutable dataset and pure filtering/conversion functions; run tests and type-check.
- [x] Record provenance and source limitations separately from the code license.

### Task 2: Accessible React explorer

**Files:** `src/web/App.tsx`, `src/web/PeriodicTable.tsx`, `src/web/ElementDetail.tsx`, `src/web/Comparison.tsx`, `src/web/*.test.tsx`, `src/web/style.css`, root build configuration.

**Interfaces:** Consume Task 1's `ElementRecord` and filtering/conditions functions. Components receive records and selection callbacks; no runtime data fetch.

- [x] Write and run failing interaction tests for all 118 buttons, search/filter/reset, selection, keyboard selection, comparison choices, validation, and missing data.
- [x] Implement the responsive dark scientific dashboard, detail sources, selectable comparison, explicit coverage states, and native keyboard controls.
- [x] Run lint, type-check, unit and scaffold tests, and production build.

### Task 3: Browser validation, PR, and authorized release

**Files:** `tests/explorer.spec.ts`, `playwright.config.ts`, `.github/workflows/test.yml`, `README.md`, `docs/architecture.md`, `docs/sources-and-licenses.md`, `docs/release.md`.

- [x] Test built assets at desktop and mobile widths, API-unavailable operation, filters, details, comparison, keyboard navigation, console health, and axe accessibility.
- [x] Review the whole branch, fix significant findings, and rerun validation.
- [ ] Open the first PR; preserve reviewability and do not merge automatically.
- [x] Inspect existing Worker, DNS, and Access state; back up the exact prior Worker. Prepare bounded release configuration and rollback instructions.
- [ ] Use a preview before activating the approved Matter Atlas production/domain changes; verify public app and preserved APIs and private protections.
