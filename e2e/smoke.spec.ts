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
