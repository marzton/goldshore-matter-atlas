import { fireEvent, render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import App from "./App";

describe("element explorer", () => {
  it("renders all 118 accessible element buttons and the initial detail without fetching", () => {
    render(<App />);
    expect(screen.getAllByRole("button", { name: /^\d+ / })).toHaveLength(118);
    expect(screen.getByRole("heading", { name: "Helium" })).toBeVisible();
    expect(
      screen.getByRole("link", { name: "View Helium on PubChem" }),
    ).toHaveAttribute(
      "href",
      "https://pubchem.ncbi.nlm.nih.gov/element/Helium",
    );
  });
  it("searches, selects, combines filters, handles no results, and resets", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByRole("searchbox"), "aluminum");
    await user.click(screen.getByRole("button", { name: /^13 / }));
    expect(screen.getByRole("heading", { name: /Alumin/ })).toBeVisible();
    await user.selectOptions(screen.getByLabelText("Family"), "Noble gas");
    expect(screen.getByText("No elements match these filters.")).toBeVisible();
    await user.click(screen.getByRole("button", { name: "Reset filters" }));
    expect(screen.getAllByRole("button", { name: /^\d+ / })).toHaveLength(118);
    await user.selectOptions(screen.getByLabelText("Standard state"), "Liquid");
    expect(screen.getAllByRole("button", { name: /^\d+ / })).toHaveLength(2);
  });
  it("selects by keyboard and exposes predicted state as text", async () => {
    const user = userEvent.setup();
    render(<App />);
    const og = screen.getByRole("button", { name: /^118 / });
    og.focus();
    await user.keyboard("{Enter}");
    expect(screen.getByRole("heading", { name: "Oganesson" })).toBeVisible();
    expect(
      within(screen.getByLabelText("Element details")).getByText(
        "Expected to be a Gas",
      ),
    ).toBeVisible();
  });
  it("moves focus and selection between element buttons with arrow keys", () => {
    render(<App />);
    const he = screen.getByRole("button", { name: /^2 / });
    he.focus();
    fireEvent.keyDown(he, { key: "ArrowRight" });
    expect(screen.getByRole("button", { name: /^3 / })).toHaveFocus();
    expect(screen.getByRole("heading", { name: "Lithium" })).toBeVisible();
  });
});

describe("comparison", () => {
  it("supports two independent choices and shows condition-specific properties as not loaded", async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.selectOptions(screen.getByLabelText("Material A"), "79");
    await user.selectOptions(screen.getByLabelText("Material B"), "8");
    const comparison = screen.getByRole("table", {
      name: "Element comparison",
    });
    expect(within(comparison).getByText("Gold")).toBeVisible();
    expect(within(comparison).getByText("Oxygen")).toBeVisible();
    expect(
      within(comparison).getAllByText("Not loaded").length,
    ).toBeGreaterThan(0);
    await user.selectOptions(screen.getByLabelText("Temperature unit"), "C");
    const t = screen.getByLabelText("Temperature");
    await user.clear(t);
    await user.type(t, "0");
    expect(screen.getByText("273.15 K · 101325 Pa")).toBeVisible();
    await user.clear(t);
    await user.type(t, "-274");
    expect(screen.getByRole("alert")).toHaveTextContent(
      "Enter a finite temperature at or above 0 K and a pressure above 0 Pa.",
    );
    expect(screen.queryByText("273.15 K · 101325 Pa")).not.toBeInTheDocument();
  });
});
