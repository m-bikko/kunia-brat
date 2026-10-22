import { expect, test } from "@playwright/test";

/** Cartoon intros built so far; each plays on both versions. */
const cartoonKinds = ["pop", "blocks"] as const;

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
