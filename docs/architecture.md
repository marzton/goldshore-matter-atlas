# Architecture

```text
Browser → existing Matter Atlas Worker → bundled React assets
                          └──────────→ original baseline API implementation
```

Vite compiles the React/TypeScript frontend into `dist/`. The entire essential dataset is bundled with the application, with no runtime provider fetch. This allows browsing when scientific APIs are unavailable; it is not a service-worker offline installation.

`src/release-worker.mjs` serves GET/HEAD requests for `/`, `/index.html`, and `/assets/*` through an `ASSETS` binding. It adds CSP and security headers to those responses. Configure assets with `run_worker_first: true` so the wrapper always applies these headers. Other paths and methods delegate to the original deployed module, copied into `src/legacy-worker.mjs`. Existing health, element APIs, 404, and 405 behavior remain covered by contract comparisons. The Google Drive scaffold modules are also preserved unchanged.

The original API expresses detached chart rows as periods 8/9. Its compatibility behavior is retained. The new frontend does not consume those fields: its typed model separates scientific periods 6/7 from display rows 8/9 and leaves the detached series' chemical groups unassigned. Group-3 convention is deliberately not asserted for those series.

React state owns search, selection, independent comparison choices, and conditions. Filtering derives from state in render. Native buttons, inputs, selects, details, focus outlines, a skip link, and keyboard-scrollable regions provide baseline accessibility. Arrow keys follow atomic-number order through visible results; Home/End jump to the first/last visible record.

Exact full names and symbols take priority over partial name matching. Active filters show compact cards; the unfiltered view keeps the standard periodic arrangement. On phones, secondary filters expand from the Filters button. The tiles have one tab stop, arrow keys move selection, and comparison activation transfers focus to Material A. Reset restores search focus.

The only new runtime binding is the local static asset collection. No GS-API, databases, storage buckets, credentials, authentication, AI inference, or external scientific services are needed.
