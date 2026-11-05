import { describe, expect, it } from "vitest";
import { elements, filterElements, parseConditions } from "./elements";

describe("bundled scientific baseline", () => {
  it("has exactly 118 unique sequential identities and chart positions", () => {
    expect(elements.map((e) => e.number)).toEqual(
      Array.from({ length: 118 }, (_, i) => i + 1),
    );
    expect(new Set(elements.map((e) => e.symbol)).size).toBe(118);
    expect(new Set(elements.map((e) => `${e.row}:${e.column}`)).size).toBe(118);
    expect(elements[0]).toMatchObject({
      name: "Hydrogen",
      symbol: "H",
      period: 1,
      group: 1,
      row: 1,
      column: 1,
    });
    expect(elements[117]).toMatchObject({
      name: "Oganesson",
      symbol: "Og",
      period: 7,
      group: 18,
      row: 7,
      column: 18,
    });
  });
  it("separates detached display rows from scientific periods and unassigned groups", () => {
    expect(elements[56]).toMatchObject({
      period: 6,
      group: null,
      row: 8,
      column: 3,
    });
    expect(elements[70]).toMatchObject({
      period: 6,
      group: null,
      row: 8,
      column: 17,
    });
    expect(elements[88]).toMatchObject({
      period: 7,
      group: null,
      row: 9,
      column: 3,
    });
    expect(elements[102]).toMatchObject({
      period: 7,
      group: null,
      row: 9,
      column: 17,
    });
    expect(elements[71]).toMatchObject({
      period: 6,
      group: 4,
      row: 6,
      column: 4,
    });
  });
  it("retains predicted state qualifiers from PubChem", () => {
    expect(elements[117].standardState).toBe("Expected to be a Gas");
    expect(elements[117].stateKind).toBe("predicted");
    expect(elements[1].stateKind).toBe("reported");
    expect(
      elements.every((e) =>
        e.sourceUrl.startsWith("https://pubchem.ncbi.nlm.nih.gov/"),
      ),
    ).toBe(true);
  });
});

describe("search and combined filters", () => {
  it("prioritizes every exact full name over partial-name collisions", () => {
    for (const record of elements) {
      expect(
        filterElements(elements, record.name, "", "").map((e) => e.number),
        record.name,
      ).toEqual([record.number]);
    }
  });
  it.each([
    [" hE ", 2],
    ["helium", 2],
    ["13", 13],
    ["aluminum", 13],
    ["aluminium", 13],
    ["cesium", 55],
    ["caesium", 55],
  ])("finds %s", (query, number) => {
    expect(
      filterElements(elements, query, "", "").map((e) => e.number),
    ).toEqual([number]);
  });
  it("uses exact atomic numbers and supports partial names and empty results", () => {
    expect(filterElements(elements, "1", "", "").map((e) => e.number)).toEqual([
      1,
    ]);
    expect(filterElements(elements, "xen", "", "")[0].symbol).toBe("Xe");
    expect(filterElements(elements, "<script>", "", "")).toEqual([]);
    expect(filterElements(elements, "119", "", "")).toEqual([]);
  });
  it("combines family, state, and text filters without losing prediction labels", () => {
    expect(filterElements(elements, "", "Noble gas", "Gas").length).toBe(7);
    expect(
      filterElements(elements, "og", "Noble gas", "Gas")[0].stateKind,
    ).toBe("predicted");
    expect(filterElements(elements, "helium", "Alkali metal", "")).toEqual([]);
  });
});

describe("comparison conditions", () => {
  it("converts Celsius and bar to SI without deriving any measurements", () => {
    expect(parseConditions("0", "C", "1", "bar")).toEqual({
      temperatureK: 273.15,
      pressurePa: 100000,
    });
    expect(parseConditions("0", "K", "101325", "Pa")).toEqual({
      temperatureK: 0,
      pressurePa: 101325,
    });
  });
  it.each([
    ["", "K", "1", "Pa"],
    ["-1", "K", "1", "Pa"],
    ["-274", "C", "1", "bar"],
    ["Infinity", "K", "1", "Pa"],
    ["2", "K", "0", "Pa"],
    ["2", "K", "-1", "Pa"],
    ["2", "K", "", "Pa"],
    ["2", "K", "1e309", "bar"],
  ])("rejects invalid %s %s, %s %s", (t, tu, p, pu) => {
    expect(
      parseConditions(t, tu as "K" | "C", p, pu as "Pa" | "bar"),
    ).toBeNull();
  });
});
