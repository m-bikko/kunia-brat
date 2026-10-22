import { expect, test } from "@playwright/test";

test("facts are real numbers and every brand has a logo", async ({ page }) => {
  await page.goto("/");
  const facts = page.locator('dl[aria-label="AXIS в фактах"]');
  await expect(facts).toContainText("398");
  await expect(facts).toContainText("позиций по Приказу № 70");
  await expect(facts).toContainText("брендов-производителей");
  await page.locator("#suppliers-title").scrollIntoViewIfNeeded();
  await expect(page.locator("#suppliers-title")).toBeVisible();
  // Logos are lazy-loaded: they get a size once the grid is scrolled into view.
  await page.getByRole("img", { name: "Fabriano" }).evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect(page.getByRole("img", { name: "Fabriano" })).toBeVisible();
  await expect(page.getByText("143")).toHaveCount(0);
});
