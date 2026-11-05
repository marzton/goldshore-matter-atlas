import { useState } from "react";
import { elements, parseConditions } from "./elements";

export function Comparison({
  first,
  onFirstChange,
}: {
  first: number;
  onFirstChange: (number: number) => void;
}) {
  const [second, setSecond] = useState(13);
  const [temperature, setTemperature] = useState("293.15");
  const [temperatureUnit, setTemperatureUnit] = useState<"K" | "C">("K");
  const [pressure, setPressure] = useState("101325");
  const [pressureUnit, setPressureUnit] = useState<"Pa" | "bar">("Pa");
  const conditions = parseConditions(
    temperature,
    temperatureUnit,
    pressure,
    pressureUnit,
  );
  const a = elements[first - 1],
    b = elements[second - 1];
  return (
    <section
      className="comparison panel"
      id="compare"
      aria-labelledby="compare-heading"
    >
      <div className="section-heading">
        <div>
          <div className="eyebrow">02 / SIDE BY SIDE</div>
          <h2 id="compare-heading">Compare at the same conditions.</h2>
        </div>
        <span className="badge">REFERENCE + COVERAGE</span>
      </div>
      <p className="muted comparison-intro">
        Start with helium and aluminium, then choose any pair. Element
        references are not isotope-specific material models.
      </p>
      <div className="comparison-controls">
        <label>
          Material A
          <select
            id="compare-material-a"
            value={first}
            onChange={(e) => onFirstChange(Number(e.target.value))}
          >
            {elements.map((e) => (
              <option value={e.number} key={e.number}>
                {e.symbol} · {e.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Material B
          <select
            value={second}
            onChange={(e) => setSecond(Number(e.target.value))}
          >
            {elements.map((e) => (
              <option value={e.number} key={e.number}>
                {e.symbol} · {e.name}
              </option>
            ))}
          </select>
        </label>
        <label>
          Temperature
          <input
            type="number"
            step="any"
            value={temperature}
            aria-invalid={!conditions}
            aria-describedby="conditions-note"
            onChange={(e) => setTemperature(e.target.value)}
          />
        </label>
        <label>
          Temperature unit
          <select
            value={temperatureUnit}
            onChange={(e) => setTemperatureUnit(e.target.value as "K" | "C")}
          >
            <option value="K">Kelvin (K)</option>
            <option value="C">Celsius (°C)</option>
          </select>
        </label>
        <label>
          Pressure
          <input
            type="number"
            step="any"
            value={pressure}
            aria-invalid={!conditions}
            aria-describedby="conditions-note"
            onChange={(e) => setPressure(e.target.value)}
          />
        </label>
        <label>
          Pressure unit
          <select
            value={pressureUnit}
            onChange={(e) => setPressureUnit(e.target.value as "Pa" | "bar")}
          >
            <option value="Pa">Pascal (Pa)</option>
            <option value="bar">Bar</option>
          </select>
        </label>
      </div>
      {conditions ? (
        <p className="conditions" aria-live="polite">
          {Number(conditions.temperatureK.toPrecision(10))} K ·{" "}
          {Number(conditions.pressurePa.toPrecision(10))} Pa
        </p>
      ) : (
        <p className="error" role="alert">
          Enter a finite temperature at or above 0 K and a pressure above 0 Pa.
        </p>
      )}
      <div
        className="comparison-scroll"
        tabIndex={0}
        role="region"
        aria-label="Comparison data, scroll horizontally on small screens"
      >
        <table aria-label="Element comparison">
          <thead>
            <tr>
              <th scope="col">Reference property</th>
              <th scope="col">{a.name}</th>
              <th scope="col">{b.name}</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th scope="row">Atomic number</th>
              <td>{a.number}</td>
              <td>{b.number}</td>
            </tr>
            <tr>
              <th scope="row">Family</th>
              <td>{a.family}</td>
              <td>{b.family}</td>
            </tr>
            <tr>
              <th scope="row">Source standard state</th>
              <td>{a.standardState}</td>
              <td>{b.standardState}</td>
            </tr>
            {[
              "Phase at these conditions",
              "Density (kg/m³)",
              "Dynamic viscosity (Pa·s)",
            ].map((property) => (
              <tr key={property}>
                <th scope="row">{property}</th>
                <td data-status="not_loaded">Not loaded</td>
                <td data-status="not_loaded">Not loaded</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted" id="conditions-note">
        Conditions define the comparison context only. No phase, isotope, or
        property calculation is performed. Missing measurements are not zero;
        standard-state references do not change with these inputs.
      </p>
    </section>
  );
}
