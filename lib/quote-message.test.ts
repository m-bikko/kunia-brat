import { describe, expect, it } from "vitest";

import { en } from "@/content/locales/en";
import { buildQuoteMessage, type QuoteTemplates } from "@/lib/quote-message";
import { fill } from "@/lib/template";

const templates: QuoteTemplates = {
  intro: "Здравствуйте! Прошу рассчитать оснащение: {cabinet}.",
  total: "По Приказу № 70: {total} поз.",
  have: "Уже есть в школе ({have}): {list}.",
  haveNone: "Нужен полный комплект.",
  need: "Подобрать: {need} поз.",
  more: "и ещё {count}",
};

describe("fill", () => {
  it("replaces known placeholders and keeps unknown ones", () => {
    expect(fill("{a} и {b}", { a: 1 })).toBe("1 и {b}");
  });
});

describe("buildQuoteMessage", () => {
  it("asks for the full kit when nothing is ticked", () => {
    expect(buildQuoteMessage({ cabinet: "Информатика", total: 22, haveItems: [], templates })).toBe(
      "Здравствуйте! Прошу рассчитать оснащение: Информатика.\nПо Приказу № 70: 22 поз.\nНужен полный комплект.\nПодобрать: 22 поз.",
    );
  });

  it("lists ticked items and subtracts them", () => {
    const message = buildQuoteMessage({
      cabinet: "Мастерская труда",
      total: 114,
      haveItems: ["Верстак", "Тиски", "Очки"],
      templates,
    });
    expect(message).toContain("Уже есть в школе (3): Верстак; Тиски; Очки.");
    expect(message).toContain("Подобрать: 111 поз.");
  });

  it("keeps long lists under the limit and says how many were left out", () => {
    const items = Array.from({ length: 114 }, (_, i) => `Позиция номер ${i + 1} с длинным названием по приказу`);
    const message = buildQuoteMessage({ cabinet: "Мастерская труда", total: 114, haveItems: items, templates });
    expect(message.length).toBeLessThanOrEqual(1800);
    expect(message).toMatch(/и ещё \d+\./);
    expect(message).toContain("Уже есть в школе (114)");
    expect(message).toContain("Подобрать: 0 поз.");
  });

  it("stops at one item even if that item alone is too long", () => {
    const message = buildQuoteMessage({ cabinet: "Арт", total: 2, haveItems: ["x".repeat(3000), "y"], templates });
    expect(message).toContain("x".repeat(3000));
    expect(message).toContain("и ещё 1");
  });
});

describe("English request", () => {
  it("reads correctly with one item left to source", () => {
    const message = buildQuoteMessage({ cabinet: "Informatics", total: 2, haveItems: ["Desk"], templates: en.order70.message });
    expect(message).not.toMatch(/\b1 items\b/);
  });
});
