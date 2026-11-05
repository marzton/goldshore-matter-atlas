# Sources and licenses

## Imported scaffold

Imported November 4, 2026 from Google Drive's [Matter Atlas folder](https://drive.google.com/drive/folders/1iDKup9mVooHY7omosR-AKFv2030Zapjz), file `goldshore-matter-atlas-marzton-scaffold.zip`.

Archive SHA-256: `9f26323cfdfff1a00e7b8a700917f9f4252591a6d7643b8d63c4dc71fed59f54`.

The first import commit retains the supplied scaffold. Subsequent commits replace its vanilla browser UI with React and keep the scaffold's Worker/data modules untouched. `docs/BUILD_PLAN.md` is an imported planning document; its older status and future milestones are historical rather than current implementation claims.

## PubChem baseline

- Provider: National Center for Biotechnology Information, PubChem.
- [Interactive periodic table](https://pubchem.ncbi.nlm.nih.gov/ptable/).
- [Downloaded machine-readable table](https://pubchem.ncbi.nlm.nih.gov/rest/pug/periodictable/JSON).
- Retrieved: November 4, 2026. Raw response SHA-256 is recorded in the bundled JSON.
- Fields retained: atomic number, symbol, name, electron configuration, GroupBlock (family), and StandardState. Original state qualifiers such as `Expected to be a Gas` are retained verbatim.
- Transformations: scientific period and chart coordinates are derived from atomic number; common Aluminium/Aluminum and Caesium/Cesium search aliases are local UI conveniences. No numerical thermophysical properties are imported or inferred.

These are selected factual reference fields. PubChem compiles information from multiple sources; do not treat public accessibility or this repository's code license as a blanket license for every third-party record. Consult [PubChem copyright guidance](https://pubchem.ncbi.nlm.nih.gov/docs/copyright), the individual element pages, and underlying attribution before expanding ingestion. This project neither copies RSC educational text nor ingests NIST or Materials Project measurements.

The [IUPAC periodic table](https://iupac.org/what-we-do/periodic-table-of-elements/) is linked as the naming and arrangement reference. Its illustrations and PDFs are not copied into the application.

## Scientific limits

`reported` means that the snapshot reports a reference classification; it does not certify a measurement, uncertainty, or experimental condition. `predicted` retains the provider's explicit expected-state wording. Different sources may classify a superheavy element differently. This app does not upgrade a prediction into an observation.

Standard state is a source reference, independent of user-entered comparison conditions. No isotope-specific state, crystal structure, superfluidity, Bose–Einstein condensation, or phase transition is inferred. Dynamic viscosity alone would not describe two-fluid helium. Future measurements require units, material/isotope identity, conditions, method, provenance, uncertainty, and model bounds.

`not_loaded` means a dataset has not been integrated. It is distinct from `not_available` (the source lacks a value) and `not_applicable` (the property does not apply). None means zero.

## Code

Original project code is MIT-licensed; see `LICENSE`. Dataset attribution and source restrictions remain separate. Dependencies retain their own licenses.
