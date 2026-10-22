import { expect, test, type Page } from "@playwright/test";

/** The app's JavaScript only: Turbopack serves the CSS from the same folder, and it must still load. */
const appScripts = (url: URL): boolean => url.pathname.startsWith("/_next/static/chunks/") && url.pathname.endsWith(".js");

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
  // The flight ends ≈4.4 s after boot; the boot failsafe must not be what ends it.
  await expect(html).not.toHaveAttribute("data-intro", { timeout: 5000 });
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
  await expect(page.locator("html")).not.toHaveAttribute("data-intro", { timeout: 4500 });
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

test("if the app's JavaScript never loads, the intro ends by itself and the first screen shows", async ({ page }) => {
  await page.route(appScripts, (route) => route.abort());
  await page.goto("/?intro=1");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro", { timeout: 4800 });
  await expect(page.locator(".intro")).toBeHidden();
  await expect(page.locator("[data-plan-target]")).toBeVisible();
});

test("slow JavaScript does not bring the intro back after it has faded", async ({ page }) => {
  await page.route(appScripts, async (route) => {
    await new Promise((resolve) => setTimeout(resolve, 4600));
    await route.continue();
  });
  await page.goto("/?intro=1", { waitUntil: "commit" });
  const start = Date.now();
  await page.waitForTimeout(4500);
  const shown: number[] = [];
  while (Date.now() - start < 5600) {
    const visible = await page.evaluate(() => {
      const intro = document.querySelector(".intro");
      if (!intro) return false;
      const style = getComputedStyle(intro);
      return style.display !== "none" && style.visibility === "visible" && Number(style.opacity) > 0.05;
    });
    if (visible) shown.push(Date.now() - start);
    await page.waitForTimeout(50);
  }
  expect(shown).toEqual([]);
});
