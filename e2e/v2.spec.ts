import { expect, test } from "@playwright/test";

const pages = [
  { path: "/v2", lang: "ru" },
  { path: "/kk/v2", lang: "kk" },
  { path: "/en/v2", lang: "en" },
] as const;

for (const { path, lang } of pages) {
  test(`${path} renders the soft version in ${lang}, closed to indexing`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => {
      if (message.type() === "error") errors.push(message.text());
    });
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.locator("html")).toHaveAttribute("lang", lang);
    await expect(page.locator(".v2")).toBeVisible();
    await expect(page.locator('meta[name="robots"]')).toHaveAttribute("content", /noindex/);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
    expect(errors).toEqual([]);
  });
}

test("the language switcher stays on v2", async ({ page }) => {
  await page.goto("/v2");
  await page.getByRole("navigation", { name: /язык/i }).first().getByRole("link", { name: "English" }).click();
  await expect(page).toHaveURL(/\/en\/v2$/);
});

test("v2 is not in the sitemap", async ({ request }) => {
  const body = await (await request.get("/sitemap.xml")).text();
  expect(body).not.toContain("/v2");
});

test("Kazakh letters are drawn by Nunito on /kk/v2", async ({ page }) => {
  await page.goto("/kk/v2");
  const uncovered = await page.evaluate(async () => {
    const heading = document.querySelector("h1");
    if (!heading) return ["no h1"];
    const family = getComputedStyle(heading).fontFamily.split(",")[0]?.trim() ?? "";
    if (!/nunito/i.test(family)) return [`family ${family}`];
    const letters = "әғқңөұүһі";
    const faces = await document.fonts.load(`800 32px ${family}`, letters);
    const covers = (range: string, code: number): boolean =>
      range.split(",").some((part) => {
        const [low, high] = part.trim().replace(/^U\+/i, "").split("-");
        const from = parseInt(low ?? "", 16);
        const to = high ? parseInt(high, 16) : from;
        return code >= from && code <= to;
      });
    return [...letters].filter((letter) => !faces.some((face) => covers(face.unicodeRange, letter.codePointAt(0) ?? 0)));
  });
  expect(uncovered).toEqual([]);
});

test("the phone menu keeps focus inside and closes with Escape", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 800 });
  await page.goto("/v2");
  const open = page.getByRole("button", { name: /меню/i });
  await open.click();
  const dialog = page.getByRole("dialog");
  await expect(dialog).toBeVisible();
  for (let i = 0; i < 15; i += 1) {
    await page.keyboard.press("Tab");
    expect(await dialog.evaluate((node) => node.contains(document.activeElement))).toBe(true);
  }
  await page.keyboard.press("Escape");
  await expect(dialog).toBeHidden();
  await expect(open).toBeFocused();
});

for (const width of [360, 390]) {
  for (const { path } of pages) {
    test(`${path} has no horizontal scroll at ${width}px`, async ({ page }) => {
      await page.setViewportSize({ width, height: 800 });
      await page.goto(path);
      expect(await page.evaluate(() => document.documentElement.scrollWidth)).toBeLessThanOrEqual(width);
    });
  }
}

test("the first screen shows the classroom as the intro target with three labels", async ({ page }) => {
  await page.goto("/v2");
  const art = page.locator("[data-intro-target]");
  await expect(art).toBeVisible();
  await expect(art).toHaveAttribute("role", "img");
  await expect(page.locator("[data-callout]")).toHaveCount(3);
  await expect(page.getByRole("link", { name: /Приказу № 70/ }).first()).toHaveAttribute("href", "/v2#order70");
  await expect(page.locator("#stages li")).toHaveCount(4);
});

test("v2 tool: tick, count and send N items with the keyboard only", async ({ page }) => {
  await page.goto("/v2#order70");
  const tool = page.locator("#order70");
  const tabs = tool.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await expect(tabs.nth(1)).toBeFocused();
  await page.keyboard.press("ArrowLeft");
  await expect(tabs.first()).toHaveAttribute("aria-selected", "true");
  const first = tool.getByRole("tabpanel").getByRole("checkbox").first();
  await first.focus();
  await page.keyboard.press("Space");
  await expect(tool.getByTestId("order70-have")).toHaveText("1");
  await expect(tool.getByTestId("order70-need")).toHaveText("21");
  const send = tool.getByRole("link", { name: /Отправить 21 позицию на расчёт/ });
  await expect(send).toBeVisible();
  expect(new URL((await send.getAttribute("href")) ?? "").searchParams.get("text")).toContain("Информатика");
  await expect(tool.getByText("Есть 1 из 22")).toBeAttached();
});

test("eight cabinet cards link to their pages and show their Order 70 size", async ({ page }) => {
  await page.goto("/v2#index");
  const cards = page.locator("#index [data-cabinet]");
  await expect(cards).toHaveCount(8);
  await expect(cards.first().getByRole("link").first()).toHaveAttribute("href", "/kabinet-informatiki");
  await expect(cards.first()).toContainText("22 позиции");
});

test("the process assembles the classroom step by step", async ({ page }) => {
  await page.goto("/v2#process");
  await expect(page.locator("#process [data-step]")).toHaveCount(4);
  await expect(page.locator("#process [data-stage]")).not.toHaveCount(0);
});
