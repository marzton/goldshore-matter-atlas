import snapshot from "./data/pubchem-elements.json";

export interface ElementRecord {
  readonly number: number;
  readonly symbol: string;
  readonly name: string;
  readonly family: string;
  readonly standardState: string;
  readonly state: string;
  readonly stateKind: "reported" | "predicted";
  readonly electronConfiguration: string;
  readonly period: number;
  readonly group: number | null;
  readonly row: number;
  readonly column: number;
  readonly sourceUrl: string;
}

function position(n: number): {
  period: number;
  group: number | null;
  row: number;
  column: number;
} {
  const period =
    n <= 2
      ? 1
      : n <= 10
        ? 2
        : n <= 18
          ? 3
          : n <= 36
            ? 4
            : n <= 54
              ? 5
              : n <= 86
                ? 6
                : 7;
  if (n >= 57 && n <= 71)
    return { period, group: null, row: 8, column: n - 54 };
  if (n >= 89 && n <= 103)
    return { period, group: null, row: 9, column: n - 86 };
  const group =
    n === 1
      ? 1
      : n === 2
        ? 18
        : n <= 10
          ? n <= 4
            ? n - 2
            : n + 8
          : n <= 18
            ? n <= 12
              ? n - 10
              : n
            : n <= 36
              ? n - 18
              : n <= 54
                ? n - 36
                : n <= 56
                  ? n - 54
                  : n <= 86
                    ? n - 68
                    : n <= 88
                      ? n - 86
                      : n - 100;
  return { period, group, row: period, column: group };
}

export const elements: readonly ElementRecord[] = Object.freeze(
  snapshot.elements.map((e) =>
    Object.freeze({
      ...e,
      ...position(e.number),
      state: e.standardState.replace("Expected to be a ", ""),
      stateKind: e.standardState.startsWith("Expected")
        ? ("predicted" as const)
        : ("reported" as const),
      sourceUrl: `https://pubchem.ncbi.nlm.nih.gov/element/${encodeURIComponent(e.name)}`,
    }),
  ),
);
export const families = [...new Set(elements.map((e) => e.family))].sort();
export const provenance = {
  name: snapshot.source,
  retrieved: snapshot.retrieved,
  url: snapshot.url,
};

export function filterElements(
  records: readonly ElementRecord[],
  query: string,
  family: string,
  state: string,
): ElementRecord[] {
  const term = query.trim().toLowerCase();
  const alias = (
    { aluminum: 13, aluminium: 13, cesium: 55, caesium: 55 } as Record<
      string,
      number
    >
  )[term];
  const exactSymbol = records.find((e) => e.symbol.toLowerCase() === term);
  return records.filter(
    (e) =>
      (!family || e.family === family) &&
      (!state || e.state === state) &&
      (!term ||
        (alias
          ? e.number === alias
          : exactSymbol
            ? e.number === exactSymbol.number
            : /^\d+$/.test(term)
              ? e.number === Number(term)
              : e.name.toLowerCase().includes(term))),
  );
}

export function parseConditions(
  temperature: string,
  temperatureUnit: "K" | "C",
  pressure: string,
  pressureUnit: "Pa" | "bar",
) {
  if (!temperature.trim() || !pressure.trim()) return null;
  const temperatureK =
    Number(temperature) + (temperatureUnit === "C" ? 273.15 : 0);
  const pressurePa = Number(pressure) * (pressureUnit === "bar" ? 100000 : 1);
  return Number.isFinite(temperatureK) &&
    temperatureK >= 0 &&
    Number.isFinite(pressurePa) &&
    pressurePa > 0
    ? { temperatureK, pressurePa }
    : null;
}

export function familyClass(family: string) {
  return family.toLowerCase().replaceAll(" ", "-");
}
