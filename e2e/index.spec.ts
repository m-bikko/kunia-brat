import { expect, test } from "@playwright/test";

test("index lists eight classrooms and previews the hovered one", async ({ page }) => {
  await page.goto("/#index");
  const index = page.locator("#index");
  await expect(index.getByRole("listitem")).toHaveCount(8);
  await index.getByRole("listitem").filter({ hasText: "Гончарная студия" }).hover();
  await expect(index.getByTestId("index-caption")).toContainText("POT");
  await expect(index.getByRole("link", { name: "Гончарная студия", exact: true })).toHaveAttribute("href", "/goncharnaya-studiya");
  await expect(index.getByRole("link", { name: "3D-тур: Информатика" })).toHaveAttribute("href", "/virtual-classroom");
});
