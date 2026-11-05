# Gold Shore Matter Atlas — Consolidated Project Notes

**Status:** Planning plus initial isolated Cloudflare Worker proof-of-concept; GitHub repository not yet created  
**Project:** Gold Shore Matter Atlas  
**Proposed repository:** `marzton/goldshore-matter-atlas` (personal GitHub portfolio repository)  
**Proposed canonical URL:** `https://matter.goldshore.ai`  
**Optional navigation URL:** `https://goldshore.ai/matter`  
**Access:** Public, free to visitors, read-only scientific exploration  
**Last consolidated:** November 4, 2026

> This document consolidates the ideas, recommendations, architectural decisions, build directives, and AI Studio prompt from our discussion. It is a planning specification, **not** a claim that the GitHub repository, GS-API integration, or full scientific platform already exist. An isolated MVP Worker named `goldshore-matter-atlas` was created in Gold Shore Labs Cloudflare on November 4, 2026.

## 1. Vision

Build an interactive **multidimensional atlas of matter**, beginning with all 118 elements and expanding into material behavior across temperature, pressure, phase, isotope, composition, and external conditions.

The interface should go beyond a conventional periodic table. Users should investigate atomic numbers, standard states, chemical effects, pressure dependencies, viscosity, molecular and crystal structures, quantum states, entropy, and mechanical, thermodynamic, hydrodynamic, microscopic, and macroscopic properties. Additional layers include density, phonons, photons, optical and acoustic properties, radiation, particle dynamics, electrical and thermal conductivity, and spectroscopy.

The central scientific principle is that many properties are **not fixed constants of an element**. They depend on material form, temperature, pressure, phase, isotopic composition, and measurement method. Distinguish isolated atoms from bulk elements, isotopes, molecules, compounds, and allotropes.

The first compelling comparison is **helium-4 versus aluminum** at varying temperature and pressure: helium-4 remains a quantum liquid at sufficiently low pressure and becomes superfluid below approximately 2.17 K, while aluminum forms a crystalline solid below its melting point at ordinary pressure. A Bose–Einstein condensate or superfluid must not be mislabeled a crystal lattice.

## 2. Product goals

- Provide a full, interactive 118-element periodic table with search, filtering, and element details.
- Let users compare materials under the same physical conditions.
- Offer temperature–pressure phase exploration and measured property curves where valid data exists.
- Explore electronic, nuclear, quantum, thermodynamic, mechanical, structural, optical, acoustic, and transport properties.
- Show source citations, units, experimental conditions, uncertainty, and whether data is measured, calculated, extrapolated, or unavailable.
- Keep the public experience free and accessible without login.
- Create an independently deployable, inspectable, portfolio-quality open-source engineering project.
- Minimize incremental operating costs and avoid unapproved paid resources.

## 3. Scientific property taxonomy

| Layer | Example properties and phenomena |
| --- | --- |
| Atomic and nuclear | Atomic number, atomic mass, isotopes, nuclear spin, binding energy, radioactive decay, half-life |
| Electronic and quantum | Orbitals, electronic configuration, spin statistics, fermions/bosons, band structure, superconductivity, Bose–Einstein condensation |
| Chemical | Valence, oxidation states, bonds, reactivity, compounds, molecular geometry |
| Thermodynamic | Temperature, pressure, entropy, enthalpy, Gibbs energy, heat capacity, phase diagrams |
| Mechanical | Elasticity, Young's modulus, shear modulus, hardness, compressibility, fracture |
| Fluid and hydrodynamic | Dynamic/kinematic viscosity, surface tension, Reynolds number, flow regimes |
| Structural | Crystal symmetry, lattice constants, defects, phonons, diffraction |
| Optical and electromagnetic | Absorption, emission, reflectivity, refractive index, dielectric response, conductivity |
| Acoustic | Sound speed, attenuation, acoustic impedance, vibrational modes |
| Transport and radiation | Electrical/thermal transport, diffusion, photon scattering, radiation absorption and emission |

Not every property is meaningful or available for every element, isotope, material, or phase. Use explicit `not_applicable`, `not_available`, or `not_loaded` states as appropriate.

## 4. Public scientific sources

| Provider | Use | Reference |
| --- | --- | --- |
| Royal Society of Chemistry | Interactive element reference, periodic trends, educational links | https://periodic-table.rsc.org/ |
| PubChem | 118-element baseline, atomic and chemical properties | https://pubchem.ncbi.nlm.nih.gov/ptable/ |
| PubChem PUG REST | Programmatic access to supported PubChem records | https://pubchem.ncbi.nlm.nih.gov/docs/pug-rest |
| NIST Chemistry WebBook | Thermophysical fluid properties for supported substances | https://webbook.nist.gov/chemistry/fluid/ |
| NIST Atomic Spectra Database | Energy levels, spectral lines, atomic transitions | https://physics.nist.gov/asd |
| Materials Project | Computational materials properties, crystal structures | https://materialsproject.org/ |
| Materials Project API documentation | Authenticated API integration guidance | https://docs.materialsproject.org/downloading-data/using-the-api/getting-started |

Candidate PubChem periodic-table endpoint to verify against current documentation:

`https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON`

**Licensing and access:** Public accessibility does not imply unrestricted copying or redistribution. Review provider terms, attribution, API limits, bulk-download permissions, and credentials before ingestion. Link to RSC content rather than assuming it can be mirrored. NIST and Materials Project coverage is not universal.

## 5. Architecture decision

**Decision:** Create a dedicated GitHub repository and independently deployed frontend. Use **Cloudflare Workers + Static Assets** for a new frontend deployment, with the **existing GS-API Worker** serving normalized scientific data. Preserve an existing Cloudflare Pages deployment if repository inspection shows migration is unnecessary.

**Do not use Cloudflare Dynamic Workers** merely for an interactive periodic table: that product targets dynamically supplied code execution, not ordinary browser interactivity.

```text
matter.goldshore.ai
       |
       v
Matter Atlas Cloudflare Worker + Static Assets
       |-- React / TypeScript SPA
       |-- 118-element interactive table
       |-- Browser-side charts and optional 3D
       |-- Local baseline dataset / graceful offline behavior
       |
       v
Existing GS-API Worker — public, versioned read-only routes
       |-- Validation, caching, rate limiting
       |-- D1: normalized records, measurements, provenance
       |-- R2: large structures, spectra, curated assets (if needed)
       |-- Provider adapters and scheduled ingestion
       |
       v
PubChem / permitted NIST datasets / Materials Project / other approved sources
```

Prefer same-origin API routing where feasible. Keep GS-Cortex administration, private APIs, and Cloudflare Access-protected routes separate. Do not expose provider API keys in browser code.

**Hosting documentation:** https://developers.cloudflare.com/workers/static-assets/

### Domain arrangement

- Canonical app: `matter.goldshore.ai` (proposed; verify DNS and existing routes).
- Optional link or redirect from `goldshore.ai/matter`.
- Frontend deploys independently from GS-API and the main Gold Shore website.

## 6. Repository plan

**Recommended name:** `goldshore-matter-atlas`.

```text
goldshore-matter-atlas/
├── apps/
│   └── web/                  # React + TypeScript frontend
├── packages/
│   ├── periodic-data/        # Local 118-element baseline
│   ├── scientific-models/    # Units, validated phase calculations
│   ├── visualizations/       # Charts and 3D modules
│   └── api-client/           # Typed GS-API client
├── workers/
│   └── ingestion/            # Optional scheduled source synchronization
├── schemas/
│   └── scientific/           # Shared data contracts
├── tests/
├── docs/
│   ├── architecture.md
│   ├── sources-and-licenses.md
│   └── scientific-methodology.md
├── .github/
│   └── workflows/
├── README.md
└── AGENTS.md
```

The directory tree is a proposal, not a mandate. First inspect existing repositories and toolchains, then use the smallest maintainable structure. If ingestion belongs operationally inside GS-API, keep it there instead of creating a redundant worker.

### Portfolio value

The project demonstrates Cloudflare/edge deployment, GitHub CI/CD, TypeScript frontend engineering, API design, data normalization, scientific computing, visualization, provenance, accessibility, and security engineering. Feature it in the Gold Shore Labs portfolio with a live demo, source repository, architecture diagram, and scientific methodology page.

Keep the code license separate from third-party dataset licensing; an MIT license for code does not relicense imported scientific data.

## 7. Proposed API contract

These are **planned**, not verified existing endpoints:

```http
GET /api/public/matter/v1/elements
GET /api/public/matter/v1/elements/:atomicNumber
GET /api/public/matter/v1/elements/:atomicNumber/properties
GET /api/public/matter/v1/elements/:atomicNumber/isotopes
GET /api/public/matter/v1/materials
GET /api/public/matter/v1/materials/:id
GET /api/public/matter/v1/materials/:id/structures
GET /api/public/matter/v1/phase
GET /api/public/matter/v1/compare
GET /api/public/matter/v1/sources
```

API requirements: versioning, schema validation, explicit units, attribution, pagination, bounded queries, cache headers, rate limits, safe errors, and isolation from private admin functionality.

### Example normalized measurement

```json
{
  "material_id": "helium-4-liquid",
  "property": "dynamic_viscosity",
  "value": null,
  "unit": "Pa.s",
  "temperature_k": 2.0,
  "pressure_pa": null,
  "phase": "superfluid",
  "uncertainty": null,
  "method": null,
  "source_id": null,
  "status": "not_loaded"
}
```

`null` must never be silently interpreted as zero. Ordinary viscosity alone does not fully characterize two-fluid superfluid helium.

## 8. Frontend specification

### Interactive periodic table

- Correct standard arrangement of all 118 elements.
- Search by name, symbol, atomic number.
- Filter/color by family, phase, or selected property.
- Element detail cards and source citations.
- Mobile responsive and keyboard accessible.
- Bundle baseline element data locally so the essential UI works even if GS-API is unavailable.

### Element and material explorer

- Atomic/electronic structures, isotopes, nuclear properties.
- Chemical properties and compounds.
- Thermodynamics, mechanics, fluids, and transport.
- Quantum statistics and collective states.
- Crystal structures and phonons.
- Optical properties, spectra, acoustics, and radiation.
- Explicit coverage and missing-data indicators.

### Temperature–pressure explorer

- Kelvin/Celsius and selectable pressure units.
- Phase diagrams and transition markers.
- Density, viscosity, entropy, conductivity, and heat-capacity curves when supported.
- Side-by-side comparison at matched conditions.
- Scientific model and interpolation bounds made visible.
- No invented phase boundaries or arbitrary extrapolation.

### Visualizations

Use lightweight client-side charting and optional 3D rendering; lazy-load heavy modules. Basic access should not depend on WebGL. Start with helium-4 versus aluminum as the reference case.

## 9. Data ingestion, storage, and performance

- Use static JSON for the small 118-element baseline where practical.
- Cache normalized scientific responses; do not call third-party APIs on every user request.
- Use D1 for queryable scientific records and provenance when needed.
- Use R2 for genuinely large structures, spectral datasets, or curated assets.
- Use scheduled ingestion only where terms permit and freshness warrants it.
- Version source datasets and record ingestion dates.
- Prefer free/existing Cloudflare resources and establish usage limits.
- Do not add paid AI inference, Durable Objects, Queues, or other services without a justified requirement.

Target minimal incremental operating cost, ideally $0 at MVP scale, but verify current limits and projected usage before claiming cost.

## 10. Security and operational constraints

- Public read-only scientific routes require no user login.
- Preserve Cloudflare Access protection on admin, agents, GS-Cortex, and other private routes.
- Keep external API credentials server-side and out of Git.
- Validate input and database queries.
- Apply CSP/security headers, appropriate WAF rules, and rate limits.
- No wildcard policy changes, destructive migrations, unrelated refactors, or unapproved DNS changes.
- Preserve existing deployment conventions and CI/CD.
- Use preview/staging deployments before production.
- Include rollback steps and provider-free tests.

## 11. Google AI Studio decision

**Use Google AI Studio for rapid UI prototyping and AI-assisted implementation—not as the required production hosting environment.**

Preferred workflow:

1. Create and own the GitHub repository first.
2. Open Google AI Studio Build mode: https://aistudio.google.com/.
3. Import/synchronize the repository if the current product integration supports it; verify availability and behavior.
4. Prototype the 118-element table, detail panels, responsive layout, charts, and helium/aluminum comparison.
5. Review generated code and sync or export changes back to GitHub.
6. Run tests and review diffs.
7. Deploy through Cloudflare Workers Static Assets using existing GitHub CI/CD conventions.

Avoid unwanted Firebase, Cloud Run, mandatory Gemini API calls, paid services, or server-side Node dependencies. Optional Gemini-assisted scientific exploration can be a later, separately cost-controlled feature. AI-generated scientific claims must be verified against authoritative data.

### Initial Google AI Studio build prompt

> Build **Gold Shore Matter Atlas**, a professional interactive scientific periodic table and material-property exploration application.
>
> Use React, TypeScript, and a responsive dark-mode scientific dashboard design.
>
> The application will be maintained in the GitHub repository `goldshore-matter-atlas` and deployed using Cloudflare Workers Static Assets.
>
> Implement all 118 elements with search, property filters, selection panels, comparison mode, and expandable scientific details.
>
> Create interactive temperature and pressure controls, phase diagrams, thermodynamic charts, and foundations for 3D crystal and atomic structure visualization.
>
> Use a locally bundled, scientifically verified baseline dataset. Design a typed API client for future integration with Gold Shore's existing GS-API.
>
> Do not invent scientific measurements. Clearly distinguish experimental data, calculated predictions, and unavailable properties.
>
> Do not introduce Firebase, Cloud Run deployment dependencies, authentication, paid services, or mandatory Gemini API calls.
>
> Keep the frontend independently deployable, modular, accessible, and suitable for an open-source engineering portfolio.
>
> Begin with the interactive periodic table and helium-4 versus aluminum comparison. Make the first version visually polished and fully functional before expanding the scientific datasets.

## 12. Updated engineering-agent build instructions

**Mission:** Create an independently deployable `goldshore-matter-atlas` repository under the existing Gold Shore GitHub organization. Build a public scientific application on Cloudflare Workers Static Assets, integrating with existing GS-API via versioned, read-only endpoints.

### Phase 0 — Read-only discovery

1. Inspect `goldshore-ai`, `gs-web`, `gs-api`, and relevant GS-Cortex contracts.
2. Identify actual owners of frontend, backend, deployment, routes, and scientific data storage.
3. Check existing Cloudflare configurations, DNS, Access policies, Worker bindings, D1/R2 resources, secrets, and CI/CD.
4. Determine whether the frontend is currently on Pages or Workers; do not migrate without justification.
5. Check CLI/config conventions: preserve Wrangler for an existing Wrangler-configured project; otherwise follow current Cloudflare CLI guidance.
6. Check scientific source APIs, licensing, attribution, quotas, and data coverage.
7. Produce an architecture and change-impact assessment before modifying infrastructure.

### Phase 1 — Repository and baseline

1. Create the new repository once authorized.
2. Scaffold React + TypeScript with independent Cloudflare deployment configuration.
3. Establish README, AGENTS.md, docs, CI, tests, code license, and dataset attribution.
4. Import/validate a baseline for all 118 elements, preferably from PubChem where permitted.
5. Implement accessible, searchable periodic-table UI with locally bundled data.

### Phase 2 — GS-API integration

1. Add a versioned, read-only public Matter Atlas router to existing GS-API.
2. Implement typed data contracts, input validation, provenance, caching, and bounded responses.
3. Add D1 schema changes only where required and via safe, reviewed migrations.
4. Keep protected ingestion/admin actions separate from public routes.
5. Provide provider-free fixture tests.

### Phase 3 — Scientific modules

1. Element detail panels and comparison mode.
2. Validated units and temperature/pressure controls.
3. Measured thermophysical curves and phase boundaries.
4. Isotopes, electronic structure, crystal geometry, spectroscopy, and optional 3D.
5. Clear experimental-versus-theoretical and unavailable-data indicators.

### Phase 4 — Verification and release

1. Run tests, lint, build, type-check, and accessibility checks.
2. Confirm all 118 elements and source attributions.
3. Verify security isolation from admin and GS-Cortex endpoints.
4. Publish preview/staging deployment, validate mobile and desktop.
5. Document cost, monitoring, rollback, and production deployment plan.
6. Require approval before production DNS, secrets, access-policy, paid-resource, or destructive changes.

### Required deliverables

- Read-only audit and proposed change list.
- New standalone GitHub repository and reviewed implementation PR.
- Functional 118-element frontend MVP.
- Typed GS-API scientific endpoints.
- Scientific source adapters and provenance metadata.
- Automated tests and CI.
- Documentation, license/attribution inventory, architecture diagram.
- Verified preview deployment and rollback instructions.

## 13. Milestones and acceptance criteria

| Milestone | Deliverable |
| --- | --- |
| 1 — Foundation | Repo audit, independent app, all 118 elements, PubChem-backed baseline, search, citations |
| 2 — Scientific properties | Element property explorer, unit normalization, provenance, comparison, permitted NIST integrations |
| 3 — Thermodynamics/quantum | Temperature/pressure charts, validated phases, helium-4 vs aluminum, isotopes, entropy, viscosity |
| 4 — Advanced visualization | Crystal structures, phonons, photons, spectra, 3D, exportable datasets |

MVP acceptance:

- All 118 element identifiers render correctly.
- Search and selection work on desktop and mobile.
- At least one verified scientific source is integrated and attributed.
- Public GS-API endpoints are read-only, validated, and isolated.
- Missing measurements are shown honestly.
- Tests, type checks, and builds pass.
- Staging/preview is verified without disrupting existing Gold Shore routes.
- No unapproved paid resources or destructive changes.

## 14. Immediate next action

**GitHub first → AI Studio prototyping second → Cloudflare preview third.**

Have an agent begin with a **read-only repository and Cloudflare infrastructure audit**, then propose the exact repository creation, file changes, GS-API routes, data ingestion permissions, and deployment plan. After approval, implement the smallest complete vertical slice: a working, attributed 118-element periodic table with helium-4 versus aluminum as the first condition-aware comparison.
