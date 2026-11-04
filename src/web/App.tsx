import { useState } from "react";
import { Comparison } from "./Comparison";
import { ElementDetail } from "./ElementDetail";
import { PeriodicTable } from "./PeriodicTable";
import {
  elements,
  families,
  familyClass,
  filterElements,
  provenance,
} from "./elements";

export default function App() {
  const [query, setQuery] = useState("");
  const [family, setFamily] = useState("");
  const [state, setState] = useState("");
  const [selected, setSelected] = useState(2);
  const [first, setFirst] = useState(2);
  const visible = filterElements(elements, query, family, state);
  function reset() {
    setQuery("");
    setFamily("");
    setState("");
  }
  function compare(number: number) {
    setFirst(number);
    document
      .getElementById("compare")
      ?.scrollIntoView?.({ behavior: "smooth" });
  }
  return (
    <>
      <a className="skip-link" href="#explorer">
        Skip to element explorer
      </a>
      <header className="site-header">
        <a className="brand" href="#">
          <span className="brand-mark" aria-hidden="true">
            G
          </span>
          <span>
            GOLD SHORE <small>LABS / MATTER ATLAS</small>
          </span>
        </a>
        <nav aria-label="Main navigation">
          <a href="#explorer">Explorer</a>
          <a href="#compare">Compare</a>
          <a href="#sources">
            Sources <span aria-hidden="true">↗</span>
          </a>
        </nav>
        <span className="header-status">
          <i /> PUBLIC REFERENCE
        </span>
      </header>
      <main>
        <section className="intro">
          <div>
            <div className="eyebrow">A FIELD GUIDE TO THE PHYSICAL WORLD</div>
            <h1>
              Matter, <em>element by element.</em>
            </h1>
            <p>
              Explore the building blocks. Follow the evidence.
              <br className="desktop-break" /> A living atlas of atomic identity
              and material possibility.
            </p>
          </div>
          <div className="intro-stat">
            <strong>118</strong>
            <span>
              ELEMENTS
              <br />
              ONE SHARED UNIVERSE
            </span>
          </div>
        </section>
        <section id="explorer" aria-labelledby="explorer-heading">
          <div className="section-heading">
            <div>
              <div className="eyebrow">01 / THE PERIODIC EXPLORER</div>
              <h2 id="explorer-heading">Find your element.</h2>
            </div>
            <span className="badge">BUNDLED DATA · {provenance.retrieved}</span>
          </div>
          <div className="filters panel">
            <label className="search-label">
              Search elements
              <input
                type="search"
                placeholder="Name, symbol, or atomic number"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
              />
            </label>
            <label>
              Family
              <select
                value={family}
                onChange={(e) => setFamily(e.target.value)}
              >
                <option value="">All families</option>
                {families.map((f) => (
                  <option key={f}>{f}</option>
                ))}
              </select>
            </label>
            <label>
              Standard state
              <select value={state} onChange={(e) => setState(e.target.value)}>
                <option value="">All states</option>
                {["Solid", "Liquid", "Gas"].map((s) => (
                  <option key={s}>{s}</option>
                ))}
              </select>
            </label>
            <button type="button" className="quiet" onClick={reset}>
              Reset filters
            </button>
          </div>
          <div className="results-line">
            <p role="status">{visible.length} of 118 elements</p>
            <span>Predicted states retain source qualifiers.</span>
          </div>
          <div className="explorer-layout">
            <div className="board panel">
              {visible.length ? (
                <PeriodicTable
                  records={visible}
                  selected={selected}
                  onSelect={setSelected}
                />
              ) : (
                <div className="empty">
                  <strong>No elements match these filters.</strong>
                  <p>Try another name, symbol, or atomic number.</p>
                  <button type="button" className="quiet" onClick={reset}>
                    Show all elements
                  </button>
                </div>
              )}
              <div className="legend" aria-label="Element family legend">
                {families.map((f) => (
                  <span key={f}>
                    <i className={familyClass(f)} />
                    {f}
                  </span>
                ))}
              </div>
              <p className="small muted table-caption">
                18 groups · 7 periods. Lanthanides and actinides are displayed
                below periods 6 and 7; detached columns are layout positions,
                not assigned groups.
              </p>
            </div>
            <ElementDetail
              element={elements[selected - 1]}
              onCompare={compare}
            />
          </div>
        </section>
        <Comparison first={first} onFirstChange={setFirst} />
        <section
          className="sources"
          id="sources"
          aria-labelledby="sources-heading"
        >
          <div>
            <div className="eyebrow">BUILT ON TRACEABLE DATA</div>
            <h2 id="sources-heading">An atlas with its sources attached.</h2>
            <p className="muted">
              Identity, electron configuration, family, and standard state come
              from a bundled PubChem snapshot. Unavailable scientific layers are
              labeled explicitly.
            </p>
          </div>
          <div>
            <a
              href="https://pubchem.ncbi.nlm.nih.gov/ptable/"
              target="_blank"
              rel="noreferrer"
            >
              PubChem periodic table <span aria-hidden="true">↗</span>
            </a>
            <a
              href="https://iupac.org/what-we-do/periodic-table-of-elements/"
              target="_blank"
              rel="noreferrer"
            >
              IUPAC naming reference <span aria-hidden="true">↗</span>
            </a>
            <p className="small muted">
              No live provider or GS-API request is needed to explore this
              dataset.
            </p>
          </div>
        </section>
      </main>
      <footer>
        <span>
          GOLD SHORE LABS <span aria-hidden="true">/</span> MATTER ATLAS
        </span>
        <span>Explore carefully. Cite what you know.</span>
      </footer>
    </>
  );
}
