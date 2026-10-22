import { expect, test } from "@playwright/test";

/** Cartoon intros built so far; each plays on both versions. */
const cartoonKinds = ["pop", "blocks", "pencil", "bell"] as const;

for (const kind of cartoonKinds) {
  for (const path of ["/", "/v2"]) {
    test(`${kind} plays on ${path} and hands over by 4.6 s`, async ({ page }) => {
      const errors: string[] = [];
      page.on("console", (message) => {
        if (message.type() === "error") errors.push(message.text());
      });
      await page.goto(`${path}?intro=${kind}`);
      await expect(page.locator("html")).toHaveAttribute("data-intro-kind", kind);
      await expect(page.locator(`.intro-scene[data-kind="${kind}"]`)).toBeVisible();
      await expect(page.locator("html")).not.toHaveAttribute("data-intro", { timeout: 4600 });
      await expect(page.locator("[data-intro-target]").first()).toBeVisible();
      expect(errors).toEqual([]);
    });
  }
}

test("v2 never plays the blueprint and two visits in a row differ", async ({ page }) => {
  const kinds: string[] = [];
  for (let visit = 0; visit < 8; visit += 1) {
    await page.goto("/v2?intro=1");
    kinds.push((await page.locator("html").getAttribute("data-intro-kind")) ?? "none");
  }
  expect(kinds).not.toContain("blueprint");
  expect(kinds).not.toContain("none");
  kinds.slice(1).forEach((kind, index) => expect(kind).not.toBe(kinds[index]));
});

test("each version plays once per session on its own", async ({ page }) => {
  await page.addInitScript(() => Object.defineProperty(navigator, "webdriver", { get: () => false }));
  await page.goto("/v2");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
  await page.goto("/");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
  await page.goto("/v2");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro");
});

test("blocked storage still plays an intro from the pool", async ({ page }) => {
  await page.addInitScript(() => {
    Object.defineProperty(window, "localStorage", {
      get: () => {
        throw new Error("blocked");
      },
    });
  });
  await page.goto("/v2?intro=1");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
  await expect(page.locator("html")).toHaveAttribute("data-intro-kind", /^(pop|blocks|pencil|bell)$/);
});

for (const path of ["/", "/v2"]) {
  test(`intro markup on ${path} stays under 80 KB`, async ({ page }) => {
    await page.goto(path);
    const size = await page.evaluate(() => document.querySelector(".intro")?.outerHTML.length ?? 0);
    expect(size).toBeGreaterThan(0);
    expect(size).toBeLessThan(80_000);
  });
}
