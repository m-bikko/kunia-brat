import { expect, test } from "@playwright/test";

for (const path of ["/", "/v2"]) test(`button-styled links and buttons on ${path} show a visible keyboard focus ring`, async ({ page }) => {
  await page.goto(path);
  await page.keyboard.press("Tab");
  const offenders = await page.evaluate(() => {
    const controls = [...document.querySelectorAll<HTMLElement>('[class~="group/button"]')].filter(
      (element) => element.getClientRects().length > 0,
    );
    return controls
      .map((element) => {
        element.focus();
        const style = getComputedStyle(element);
        const ring = style.outlineStyle !== "none" && parseFloat(style.outlineWidth) >= 2;
        return ring ? null : (element.textContent ?? "").trim().slice(0, 40);
      })
      .filter((label): label is string => label !== null);
  });
  expect(offenders).toEqual([]);
});

/** Contrast of every visible text run against the colour actually behind it (WCAG AA). */
for (const path of ["/", "/en", "/v2", "/kk/v2", "/en/v2"]) {
  test(`text on ${path} meets WCAG AA contrast`, async ({ page }) => {
    await page.goto(path);
    await page.evaluate(async () => {
      for (let y = 0; y < document.documentElement.scrollHeight; y += 700) {
        window.scrollTo(0, y);
        await new Promise((resolve) => setTimeout(resolve, 60));
      }
    });
    await page.waitForTimeout(1200);

    const failures = await page.evaluate(() => {
      type Rgba = [number, number, number, number];
      // Tailwind v4 colours compute to oklab()/color(); a canvas converts any CSS colour to sRGB.
      const context = document.createElement("canvas").getContext("2d", { willReadFrequently: true });
      const parse = (value: string): Rgba => {
        if (!context) return [0, 0, 0, 0];
        context.clearRect(0, 0, 1, 1);
        context.fillStyle = value;
        context.fillRect(0, 0, 1, 1);
        const [r = 0, g = 0, b = 0, a = 0] = context.getImageData(0, 0, 1, 1).data;
        return [r, g, b, a / 255];
      };
      const over = (top: Rgba, bottom: Rgba): Rgba => {
        const alpha = top[3] + bottom[3] * (1 - top[3]);
        const mix = (i: number): number => (top[i] * top[3] + bottom[i] * bottom[3] * (1 - top[3])) / (alpha || 1);
        return [mix(0), mix(1), mix(2), alpha];
      };
      const luminance = ([r, g, b]: Rgba): number => {
        const channel = (c: number): number => {
          const s = c / 255;
          return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4;
        };
        return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b);
      };
      const backgroundOf = (element: Element): Rgba | null => {
        const layers: Rgba[] = [];
        for (let node: Element | null = element; node; node = node.parentElement) {
          const style = getComputedStyle(node);
          if (node instanceof HTMLImageElement || node.tagName === "VIDEO") return null;
          const color = parse(style.backgroundColor);
          if (color[3] > 0) layers.push(color);
          if (color[3] >= 1) break;
          if (style.backgroundImage.includes("url(")) return null;
        }
        return layers.reduceRight<Rgba>((acc, layer) => over(layer, acc), [255, 255, 255, 1]);
      };
      const opacityOf = (element: Element): number => {
        let value = 1;
        for (let node: Element | null = element; node; node = node.parentElement) value *= Number(getComputedStyle(node).opacity);
        return value;
      };

      const results: string[] = [];
      const walker = document.createTreeWalker(document.querySelector("main") ?? document.body, NodeFilter.SHOW_TEXT);
      const seen = new Set<Element>();
      for (let text = walker.nextNode(); text; text = walker.nextNode()) {
        const element = text.parentElement;
        if (!element || seen.has(element) || !(text.textContent ?? "").trim()) continue;
        seen.add(element);
        if (element.closest("[aria-hidden='true'], .sr-only, button:disabled, svg, .intro")) continue;
        if (element.getClientRects().length === 0 || opacityOf(element) < 0.05) continue;
        const style = getComputedStyle(element);
        if (style.visibility !== "visible") continue;
        const background = backgroundOf(element);
        if (!background) continue;
        const color = parse(style.color);
        const foreground = over([color[0], color[1], color[2], color[3] * opacityOf(element)], background);
        const [light, dark] = [luminance(foreground), luminance(background)].sort((a, b) => b - a);
        const ratio = (light + 0.05) / (dark + 0.05);
        const size = parseFloat(style.fontSize);
        const large = size >= 24 || (size >= 18.66 && Number(style.fontWeight) >= 700);
        if (ratio < (large ? 3 : 4.5)) results.push(`${ratio.toFixed(2)} ${(text.textContent ?? "").trim().slice(0, 32)}`);
      }
      return results;
    });
    expect(failures).toEqual([]);
  });
}

test("the focus ring inside the white closing card is brand blue, not yellow", async ({ page }) => {
  await page.goto("/v2");
  await page.keyboard.press("Tab");
  const color = await page.locator("#contact select").evaluate((select) => {
    (select as HTMLSelectElement).focus();
    return getComputedStyle(select).outlineColor;
  });
  expect(color).toBe("rgb(48, 89, 223)");
});

test("under reduced motion the cabinet cards do not move on hover", async ({ page }) => {
  await page.emulateMedia({ reducedMotion: "reduce" });
  await page.goto("/v2#index");
  const card = page.locator("#index [data-cabinet]").first();
  await card.hover();
  await page.waitForTimeout(400);
  const moved = await card.evaluate((node) => {
    const style = getComputedStyle(node);
    return { translate: style.translate, rotate: style.rotate, transform: style.transform };
  });
  expect(moved).toEqual({ translate: "none", rotate: "none", transform: "none" });
});

test("phones do not download the hover-only concept renders", async ({ browser }) => {
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true });
  const page = await context.newPage();
  const renders: string[] = [];
  page.on("request", (request) => {
    if (/(%2F|\/)(informatics|art|sewing|pottery|workshop|kazakh|russian|english)\.[\w-]+\.webp/.test(request.url())) renders.push(request.url());
  });
  await page.goto("/v2");
  expect(await page.evaluate(() => matchMedia("(hover: none)").matches)).toBe(true);
  await page.locator("#index").scrollIntoViewIfNeeded();
  await page.evaluate(() => window.scrollBy(0, 2400));
  await page.waitForTimeout(800);
  expect(renders).toEqual([]);
  await context.close();
});
