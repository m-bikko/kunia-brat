import { expect, test } from "@playwright/test";

const headlines = {
  "/": "Проектируем и оснащаем школьные кабинеты",
  "/kk": "Мектеп кабинеттерін жобалап, жабдықтаймыз",
  "/en": "We design and equip school classrooms",
} as const;

for (const [path, text] of Object.entries(headlines)) {
  test(`first screen headline on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(text);
    await expect(page.locator("[data-plan-target]")).toBeVisible();
  });
}

test("header links point at the new sections", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("banner").getByRole("navigation", { name: "AXIS" });
  await expect(nav.getByRole("link", { name: "Приказ № 70" })).toHaveAttribute("href", "/#order70");
  await expect(nav.getByRole("link", { name: "Кабинеты" })).toHaveAttribute("href", "/#index");
});
