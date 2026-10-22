import { expect, test } from "@playwright/test";

test("tick what the school has and send the rest", async ({ page }) => {
  await page.goto("/#order70");
  const tool = page.locator("#order70");
  await tool.getByRole("tab", { name: /Мастерская труда/ }).click();
  await expect(tool.getByTestId("order70-total")).toHaveText("114");

  const boxes = tool.getByRole("tabpanel").getByRole("checkbox");
  for (const index of [0, 1, 2]) await boxes.nth(index).check();
  await expect(tool.getByTestId("order70-have")).toHaveText("3");
  await expect(tool.getByTestId("order70-need")).toHaveText("111");

  const firstName = await boxes.nth(0).getAttribute("data-name");
  const href = await tool.getByRole("link", { name: /Отправить на расчёт/ }).getAttribute("href");
  const text = new URL(href ?? "").searchParams.get("text") ?? "";
  expect(text).toContain("Мастерская труда");
  expect(text).toContain(firstName ?? "missing");
  expect(text).toContain("Подобрать: 111 поз.");

  await tool.getByRole("tab", { name: /Информатика/ }).click();
  await expect(tool.getByTestId("order70-have")).toHaveText("0");
  await tool.getByRole("tab", { name: /Мастерская труда/ }).click();
  await expect(tool.getByTestId("order70-have")).toHaveText("3");

  await tool.getByRole("button", { name: /Сбросить/ }).click();
  await expect(tool.getByTestId("order70-have")).toHaveText("0");
});

test("tabs follow the arrow keys", async ({ page }) => {
  await page.goto("/#order70");
  const tabs = page.locator("#order70").getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toBeFocused();
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
});

test("the Kazakh page shows the tool in Kazakh", async ({ page }) => {
  await page.goto("/kk#order70");
  const tool = page.locator("#order70");
  await expect(tool.getByRole("tab", { name: /Еңбек шеберханасы/ })).toBeVisible();
  await expect(tool.getByRole("link", { name: /Есептеуге жіберу/ })).toBeVisible();
});
