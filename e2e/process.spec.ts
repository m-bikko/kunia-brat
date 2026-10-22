import { expect, test } from "@playwright/test";

test("the classroom assembles as the steps scroll past", async ({ page }) => {
  await page.goto("/#process");
  const steps = page.locator("#process ol > li");
  await expect(steps).toHaveCount(4);
  await steps.nth(3).evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect(steps.nth(3)).toHaveAttribute("aria-current", "step");
  await steps.nth(0).evaluate((element) => element.scrollIntoView({ block: "center" }));
  await expect(steps.nth(0)).toHaveAttribute("aria-current", "step");
});

test("process heading uses the drawing sheet tag", async ({ page }) => {
  await page.goto("/#process");
  await expect(page.locator("#process")).toContainText("Лист 04");
});
