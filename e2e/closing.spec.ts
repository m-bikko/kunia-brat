import { expect, test } from "@playwright/test";

test("the closing form prepares a WhatsApp request for the chosen classroom", async ({ page }) => {
  await page.goto("/#contact");
  const form = page.locator("#contact");
  await expect(form).toContainText("Лист 08");
  await form.getByRole("combobox").selectOption("pottery");
  const href = await form.getByRole("link", { name: /Запросить расчёт/ }).getAttribute("href");
  expect(new URL(href ?? "").searchParams.get("text")).toContain("Гончарная студия");
});

test("notes open one at a time", async ({ page }) => {
  await page.goto("/");
  const notes = page.locator("details[name='notes']");
  await expect(notes).toHaveCount(5);
  await expect(notes.first()).toHaveAttribute("open", "");
  await notes.nth(2).locator("summary").click();
  await expect(notes.nth(2)).toHaveAttribute("open", "");
  await expect(notes.first()).not.toHaveAttribute("open");
});
