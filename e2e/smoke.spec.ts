import { expect, test } from "@playwright/test";

test("the landing answers in every language", async ({ page }) => {
  for (const path of ["/", "/kk", "/en"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("unknown paths are 404", async ({ page }) => {
  const response = await page.goto("/xx");
  expect(response?.status()).toBe(404);
});

test("no horizontal scroll on phones in any language", async ({ page }) => {
  for (const width of [360, 390]) {
    await page.setViewportSize({ width, height: 800 });
    for (const path of ["/", "/kk", "/en"]) {
      await page.goto(path);
      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
      expect(overflow, `${path} at ${width}px`).toBeLessThanOrEqual(0);
    }
  }
});
