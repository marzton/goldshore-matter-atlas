import { familyClass, provenance, type ElementRecord } from "./elements";

export function ElementDetail({
  element,
  onCompare,
}: {
  element: ElementRecord;
  onCompare: (number: number) => void;
}) {
  return (
    <aside className="detail panel" aria-label="Element details">
      <div className="section-kicker">
        ELEMENT PROFILE{" "}
        <span>{String(element.number).padStart(3, "0")} / 118</span>
      </div>
      <div className={`hero-symbol ${familyClass(element.family)}`}>
        <span>{element.number}</span>
        <strong>{element.symbol}</strong>
        <small>{element.family}</small>
      </div>
      <h2>{element.name}</h2>
      <p className="muted">Atomic identity · local reference</p>
      <dl className="facts">
        <div>
          <dt>Atomic number</dt>
          <dd>{element.number}</dd>
        </div>
        <div>
          <dt>Period</dt>
          <dd>{element.period}</dd>
        </div>
        <div>
          <dt>Group</dt>
          <dd>{element.group ?? "f-block series"}</dd>
        </div>
        <div>
          <dt>Standard state</dt>
          <dd>{element.standardState}</dd>
        </div>
      </dl>
      <p className="small muted">
        {element.stateKind === "predicted"
          ? "Predicted by the source; not an observed bulk-state measurement."
          : "Source-reported standard state; not calculated for the comparison conditions."}
      </p>
      <div className="configuration">
        <h3>Electron configuration</h3>
        <code>{element.electronConfiguration || "Not available"}</code>
        <p className="small muted">Source reference for the neutral atom.</p>
      </div>
      <button
        type="button"
        className="primary"
        onClick={() => onCompare(element.number)}
      >
        Compare {element.symbol} as material A <span aria-hidden="true">↗</span>
      </button>
      <details>
        <summary>Data coverage &amp; source</summary>
        <p className="small">
          Identity and reference classifications are loaded. Isotopes, crystal
          structure, density, viscosity, and phase curves are{" "}
          <strong>not loaded</strong>.
        </p>
        <p className="small muted">
          Snapshot: {provenance.retrieved}. Original source qualifiers are
          retained.
        </p>
      </details>
      <a
        className="source-link"
        href={element.sourceUrl}
        target="_blank"
        rel="noreferrer"
      >
        View {element.name} on PubChem <span aria-hidden="true">↗</span>
      </a>
    </aside>
  );
}
