import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";

test("bundled explorer works without APIs, supports keyboard, filters, and details", async ({
  page,
}) => {
  const errors: string[] = [];
  page.on("pageerror", (error) => errors.push(error.message));
  page.on("console", (message) => {
    if (message.type() === "error") errors.push(message.text());
  });
  await page.route("**/api/**", (route) => route.abort());
  await page.goto("/");
  await expect(page).toHaveTitle("Gold Shore Matter Atlas");
  await expect(page.getByRole("heading", { level: 1 })).toContainText("Matter");
  await expect(page.getByRole("button", { name: /^\d+ / })).toHaveCount(118);
  const he = page.getByRole("button", { name: /^2 / });
  await he.focus();
  await page.keyboard.press("ArrowRight");
  await expect(page.getByRole("button", { name: /^3 / })).toBeFocused();
  await expect(
    page.getByRole("heading", { name: "Lithium", exact: true }),
  ).toBeVisible();
  await page.getByRole("searchbox").fill("  aluminum  ");
  await page.getByRole("button", { name: /^13 / }).click();
  await expect(
    page.getByLabel("Element details").getByRole("heading", { level: 2 }),
  ).toHaveText(/Alumin/);
  await page
    .getByRole("combobox", { name: "Family", exact: true })
    .selectOption("Noble gas");
  await expect(
    page.getByText("No elements match these filters."),
  ).toBeVisible();
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page
    .getByRole("combobox", { name: "Standard state", exact: true })
    .selectOption("Liquid");
  await expect(page.getByRole("button", { name: /^\d+ / })).toHaveCount(2);
  await page.getByRole("button", { name: "Reset filters" }).click();
  await page.getByRole("searchbox").fill("Og");
  await page.getByRole("button", { name: /^118 / }).click();
  await expect(
    page.getByLabel("Element details").getByText("Expected to be a Gas"),
  ).toBeVisible();
  await expect(
    page.getByRole("link", { name: "View Oganesson on PubChem" }),
  ).toHaveAttribute(
    "href",
    "https://pubchem.ncbi.nlm.nih.gov/element/Oganesson",
  );
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
  expect(errors).toEqual([]);
});

test("comparison updates selections and validates condition inputs without inventing data", async ({
  page,
}) => {
  await page.goto("/");
  await page.getByRole("button", { name: "Compare He as material A" }).click();
  await expect(page.getByLabel("Material A")).toHaveValue("2");
  await page.getByLabel("Material A").selectOption("79");
  await page.getByLabel("Material B").selectOption("8");
  const table = page.getByRole("table", { name: "Element comparison" });
  await expect(table.getByRole("columnheader", { name: "Gold" })).toBeVisible();
  await expect(
    table.getByRole("columnheader", { name: "Oxygen" }),
  ).toBeVisible();
  await expect(table.getByText("Not loaded")).toHaveCount(6);
  await page.getByLabel("Temperature unit").selectOption("C");
  await page.getByLabel("Temperature", { exact: true }).fill("0");
  await expect(page.getByText("273.15 K · 101325 Pa")).toBeVisible();
  await page.getByLabel("Pressure unit").selectOption("bar");
  await page.getByLabel("Pressure", { exact: true }).fill("1");
  await expect(page.getByText("273.15 K · 100000 Pa")).toBeVisible();
  await page.getByLabel("Temperature", { exact: true }).fill("-274");
  await expect(page.getByRole("alert")).toBeVisible();
  await expect(page.getByText("273.15 K · 100000 Pa")).toHaveCount(0);
  await page.getByLabel("Temperature", { exact: true }).fill("0");
  await page.getByLabel("Pressure", { exact: true }).fill("0");
  await expect(page.getByRole("alert")).toBeVisible();
});

test("no serious accessibility findings or horizontal page overflow", async ({
  page,
}) => {
  await page.goto("/");
  await expect(page.getByRole("button", { name: /^\d+ / })).toHaveCount(118);
  await page.getByText("Data coverage & source", { exact: true }).click();
  const scan = await new AxeBuilder({ page })
    .withTags(["wcag2a", "wcag2aa", "wcag21a", "wcag21aa"])
    .analyze();
  expect(
    scan.violations.map((v) => ({
      id: v.id,
      impact: v.impact,
      targets: v.nodes.map((n) => n.target),
    })),
  ).toEqual([]);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= innerWidth,
    ),
  ).toBe(true);
});
