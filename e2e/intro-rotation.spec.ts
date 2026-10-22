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
      page.on("pageerror", (error) => errors.push(error.message));
      await page.goto(`${path}?intro=${kind}`);
      await expect(page.locator("html")).toHaveAttribute("data-intro-kind", kind);
      await expect(page.locator(`.intro-scene[data-kind="${kind}"]`)).toBeVisible();
      // The controller took over (otherwise only the boot failsafe would end the intro, at 4.4 s).
      await expect(page.locator(".intro")).toHaveAttribute("data-js", "", { timeout: 3000 });
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

test("cartoon intro captions keep their rounded bold style on v1", async ({ page }) => {
  await page.goto("/?intro=pop");
  const caption = page.locator('.intro-scene[data-kind="pop"] .intro-caption-soft');
  await expect(caption).toBeAttached();
  const style = await caption.evaluate((node) => {
    const computed = getComputedStyle(node);
    return { weight: computed.fontWeight, size: parseFloat(computed.fontSize) };
  });
  expect(style.weight).toBe("800");
  expect(style.size).toBeGreaterThanOrEqual(18);
});

test("the pop box leaves straight down, centred under the room", async ({ page }) => {
  await page.goto("/v2?intro=pop", { waitUntil: "commit" });
  await page.waitForTimeout(1350);
  const offset = await page.evaluate(() => {
    const box = document.querySelector(".intro-pop-box")?.getBoundingClientRect();
    const room = document.querySelector('.intro-scene[data-kind="pop"] [data-intro-subject]')?.getBoundingClientRect();
    return box && room ? Math.abs(box.left + box.width / 2 - (room.left + room.width / 2)) : 999;
  });
  expect(offset).toBeLessThan(12);
});

