import { expect, test, type Page } from "@playwright/test";

/** Automated browsers never get the intro; pretend to be a regular visitor. */
const asVisitor = async (page: Page): Promise<void> => {
  await page.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }));
};

test("plays once per session and hands over to the first screen", async ({ page }) => {
  await asVisitor(page);
  await page.goto("/");
  const html = page.locator("html");
  await expect(html).toHaveAttribute("data-intro", "play");
  await expect(page.locator(".intro")).toBeVisible();
  await expect(html).not.toHaveAttribute("data-intro", { timeout: 7000 });
  await expect(page.locator(".intro")).toBeHidden();
  await expect(page.locator("[data-plan-target]")).toBeVisible();
  await page.reload();
  await expect(html).not.toHaveAttribute("data-intro");
});

test("Escape skips the intro", async ({ page }) => {
  await page.goto("/?intro=1");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
  await page.waitForTimeout(800);
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro", { timeout: 1500 });
});

test("deep links skip the intro", async ({ page }) => {
  await asVisitor(page);
  await page.goto("/#order70");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
});

test("narrow screens fade the intro out instead of flying", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?intro=1");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro", { timeout: 7000 });
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
});

test("first screen works without JavaScript", async ({ browser }) => {
  const context = await browser.newContext({ javaScriptEnabled: false });
  const page = await context.newPage();
  await page.goto("/");
  await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  await expect(page.locator(".intro")).toBeHidden();
  await context.close();
});
