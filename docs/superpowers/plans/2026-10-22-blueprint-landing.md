# Лендинг AXIS «Чертёж» + интро «Синька» + инструмент «Приказ № 70»: план реализации

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Заменить шаблонный лендинг на концепт «Чертёж» с интро «Синька» и рабочим инструментом подбора по Приказу № 70.

**Architecture:** Next.js 16.4 App Router, два root layout (`/` и `/[locale]`), словари `content/locales/*` под типом `Dictionary`.
Страница собирается из секций в `components/sections/*`; интро — CSS-таймлайн, который запускает inline-скрипт до первой
отрисовки, плюс клиентский компонент для перелёта и пропуска. Данные Приказа № 70 генерируются Python-скриптом из
выгрузки живого сайта в `content/order70.ts`.

**Tech Stack:** Next.js 16.4, React 19.3, TypeScript strict, Tailwind v4, motion 14 (`motion/react`), lucide-react,
Geist + Geist Mono (`next/font/google`), Vitest (логика), Playwright Test (e2e, канал Chrome), Python 3 stdlib.

**Spec:** `docs/superpowers/specs/2026-10-22-blueprint-landing-design.md`

## Global Constraints

- Логотип `/brand/axis-logo.png` и синий `#3059df` — единственный цвет; зелёный `#15803D` только для статуса «есть».
- Радиус 0 у всех карточек, кнопок, полей и фото; линии 1px `--line` `#D3D8DF`.
- Шрифты: Geist (текст), Geist Mono (аннотации), подмножества `latin`, `cyrillic`, `cyrillic-ext`.
- Тексты только из словарей; новый ключ добавляется в `ru.ts`, `kk.ts`, `en.ts` одновременно.
- В ru/kk перед тире ` `; в en тире не используются.
- Ссылки на страницы старого сайта — обычный `<a>`, не `next/link`.
- Анимируются только transform, opacity, `stroke-dashoffset`, цвет фона интро; всё уважает `prefers-reduced-motion`.
- Никакого `any`; приведения типов только для CSS-переменных через типы React (см. `types/css.d.ts`).
- Новые зависимости только dev: `vitest`, `@playwright/test`.
- После правок `@theme`/токенов в `app/globals.css`: `rm -rf .next` перед сборкой.
- Проверка каждой задачи: `npx tsc --noEmit && pnpm lint && pnpm test && pnpm test:e2e`.

## Review Focus

1. **Интро на узком экране или при прокрутке**: цель перелёта вне экрана → интро плавно гаснет, заголовок виден.
   Тест: `e2e/intro.spec.ts` «narrow screens fade the intro out».
2. **JS не загрузился**: первый экран читается, оверлей не показан. Тест: `e2e/intro.spec.ts` «works without JavaScript».
3. **Отметки не перетекают между кабинетами**, «Сбросить» чистит только текущий. Тест: `e2e/order70.spec.ts`.
4. **Все 114 позиций мастерской отмечены**: сообщение ≤ 1 800 символов и честно говорит «и ещё N».
   Тест: `lib/quote-message.test.ts`.
5. **Глубокая ссылка `/#order70`** не перекрывается интро. Тест: `e2e/intro.spec.ts` «deep links skip the intro».

---

## Карта файлов

| Файл | Ответственность | Задача |
|---|---|---|
| `vitest.config.ts`, `playwright.config.ts`, `e2e/smoke.spec.ts` | тестовая инфраструктура | 1 |
| `scripts/data/order70-raw.json`, `scripts/extract_order70.py`, `scripts/test_extract_order70.py`, `content/order70.ts`, `lib/order70.ts`, `content/order70.test.ts` | данные Приказа № 70 | 2 |
| `lib/template.ts`, `lib/quote-message.ts`, `lib/quote-message.test.ts` | сообщение в WhatsApp | 3 |
| `lib/fonts.ts`, `app/globals.css`, `types/css.d.ts`, `components/ui/button.tsx`, `components/language-switcher.tsx`, `components/sheet.tsx` | основа визуального языка | 4 |
| `components/site-header.tsx`, `components/sections/hero-sheet.tsx`, `components/sections/plan-drawing.tsx`, `e2e/hero.spec.ts` | шапка и первый экран | 5 |
| `components/intro/*`, `scripts/make_furniture_outline.py`, `assets/illustrations/room-furniture-outline.svg`, `e2e/intro.spec.ts` | интро «Синька» | 6 |
| `components/sections/stages.tsx`, `components/sections/order70-tool.tsx`, `e2e/order70.spec.ts` | этапы и инструмент | 7 |
| `components/sections/cabinet-index.tsx`, `e2e/index.spec.ts` | индекс кабинетов | 8 |
| `components/sections/process.tsx`, `e2e/process.spec.ts` | процесс в стиле чертежа | 9 |
| `components/sections/production.tsx`, `components/sections/facts-suppliers.tsx`, `e2e/facts.spec.ts` | производство, факты, бренды | 10 |
| `components/sections/notes.tsx`, `components/sections/closing.tsx`, `g8.tsx`, `site-footer.tsx`, `whatsapp-fab.tsx`, `e2e/closing.spec.ts` | примечания, G8, заявка, футер | 11 |
| удаление старого, README, CLAUDE.md, wiki | зачистка и документация | 12 |

Словарь (`content/types.ts` + три локали) меняется в каждой задаче ровно на свои ключи, поэтому сборка зелёная после
каждой задачи.

---

### Task 1: Тестовая инфраструктура

**Files:**
- Create: `vitest.config.ts`, `playwright.config.ts`, `e2e/smoke.spec.ts`
- Modify: `package.json` (scripts), `.gitignore`

**Interfaces:**
- Produces: `pnpm test` (Vitest, `**/*.test.ts`), `pnpm test:e2e` (сборка + Playwright на порту 3200, Chrome),
  `pnpm test:py` (unittest в `scripts/`).

- [ ] **Step 1: Поставить dev-зависимости**

Run: `pnpm add -D vitest @playwright/test`
Expected: оба пакета в `devDependencies`.

- [ ] **Step 2: Конфиг Vitest** — `vitest.config.ts`

```ts
import path from "node:path";

import { defineConfig } from "vitest/config";

/** Unit tests for pure logic (no React, no Next.js runtime). */
export default defineConfig({
  resolve: { alias: { "@": path.resolve(import.meta.dirname) } },
  test: {
    include: ["**/*.test.ts"],
    exclude: ["node_modules/**", ".next/**", "e2e/**"],
  },
});
```

- [ ] **Step 3: Конфиг Playwright** — `playwright.config.ts`

```ts
import { defineConfig } from "@playwright/test";

/** E2E against the production build. `pnpm test:e2e` builds first, then serves on :3200. */
export default defineConfig({
  testDir: "e2e",
  fullyParallel: true,
  use: {
    baseURL: "http://localhost:3200",
    channel: "chrome",
    viewport: { width: 1440, height: 900 },
    trace: "retain-on-failure",
  },
  webServer: {
    command: "pnpm start -p 3200",
    url: "http://localhost:3200",
    reuseExistingServer: false,
    timeout: 60_000,
  },
});
```

- [ ] **Step 4: Скрипты** — в `package.json` → `"scripts"` добавить:

```json
"test": "vitest run",
"test:e2e": "next build && playwright test",
"test:py": "python3 -m unittest discover -s scripts -p 'test_*.py'"
```

и в `.gitignore` дописать:

```
# test output
test-results/
playwright-report/
```

- [ ] **Step 5: Smoke-тест** — `e2e/smoke.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test("the landing answers in every language", async ({ page }) => {
  for (const path of ["/", "/kk", "/en"]) {
    const response = await page.goto(path);
    expect(response?.status()).toBe(200);
    await expect(page.getByRole("heading", { level: 1 })).toBeVisible();
  }
});

test("unknown paths are 404", async ({ page }) => {
  const response = await page.goto("/xx");
  expect(response?.status()).toBe(404);
});
```

- [ ] **Step 6: Прогон**

Run: `pnpm test:e2e`
Expected: 2 passed. (`pnpm test` пока сообщает «No test files found» — это нормально до Task 2.)

- [ ] **Step 7: Commit**

```bash
git add package.json pnpm-lock.yaml vitest.config.ts playwright.config.ts e2e/smoke.spec.ts .gitignore
git commit -m "test: add vitest and playwright e2e harness"
```

---

### Task 2: Данные Приказа № 70

**Files:**
- Create: `scripts/data/order70-raw.json` (копия выгрузки из
  `/private/tmp/claude-501/-Users-beimbetmaratov-Development-axisgroup-kz/da445e23-92c1-401c-ab7c-176ce36dae8d/scratchpad/site2/order70-raw.json`),
  `scripts/extract_order70.py`, `scripts/test_extract_order70.py`, `content/order70.ts` (генерируется),
  `lib/order70.ts`, `content/order70.test.ts`

**Interfaces:**
- Produces: `order70: Record<CabinetId, readonly Order70Group[]>`, `Order70Group { category; items: readonly Order70Item[] }`,
  `Order70Item { name; unit }`, `order70Source`; `countItems(id: CabinetId): number`, `totalItems(): number`.

- [ ] **Step 1: Скопировать сырые данные**

```bash
mkdir -p scripts/data
cp /private/tmp/claude-501/-Users-beimbetmaratov-Development-axisgroup-kz/da445e23-92c1-401c-ab7c-176ce36dae8d/scratchpad/site2/order70-raw.json scripts/data/order70-raw.json
```

- [ ] **Step 2: Падающий тест разбора** — `scripts/test_extract_order70.py`

```python
import json
import sys
import unittest
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
from extract_order70 import RAW, build, split_category  # noqa: E402

EXPECTED = {"informatics": 22, "art": 54, "sewing": 65, "pottery": 45,
            "workshop": 114, "kazakh": 39, "russian": 30, "english": 29}


class SplitCategoryTest(unittest.TestCase):
    def test_multi_word_category(self):
        self.assertEqual(split_category("МЕБЕЛЬ ДЛЯ КАБИНЕТА Доска маркерная"),
                         ("МЕБЕЛЬ ДЛЯ КАБИНЕТА", "Доска маркерная"))

    def test_category_with_comma(self):
        self.assertEqual(split_category("ПОСОБИЯ, СТЕНДЫ И ПРОГРАММЫ Таблица «IT-технологии»"),
                         ("ПОСОБИЯ, СТЕНДЫ И ПРОГРАММЫ", "Таблица «IT-технологии»"))

    def test_kazakh_item_name(self):
        self.assertEqual(split_category("УЧЕБНЫЕ ПОСОБИЯ Қазақ тілінің түсіндірме сөздігі")[1],
                         "Қазақ тілінің түсіндірме сөздігі")

    def test_collapses_whitespace(self):
        self.assertEqual(split_category("МЕБЕЛЬ  Стол\nкомпьютерный"), ("МЕБЕЛЬ", "Стол компьютерный"))

    def test_rejects_row_without_category(self):
        with self.assertRaises(ValueError):
            split_category("Доска маркерная")


class BuildTest(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.data = build(json.loads(RAW.read_text(encoding="utf-8")))

    def test_counts_match_live_site(self):
        counts = {c: sum(len(g["items"]) for g in groups) for c, groups in self.data.items()}
        self.assertEqual(counts, EXPECTED)

    def test_categories_are_unique_per_cabinet(self):
        for cabinet, groups in self.data.items():
            names = [g["category"] for g in groups]
            self.assertEqual(len(names), len(set(names)), cabinet)

    def test_units_are_lowercase(self):
        for groups in self.data.values():
            for group in groups:
                for item in group["items"]:
                    self.assertEqual(item["unit"], item["unit"].lower())


if __name__ == "__main__":
    unittest.main()
```

- [ ] **Step 3: Убедиться, что падает**

Run: `pnpm test:py`
Expected: FAIL — `ModuleNotFoundError: No module named 'extract_order70'`.

- [ ] **Step 4: Скрипт** — `scripts/extract_order70.py`

```python
"""Build content/order70.ts from the Order No. 70 tables scraped from axisgroup.kz.

scripts/data/order70-raw.json holds, per cabinet, the rows of the "Матрица соответствия"
table as rendered on each cabinet page (headless browser, 2026-10-22; the table renders
on the client). Column 2 is "CATEGORY Item name", column 5 is the unit.

Usage: python3 scripts/extract_order70.py
"""
from __future__ import annotations

import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
RAW = ROOT / "scripts" / "data" / "order70-raw.json"
OUT = ROOT / "content" / "order70.ts"
SOURCE_URL = "https://axisgroup.kz"
RETRIEVED = "2026-10-22"
CABINETS = ["informatics", "art", "sewing", "pottery", "workshop", "kazakh", "russian", "english"]

UPPER = "A-ZА-ЯЁӘҒҚҢӨҰҮҺІ"
LOWER = "a-zа-яёәғқңөұүһі"
_CATEGORY = re.compile(rf"^([{UPPER}0-9«»\"(),.\-–/№ ]+?)\s+(?=[{UPPER}][{LOWER}])")


def split_category(cell: str) -> tuple[str, str]:
    """'МЕБЕЛЬ ДЛЯ КАБИНЕТА Доска маркерная' -> ('МЕБЕЛЬ ДЛЯ КАБИНЕТА', 'Доска маркерная')."""
    text = " ".join(cell.split())
    match = _CATEGORY.match(text)
    if not match:
        raise ValueError(f"no category prefix: {cell!r}")
    return match.group(1).strip(), text[match.end():].strip()


def build(raw: dict) -> dict[str, list[dict]]:
    """Group rows by category, in order of first appearance, for each cabinet."""
    result: dict[str, list[dict]] = {}
    for cabinet in CABINETS:
        groups: dict[str, list[dict[str, str]]] = {}
        for row in raw[cabinet]["rows"]:
            category, name = split_category(row[2])
            groups.setdefault(category, []).append({"name": name, "unit": row[5].strip().lower()})
        result[cabinet] = [{"category": c, "items": items} for c, items in groups.items()]
    return result


def to_typescript(data: dict[str, list[dict]]) -> str:
    body = json.dumps(data, ensure_ascii=False, indent=2)
    return f'''// Generated by scripts/extract_order70.py from scripts/data/order70-raw.json. Do not edit by hand.
import type {{ CabinetId }} from "@/content/cabinets";

export interface Order70Item {{
  name: string;
  /** Unit as written in the order: "шт.", "компл.", "набор", ... */
  unit: string;
}}

export interface Order70Group {{
  /** Category exactly as in the source table, e.g. "МЕБЕЛЬ ДЛЯ КАБИНЕТА". */
  category: string;
  items: readonly Order70Item[];
}}

export const order70Source = {{ url: "{SOURCE_URL}", retrieved: "{RETRIEVED}" }} as const;

export const order70: Record<CabinetId, readonly Order70Group[]> = {body};
'''


def main() -> None:
    data = build(json.loads(RAW.read_text(encoding="utf-8")))
    OUT.write_text(to_typescript(data), encoding="utf-8")
    total = sum(len(g["items"]) for groups in data.values() for g in groups)
    print(f"wrote {OUT.relative_to(ROOT)}: {total} items")


if __name__ == "__main__":
    main()
```

- [ ] **Step 5: Тесты разбора зелёные, сгенерировать файл**

Run: `pnpm test:py && python3 scripts/extract_order70.py`
Expected: `Ran 8 tests ... OK`, затем `wrote content/order70.ts: 398 items`.

- [ ] **Step 6: Падающий тест данных** — `content/order70.test.ts`

```ts
import { describe, expect, it } from "vitest";

import { order70 } from "@/content/order70";
import { countItems, totalItems } from "@/lib/order70";

describe("order70", () => {
  it("matches the item counts on the live site", () => {
    expect({
      informatics: countItems("informatics"),
      art: countItems("art"),
      sewing: countItems("sewing"),
      pottery: countItems("pottery"),
      workshop: countItems("workshop"),
      kazakh: countItems("kazakh"),
      russian: countItems("russian"),
      english: countItems("english"),
    }).toEqual({ informatics: 22, art: 54, sewing: 65, pottery: 45, workshop: 114, kazakh: 39, russian: 30, english: 29 });
    expect(totalItems()).toBe(398);
  });

  it("has a category, a name and a unit for every item", () => {
    for (const groups of Object.values(order70)) {
      for (const group of groups) {
        expect(group.category.trim()).not.toBe("");
        for (const item of group.items) {
          expect(item.name.trim()).not.toBe("");
          expect(item.unit).toMatch(/^[а-яё.²]+$/u);
        }
      }
    }
  });
});
```

Run: `pnpm test` → Expected: FAIL «Failed to resolve import "@/lib/order70"».

- [ ] **Step 7: Помощники** — `lib/order70.ts`

```ts
import type { CabinetId } from "@/content/cabinets";
import { order70 } from "@/content/order70";

/** Number of Order No. 70 items for one cabinet. */
export const countItems = (id: CabinetId): number =>
  order70[id].reduce((sum, group) => sum + group.items.length, 0);

/** Number of Order No. 70 items across all cabinets. */
export const totalItems = (): number =>
  Object.values(order70).reduce(
    (sum, groups) => sum + groups.reduce((inner, group) => inner + group.items.length, 0),
    0,
  );
```

- [ ] **Step 8: Прогон**

Run: `pnpm test && npx tsc --noEmit`
Expected: 2 passed; tsc без ошибок.

- [ ] **Step 9: Commit**

```bash
git add scripts content/order70.ts content/order70.test.ts lib/order70.ts
git commit -m "feat(data): Order No. 70 equipment lists for all eight cabinets"
```

---

### Task 3: Сообщение для WhatsApp

**Files:**
- Create: `lib/template.ts`, `lib/quote-message.ts`, `lib/quote-message.test.ts`

**Interfaces:**
- Produces: `fill(template: string, values: Record<string, string | number>): string`;
  `QuoteTemplates { intro; total; have; haveNone; need; more }`;
  `buildQuoteMessage({ cabinet, total, haveItems, templates, maxLength? }): string`.

- [ ] **Step 1: Падающие тесты** — `lib/quote-message.test.ts`

```ts
import { describe, expect, it } from "vitest";

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
```

Run: `pnpm test` → Expected: FAIL «Failed to resolve import "@/lib/quote-message"».

- [ ] **Step 2: Реализация** — `lib/template.ts`

```ts
/** Replaces {name} placeholders; unknown placeholders are left untouched. */
export const fill = (template: string, values: Record<string, string | number>): string =>
  template.replace(/\{(\w+)\}/g, (match, key: string) => (key in values ? String(values[key]) : match));
```

`lib/quote-message.ts`

```ts
import { fill } from "@/lib/template";

/** Localized lines of the WhatsApp request (dictionary key `order70.message`). */
export interface QuoteTemplates {
  /** `{cabinet}` */
  intro: string;
  /** `{total}` */
  total: string;
  /** `{have}`, `{list}` */
  have: string;
  haveNone: string;
  /** `{need}` */
  need: string;
  /** `{count}` — appended when the list of owned items is cut */
  more: string;
}

interface QuoteInput {
  cabinet: string;
  total: number;
  haveItems: readonly string[];
  templates: QuoteTemplates;
  maxLength?: number;
}

/**
 * Short request for a quote: cabinet, size of the Order No. 70 list and what the school already has.
 * Listing what is owned is usually shorter than listing what is missing; long lists are cut with "and N more".
 */
export const buildQuoteMessage = ({ cabinet, total, haveItems, templates, maxLength = 1800 }: QuoteInput): string => {
  const head = fill(templates.intro, { cabinet });
  const totalLine = fill(templates.total, { total });
  const needLine = fill(templates.need, { need: total - haveItems.length });

  if (haveItems.length === 0) return [head, totalLine, templates.haveNone, needLine].join("\n");

  const compose = (list: string): string =>
    [head, totalLine, fill(templates.have, { have: haveItems.length, list }), needLine].join("\n");

  let shown = haveItems.length;
  let message = compose(haveItems.join("; "));
  while (message.length > maxLength && shown > 1) {
    shown -= 1;
    const rest = fill(templates.more, { count: haveItems.length - shown });
    message = compose(`${haveItems.slice(0, shown).join("; ")} ${rest}`);
  }
  return message;
};
```

- [ ] **Step 3: Прогон**

Run: `pnpm test`
Expected: 7 passed.

- [ ] **Step 4: Commit**

```bash
git add lib/template.ts lib/quote-message.ts lib/quote-message.test.ts
git commit -m "feat: build the WhatsApp quote request from ticked Order 70 items"
```

---
### Task 4: Основа визуального языка «Чертёж»

**Files:**
- Modify: `lib/fonts.ts`, `app/globals.css`, `components/ui/button.tsx`, `components/language-switcher.tsx`,
  `content/types.ts`, `content/locales/{ru,kk,en}.ts`
- Create: `types/css.d.ts`, `components/sheet.tsx`
- Delete: `assets/fonts/onest-kazakh.woff2`, `assets/fonts/onest-OFL.txt`

**Interfaces:**
- Produces: токены `ink, ink-2, ink-muted, ink-faint, brand, brand-hover, brand-soft, brand-light, ok, paper, surface,
  line, line-strong`; утилиты `container-axis`, `bg-columns`, `bg-blueprint`, `label-mono`, `reveal`, `draw`
  (задержка через CSS-переменную `--reveal-delay`);
  `buttonVariants({ variant: "primary" | "ink" | "outline" | "light" | "ghostLight", size: "sm" | "md" | "lg" })`;
  `type Lines = readonly string[]`; `Dictionary["stamp"]`;
  `sheetTag(stamp, n): string`, `<SheetRuler />`, `<SheetHeading id title sheet? lead? tone? className? />`,
  `<Stamp t sheet className? />`.

- [ ] **Step 1: Шрифты** — `lib/fonts.ts` целиком

```ts
import { Geist, Geist_Mono } from "next/font/google";

/** Text and headings. Covers the full Kazakh alphabet in cyrillic + cyrillic-ext. */
export const geist = Geist({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-geist",
  display: "swap",
});

/** Drawing annotations: sheet tags, codes, dimensions. */
export const geistMono = Geist_Mono({
  subsets: ["latin", "cyrillic", "cyrillic-ext"],
  variable: "--font-geist-mono",
  display: "swap",
});

export const fontVariables = `${geist.variable} ${geistMono.variable}`;
```

Run: `git rm -q assets/fonts/onest-kazakh.woff2 assets/fonts/onest-OFL.txt`

- [ ] **Step 2: Типы CSS-переменных** — `types/css.d.ts`

```ts
import "react";

declare module "react" {
  interface CSSProperties {
    /** CSS custom properties such as `--reveal-delay` used by the drawing animations. */
    [key: `--${string}`]: string | number | undefined;
  }
}
```

- [ ] **Step 3: Токены** — `app/globals.css` целиком

```css
@import "tailwindcss";
@import "tw-animate-css";
@import "shadcn/tailwind.css";

/*
 * AXIS "drawing sheet" tokens.
 * Light-only. Sharp corners everywhere (radius 0), 1px hairlines, blue is the only colour.
 * Z-index scale: header 40, floating WhatsApp 30, mobile menu 50, skip link 60, intro 70.
 */
:root {
  color-scheme: light;

  --ink: #0b1220;
  --ink-deep: #0b1220;
  --ink-2: #3a4352;
  --ink-muted: #5b6472;
  --ink-faint: #8a93a1;
  --brand: #3059df;
  --brand-hover: #2449c4;
  --brand-soft: #e9eefc;
  --brand-light: #9db4f5;
  --ok: #15803d;
  --paper: #f4f5f7;
  --surface: #ffffff;
  --line: #d3d8df;
  --line-strong: #b4bcc7;

  /* shadcn/ui semantic tokens mapped onto the brand */
  --background: var(--paper);
  --foreground: var(--ink);
  --card: var(--surface);
  --card-foreground: var(--ink);
  --popover: var(--surface);
  --popover-foreground: var(--ink);
  --primary: var(--brand);
  --primary-foreground: #ffffff;
  --secondary: var(--brand-soft);
  --secondary-foreground: var(--ink);
  --muted: #eceef2;
  --muted-foreground: var(--ink-muted);
  --accent: var(--brand-soft);
  --accent-foreground: var(--ink);
  --destructive: #b42335;
  --border: var(--line);
  --input: var(--line-strong);
  --ring: var(--brand);
  --radius: 0rem;

  --ease-out-expo: cubic-bezier(0.16, 1, 0.3, 1);
  --header-height: 3.5rem;
}

@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-popover: var(--popover);
  --color-popover-foreground: var(--popover-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-secondary: var(--secondary);
  --color-secondary-foreground: var(--secondary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --color-accent: var(--accent);
  --color-accent-foreground: var(--accent-foreground);
  --color-destructive: var(--destructive);
  --color-border: var(--border);
  --color-input: var(--input);
  --color-ring: var(--ring);

  --color-ink: var(--ink);
  --color-ink-deep: var(--ink-deep);
  --color-ink-2: var(--ink-2);
  --color-ink-muted: var(--ink-muted);
  --color-ink-faint: var(--ink-faint);
  --color-brand: var(--brand);
  --color-brand-hover: var(--brand-hover);
  --color-brand-soft: var(--brand-soft);
  --color-brand-light: var(--brand-light);
  --color-ok: var(--ok);
  --color-paper: var(--paper);
  --color-surface: var(--surface);
  --color-line: var(--line);
  --color-line-strong: var(--line-strong);

  --font-sans: var(--font-geist), ui-sans-serif, system-ui, sans-serif;
  --font-mono: var(--font-geist-mono), ui-monospace, monospace;
  --font-heading: var(--font-sans);

  --radius-sm: 0px;
  --radius-md: 0px;
  --radius-lg: 0px;
  --radius-xl: 0px;
  --radius-2xl: 0px;
  --radius-3xl: 0px;
  --radius-4xl: 0px;
  /* Old components still reference these until Task 12 removes them. */
  --radius-card: 0px;
  --radius-control: 0px;

  --animate-marquee: marquee var(--duration) infinite linear;
  --animate-marquee-vertical: marquee-vertical var(--duration) linear infinite;
  --animate-shine: shine var(--duration) infinite linear;

  @keyframes marquee {
    from {
      transform: translateX(0);
    }
    to {
      transform: translateX(calc(-100% - var(--gap)));
    }
  }
  @keyframes marquee-vertical {
    from {
      transform: translateY(0);
    }
    to {
      transform: translateY(calc(-100% - var(--gap)));
    }
  }
  @keyframes shine {
    0% {
      background-position: 0% 0%;
    }
    50% {
      background-position: 100% 100%;
    }
    to {
      background-position: 0% 0%;
    }
  }
}

@layer base {
  * {
    @apply border-border outline-ring/50;
  }
  html {
    @apply font-sans;
    -webkit-text-size-adjust: 100%;
    text-rendering: optimizeLegibility;
  }
  body {
    @apply bg-background text-foreground antialiased;
  }
  [id] {
    scroll-margin-top: calc(var(--header-height) + 1rem);
  }
  ::selection {
    background: color-mix(in oklab, var(--brand) 22%, transparent);
  }
  :focus-visible {
    outline: 2px solid var(--brand);
    outline-offset: 3px;
  }
}

@media (prefers-reduced-motion: no-preference) {
  html {
    scroll-behavior: smooth;
  }
}

@layer utilities {
  .container-axis {
    @apply mx-auto w-full max-w-[1440px] px-4 sm:px-6 lg:px-10;
  }

  /* Twelve visible column lines, like a drawing sheet. */
  .bg-columns {
    background-image: linear-gradient(to right, var(--line) 1px, transparent 1px);
    background-size: calc(100% / 12) 100%;
  }

  /* Blueprint paper: the 40px drafting grid. */
  .bg-blueprint {
    background-image:
      linear-gradient(to right, color-mix(in oklab, var(--brand) 9%, transparent) 1px, transparent 1px),
      linear-gradient(to bottom, color-mix(in oklab, var(--brand) 9%, transparent) 1px, transparent 1px);
    background-size: 40px 40px;
  }

  .label-mono {
    @apply font-mono text-[11px] leading-none tracking-[0.06em] uppercase;
  }

  .text-balance {
    text-wrap: balance;
  }
  .text-pretty {
    text-wrap: pretty;
  }
}

/* First-screen reveal: CSS only, so it runs before hydration. Delay via --reveal-delay. */
.reveal {
  animation: reveal 0.7s var(--ease-out-expo) both;
  animation-delay: var(--reveal-delay, 0s);
}
.draw {
  stroke-dasharray: 1;
  animation: draw 0.9s var(--ease-out-expo) both;
  animation-delay: var(--reveal-delay, 0s);
}
@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(14px);
  }
}
@keyframes draw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}

@media (prefers-reduced-motion: reduce) {
  .reveal,
  .draw {
    animation: none;
  }
  .animate-marquee,
  .animate-marquee-vertical,
  .animate-shine {
    animation-play-state: paused;
  }
}

/* FAQ accordion: animate <details> where supported, instant elsewhere. */
@supports (interpolate-size: allow-keywords) {
  :root {
    interpolate-size: allow-keywords;
  }
  details::details-content {
    block-size: 0;
    overflow-y: clip;
    transition:
      block-size 0.35s var(--ease-out-expo),
      content-visibility 0.35s allow-discrete;
  }
  details[open]::details-content {
    block-size: auto;
  }
  @media (prefers-reduced-motion: reduce) {
    details::details-content {
      transition: none;
    }
  }
}
```

- [ ] **Step 4: Кнопки** — `components/ui/button.tsx` целиком

```tsx
import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

/**
 * AXIS button styles: sharp, flat, label left / icon right when stretched.
 * Use `buttonVariants()` on links (most CTAs are links) or `<Button>` for real buttons.
 */
const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center gap-3 border border-transparent font-medium whitespace-nowrap transition-[background-color,border-color,color,transform] duration-200 outline-none select-none active:translate-y-px disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        primary: "bg-brand text-white hover:bg-brand-hover",
        ink: "bg-ink text-white hover:bg-ink-2",
        outline: "border-ink bg-transparent text-ink hover:bg-ink hover:text-white",
        light: "bg-white text-ink hover:bg-brand-soft",
        ghostLight: "border-white/30 text-white hover:border-white hover:bg-white/10",
      },
      size: {
        sm: "h-9 px-4 text-[13px]",
        md: "h-11 px-5 text-sm",
        lg: "h-12 px-5 text-[15px]",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  }
)

function Button({
  className,
  variant = "primary",
  size = "md",
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }
```

- [ ] **Step 5: Переключатель языков** — `components/language-switcher.tsx` целиком

```tsx
import Link from "next/link";
import { Fragment } from "react";

import { localeLabel, localeName, localePath, locales, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface LanguageSwitcherProps {
  locale: Locale;
  label: string;
  tone?: "light" | "dark";
  className?: string;
}

/** RU · KZ · EN in mono, the current one in ink. Each locale is a separate static page. */
export const LanguageSwitcher = ({ locale, label, tone = "light", className }: LanguageSwitcherProps): React.JSX.Element => (
  <nav aria-label={label} className={cn("flex items-center gap-2 font-mono text-xs", className)}>
    {locales.map((code, index) => {
      const active = code === locale;
      return (
        <Fragment key={code}>
          {index > 0 && (
            <span aria-hidden className={tone === "light" ? "text-line-strong" : "text-white/30"}>
              ·
            </span>
          )}
          <Link
            href={localePath(code)}
            hrefLang={code}
            lang={code}
            aria-label={localeName[code]}
            aria-current={active ? "true" : undefined}
            className={cn(
              "transition-colors",
              tone === "light"
                ? active
                  ? "text-ink underline decoration-brand decoration-2 underline-offset-4"
                  : "text-ink-faint hover:text-ink"
                : active
                  ? "text-white underline decoration-brand-light decoration-2 underline-offset-4"
                  : "text-white/55 hover:text-white",
            )}
          >
            {localeLabel[code]}
          </Link>
        </Fragment>
      );
    })}
  </nav>
);
```

- [ ] **Step 6: Типы словаря** — в `content/types.ts` после `export interface SplitTitle {...}` добавить

```ts
/** A display title split into lines exactly where the design breaks them. */
export type Lines = readonly string[];
```

и в `interface Dictionary` после `meta: {...};` добавить

```ts
  stamp: {
    object: string;
    objectValue: string;
    stage: string;
    stageValue: string;
    project: string;
    projectValue: string;
    sheet: string;
    /** `{n}` is the two-digit sheet number. */
    sheetTag: string;
  };
```

- [ ] **Step 7: Словари** — в каждом файле локали после блока `meta: {...},` вставить блок `stamp`.

`content/locales/ru.ts`:

```ts
  stamp: {
    object: "Объект",
    objectValue: "Кабинет информатики",
    stage: "Стадия",
    stageValue: "Эскиз",
    project: "Проект",
    projectValue: "AXIS · Алматы",
    sheet: "Лист",
    sheetTag: "Лист {n}",
  },
```

`content/locales/kk.ts`:

```ts
  stamp: {
    object: "Нысан",
    objectValue: "Информатика кабинеті",
    stage: "Кезең",
    stageValue: "Эскиз",
    project: "Жоба",
    projectValue: "AXIS · Алматы",
    sheet: "Парақ",
    sheetTag: "{n}-парақ",
  },
```

`content/locales/en.ts`:

```ts
  stamp: {
    object: "Object",
    objectValue: "Computer science classroom",
    stage: "Stage",
    stageValue: "Sketch",
    project: "Project",
    projectValue: "AXIS · Almaty",
    sheet: "Sheet",
    sheetTag: "Sheet {n}",
  },
```

- [ ] **Step 8: Примитивы листа** — `components/sheet.tsx`

```tsx
import type { Dictionary, Lines } from "@/content/types";
import { fill } from "@/lib/template";
import { cn } from "@/lib/utils";

const COLUMNS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L"] as const;

/** "Лист 02" / "02-парақ" / "Sheet 02" for a section number. */
export const sheetTag = (stamp: Dictionary["stamp"], n: number): string =>
  fill(stamp.sheetTag, { n: String(n).padStart(2, "0") });

/** Column letters above the header, like the frame of a drawing sheet. Desktop only. */
export const SheetRuler = (): React.JSX.Element => (
  <div aria-hidden className="container-axis hidden lg:block">
    <div className="grid h-6 grid-cols-12 items-end font-mono text-[10px] text-ink-faint">
      {COLUMNS.map((column) => (
        <span key={column} className="pl-1">
          {column}
        </span>
      ))}
    </div>
  </div>
);

interface SheetHeadingProps {
  id: string;
  title: Lines;
  sheet?: string;
  lead?: string;
  tone?: "light" | "dark";
  className?: string;
}

/** Section heading: big title on the left, sheet tag and a short lead on the right like a title block. */
export const SheetHeading = ({ id, title, sheet, lead, tone = "light", className }: SheetHeadingProps): React.JSX.Element => (
  <div className={cn("grid gap-6 lg:grid-cols-12 lg:items-end", className)}>
    <h2
      id={id}
      className={cn(
        "text-[clamp(2.25rem,4.4vw,4rem)] leading-[0.95] font-semibold tracking-[-0.045em] text-balance lg:col-span-8",
        tone === "light" ? "text-ink" : "text-white",
      )}
    >
      {title.map((line) => (
        <span key={line} className="block">
          {line}{" "}
        </span>
      ))}
    </h2>
    {(sheet || lead) && (
      <div className="lg:col-span-4 lg:pb-1.5">
        {sheet && <p className={cn("label-mono", tone === "light" ? "text-brand" : "text-brand-light")}>{sheet}</p>}
        {lead && (
          <p className={cn("mt-3 max-w-[44ch] leading-relaxed text-pretty", tone === "light" ? "text-ink-muted" : "text-white/70")}>
            {lead}
          </p>
        )}
      </div>
    )}
  </div>
);

interface StampProps {
  t: Dictionary["stamp"];
  sheet: string;
  className?: string;
}

/** Title block of a drawing: object, stage, project, sheet. */
export const Stamp = ({ t, sheet, className }: StampProps): React.JSX.Element => (
  <dl className={cn("grid grid-cols-[auto_1fr_auto_auto] border-t border-line font-mono text-[11px]", className)}>
    <dt className="border-r border-b border-line px-4 py-2.5 text-ink-faint">{t.object}</dt>
    <dd className="border-r border-b border-line px-4 py-2.5 text-ink">{t.objectValue}</dd>
    <dt className="border-r border-b border-line px-4 py-2.5 text-ink-faint">{t.stage}</dt>
    <dd className="border-b border-line px-4 py-2.5 text-ink">{t.stageValue}</dd>
    <dt className="border-r border-line px-4 py-2.5 text-ink-faint">{t.project}</dt>
    <dd className="border-r border-line px-4 py-2.5 text-ink">{t.projectValue}</dd>
    <dt className="border-r border-line px-4 py-2.5 text-ink-faint">{t.sheet}</dt>
    <dd className="px-4 py-2.5 text-ink">{sheet}</dd>
  </dl>
);
```

- [ ] **Step 9: Проверка**

Run: `npx tsc --noEmit && pnpm lint && pnpm test && rm -rf .next && pnpm test:e2e`
Expected: всё зелёное (старые секции рендерятся острыми углами и Geist — это промежуточное состояние).

- [ ] **Step 10: Commit**

```bash
git add -A lib/fonts.ts app/globals.css types components/ui/button.tsx components/language-switcher.tsx components/sheet.tsx content assets/fonts
git commit -m "feat(design): drawing-sheet tokens, Geist, sharp buttons and sheet primitives"
```

---
### Task 5: Шапка и первый экран «Лист 01»

**Files:**
- Modify: `content/types.ts`, `content/locales/{ru,kk,en}.ts`, `content/cabinets.ts`, `components/site-header.tsx`,
  `components/landing-page.tsx`
- Create: `components/sections/hero-sheet.tsx`, `components/sections/plan-drawing.tsx`, `e2e/hero.spec.ts`
- Delete: `components/sections/hero.tsx`, `components/sections/hero-backdrop.tsx`, `components/sections/hero-visual.tsx`

**Interfaces:**
- Consumes: `SheetRuler`, `Stamp`, `sheetTag` (Task 4); классы `reveal`, `draw`, `bg-columns`.
- Produces: `Dictionary["hero"]` (новая форма), `Dictionary["nav"].order70`, `.process`; элемент `[data-plan-target]`
  (коробка 880×650 с цветным классом) — цель перелёта интро в Task 6; якоря `#order70`, `#index` (секции появятся в Task 7–8).

- [ ] **Step 1: Падающий тест** — `e2e/hero.spec.ts`

```ts
import { expect, test } from "@playwright/test";

const headlines = {
  "/": "Проектируем и оснащаем школьные кабинеты",
  "/kk": "Мектеп кабинеттерін жобалап, жабдықтаймыз",
  "/en": "We design and equip school classrooms",
} as const;

for (const [path, text] of Object.entries(headlines)) {
  test(`first screen headline on ${path}`, async ({ page }) => {
    await page.goto(path);
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(text);
    await expect(page.locator("[data-plan-target]")).toBeVisible();
  });
}

test("header links point at the new sections", async ({ page }) => {
  await page.goto("/");
  const nav = page.getByRole("banner").getByRole("navigation", { name: "AXIS" });
  await expect(nav.getByRole("link", { name: "Приказ № 70" })).toHaveAttribute("href", "/#order70");
  await expect(nav.getByRole("link", { name: "Кабинеты" })).toHaveAttribute("href", "/#index");
});
```

Run: `pnpm test:e2e e2e/hero.spec.ts` → Expected: FAIL (старый заголовок «Оснащение школьных кабинетов под ключ.»).

- [ ] **Step 2: Типы** — в `content/types.ts` заменить блок `nav: {...};` и `hero: {...};` на

```ts
  nav: {
    skipToContent: string;
    cabinets: string;
    order70: string;
    process: string;
    catalog: string;
    services: string;
    about: string;
    contactCta: string;
    menuOpen: string;
    menuClose: string;
    languageLabel: string;
  };
  hero: {
    kicker: string;
    title: Lines;
    subtitle: string;
    primaryCta: string;
    secondaryCta: string;
    sheetLabel: string;
    sheetScale: string;
    callouts: readonly [string, string, string];
    axisX: string;
    axisY: string;
  };
```

- [ ] **Step 3: Словари** — заменить блоки `nav` и `hero`.

`ru.ts`:

```ts
  nav: {
    skipToContent: "Перейти к содержанию",
    cabinets: "Кабинеты",
    order70: "Приказ № 70",
    process: "Как работаем",
    catalog: "Каталог",
    services: "Услуги",
    about: "О компании",
    contactCta: "Обсудить проект",
    menuOpen: "Открыть меню",
    menuClose: "Закрыть меню",
    languageLabel: "Язык сайта",
  },
  hero: {
    kicker: "AXIS / Проектирование и оснащение учебных пространств",
    title: ["Проектируем", "и оснащаем", "школьные", "кабинеты"],
    subtitle:
      "От замера помещения до первого урока: планировка, мебель собственного цеха, техника и монтаж. Для государственных и частных школ по всему Казахстану.",
    primaryCta: "Подобрать по Приказу № 70",
    secondaryCta: "Смотреть кабинеты",
    sheetLabel: "Эскиз кабинета",
    sheetScale: "М 1:50",
    callouts: ["Рабочие места учащихся", "Место преподавателя", "Интерактивная панель"],
    axisX: "ось X",
    axisY: "ось Y",
  },
```

`kk.ts`:

```ts
  nav: {
    skipToContent: "Мазмұнға өту",
    cabinets: "Кабинеттер",
    order70: "№ 70 бұйрық",
    process: "Қалай жұмыс істейміз",
    catalog: "Каталог",
    services: "Қызметтер",
    about: "Компания туралы",
    contactCta: "Жобаны талқылау",
    menuOpen: "Мәзірді ашу",
    menuClose: "Мәзірді жабу",
    languageLabel: "Сайт тілі",
  },
  hero: {
    kicker: "AXIS / Оқу кеңістіктерін жобалау және жабдықтау",
    title: ["Мектеп", "кабинеттерін", "жобалап,", "жабдықтаймыз"],
    subtitle:
      "Бөлмені өлшеуден алғашқы сабаққа дейін: жоспарлау, өз цехымыздың жиһазы, техника және монтаж. Бүкіл Қазақстандағы мемлекеттік және жеке мектептерге.",
    primaryCta: "№ 70 бұйрық бойынша іріктеу",
    secondaryCta: "Кабинеттерді көру",
    sheetLabel: "Кабинет эскизі",
    sheetScale: "М 1:50",
    callouts: ["Оқушылардың жұмыс орындары", "Мұғалімнің орны", "Интерактивті панель"],
    axisX: "X осі",
    axisY: "Y осі",
  },
```

`en.ts`:

```ts
  nav: {
    skipToContent: "Skip to content",
    cabinets: "Classrooms",
    order70: "Order No. 70",
    process: "How we work",
    catalog: "Catalog",
    services: "Services",
    about: "About",
    contactCta: "Discuss a project",
    menuOpen: "Open menu",
    menuClose: "Close menu",
    languageLabel: "Site language",
  },
  hero: {
    kicker: "AXIS / Design and fit-out of learning spaces",
    title: ["We design", "and equip", "school", "classrooms"],
    subtitle:
      "From measuring the room to the first lesson: layout, furniture from our own workshop, equipment and installation. For public and private schools across Kazakhstan.",
    primaryCta: "Match Order No. 70",
    secondaryCta: "See the classrooms",
    sheetLabel: "Classroom sketch",
    sheetScale: "Scale 1:50",
    callouts: ["Student workstations", "Teacher's desk", "Interactive panel"],
    axisX: "axis X",
    axisY: "axis Y",
  },
```

В `content/cabinets.ts` удалить экспорт `heroCabinetIds` (больше не используется).

- [ ] **Step 4: Чертёж первого экрана** — `components/sections/plan-drawing.tsx`

```tsx
import Image from "next/image";

import boardLayer from "@/assets/illustrations/room-board.svg";
import decorLayer from "@/assets/illustrations/room-decor.svg";
import furnitureLayer from "@/assets/illustrations/room-furniture.svg";
import screensLayer from "@/assets/illustrations/room-screens.svg";
import shellLayer from "@/assets/illustrations/room-shell.svg";

const layers = [shellLayer, furnitureLayer, decorLayer, boardLayer, screensLayer];

/** Callout anchor points in % of the 880×650 drawing: desks, teacher's desk, board. */
const anchors = [
  { x: 40, y: 54 },
  { x: 62, y: 44 },
  { x: 68, y: 26 },
] as const;

interface PlanDrawingProps {
  callouts: readonly [string, string, string];
  axisX: string;
  axisY: string;
  label: string;
}

/**
 * The finished classroom as a sketch: colour layers, dimension lines that draw themselves and
 * callouts. `data-plan-target` is where the blueprint intro lands. Server-rendered; animation is CSS.
 */
export const PlanDrawing = ({ callouts, axisX, axisY, label }: PlanDrawingProps): React.JSX.Element => (
  <div className="flex flex-1 items-center p-6 sm:p-8">
    <div data-plan-target role="img" aria-label={label} className="relative mx-auto aspect-[880/650] w-full max-w-[34rem]">
      {layers.map((src, index) => (
        <Image key={src.src} src={src} alt="" fill unoptimized priority={index === 0} className="object-contain" />
      ))}
      <svg aria-hidden viewBox="0 0 880 650" className="absolute inset-0 size-full overflow-visible">
        <g fill="none" stroke="var(--brand)" strokeWidth="1.4">
          <path className="draw" pathLength={1} style={{ "--reveal-delay": "0.5s" }} d="M79 450 L432 611 M82 443 L76 457 M435 604 L429 618" />
          <path className="draw" pathLength={1} style={{ "--reveal-delay": "0.65s" }} d="M461 615 L812 454 M458 608 L464 622 M809 447 L815 461" />
        </g>
        <g className="font-mono" fill="var(--brand)" fontSize="15">
          <text x="226" y="566" transform="rotate(24.5 226 566)" className="reveal" style={{ "--reveal-delay": "0.9s" }}>
            {axisX}
          </text>
          <text x="610" y="560" transform="rotate(-24.5 610 560)" className="reveal" style={{ "--reveal-delay": "1s" }}>
            {axisY}
          </text>
        </g>
      </svg>
      {callouts.map((text, index) => (
        <span
          key={text}
          className="reveal absolute hidden -translate-y-1/2 items-center gap-1.5 sm:flex"
          style={{ left: `${anchors[index].x}%`, top: `${anchors[index].y}%`, "--reveal-delay": `${1 + index * 0.15}s` }}
        >
          <span aria-hidden className="size-2 shrink-0 bg-brand" />
          <span className="border border-brand bg-surface px-1.5 py-0.5 font-mono text-[10px] whitespace-nowrap text-brand">{text}</span>
        </span>
      ))}
    </div>
  </div>
);
```

Примечание: у выносок transform задаёт `-translate-y-1/2`, а `reveal` анимирует transform; это нормально — анимация
идёт от сдвига вниз к классу, после неё остаётся transform класса.

- [ ] **Step 5: Первый экран** — `components/sections/hero-sheet.tsx`

```tsx
import { Fragment } from "react";
import { ArrowDownRight } from "lucide-react";

import { PlanDrawing } from "@/components/sections/plan-drawing";
import { Stamp, sheetTag } from "@/components/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cabinetIds } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { cn } from "@/lib/utils";

interface HeroSheetProps {
  locale: Locale;
  t: Dictionary;
}

/** "Sheet 01": huge headline over visible column lines on the left, the classroom sketch with a title block on the right. */
export const HeroSheet = ({ locale, t }: HeroSheetProps): React.JSX.Element => {
  const lines = t.hero.title;

  return (
    <section aria-labelledby="hero-title" className="border-b border-line">
      <div className="container-axis">
        <div className="bg-columns grid border-x border-line lg:min-h-[min(calc(100dvh-5rem),50rem)] lg:grid-cols-12">
          <div className="flex flex-col justify-between gap-12 px-4 py-10 sm:px-6 lg:col-span-7 lg:py-14 lg:pr-10 lg:pl-8">
            <div>
              <p className="reveal font-mono text-xs text-ink-muted">{t.hero.kicker}</p>
              <h1
                id="hero-title"
                className="mt-8 text-[clamp(3rem,7.2vw,6.5rem)] leading-[0.92] font-semibold tracking-[-0.055em] text-ink lg:mt-10"
              >
                {lines.map((line, index) => (
                  <Fragment key={line}>
                    {index > 0 && " "}
                    <span className="reveal block" style={{ "--reveal-delay": `${0.08 + index * 0.08}s` }}>
                      {line}
                      {index === lines.length - 1 && (
                        <span aria-hidden className="ml-[0.06em] inline-block size-[0.17em] bg-brand" />
                      )}
                    </span>
                  </Fragment>
                ))}
              </h1>
            </div>

            <div className="reveal grid gap-6 border-t border-line pt-6 sm:grid-cols-7" style={{ "--reveal-delay": "0.45s" }}>
              <p className="text-[1.05rem] leading-relaxed text-pretty text-ink-2 sm:col-span-4 sm:pr-4">{t.hero.subtitle}</p>
              <div className="flex flex-col gap-3 sm:col-span-3">
                <a href={localePath(locale, "#order70")} className={cn(buttonVariants({ size: "lg" }), "justify-between")}>
                  {t.hero.primaryCta}
                  <ArrowDownRight aria-hidden />
                </a>
                <a
                  href={localePath(locale, "#index")}
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "justify-between")}
                >
                  {t.hero.secondaryCta}
                  <span className="font-mono text-xs opacity-60">{String(cabinetIds.length).padStart(2, "0")}</span>
                </a>
              </div>
            </div>
          </div>

          <div className="flex flex-col border-t border-line bg-surface lg:col-span-5 lg:border-t-0 lg:border-l">
            <div className="label-mono flex h-11 items-center justify-between border-b border-line px-5 text-ink-muted">
              <span>
                {sheetTag(t.stamp, 1)} · {t.hero.sheetLabel}
              </span>
              <span>{t.hero.sheetScale}</span>
            </div>
            <PlanDrawing
              callouts={t.hero.callouts}
              axisX={t.hero.axisX}
              axisY={t.hero.axisY}
              label={t.process.illustrationAlt}
            />
            <Stamp t={t.stamp} sheet="01 / 08" />
          </div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 6: Шапка** — `components/site-header.tsx` целиком

```tsx
"use client";

import { AnimatePresence, motion } from "motion/react";
import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowRight, Menu, X } from "lucide-react";

import { LanguageSwitcher } from "@/components/language-switcher";
import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { site, sitePaths, whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

interface SiteHeaderProps {
  locale: Locale;
  t: Dictionary["nav"];
}

/** Sticky header between two hairlines, like the top band of a drawing sheet. Full-screen menu below lg. */
export const SiteHeader = ({ locale, t }: SiteHeaderProps): React.JSX.Element => {
  const [open, setOpen] = useState(false);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const firstLinkRef = useRef<HTMLAnchorElement>(null);

  const close = useCallback((): void => {
    setOpen(false);
    menuButtonRef.current?.focus();
  }, []);

  useEffect(() => {
    if (!open) return;
    const root = document.documentElement;
    const previous = root.style.overflow;
    root.style.overflow = "hidden";
    firstLinkRef.current?.focus();
    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      root.style.overflow = previous;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, close]);

  const links = [
    { href: localePath(locale, "#index"), label: t.cabinets },
    { href: localePath(locale, "#order70"), label: t.order70 },
    { href: localePath(locale, "#process"), label: t.process },
    { href: sitePaths.about, label: t.about },
  ];

  return (
    <>
      <a
        href="#main"
        className="fixed top-3 left-3 z-[60] -translate-y-24 bg-ink px-4 py-2 text-sm font-medium text-white focus:translate-y-0"
      >
        {t.skipToContent}
      </a>

      <header className="sticky top-0 z-40 bg-paper">
        <div className="container-axis">
          <div className="flex h-(--header-height) items-center gap-8 border-y border-line">
            <Link href={localePath(locale)} aria-label="AXIS" className="shrink-0">
              <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} priority className="h-6 w-auto" />
            </Link>

            <nav aria-label="AXIS" className="hidden flex-1 justify-center lg:flex">
              <ul className="flex items-center gap-9">
                {links.map((link) => (
                  <li key={link.href}>
                    <a href={link.href} className="text-sm font-medium text-ink-2 transition-colors hover:text-brand">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>

            <div className="ml-auto flex items-center gap-6 lg:ml-0">
              <LanguageSwitcher locale={locale} label={t.languageLabel} className="hidden sm:flex" />
              <a
                href={whatsappUrl()}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "ink", size: "sm" }), "hidden md:inline-flex")}
              >
                {t.contactCta}
                <ArrowRight aria-hidden />
              </a>
              <button
                ref={menuButtonRef}
                type="button"
                onClick={() => setOpen((value) => !value)}
                aria-expanded={open}
                aria-controls="mobile-menu"
                aria-label={open ? t.menuClose : t.menuOpen}
                className="grid size-10 place-items-center border border-line-strong bg-surface text-ink lg:hidden"
              >
                {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
              </button>
            </div>
          </div>
        </div>
      </header>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-menu"
            role="dialog"
            aria-modal="true"
            aria-label={t.menuOpen}
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="fixed inset-x-0 top-(--header-height) bottom-0 z-50 overflow-y-auto bg-paper lg:hidden"
          >
            <div className="container-axis flex min-h-full flex-col gap-10 py-8">
              <ul className="flex flex-col border-t border-ink">
                {links.map((link, index) => (
                  <li key={link.href} className="border-b border-line">
                    <a
                      ref={index === 0 ? firstLinkRef : undefined}
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="flex items-center justify-between py-4 text-3xl font-semibold tracking-tight text-ink"
                    >
                      {link.label}
                      <span className="font-mono text-xs text-ink-faint">{String(index + 1).padStart(2, "0")}</span>
                    </a>
                  </li>
                ))}
              </ul>
              <div className="mt-auto flex flex-col gap-5">
                <LanguageSwitcher locale={locale} label={t.languageLabel} className="sm:hidden" />
                <a href={site.phoneHref} className="text-lg font-medium text-ink tabular-nums">
                  {site.phoneDisplay}
                </a>
                <a href={`mailto:${site.email}`} className="text-ink-muted">
                  {site.email}
                </a>
                <a
                  href={whatsappUrl()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={cn(buttonVariants({ size: "lg" }), "w-full justify-between")}
                >
                  {t.contactCta}
                  <ArrowRight aria-hidden />
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
```

- [ ] **Step 7: Сборка страницы** — `components/landing-page.tsx` целиком

```tsx
import { JsonLd } from "@/components/json-ld";
import { Brands } from "@/components/sections/brands";
import { Cabinets } from "@/components/sections/cabinets";
import { ContactCta } from "@/components/sections/contact-cta";
import { Faq } from "@/components/sections/faq";
import { G8 } from "@/components/sections/g8";
import { HeroSheet } from "@/components/sections/hero-sheet";
import { Process } from "@/components/sections/process";
import { Showroom, type ShowroomTour } from "@/components/sections/showroom";
import { Stats } from "@/components/sections/stats";
import { Team } from "@/components/sections/team";
import { SheetRuler } from "@/components/sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { cabinets, tourCabinetIds } from "@/content/cabinets";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";

/** The whole landing for one locale. */
export const LandingPage = ({ locale }: { locale: Locale }): React.JSX.Element => {
  const t = getDictionary(locale);

  const tours: ShowroomTour[] = tourCabinetIds.flatMap((id) => {
    const { tourHref, image } = cabinets[id];
    return tourHref ? [{ id, name: t.cabinets.items[id].name, image, tourHref }] : [];
  });

  return (
    <>
      <JsonLd locale={locale} t={t} />
      <SheetRuler />
      <SiteHeader locale={locale} t={t.nav} />
      <main id="main">
        <HeroSheet locale={locale} t={t} />
        <Stats locale={locale} t={t.stats} />
        <Cabinets t={t} />
        <Showroom t={t.showroom} tours={tours} />
        <Brands t={t.brands} />
        <Process t={t.process} />
        <Team t={t} />
        <Faq t={t} />
        <G8 t={t.g8} />
        <ContactCta t={t.contact} address={t.footer.address} cabinetItems={t.cabinets.items} />
      </main>
      <SiteFooter locale={locale} t={t} />
      <WhatsappFab label={t.whatsappFab} />
    </>
  );
};
```

Run: `git rm -q components/sections/hero.tsx components/sections/hero-backdrop.tsx components/sections/hero-visual.tsx`

- [ ] **Step 8: Прогон**

Run: `npx tsc --noEmit && pnpm lint && rm -rf .next && pnpm test:e2e`
Expected: все e2e зелёные (hero: 4 passed).

- [ ] **Step 9: Визуальная сверка** — снять 1440×900 и 390×844 скриншоты `/` (скрипт `local.mjs` из
  `scratchpad/tools`, сервер `PORT=3100 pnpm start`), сравнить с `scratchpad/concepts/a-blueprint-1.jpg`.
  Квадратик каждой выноски должен стоять на своём объекте (парты, стол учителя, доска); если промах больше 3%,
  поправить `anchors` в `plan-drawing.tsx` и пересобрать.

- [ ] **Step 10: Commit**

```bash
git add -A components content e2e/hero.spec.ts
git commit -m "feat: drawing-sheet header and first screen with classroom sketch"
```

---

### Task 6: Интро «Синька»

**Files:**
- Create: `components/intro/timeline.ts`, `components/intro/intro-boot.tsx`, `components/intro/room-outline.ts`,
  `components/intro/blueprint-intro.tsx`, `scripts/make_furniture_outline.py`,
  `assets/illustrations/room-furniture-outline.svg` (генерируется), `e2e/intro.spec.ts`
- Modify: `app/globals.css`, `components/site-document.tsx`, `components/landing-page.tsx`, `content/types.ts`,
  `content/locales/{ru,kk,en}.ts`

**Interfaces:**
- Consumes: `[data-plan-target]` (Task 5), классы `reveal`/`draw`.
- Produces: `html[data-intro="play" | "skip"]` пока интро идёт; `Dictionary["intro"] { caption; skip }`;
  `INTRO { flightAt: 3400; flightMs: 900; failsafeMs: 5600 }`.

- [ ] **Step 1: Падающие тесты** — `e2e/intro.spec.ts`

```ts
import { expect, test, type Page } from "@playwright/test";

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
  await expect(html).not.toHaveAttribute("data-intro", { timeout: 7000 });
  await expect(page.locator(".intro")).toBeHidden();
  await expect(page.locator("[data-plan-target]")).toBeVisible();
  await page.reload();
  await expect(html).not.toHaveAttribute("data-intro");
});

test("Escape skips the intro", async ({ page }) => {
  await page.goto("/?intro=1");
  await page.waitForTimeout(800);
  await page.keyboard.press("Escape");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro", { timeout: 1500 });
});

test("deep links skip the intro", async ({ page }) => {
  await asVisitor(page);
  await page.goto("/#order70");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro");
});

test("narrow screens fade the intro out instead of flying", async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("/?intro=1");
  await expect(page.locator("html")).not.toHaveAttribute("data-intro", { timeout: 7000 });
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
```

Run: `pnpm test:e2e e2e/intro.spec.ts` → Expected: FAIL (атрибута `data-intro` нет).

- [ ] **Step 2: Тексты** — в `content/types.ts` в `Dictionary` после `stamp` добавить

```ts
  intro: {
    caption: string;
    skip: string;
  };
```

и в словари после `stamp`:
- `ru.ts`: `intro: { caption: "Каждый кабинет начинается с оси", skip: "Пропустить интро" },`
- `kk.ts`: `intro: { caption: "Әр кабинет осьтен басталады", skip: "Интроны өткізу" },`
- `en.ts`: `intro: { caption: "Every classroom starts with an axis", skip: "Skip intro" },`

- [ ] **Step 3: Таймлайн и загрузчик**

`components/intro/timeline.ts`:

```ts
/**
 * Blueprint intro moments in ms. The CSS animations in app/globals.css (section "Blueprint intro")
 * use the same moments in seconds; change both together.
 */
export const INTRO = {
  flightAt: 3400,
  flightMs: 900,
  failsafeMs: 5600,
} as const;
```

`components/intro/intro-boot.tsx`:

```tsx
import { INTRO } from "@/components/intro/timeline";

/**
 * Runs while the HTML is parsed, before the first paint. Plays the intro on the first visit of the
 * session, unless the visitor prefers reduced motion, the browser is automated or the URL has an
 * #anchor. `?intro=1` forces it, `?intro=0` disables it. Failsafe: ends the intro after
 * INTRO.failsafeMs even if the app's JavaScript never loads.
 */
const script = `(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get("intro");var play=q==="1"||(q!=="0"&&!location.hash&&sessionStorage.getItem("axis-intro")!=="seen"&&!navigator.webdriver&&!matchMedia("(prefers-reduced-motion: reduce)").matches);if(!play)return;d.setAttribute("data-intro","play");sessionStorage.setItem("axis-intro","seen");window.__axisIntroStart=performance.now();setTimeout(function(){d.removeAttribute("data-intro")},${INTRO.failsafeMs})}catch(e){}})();`;

export const IntroBoot = (): React.JSX.Element => <script dangerouslySetInnerHTML={{ __html: script }} />;
```

`components/site-document.tsx` целиком:

```tsx
import type { ReactNode } from "react";

import { Analytics } from "@/components/analytics";
import { IntroBoot } from "@/components/intro/intro-boot";
import { MotionProvider } from "@/components/providers/motion-provider";
import { fontVariables } from "@/lib/fonts";
import type { Locale } from "@/lib/i18n";

/**
 * <html>/<body> shell shared by both root layouts. `suppressHydrationWarning` on <html> because the
 * intro boot script sets data-intro before React hydrates.
 */
export const SiteDocument = ({ locale, children }: { locale: Locale; children: ReactNode }): React.JSX.Element => (
  <html lang={locale} className={fontVariables} suppressHydrationWarning>
    <head>
      <IntroBoot />
    </head>
    <body className="min-h-dvh">
      <MotionProvider>{children}</MotionProvider>
      <Analytics />
    </body>
  </html>
);
```

- [ ] **Step 4: Контуры класса** — `components/intro/room-outline.ts`

```ts
/**
 * White line-art of the isometric classroom for the blueprint intro, in the 880×650 space of
 * assets/illustrations/room-*.svg. Coordinates come from the source illustration of the live site.
 */

/** Floor, floor edge and the two walls: drawn first. */
export const roomStructurePaths = [
  "M440 235 L790 395 L440 555 L90 395 Z",
  "M90 395 L90 407.4 L440 567.4 L790 407.4 L790 395",
  "M91 395.5 L91 175.4 L441 15.4 L441 235.5",
  "M439.7 15.1 L789.7 175.1 L789.7 395.2",
] as const;

/** Floor tiles: faint. */
export const roomGridPaths = [
  "M370 266.4 L720 426.4",
  "M510 266.4 L160 426.4",
  "M300 298.4 L650 458.4",
  "M580 298.4 L230 458.4",
  "M230 330.4 L580 490.4",
  "M650 330.4 L300 490.4",
  "M160 362.4 L510 522.4",
  "M720 362.4 L370 522.4",
] as const;

/** Three windows and the board. */
export const roomDetailPaths = [
  "M403.3 194.5 L329.8 228.1 L329.8 102.2 L403.3 68.6 Z",
  "M367.5 208.7 L367.5 87.8",
  "M303.5 240.1 L230 273.7 L230 147.8 L303.5 114.2 Z",
  "M267.8 254.3 L267.8 133.4",
  "M203.8 285.7 L130.3 319.3 L130.3 193.4 L203.8 159.8 Z",
  "M168.1 299.9 L168.1 179",
  "M553.8 205.5 L669.3 258.3 L669.3 157.9 L553.8 105.1 Z",
] as const;

/** Dimension lines with end ticks. */
export const roomDimPaths = [
  "M79 450 L432 611 M82 443 L76 457 M435 604 L429 618",
  "M461 615 L812 454 M458 608 L464 622 M809 447 L815 461",
] as const;
```

`scripts/make_furniture_outline.py`:

```python
"""White line-art copy of the furniture layer for the blueprint intro.

Usage: python3 scripts/make_furniture_outline.py
"""
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "assets" / "illustrations" / "room-furniture.svg"
OUT = ROOT / "assets" / "illustrations" / "room-furniture-outline.svg"

svg = SRC.read_text(encoding="utf-8")
svg = re.sub(r'fill="(?!none)[^"]*"', 'fill="none"', svg)
svg = re.sub(r'stroke="[^"]*"', 'stroke="#ffffff"', svg)
svg = re.sub(r'stroke-width="[^"]*"', 'stroke-width=".9"', svg)
OUT.write_text(svg, encoding="utf-8")
print(f"wrote {OUT.relative_to(ROOT)}")
```

Run: `python3 scripts/make_furniture_outline.py` → Expected: `wrote assets/illustrations/room-furniture-outline.svg`.

- [ ] **Step 5: CSS-таймлайн** — в конец `app/globals.css` добавить

```css
/* ---------- Blueprint intro. Moments mirror components/intro/timeline.ts ---------- */
.intro {
  display: none;
  position: fixed;
  inset: 0;
  z-index: 70;
  /* Failsafe exit when the app's JS never takes over (it sets data-js and disables this). */
  animation: intro-out 0.4s ease-in 4s both;
}
html[data-intro] .intro {
  display: block;
}
.intro[data-js] {
  animation: none;
}
html[data-intro="skip"] .intro {
  animation: intro-out 0.3s ease-in both;
}
.intro-bg {
  position: absolute;
  inset: 0;
  background-color: #1a3696;
  animation: intro-develop 0.8s ease-in-out 2.6s both;
}
.intro-grid {
  position: absolute;
  inset: 0;
  background-image:
    linear-gradient(to right, rgb(255 255 255 / 0.08) 1px, transparent 1px),
    linear-gradient(to bottom, rgb(255 255 255 / 0.08) 1px, transparent 1px);
  background-size: 48px 48px;
  animation: intro-fade-out 0.6s ease 2.6s both;
}
.intro-in {
  animation: intro-fade-in 0.5s var(--ease-out-expo) var(--at, 0s) both;
}
.intro-pop {
  animation: intro-pop 0.6s var(--ease-out-expo) var(--at, 0s) both;
}
.intro-draw {
  stroke-dasharray: 1;
  animation: intro-draw var(--dur, 0.7s) var(--ease-out-expo) var(--at, 0s) both;
}
.intro-out-at {
  animation: intro-fade-out 0.5s ease var(--out, 2.6s) both;
}
.intro-in-out {
  animation:
    intro-fade-in 0.5s var(--ease-out-expo) var(--at, 0s) both,
    intro-fade-out 0.4s ease var(--out, 2.5s) both;
}
.intro-grow-x {
  transform-origin: left center;
  animation: intro-grow-x 0.8s var(--ease-out-expo) 0.6s both;
}
.intro-grow-y {
  transform-origin: center bottom;
  animation: intro-grow-y 0.8s var(--ease-out-expo) 0.6s both;
}
@keyframes intro-out {
  to {
    opacity: 0;
    visibility: hidden;
  }
}
@keyframes intro-develop {
  to {
    background-color: var(--paper);
  }
}
@keyframes intro-fade-in {
  from {
    opacity: 0;
  }
}
@keyframes intro-fade-out {
  to {
    opacity: 0;
  }
}
@keyframes intro-pop {
  from {
    opacity: 0;
    transform: scale(0.6);
  }
}
@keyframes intro-draw {
  from {
    stroke-dashoffset: 1;
  }
  to {
    stroke-dashoffset: 0;
  }
}
@keyframes intro-grow-x {
  from {
    transform: scaleX(0);
  }
}
@keyframes intro-grow-y {
  from {
    transform: scaleY(0);
  }
}

/* While the intro plays, the first screen waits: its reveal is paused and its drawing hidden. */
html[data-intro="play"] :is(.reveal, .draw) {
  animation-play-state: paused;
}
html[data-intro] [data-plan-target] {
  visibility: hidden;
}
```

- [ ] **Step 6: Компонент интро** — `components/intro/blueprint-intro.tsx`

```tsx
"use client";

import { animate } from "motion/react";
import Image from "next/image";
import { useEffect, useRef } from "react";

import boardLayer from "@/assets/illustrations/room-board.svg";
import decorLayer from "@/assets/illustrations/room-decor.svg";
import furnitureOutline from "@/assets/illustrations/room-furniture-outline.svg";
import furnitureLayer from "@/assets/illustrations/room-furniture.svg";
import screensLayer from "@/assets/illustrations/room-screens.svg";
import shellLayer from "@/assets/illustrations/room-shell.svg";
import { roomDetailPaths, roomDimPaths, roomGridPaths, roomStructurePaths } from "@/components/intro/room-outline";
import { INTRO } from "@/components/intro/timeline";
import type { Dictionary } from "@/content/types";

declare global {
  interface Window {
    /** performance.now() when the boot script started the intro. */
    __axisIntroStart?: number;
  }
}

const colorLayers = [
  { src: shellLayer, at: "2.7s" },
  { src: furnitureLayer, at: "2.9s" },
  { src: decorLayer, at: "3s" },
  { src: boardLayer, at: "3.1s" },
  { src: screensLayer, at: "3.2s" },
] as const;

const EASE_IN_OUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

/**
 * Blueprint intro: logo corner → X/Y axes → classroom in white lines → develops into colour → flies
 * into the first screen's sketch. The timeline is CSS (it starts before hydration); this component
 * adds skipping and the measured flight. It only renders markup; the boot script decides if it shows.
 */
export const BlueprintIntro = ({ t }: { t: Dictionary["intro"] }): React.JSX.Element => {
  const rootRef = useRef<HTMLDivElement>(null);
  const bgRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const skipRef = useRef<() => void>(() => undefined);

  useEffect(() => {
    const html = document.documentElement;
    const root = rootRef.current;
    if (!root || html.getAttribute("data-intro") !== "play") return;

    root.dataset.js = "";
    const controller = new AbortController();
    const timers: number[] = [];

    const end = (): void => {
      controller.abort();
      html.removeAttribute("data-intro");
    };

    const skip = (): void => {
      if (html.getAttribute("data-intro") !== "play") return;
      html.setAttribute("data-intro", "skip");
      timers.push(window.setTimeout(end, 300));
    };
    skipRef.current = skip;

    const fly = (): void => {
      if (html.getAttribute("data-intro") !== "play") return;
      const room = roomRef.current;
      const from = room?.getBoundingClientRect();
      const to = document.querySelector("[data-plan-target]")?.getBoundingClientRect();
      const onScreen = to !== undefined && to.top >= 0 && to.bottom <= window.innerHeight && window.innerWidth >= 1024;

      if (room && from && to && onScreen) {
        room.style.transformOrigin = "0 0";
        animate(
          room,
          { x: to.left - from.left, y: to.top - from.top, scale: to.width / from.width },
          { duration: INTRO.flightMs / 1000, ease: EASE_IN_OUT },
        );
        if (bgRef.current) animate(bgRef.current, { opacity: 0 }, { duration: 0.6, delay: 0.2 });
        timers.push(window.setTimeout(end, INTRO.flightMs + 60));
      } else {
        animate(root, { opacity: 0 }, { duration: 0.5 }).then(end);
      }
    };

    const elapsed = performance.now() - (window.__axisIntroStart ?? performance.now());
    timers.push(window.setTimeout(fly, Math.max(0, INTRO.flightAt - elapsed)));

    const onKey = (event: KeyboardEvent): void => {
      if (event.key === "Escape") skip();
    };
    window.addEventListener("keydown", onKey, { signal: controller.signal });
    window.addEventListener("wheel", skip, { passive: true, signal: controller.signal });
    window.addEventListener("touchmove", skip, { passive: true, signal: controller.signal });

    // Cleanup only stops this run (React Strict Mode re-runs effects in development).
    return () => {
      controller.abort();
      timers.forEach((id) => window.clearTimeout(id));
    };
  }, []);

  return (
    <div ref={rootRef} className="intro">
      <div ref={bgRef} className="intro-bg" />
      <div aria-hidden className="intro-grid" />

      <div aria-hidden className="absolute inset-0 overflow-hidden">
        <div className="intro-out-at absolute inset-0" style={{ "--out": "2.6s" }}>
          <div className="intro-grow-x absolute top-1/2 left-1/2 h-[1.5px] w-1/2 bg-white/80" />
          <div className="intro-grow-y absolute bottom-1/2 left-1/2 h-1/2 w-[1.5px] bg-white/80" />
          <span className="intro-in absolute top-1/2 right-6 mt-3 font-mono text-xs text-white/80" style={{ "--at": "1.2s" }}>
            X
          </span>
          <span className="intro-in absolute top-6 left-1/2 ml-3 font-mono text-xs text-white/80" style={{ "--at": "1.2s" }}>
            Y
          </span>
        </div>

        <div className="intro-out-at absolute top-1/2 left-1/2 -translate-y-full" style={{ "--out": "1.4s" }}>
          <div className="intro-pop relative size-12 border-b-[5px] border-l-[5px] border-white" style={{ "--at": "0.1s" }}>
            <span className="absolute bottom-1.5 left-1.5 size-2.5 bg-brand-light" />
          </div>
        </div>

        <div className="absolute inset-0 grid place-items-center">
          <div ref={roomRef} className="relative aspect-[880/650] w-[min(80vw,54rem)]">
            <svg viewBox="0 0 880 650" className="absolute inset-0 size-full overflow-visible">
              <g fill="none" stroke="white" strokeLinejoin="round" className="intro-out-at" style={{ "--out": "2.75s" }}>
                {roomStructurePaths.map((d, index) => (
                  <path key={d} d={d} pathLength={1} strokeWidth={1.6} className="intro-draw" style={{ "--at": `${1.4 + index * 0.12}s`, "--dur": "0.6s" }} />
                ))}
                {roomGridPaths.map((d, index) => (
                  <path key={d} d={d} pathLength={1} strokeWidth={0.8} strokeOpacity={0.35} className="intro-draw" style={{ "--at": `${1.8 + index * 0.03}s`, "--dur": "0.4s" }} />
                ))}
                {roomDetailPaths.map((d, index) => (
                  <path key={d} d={d} pathLength={1} strokeWidth={1.2} className="intro-draw" style={{ "--at": `${1.9 + index * 0.05}s`, "--dur": "0.5s" }} />
                ))}
                {roomDimPaths.map((d) => (
                  <path key={d} d={d} pathLength={1} strokeWidth={1.2} stroke="#9db4f5" className="intro-draw" style={{ "--at": "2s", "--dur": "0.6s" }} />
                ))}
              </g>
            </svg>
            <Image src={furnitureOutline} alt="" fill unoptimized className="intro-in-out object-contain" style={{ "--at": "2.2s", "--out": "2.8s" }} />
            {colorLayers.map(({ src, at }) => (
              <Image key={at} src={src} alt="" fill unoptimized className="intro-in object-contain" style={{ "--at": at }} />
            ))}
          </div>
        </div>

        <p
          className="intro-in-out absolute inset-x-0 bottom-[16%] text-center font-mono text-xs tracking-[0.2em] text-white/85 uppercase"
          style={{ "--at": "1s", "--out": "2.5s" }}
        >
          {t.caption}
        </p>
      </div>

      <button
        type="button"
        onClick={() => skipRef.current()}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-ink/85 px-4 py-2.5 font-mono text-[11px] tracking-[0.08em] text-white uppercase transition-colors hover:bg-ink"
      >
        {t.skip}
      </button>
    </div>
  );
};
```

- [ ] **Step 7: Подключить** — в `components/landing-page.tsx` добавить импорт
  `import { BlueprintIntro } from "@/components/intro/blueprint-intro";` и строку `<BlueprintIntro t={t.intro} />`
  сразу после `<JsonLd locale={locale} t={t} />`.

- [ ] **Step 8: Прогон**

Run: `npx tsc --noEmit && pnpm lint && rm -rf .next && pnpm test:e2e`
Expected: все зелёные, включая 5 тестов интро.

- [ ] **Step 9: Кадры сценария** — Playwright-скрипт: открыть `http://localhost:3100/?intro=1` (1440×900),
  снять кадры на 0.5, 1.2, 2.2, 3.0, 3.6, 4.0, 4.6 с. Ожидаемо: знак → оси с подписью → белые контуры класса →
  цветной класс на бумаге → перелёт → первый экран, класс стоит в листе без скачка. Если в момент 4.4 с виден скачок
  между летящим классом и `[data-plan-target]`, сравнить их `getBoundingClientRect()` в конце перелёта и устранить
  расхождение (обычно — отступы контейнера цели).

- [ ] **Step 10: Commit**

```bash
git add -A components app/globals.css content scripts/make_furniture_outline.py assets/illustrations/room-furniture-outline.svg e2e/intro.spec.ts
git commit -m "feat: blueprint intro that develops into the first screen"
```

---
### Task 7: Линейка этапов и инструмент «Приказ № 70»

**Files:**
- Modify: `content/types.ts`, `content/locales/{ru,kk,en}.ts`, `content/cabinets.ts`, `components/landing-page.tsx`
- Create: `components/sections/stages.tsx`, `components/sections/order70-tool.tsx`, `e2e/order70.spec.ts`

**Interfaces:**
- Consumes: `order70`, `countItems` (Task 2); `buildQuoteMessage`, `QuoteTemplates` (Task 3); `SheetHeading` (Task 4).
- Produces: `Cabinet.code` (`"INF" | "ART" | ...` как `string`); `Dictionary["stages"]`, `Dictionary["order70"]`;
  секция `#order70` с `data-testid="order70-total" | "order70-have" | "order70-need"`.

- [ ] **Step 1: Падающие тесты** — `e2e/order70.spec.ts`

```ts
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
```

Run: `pnpm test:e2e e2e/order70.spec.ts` → Expected: FAIL (`#order70` не найден).

- [ ] **Step 2: Коды кабинетов** — в `content/cabinets.ts` в `interface Cabinet` после `category` добавить

```ts
  /** Three-letter index code shown in the drawing index, e.g. "INF". */
  code: string;
```

и в объекты `cabinets` добавить `code`: informatics `"INF"`, art `"ART"`, sewing `"SEW"`, pottery `"POT"`,
workshop `"WRK"`, kazakh `"KAZ"`, russian `"RUS"`, english `"ENG"` (строкой после `category`).

- [ ] **Step 3: Типы** — в `content/types.ts` добавить импорт
  `import type { QuoteTemplates } from "@/lib/quote-message";`, интерфейс

```ts
export interface StageCopy {
  label: string;
  text: string;
}
```

и в `Dictionary` после `hero`:

```ts
  stages: {
    label: string;
    items: readonly [StageCopy, StageCopy, StageCopy, StageCopy];
  };
  order70: {
    title: Lines;
    text: string;
    tabsLabel: string;
    itemsUnit: string;
    total: string;
    have: string;
    need: string;
    haveBadge: string;
    send: string;
    reset: string;
    hint: string;
    previewCaption: string;
    sourceNote: string;
    message: QuoteTemplates;
  };
```

- [ ] **Step 4: Словари** — после блока `hero` вставить.

`ru.ts`:

```ts
  stages: {
    label: "Этапы работы",
    items: [
      { label: "Замер", text: "Изучаем помещение и задачи" },
      { label: "Проектирование", text: "Планировка и состав по нормативу" },
      { label: "Поставка", text: "Мебель из своего цеха и техника" },
      { label: "Установка", text: "Подключаем и запускаем урок" },
    ],
  },
  order70: {
    title: ["Состав кабинета", "по Приказу № 70"],
    text: "Выберите кабинет и отметьте, что уже есть в школе. Остальное подберём, изготовим в своём цехе, привезём и смонтируем.",
    tabsLabel: "Кабинет",
    itemsUnit: "поз.",
    total: "Всего",
    have: "Есть",
    need: "Подобрать",
    haveBadge: "есть",
    send: "Отправить на расчёт",
    reset: "Сбросить",
    hint: "Откроется WhatsApp с готовым списком",
    previewCaption: "визуализация концепции",
    sourceNote: "Перечень приводится по тексту Приказа № 70. Итоговый состав уточняем после замера.",
    message: {
      intro: "Здравствуйте! Прошу рассчитать оснащение: {cabinet}.",
      total: "По Приказу № 70: {total} поз.",
      have: "Уже есть в школе ({have}): {list}.",
      haveNone: "Нужен полный комплект.",
      need: "Подобрать: {need} поз.",
      more: "и ещё {count}",
    },
  },
```

`kk.ts`:

```ts
  stages: {
    label: "Жұмыс кезеңдері",
    items: [
      { label: "Өлшеу", text: "Бөлме мен міндеттерді зерттейміз" },
      { label: "Жобалау", text: "Норматив бойынша жоспар мен құрам" },
      { label: "Жеткізу", text: "Өз цехымыздың жиһазы және техника" },
      { label: "Орнату", text: "Қосамыз да, сабақты бастаймыз" },
    ],
  },
  order70: {
    title: ["№ 70 бұйрық бойынша", "кабинет құрамы"],
    text: "Кабинетті таңдап, мектепте бұрыннан бар нәрсені белгілеңіз. Қалғанын іріктеп, өз цехымызда жасап, жеткізіп, орнатамыз.",
    tabsLabel: "Кабинет",
    itemsUnit: "позиция",
    total: "Барлығы",
    have: "Бар",
    need: "Іріктеу",
    haveBadge: "бар",
    send: "Есептеуге жіберу",
    reset: "Тазарту",
    hint: "Дайын тізімі бар WhatsApp ашылады",
    previewCaption: "тұжырымдама визуализациясы",
    sourceNote: "Тізбе № 70 бұйрық мәтіні бойынша берілген. Түпкілікті құрамды өлшеуден кейін нақтылаймыз.",
    message: {
      intro: "Сәлеметсіз бе! Жабдықтауды есептеп беруіңізді сұраймын: {cabinet}.",
      total: "№ 70 бұйрық бойынша: {total} позиция.",
      have: "Мектепте бар ({have}): {list}.",
      haveNone: "Толық жинақ керек.",
      need: "Іріктеу керек: {need} позиция.",
      more: "және тағы {count}",
    },
  },
```

`en.ts`:

```ts
  stages: {
    label: "How we work",
    items: [
      { label: "Survey", text: "We study the room and your goals" },
      { label: "Design", text: "Layout and kit to the standard" },
      { label: "Delivery", text: "Furniture from our workshop, plus equipment" },
      { label: "Installation", text: "We connect everything and start the lesson" },
    ],
  },
  order70: {
    title: ["Classroom kit", "under Order No. 70"],
    text: "Pick a classroom and tick what the school already has. We will source the rest, build it in our workshop, deliver and install it.",
    tabsLabel: "Classroom",
    itemsUnit: "items",
    total: "Total",
    have: "In place",
    need: "To source",
    haveBadge: "in place",
    send: "Send for a quote",
    reset: "Clear",
    hint: "WhatsApp opens with the list ready",
    previewCaption: "concept visualization",
    sourceNote: "Items are listed as worded in Order No. 70. The final kit is confirmed after the survey.",
    message: {
      intro: "Hello! Please prepare a quote for: {cabinet}.",
      total: "Order No. 70 lists {total} items.",
      have: "Already in place ({have}): {list}.",
      haveNone: "We need the full kit.",
      need: "To source: {need} items.",
      more: "and {count} more",
    },
  },
```

- [ ] **Step 5: Линейка этапов** — `components/sections/stages.tsx`

```tsx
import type { Dictionary } from "@/content/types";

/** The four stages as a ruler right under the first screen. Hairlines come from the 1px grid gap. */
export const Stages = ({ t }: { t: Dictionary["stages"] }): React.JSX.Element => (
  <section aria-label={t.label} className="border-b border-line">
    <div className="container-axis">
      <ol className="grid gap-px border-x border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
        {t.items.map((stage) => (
          <li key={stage.label} className="bg-paper px-5 py-6 lg:px-6">
            <p className="label-mono text-brand">→ {stage.label}</p>
            <p className="mt-2.5 text-[15px] text-ink">{stage.text}</p>
          </li>
        ))}
      </ol>
    </div>
  </section>
);
```

- [ ] **Step 6: Инструмент** — `components/sections/order70-tool.tsx`

```tsx
"use client";

import Image from "next/image";
import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Check, MessageCircle, RotateCcw } from "lucide-react";

import { SheetHeading } from "@/components/sheet";
import { buttonVariants } from "@/components/ui/button";
import { cabinetIds, cabinets, type CabinetId } from "@/content/cabinets";
import { order70 } from "@/content/order70";
import type { Dictionary } from "@/content/types";
import { countItems } from "@/lib/order70";
import { buildQuoteMessage } from "@/lib/quote-message";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

interface Order70ToolProps {
  t: Dictionary["order70"];
  items: Dictionary["cabinets"]["items"];
  sheet: string;
}

/** Key of an item inside one cabinet; names can repeat across categories. */
const itemKey = (group: number, item: number): string => `${group}:${item}`;

/**
 * "#order70": pick a classroom, tick what the school already has, send the rest for a quote.
 * Ticks are kept per classroom while switching tabs.
 */
export const Order70Tool = ({ t, items, sheet }: Order70ToolProps): React.JSX.Element => {
  const [active, setActive] = useState<CabinetId>("informatics");
  const [ticks, setTicks] = useState<Partial<Record<CabinetId, readonly string[]>>>({});
  const tabRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const groups = order70[active];
  const checked = ticks[active] ?? [];
  const total = countItems(active);
  const have = checked.length;
  const haveNames = groups.flatMap((group, g) =>
    group.items.flatMap((item, i) => (checked.includes(itemKey(g, i)) ? [item.name] : [])),
  );
  const message = buildQuoteMessage({ cabinet: items[active].name, total, haveItems: haveNames, templates: t.message });

  const toggle = (key: string): void =>
    setTicks((previous) => {
      const current = previous[active] ?? [];
      return { ...previous, [active]: current.includes(key) ? current.filter((k) => k !== key) : [...current, key] };
    });

  const reset = (): void => setTicks((previous) => ({ ...previous, [active]: [] }));

  const onTabKeyDown = (event: KeyboardEvent<HTMLButtonElement>, index: number): void => {
    const last = cabinetIds.length - 1;
    const moves: Record<string, number> = {
      ArrowRight: index === last ? 0 : index + 1,
      ArrowLeft: index === 0 ? last : index - 1,
      Home: 0,
      End: last,
    };
    const next = moves[event.key];
    if (next === undefined) return;
    event.preventDefault();
    setActive(cabinetIds[next]);
    tabRefs.current[next]?.focus();
  };

  const panelId = `${baseId}-panel`;

  return (
    <section id="order70" aria-labelledby="order70-title" className="border-b border-line py-20 lg:py-28">
      <div className="container-axis">
        <SheetHeading id="order70-title" sheet={sheet} title={t.title} lead={t.text} />

        <div className="mt-12 border border-ink bg-surface">
          <div role="tablist" aria-label={t.tabsLabel} className="flex overflow-x-auto border-b border-line">
            {cabinetIds.map((id, index) => {
              const selected = id === active;
              return (
                <button
                  key={id}
                  ref={(node) => {
                    tabRefs.current[index] = node;
                  }}
                  id={`${baseId}-tab-${id}`}
                  type="button"
                  role="tab"
                  aria-selected={selected}
                  aria-controls={panelId}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setActive(id)}
                  onKeyDown={(event) => onTabKeyDown(event, index)}
                  className={cn(
                    "flex shrink-0 items-center gap-2 border-r border-line px-4 py-3 text-sm whitespace-nowrap transition-colors",
                    selected ? "bg-ink text-white" : "text-ink-2 hover:bg-paper",
                  )}
                >
                  <span className={cn("font-mono text-[11px]", selected ? "text-brand-light" : "text-ink-faint")}>
                    {cabinets[id].code}
                  </span>
                  {items[id].name}
                </button>
              );
            })}
          </div>

          <div id={panelId} role="tabpanel" aria-labelledby={`${baseId}-tab-${active}`} className="grid lg:grid-cols-[minmax(0,1fr)_20rem]">
            <div className="max-h-[36rem] overflow-y-auto px-5 pt-4 pb-6">
              <div className="label-mono flex justify-between text-ink-muted">
                <span>{items[active].name}</span>
                <span>
                  {total} {t.itemsUnit}
                </span>
              </div>
              {groups.map((group, g) => (
                <fieldset key={group.category} className="mt-6">
                  <legend className="label-mono text-ink-faint">{group.category}</legend>
                  <ul className="mt-2 divide-y divide-line border-y border-line">
                    {group.items.map((item, i) => {
                      const key = itemKey(g, i);
                      const on = checked.includes(key);
                      return (
                        <li key={key}>
                          <label className="flex cursor-pointer items-start gap-3 py-2.5 text-[15px]">
                            <input
                              type="checkbox"
                              checked={on}
                              onChange={() => toggle(key)}
                              data-name={item.name}
                              className="peer sr-only"
                            />
                            <span
                              aria-hidden
                              className={cn(
                                "mt-0.5 grid size-[18px] shrink-0 place-items-center border transition-colors peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-focus-visible:outline-brand",
                                on ? "border-brand bg-brand text-white" : "border-line-strong bg-surface",
                              )}
                            >
                              {on && <Check className="size-3" strokeWidth={3} />}
                            </span>
                            <span className={cn("flex-1 text-pretty", on ? "text-ink-faint line-through decoration-line-strong" : "text-ink")}>
                              {item.name}
                            </span>
                            <span className={cn("pt-0.5 font-mono text-[11px]", on ? "text-ok" : "text-ink-faint")}>
                              {on ? t.haveBadge : item.unit}
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                </fieldset>
              ))}
            </div>

            <aside className="sticky bottom-0 border-t border-line bg-paper p-5 lg:static lg:border-t-0 lg:border-l">
              <figure className="hidden lg:block">
                <div className="relative aspect-[4/3] overflow-hidden bg-line">
                  <Image src={cabinets[active].image} alt="" fill placeholder="blur" sizes="20rem" className="object-cover" />
                </div>
                <figcaption className="mt-2 font-mono text-[11px] text-ink-faint">
                  {cabinets[active].code} · {t.previewCaption}
                </figcaption>
              </figure>
              <dl aria-live="polite" className="grid grid-cols-3 gap-px border border-line bg-line lg:mt-5">
                <div className="bg-surface p-3">
                  <dt className="label-mono text-ink-faint">{t.total}</dt>
                  <dd data-testid="order70-total" className="mt-2 text-2xl font-semibold tabular-nums">
                    {total}
                  </dd>
                </div>
                <div className="bg-surface p-3">
                  <dt className="label-mono text-ink-faint">{t.have}</dt>
                  <dd data-testid="order70-have" className="mt-2 text-2xl font-semibold text-ok tabular-nums">
                    {have}
                  </dd>
                </div>
                <div className="bg-surface p-3">
                  <dt className="label-mono text-ink-faint">{t.need}</dt>
                  <dd data-testid="order70-need" className="mt-2 text-2xl font-semibold text-brand tabular-nums">
                    {total - have}
                  </dd>
                </div>
              </dl>
              <a
                href={whatsappUrl(message)}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ size: "lg" }), "mt-4 w-full justify-between")}
              >
                {t.send}
                <MessageCircle aria-hidden />
              </a>
              <div className="mt-3 flex items-center justify-between gap-3">
                <p className="text-xs text-ink-muted">{t.hint}</p>
                <button
                  type="button"
                  onClick={reset}
                  disabled={have === 0}
                  className="inline-flex shrink-0 items-center gap-1.5 text-xs font-medium text-ink-2 transition-colors hover:text-brand disabled:opacity-40"
                >
                  <RotateCcw aria-hidden className="size-3.5" />
                  {t.reset}
                </button>
              </div>
            </aside>
          </div>
        </div>
        <p className="mt-4 font-mono text-[11px] text-ink-faint">{t.sourceNote}</p>
      </div>
    </section>
  );
};
```

- [ ] **Step 7: Подключить** — в `components/landing-page.tsx`: импорты
  `import { Order70Tool } from "@/components/sections/order70-tool";`,
  `import { Stages } from "@/components/sections/stages";`, импорт `sheetTag` рядом с `SheetRuler`
  (`import { SheetRuler, sheetTag } from "@/components/sheet";`) и сразу после `<HeroSheet locale={locale} t={t} />`:

```tsx
        <Stages t={t.stages} />
        <Order70Tool t={t.order70} items={t.cabinets.items} sheet={sheetTag(t.stamp, 2)} />
```

- [ ] **Step 8: Прогон**

Run: `npx tsc --noEmit && pnpm lint && pnpm test && rm -rf .next && pnpm test:e2e`
Expected: всё зелёное, order70: 3 passed.

- [ ] **Step 9: Commit**

```bash
git add -A components content e2e/order70.spec.ts
git commit -m "feat: stage ruler and Order No. 70 kit tool with WhatsApp request"
```

---

### Task 8: Индекс кабинетов

**Files:**
- Modify: `content/types.ts`, `content/locales/{ru,kk,en}.ts`, `content/cabinets.ts`, `components/landing-page.tsx`
- Create: `components/sections/cabinet-index.tsx`, `e2e/index.spec.ts`
- Delete: `components/sections/cabinets.tsx`, `components/sections/showroom.tsx`

**Interfaces:**
- Consumes: `Cabinet.code` (Task 7), `countItems` (Task 2), `fill` (Task 3).
- Produces: секция `#index`, `data-testid="index-caption"`; `Dictionary["index"]`;
  `Dictionary["cabinets"]` сужается до `{ tour; quote; items }`.

- [ ] **Step 1: Падающий тест** — `e2e/index.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test("index lists eight classrooms and previews the hovered one", async ({ page }) => {
  await page.goto("/#index");
  const index = page.locator("#index");
  await expect(index.getByRole("listitem")).toHaveCount(8);
  await index.getByRole("listitem").filter({ hasText: "Гончарная студия" }).hover();
  await expect(index.getByTestId("index-caption")).toContainText("POT");
  await expect(index.getByRole("link", { name: "Гончарная студия", exact: true })).toHaveAttribute("href", "/goncharnaya-studiya");
  await expect(index.getByRole("link", { name: "3D-тур: Информатика" })).toHaveAttribute("href", "/virtual-classroom");
});
```

Run: `pnpm test:e2e e2e/index.spec.ts` → Expected: FAIL (`#index` не найден).

- [ ] **Step 2: Типы** — в `content/types.ts` заменить блок `cabinets: {...};` на

```ts
  cabinets: {
    tour: string;
    quote: string;
    items: Record<CabinetId, CabinetCopy>;
  };
  index: {
    title: Lines;
    hint: string;
    columns: { code: string; name: string; key: string; items: string; action: string };
    itemsUnit: string;
    previewCaption: string;
  };
```

удалить блок `showroom: {...};` и импорт `CabinetCategory` (больше не нужен).

- [ ] **Step 3: Словари** — в каждой локали: в блоке `cabinets` удалить ключи `title`, `lead`, `openKit`,
  `categories`, `languagesTitle`, `languagesText`, `languagesLinks`; удалить блок `showroom`; после блока `cabinets`
  вставить `index`.

`ru.ts`:

```ts
  index: {
    title: ["Восемь кабинетов.", "Один подрядчик."],
    hint: "Наведите на строку, чтобы увидеть концепцию кабинета.",
    columns: { code: "Код", name: "Кабинет", key: "Ключевое", items: "Приказ № 70", action: "Действие" },
    itemsUnit: "поз.",
    previewCaption: "визуализация концепции",
  },
```

`kk.ts`:

```ts
  index: {
    title: ["Сегіз кабинет.", "Бір мердігер."],
    hint: "Кабинет тұжырымдамасын көру үшін жолды таңдаңыз.",
    columns: { code: "Код", name: "Кабинет", key: "Негізгісі", items: "№ 70 бұйрық", action: "Әрекет" },
    itemsUnit: "позиция",
    previewCaption: "тұжырымдама визуализациясы",
  },
```

`en.ts`:

```ts
  index: {
    title: ["Eight classrooms.", "One contractor."],
    hint: "Hover a row to preview the classroom concept.",
    columns: { code: "Code", name: "Classroom", key: "Key item", items: "Order No. 70", action: "Action" },
    itemsUnit: "items",
    previewCaption: "concept visualization",
  },
```

В `content/cabinets.ts` удалить экспорты `tourCabinetIds` и `languageCabinetIds`.

- [ ] **Step 4: Индекс** — `components/sections/cabinet-index.tsx`

```tsx
"use client";

import Image from "next/image";
import { useState } from "react";
import { Box, Calculator } from "lucide-react";

import { SheetHeading } from "@/components/sheet";
import { cabinetIds, cabinets, type CabinetId } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { countItems } from "@/lib/order70";
import { whatsappUrl } from "@/lib/site";
import { fill } from "@/lib/template";
import { cn } from "@/lib/utils";

interface CabinetIndexProps {
  copy: Dictionary["index"];
  items: Dictionary["cabinets"]["items"];
  tour: string;
  quote: string;
  quoteTemplate: string;
  sheet: string;
}

const columns = "lg:grid-cols-[4.5rem_minmax(0,1fr)_11rem_6.5rem_7rem]";

/** "#index": the eight classrooms as a drawing index; hovering or focusing a row swaps the preview. */
export const CabinetIndex = ({ copy, items, tour, quote, quoteTemplate, sheet }: CabinetIndexProps): React.JSX.Element => {
  const [active, setActive] = useState<CabinetId>("informatics");
  const position = cabinetIds.indexOf(active) + 1;

  return (
    <section id="index" aria-labelledby="index-title" className="border-b border-line py-20 lg:py-28">
      <div className="container-axis">
        <SheetHeading id="index-title" sheet={sheet} title={copy.title} lead={copy.hint} />

        <div className="mt-12 grid border-t border-ink lg:grid-cols-12">
          <div className="lg:col-span-7">
            <div aria-hidden className={cn("label-mono hidden h-10 items-center border-b border-line text-ink-faint lg:grid", columns)}>
              <span className="pl-3">{copy.columns.code}</span>
              <span>{copy.columns.name}</span>
              <span>{copy.columns.key}</span>
              <span>{copy.columns.items}</span>
              <span className="pr-3 text-right">{copy.columns.action}</span>
            </div>
            <ul>
              {cabinetIds.map((id) => {
                const cabinet = cabinets[id];
                const item = items[id];
                const selected = id === active;
                return (
                  <li
                    key={id}
                    onMouseEnter={() => setActive(id)}
                    onFocusCapture={() => setActive(id)}
                    className={cn(
                      "group relative grid grid-cols-[4.5rem_minmax(0,1fr)_auto] items-center gap-y-3 border-b border-line py-4 transition-colors lg:h-[4.75rem] lg:py-0",
                      columns,
                      selected ? "bg-surface" : "hover:bg-surface",
                    )}
                  >
                    <span className={cn("pl-3 font-mono text-xs", selected ? "text-brand" : "text-ink-faint")}>{cabinet.code}</span>
                    <a
                      href={cabinet.href}
                      className="text-xl font-medium tracking-tight text-ink outline-none after:absolute after:inset-0 focus-visible:after:outline-2 focus-visible:after:-outline-offset-2 focus-visible:after:outline-brand lg:text-2xl"
                    >
                      {item.name}
                    </a>
                    <span className="hidden text-[13px] text-ink-muted lg:block">{item.features[0]}</span>
                    <span className="hidden font-mono text-xs text-ink-muted lg:block">
                      {countItems(id)} {copy.itemsUnit}
                    </span>
                    {cabinet.tourHref ? (
                      <a
                        href={cabinet.tourHref}
                        aria-label={`${tour}: ${item.name}`}
                        className="relative z-10 inline-flex items-center justify-end gap-1.5 pr-3 text-[13px] font-medium text-brand hover:underline"
                      >
                        <Box aria-hidden className="size-3.5" />
                        {tour}
                      </a>
                    ) : (
                      <a
                        href={whatsappUrl(fill(quoteTemplate, { cabinet: item.name }))}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${quote}: ${item.name}`}
                        className="relative z-10 inline-flex items-center justify-end gap-1.5 pr-3 text-[13px] font-medium text-ink-2 hover:text-brand"
                      >
                        <Calculator aria-hidden className="size-3.5" />
                        {quote}
                      </a>
                    )}
                    <div className="relative col-span-3 mx-3 aspect-[16/9] overflow-hidden bg-line lg:hidden">
                      <Image src={cabinet.image} alt="" fill placeholder="blur" sizes="100vw" className="object-cover" />
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="hidden border-l border-line lg:col-span-5 lg:block">
            <figure className="sticky top-[calc(var(--header-height)+1.5rem)] p-6">
              <div className="relative aspect-[4/3] overflow-hidden bg-line">
                {cabinetIds.map((id) => (
                  <Image
                    key={id}
                    src={cabinets[id].image}
                    alt={id === active ? items[id].name : ""}
                    fill
                    placeholder="blur"
                    sizes="38vw"
                    className={cn("object-cover transition-opacity duration-500", id === active ? "opacity-100" : "opacity-0")}
                  />
                ))}
              </div>
              <figcaption data-testid="index-caption" className="mt-3 flex justify-between font-mono text-[11px] text-ink-muted">
                <span>
                  {cabinets[active].code} · {copy.previewCaption}
                </span>
                <span>
                  {String(position).padStart(2, "0")} / {String(cabinetIds.length).padStart(2, "0")}
                </span>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 5: Страница** — `components/landing-page.tsx` целиком

```tsx
import { BlueprintIntro } from "@/components/intro/blueprint-intro";
import { JsonLd } from "@/components/json-ld";
import { Brands } from "@/components/sections/brands";
import { CabinetIndex } from "@/components/sections/cabinet-index";
import { ContactCta } from "@/components/sections/contact-cta";
import { Faq } from "@/components/sections/faq";
import { G8 } from "@/components/sections/g8";
import { HeroSheet } from "@/components/sections/hero-sheet";
import { Order70Tool } from "@/components/sections/order70-tool";
import { Process } from "@/components/sections/process";
import { Stages } from "@/components/sections/stages";
import { Stats } from "@/components/sections/stats";
import { Team } from "@/components/sections/team";
import { SheetRuler, sheetTag } from "@/components/sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";

/** The whole landing for one locale. */
export const LandingPage = ({ locale }: { locale: Locale }): React.JSX.Element => {
  const t = getDictionary(locale);
  const sheet = (n: number): string => sheetTag(t.stamp, n);

  return (
    <>
      <JsonLd locale={locale} t={t} />
      <BlueprintIntro t={t.intro} />
      <SheetRuler />
      <SiteHeader locale={locale} t={t.nav} />
      <main id="main">
        <HeroSheet locale={locale} t={t} />
        <Stages t={t.stages} />
        <Order70Tool t={t.order70} items={t.cabinets.items} sheet={sheet(2)} />
        <CabinetIndex
          copy={t.index}
          items={t.cabinets.items}
          tour={t.cabinets.tour}
          quote={t.cabinets.quote}
          quoteTemplate={t.contact.messageTemplate}
          sheet={sheet(3)}
        />
        <Stats locale={locale} t={t.stats} />
        <Brands t={t.brands} />
        <Process t={t.process} />
        <Team t={t} />
        <Faq t={t} />
        <G8 t={t.g8} />
        <ContactCta t={t.contact} address={t.footer.address} cabinetItems={t.cabinets.items} />
      </main>
      <SiteFooter locale={locale} t={t} />
      <WhatsappFab label={t.whatsappFab} />
    </>
  );
};
```

Run: `git rm -q components/sections/cabinets.tsx components/sections/showroom.tsx`

- [ ] **Step 6: Прогон**

Run: `npx tsc --noEmit && pnpm lint && rm -rf .next && pnpm test:e2e`
Expected: всё зелёное, index: 1 passed.

- [ ] **Step 7: Commit**

```bash
git add -A components content e2e/index.spec.ts
git commit -m "feat: classroom index with live preview replaces bento and showroom"
```

---
### Task 9: Процесс в языке чертежа

**Files:**
- Modify: `components/sections/process.tsx` (целиком), `content/types.ts`, `content/locales/{ru,kk,en}.ts`,
  `components/landing-page.tsx`
- Create: `e2e/process.spec.ts`

**Interfaces:**
- Consumes: `SheetHeading` (Task 4).
- Produces: `<Process t sheet />`; `Dictionary["process"].title: Lines`.

- [ ] **Step 1: Тест** — `e2e/process.spec.ts`

```ts
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
```

Run: `pnpm test:e2e e2e/process.spec.ts` → Expected: второй тест FAIL (метки «Лист 04» нет).

- [ ] **Step 2: Типы и словари** — в `content/types.ts` у `process` поменять `title: SplitTitle;` на `title: Lines;`.
  В словарях заменить `title` в блоке `process`:
  - `ru.ts`: `title: ["Из пустой комнаты —", "в мир возможностей."],`
  - `kk.ts`: `title: ["Бос бөлмеден —", "мүмкіндіктер әлеміне."],`
  - `en.ts`: `title: ["From an empty room", "to a world of possibilities."],`

- [ ] **Step 3: Компонент** — `components/sections/process.tsx` целиком

```tsx
"use client";

import { motion, useInView, useScroll, type Transition } from "motion/react";
import Image, { type StaticImageData } from "next/image";
import { useEffect, useRef, useState } from "react";
import { ArrowRight } from "lucide-react";

import boardLayer from "@/assets/illustrations/room-board.svg";
import decorLayer from "@/assets/illustrations/room-decor.svg";
import dimsLayer from "@/assets/illustrations/room-dims.svg";
import furniturePlanLayer from "@/assets/illustrations/room-furniture-plan.svg";
import furnitureLayer from "@/assets/illustrations/room-furniture.svg";
import screensLayer from "@/assets/illustrations/room-screens.svg";
import shellLayer from "@/assets/illustrations/room-shell.svg";
import { SheetHeading } from "@/components/sheet";
import type { Dictionary, ProcessStepCopy } from "@/content/types";
import { sitePaths } from "@/lib/site";
import { cn } from "@/lib/utils";

const ease: Transition["ease"] = [0.16, 1, 0.3, 1];

interface LayerProps {
  src: StaticImageData;
  visible: boolean;
  /** Pixels the layer drops in from when it appears. */
  rise?: number;
  delay?: number;
}

/** One transparent SVG layer of the isometric classroom, stacked on the others. */
const Layer = ({ src, visible, rise = 0, delay = 0 }: LayerProps): React.JSX.Element => (
  <motion.div
    className="absolute inset-0"
    initial={false}
    animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -rise }}
    transition={{ duration: 0.7, ease, delay: visible ? delay : 0 }}
  >
    <Image src={src} alt="" fill unoptimized className="object-contain" />
  </motion.div>
);

interface StepProps {
  index: number;
  step: ProcessStepCopy;
  active: boolean;
  onActive: (index: number) => void;
}

/** A step becomes active when it crosses the vertical middle of the viewport. */
const Step = ({ index, step, active, onActive }: StepProps): React.JSX.Element => {
  const ref = useRef<HTMLLIElement>(null);
  const inView = useInView(ref, { margin: "-50% 0px -50% 0px" });

  useEffect(() => {
    if (inView) onActive(index);
  }, [inView, index, onActive]);

  return (
    <li
      ref={ref}
      aria-current={active ? "step" : undefined}
      className="relative flex min-h-[46vh] flex-col justify-center py-10 pl-10 lg:min-h-[64vh] lg:pl-14"
    >
      <span
        aria-hidden
        className={cn(
          "absolute top-1/2 left-0 size-3 -translate-x-[calc(50%-0.5px)] -translate-y-1/2 border-2 transition-colors duration-500",
          active ? "border-brand bg-brand" : "border-line-strong bg-surface",
        )}
      />
      <p className={cn("label-mono transition-colors duration-500", active ? "text-brand" : "text-ink-faint")}>
        {String(index + 1).padStart(2, "0")} · {step.label}
      </p>
      <h3
        className={cn(
          "mt-3 text-[clamp(1.6rem,2.6vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] transition-colors duration-500",
          active ? "text-ink" : "text-ink/40",
        )}
      >
        {step.title}
      </h3>
      <p
        className={cn(
          "mt-4 max-w-[46ch] text-base leading-relaxed text-pretty transition-colors duration-500 lg:text-lg",
          active ? "text-ink-muted" : "text-ink-muted/60",
        )}
      >
        {step.text}
      </p>
    </li>
  );
};

interface ProcessProps {
  t: Dictionary["process"];
  sheet: string;
}

/**
 * "#process": an empty isometric room assembles as the four steps scroll past.
 * Survey shows dimensions, design shows the plan, delivery places furniture, installation turns it on.
 */
export const Process = ({ t, sheet }: ProcessProps): React.JSX.Element => {
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLOListElement>(null);
  const { scrollYProgress } = useScroll({ target: listRef, offset: ["start center", "end center"] });

  return (
    <section id="process" aria-labelledby="process-title" className="border-b border-line bg-surface py-20 lg:py-28">
      <div className="container-axis">
        <SheetHeading id="process-title" sheet={sheet} title={t.title} />

        <div className="mt-10 grid gap-x-16 lg:mt-14 lg:grid-cols-12">
          <div className="sticky top-(--header-height) z-10 -mx-4 bg-surface px-4 pt-3 pb-4 sm:-mx-6 sm:px-6 lg:top-[calc(var(--header-height)+2.5rem)] lg:col-span-6 lg:mx-0 lg:self-start lg:p-0">
            <figure className="bg-blueprint relative overflow-hidden border border-line bg-paper">
              <div role="img" aria-label={t.illustrationAlt} className="relative mx-auto aspect-[880/650] max-h-[34vh] lg:max-h-none">
                <Layer src={shellLayer} visible />
                <Layer src={dimsLayer} visible={active === 0} />
                <Layer src={furniturePlanLayer} visible={active === 1} />
                <Layer src={furnitureLayer} visible={active >= 2} rise={18} />
                <Layer src={decorLayer} visible={active >= 2} rise={12} delay={0.15} />
                <Layer src={boardLayer} visible={active >= 3} rise={10} />
                <Layer src={screensLayer} visible={active >= 3} delay={0.25} />
              </div>
              <figcaption className="grid grid-cols-4 border-t border-line bg-surface">
                {t.steps.map((step, index) => (
                  <span
                    key={step.label}
                    className={cn(
                      "label-mono relative truncate px-2 py-3.5 text-center transition-colors duration-500",
                      index === active ? "text-brand" : "text-ink-faint",
                    )}
                  >
                    {step.label}
                    {index === active && (
                      <motion.span
                        layoutId="process-step-underline"
                        className="absolute inset-x-0 bottom-0 h-0.5 bg-brand"
                        transition={{ duration: 0.5, ease }}
                      />
                    )}
                  </span>
                ))}
              </figcaption>
            </figure>
          </div>

          <div className="relative lg:col-span-6">
            <div aria-hidden className="absolute top-0 bottom-0 left-0 w-px bg-line" />
            <motion.div aria-hidden className="absolute top-0 bottom-0 left-0 w-px origin-top bg-brand" style={{ scaleY: scrollYProgress }} />
            <ol ref={listRef}>
              {t.steps.map((step, index) => (
                <Step key={step.label} index={index} step={step} active={index === active} onActive={setActive} />
              ))}
            </ol>
            <a href={sitePaths.services} className="group mt-4 ml-10 inline-flex items-center gap-2 font-medium text-brand lg:ml-14">
              {t.more}
              <ArrowRight aria-hidden className="size-4 transition-transform group-hover:translate-x-1" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 4: Страница** — в `components/landing-page.tsx` заменить `<Process t={t.process} />` на
  `<Process t={t.process} sheet={sheet(4)} />`.

- [ ] **Step 5: Прогон**

Run: `npx tsc --noEmit && pnpm lint && rm -rf .next && pnpm test:e2e`
Expected: всё зелёное, process: 2 passed.

- [ ] **Step 6: Commit**

```bash
git add -A components content e2e/process.spec.ts
git commit -m "feat: process section in the drawing-sheet language"
```

---

### Task 10: Производство, факты и бренды

**Files:**
- Modify: `content/types.ts`, `content/locales/{ru,kk,en}.ts`, `components/landing-page.tsx`
- Create: `components/sections/production.tsx`, `components/sections/facts-suppliers.tsx`, `e2e/facts.spec.ts`
- Delete: `components/sections/stats.tsx`, `components/sections/team.tsx`, `components/sections/brands.tsx`,
  `content/stats.ts`

**Interfaces:**
- Consumes: `totalItems` (Task 2), `plural` (`lib/i18n.ts`), `brands` (`content/brands.ts`).
- Produces: `Dictionary["facts"]`, `Dictionary["team"].title: Lines`, `Dictionary["brands"] { title: Lines; text; more }`;
  заголовок `#suppliers-title`.

- [ ] **Step 1: Падающий тест** — `e2e/facts.spec.ts`

```ts
import { expect, test } from "@playwright/test";

test("facts are real numbers and every brand has a logo", async ({ page }) => {
  await page.goto("/");
  const facts = page.locator('dl[aria-label="AXIS в фактах"]');
  await expect(facts).toContainText("398");
  await expect(facts).toContainText("позиций по Приказу № 70");
  await expect(facts).toContainText("брендов-производителей");
  await expect(page.locator("#suppliers-title")).toBeVisible();
  await expect(page.getByRole("img", { name: "Fabriano" })).toBeVisible();
  await expect(page.getByText("143")).toHaveCount(0);
});
```

Run: `pnpm test:e2e e2e/facts.spec.ts` → Expected: FAIL (фактов нет, «143» ещё на странице).

- [ ] **Step 2: Типы** — в `content/types.ts`: удалить блок `stats: {...};` и импорт `StatId`; у `team` поменять
  `title: SplitTitle;` на `title: Lines;`; блок `brands` заменить на

```ts
  brands: {
    title: Lines;
    text: string;
    /** Last cell of the logo grid. */
    more: string;
  };
  facts: {
    label: string;
    items: Record<"directions" | "positions" | "brands", PluralForms>;
    workshopValue: string;
    workshopLabel: string;
  };
```

- [ ] **Step 3: Словари** — удалить блок `stats`; заменить `team.title`, блок `brands` и добавить `facts`.

`ru.ts`:

```ts
    title: ["За каждым кабинетом —", "наша команда."],
```
(в блоке `team`), и

```ts
  brands: {
    title: ["Бренды", "в наших кабинетах."],
    text: "Техника, мебель и материалы для наших образовательных пространств — от брендов, представленных в решениях AXIS.",
    more: "Остальное подбираем по техническому заданию",
  },
  facts: {
    label: "AXIS в фактах",
    items: {
      directions: {
        one: "направление оснащения",
        few: "направления оснащения",
        many: "направлений оснащения",
        other: "направления оснащения",
      },
      positions: {
        one: "позиция по Приказу № 70",
        few: "позиции по Приказу № 70",
        many: "позиций по Приказу № 70",
        other: "позиции по Приказу № 70",
      },
      brands: {
        one: "бренд-производитель",
        few: "бренда-производителя",
        many: "брендов-производителей",
        other: "бренда-производителя",
      },
    },
    workshopValue: "Свой",
    workshopLabel: "мебельный цех",
  },
```

`kk.ts`:

```ts
    title: ["Әр кабинеттің артында —", "біздің команда."],
```
(в блоке `team`), и

```ts
  brands: {
    title: ["Біздің кабинеттердегі", "брендтер."],
    text: "Білім беру кеңістіктерімізге арналған техника, жиһаз және материалдар — AXIS шешімдеріндегі брендтерден.",
    more: "Қалғанын техникалық тапсырма бойынша іріктейміз",
  },
  facts: {
    label: "AXIS деректері",
    items: {
      directions: { one: "жабдықтау бағыты", other: "жабдықтау бағыты" },
      positions: { one: "позиция (№ 70 бұйрық)", other: "позиция (№ 70 бұйрық)" },
      brands: { one: "өндіруші бренд", other: "өндіруші бренд" },
    },
    workshopValue: "Өз",
    workshopLabel: "жиһаз цехымыз",
  },
```

`en.ts`:

```ts
    title: ["Behind every classroom", "is our team."],
```
(в блоке `team`), и

```ts
  brands: {
    title: ["Brands", "in our classrooms."],
    text: "Equipment, furniture and materials for our learning spaces, from the brands featured in AXIS solutions.",
    more: "Everything else is sourced to the specification",
  },
  facts: {
    label: "AXIS in facts",
    items: {
      directions: { one: "subject area", other: "subject areas" },
      positions: { one: "item under Order No. 70", other: "items under Order No. 70" },
      brands: { one: "manufacturer brand", other: "manufacturer brands" },
    },
    workshopValue: "Own",
    workshopLabel: "furniture workshop",
  },
```

- [ ] **Step 4: Производство** — `components/sections/production.tsx`

```tsx
import Image, { type StaticImageData } from "next/image";
import { ArrowRight } from "lucide-react";

import ranzenStore from "@/assets/images/team/ranzen-store.jpg";
import furnitureWorkshop from "@/assets/images/team/furniture-workshop.webp";
import { SheetHeading } from "@/components/sheet";
import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { whatsappUrl } from "@/lib/site";
import { cn } from "@/lib/utils";

interface PhotoProps {
  src: StaticImageData;
  alt: string;
  kicker: string;
  title: string;
  text: string;
  aspect: string;
  sizes: string;
}

/** A real photo mounted in a hairline frame, captioned like a site record. */
const Photo = ({ src, alt, kicker, title, text, aspect, sizes }: PhotoProps): React.JSX.Element => (
  <figure>
    <div className="border border-line bg-surface p-2.5">
      <div className={cn("relative overflow-hidden bg-line", aspect)}>
        <Image src={src} alt={alt} fill placeholder="blur" sizes={sizes} className="object-cover" />
      </div>
    </div>
    <figcaption className="mt-4 grid gap-1 sm:grid-cols-[9rem_1fr]">
      <p className="label-mono pt-1.5 text-brand">{kicker}</p>
      <div>
        <p className="text-xl font-semibold tracking-tight text-ink">{title}</p>
        <p className="mt-1 text-ink-muted">{text}</p>
      </div>
    </figcaption>
  </figure>
);

interface ProductionProps {
  t: Dictionary;
  sheet: string;
}

/** The furniture workshop and the Ranzen store: proof that AXIS makes and supplies, not just resells. */
export const Production = ({ t, sheet }: ProductionProps): React.JSX.Element => (
  <section aria-labelledby="production-title" className="border-b border-line py-20 lg:py-28">
    <div className="container-axis">
      <SheetHeading id="production-title" sheet={sheet} title={t.team.title} />
      <div className="mt-12 grid gap-10 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-7">
          <Photo
            src={furnitureWorkshop}
            alt={t.team.workshop.alt}
            kicker={t.team.workshop.kicker}
            title={t.team.workshop.title}
            text={t.team.workshop.text}
            aspect="aspect-[4/3]"
            sizes="(min-width: 1024px) 55vw, 100vw"
          />
        </div>
        <div className="lg:col-span-5 lg:mt-32">
          <Photo
            src={ranzenStore}
            alt={t.team.store.alt}
            kicker={t.team.store.kicker}
            title={t.team.store.title}
            text={t.team.store.text}
            aspect="aspect-[4/5]"
            sizes="(min-width: 1024px) 38vw, 100vw"
          />
        </div>
      </div>
      <div className="mt-14 flex flex-col gap-6 border-t border-ink pt-6 sm:flex-row sm:items-center sm:justify-between">
        <p>
          <span className="font-semibold text-ink">{t.team.teamTitle}.</span>{" "}
          <span className="text-ink-muted">{t.team.teamText}</span>
        </p>
        <a
          href={whatsappUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className={cn(buttonVariants({ variant: "outline" }), "self-start sm:self-auto")}
        >
          {t.nav.contactCta}
          <ArrowRight aria-hidden />
        </a>
      </div>
    </div>
  </section>
);
```

- [ ] **Step 5: Факты и бренды** — `components/sections/facts-suppliers.tsx`

```tsx
import Image from "next/image";

import { SheetHeading } from "@/components/sheet";
import { brands } from "@/content/brands";
import { cabinetIds } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { plural, type Locale } from "@/lib/i18n";
import { totalItems } from "@/lib/order70";

interface FactsSuppliersProps {
  locale: Locale;
  t: Dictionary;
  sheet: string;
}

/** Four facts that are all true (no invented numbers), then the brands as a spec-sheet grid. */
export const FactsSuppliers = ({ locale, t, sheet }: FactsSuppliersProps): React.JSX.Element => {
  const positions = totalItems();
  const facts = [
    { value: String(cabinetIds.length), label: plural(locale, cabinetIds.length, t.facts.items.directions) },
    { value: String(positions), label: plural(locale, positions, t.facts.items.positions) },
    { value: String(brands.length), label: plural(locale, brands.length, t.facts.items.brands) },
    { value: t.facts.workshopValue, label: t.facts.workshopLabel },
  ];

  return (
    <section aria-labelledby="suppliers-title" className="border-b border-line py-20 lg:py-28">
      <div className="container-axis">
        <dl aria-label={t.facts.label} className="grid grid-cols-2 gap-px border border-line bg-line lg:grid-cols-4">
          {facts.map((fact) => (
            <div key={fact.label} className="flex flex-col gap-3 bg-paper p-5 lg:p-7">
              <dt className="order-2 text-sm text-ink-muted">{fact.label}</dt>
              <dd className="order-1 text-[clamp(2.5rem,5vw,4rem)] leading-none font-semibold tracking-[-0.05em] text-ink tabular-nums">
                {fact.value}
              </dd>
            </div>
          ))}
        </dl>

        <SheetHeading id="suppliers-title" sheet={sheet} title={t.brands.title} lead={t.brands.text} className="mt-20 lg:mt-28" />

        <ul className="mt-10 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3 lg:grid-cols-6">
          {brands.map((brand) => (
            <li key={brand.name} className="group flex h-28 items-center justify-center bg-surface px-6">
              <Image
                src={brand.logo}
                alt={brand.name}
                sizes="160px"
                unoptimized={brand.logo.src.endsWith(".svg")}
                className="max-h-11 w-auto object-contain opacity-70 grayscale transition-[filter,opacity] duration-300 group-hover:opacity-100 group-hover:grayscale-0"
              />
            </li>
          ))}
          <li className="flex h-28 items-center bg-paper px-5 font-mono text-[11px] leading-relaxed text-ink-muted">
            {t.brands.more}
          </li>
        </ul>
      </div>
    </section>
  );
};
```

- [ ] **Step 6: Страница** — в `components/landing-page.tsx`: удалить импорты `Brands`, `Stats`, `Team`; добавить
  `import { FactsSuppliers } from "@/components/sections/facts-suppliers";` и
  `import { Production } from "@/components/sections/production";`; в `<main>` удалить `<Stats .../>`, `<Brands .../>`,
  `<Team .../>` и после `<Process t={t.process} sheet={sheet(4)} />` поставить

```tsx
        <Production t={t} sheet={sheet(5)} />
        <FactsSuppliers locale={locale} t={t} sheet={sheet(6)} />
```

Run: `git rm -q components/sections/stats.tsx components/sections/team.tsx components/sections/brands.tsx content/stats.ts`

- [ ] **Step 7: Прогон**

Run: `npx tsc --noEmit && pnpm lint && rm -rf .next && pnpm test:e2e`
Expected: всё зелёное, facts: 1 passed.

- [ ] **Step 8: Commit**

```bash
git add -A components content e2e/facts.spec.ts
git commit -m "feat: production photos, real facts and brand grid replace stats and marquee"
```

---

### Task 11: Примечания, G8, финальная заявка, футер-штамп

**Files:**
- Modify: `content/types.ts`, `content/locales/{ru,kk,en}.ts`, `components/sections/g8.tsx`, `components/site-footer.tsx`,
  `components/whatsapp-fab.tsx`, `components/landing-page.tsx`
- Create: `components/sections/notes.tsx`, `components/sections/closing.tsx`, `e2e/closing.spec.ts`
- Delete: `components/sections/faq.tsx`, `components/sections/contact-cta.tsx`, `components/section-title.tsx`

**Interfaces:**
- Consumes: `SheetHeading`, `fill`, `isCabinetId`.
- Produces: `Dictionary["faq"].label`, `g8.title: Lines`, `contact.title: Lines`; тип `SplitTitle` удалён.

- [ ] **Step 1: Падающие тесты** — `e2e/closing.spec.ts`

```ts
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
```

Run: `pnpm test:e2e e2e/closing.spec.ts` → Expected: FAIL («Лист 08» нет, `details[name='notes']` нет).

- [ ] **Step 2: Типы** — в `content/types.ts`: удалить `export interface SplitTitle {...}`; у `faq` добавить
  `label: string;`; у `g8` и `contact` поменять `title: SplitTitle;` на `title: Lines;`.

- [ ] **Step 3: Словари**
  - `ru.ts`: в `faq` добавить `label: "Примечания",`; `g8.title: ["Спортивное оборудование", "для школ."]`;
    `contact.title: ["Что создадим", "вместе?"]`.
  - `kk.ts`: в `faq` добавить `label: "Ескертпелер",`; `g8.title: ["Мектептерге арналған", "спорт жабдықтары."]`;
    `contact.title: ["Бірге не", "жасаймыз?"]`.
  - `en.ts`: в `faq` добавить `label: "Notes",`; `g8.title: ["Sports equipment", "for schools."]`;
    `contact.title: ["What shall we", "build together?"]`.

- [ ] **Step 4: Примечания** — `components/sections/notes.tsx`

```tsx
import { ArrowUpRight, Plus } from "lucide-react";

import { SheetHeading } from "@/components/sheet";
import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";

interface NotesProps {
  t: Dictionary;
  sheet: string;
}

/**
 * FAQ as numbered notes to the drawing (native <details>, one open at a time, works without JS),
 * plus the "Оснащение кабинета ..." directory that keeps the site's internal links.
 */
export const Notes = ({ t, sheet }: NotesProps): React.JSX.Element => (
  <section aria-labelledby="notes-title" className="border-b border-line bg-surface py-20 lg:py-28">
    <div className="container-axis">
      <SheetHeading id="notes-title" sheet={`${sheet} · ${t.faq.label}`} title={[t.faq.title]} />

      <ol className="mt-12 border-t border-ink">
        {t.faq.items.map((item, index) => (
          <li key={item.question} className="border-b border-line">
            <details name="notes" open={index === 0} className="group">
              <summary className="grid cursor-pointer list-none grid-cols-[3rem_minmax(0,1fr)_auto] items-start gap-4 py-6 [&::-webkit-details-marker]:hidden">
                <span className="pt-1 font-mono text-xs text-brand">{String(index + 1).padStart(2, "0")}</span>
                <span className="text-lg font-semibold text-ink transition-colors group-hover:text-brand">{item.question}</span>
                <span className="mt-0.5 grid size-8 place-items-center border border-line-strong transition-[transform,background-color,border-color,color] duration-300 group-open:rotate-45 group-open:border-ink group-open:bg-ink group-open:text-white">
                  <Plus aria-hidden className="size-4" />
                </span>
              </summary>
              <div className="pr-12 pb-7 pl-16">
                <p className="max-w-[70ch] leading-relaxed text-pretty text-ink-muted">{item.answer}</p>
                {item.link && (
                  <a href={item.link.href} className="mt-3 inline-flex items-center gap-1.5 font-medium text-brand hover:underline">
                    {item.link.label}
                    <ArrowUpRight aria-hidden className="size-4" />
                  </a>
                )}
              </div>
            </details>
          </li>
        ))}
      </ol>

      <nav aria-labelledby="directory-title" className="mt-16">
        <p id="directory-title" className="label-mono text-ink-faint">
          {t.faq.directoryTitle}
        </p>
        <p className="mt-2 max-w-[60ch] text-sm text-ink-muted">{t.faq.directoryText}</p>
        <ul className="mt-5 grid gap-px border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {cabinetIds.map((id) => (
            <li key={id}>
              <a
                href={cabinets[id].href}
                className="flex h-full items-center justify-between gap-3 bg-surface px-4 py-3.5 text-sm font-medium text-ink transition-colors hover:bg-ink hover:text-white"
              >
                <span>
                  <span className="mr-2 font-mono text-[11px] opacity-50">{cabinets[id].code}</span>
                  {t.cabinets.items[id].directoryLabel}
                </span>
                <ArrowUpRight aria-hidden className="size-4 shrink-0" />
              </a>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  </section>
);
```

- [ ] **Step 5: G8** — `components/sections/g8.tsx` целиком

```tsx
import { ArrowUpRight } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import type { Dictionary } from "@/content/types";
import { site } from "@/lib/site";

interface G8Props {
  t: Dictionary["g8"];
}

/** Cross-promo for G8, the sister site for school sports equipment. */
export const G8 = ({ t }: G8Props): React.JSX.Element => (
  <section aria-labelledby="g8-title" className="border-b border-line py-20 lg:py-24">
    <div className="container-axis">
      <div className="grid border border-line bg-surface lg:grid-cols-2">
        <div className="flex flex-col justify-center p-8 sm:p-10 lg:p-14">
          <h2 id="g8-title" className="text-[clamp(2rem,3.6vw,3rem)] leading-[0.98] font-semibold tracking-[-0.04em] text-ink">
            {t.title.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h2>
          <p className="mt-5 max-w-[52ch] leading-relaxed text-pretty text-ink-muted">{t.text}</p>
          <a
            href={site.g8Url}
            target="_blank"
            rel="noopener"
            className={buttonVariants({ variant: "outline", className: "mt-8 self-start" })}
          >
            {t.cta}
            <ArrowUpRight aria-hidden />
          </a>
        </div>
        <div aria-hidden className="bg-blueprint relative min-h-[18rem] border-t border-line bg-brand-soft p-8 sm:p-10 lg:border-t-0 lg:border-l">
          <p className="text-[clamp(3.5rem,7vw,5.5rem)] leading-none font-bold tracking-[-0.06em] text-brand">G8</p>
          {/* Pitch outline: a plain geometric mark, as on the live site. */}
          <svg
            viewBox="0 0 280 180"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="absolute right-8 bottom-8 left-8 h-auto text-brand/70 sm:left-auto sm:w-[78%]"
          >
            <rect x="1" y="1" width="278" height="178" />
            <line x1="140" y1="1" x2="140" y2="179" />
            <circle cx="140" cy="90" r="24" />
            <circle cx="140" cy="90" r="1.5" fill="currentColor" />
            <rect x="1" y="45" width="36" height="90" />
            <rect x="1" y="68" width="14" height="44" />
            <rect x="243" y="45" width="36" height="90" />
            <rect x="265" y="68" width="14" height="44" />
          </svg>
        </div>
      </div>
    </div>
  </section>
);
```

- [ ] **Step 6: Финальная заявка** — `components/sections/closing.tsx`

```tsx
"use client";

import { useId, useState } from "react";
import { ChevronDown, Mail, MapPin, MessageCircle, Phone } from "lucide-react";

import { buttonVariants } from "@/components/ui/button";
import { cabinetIds, isCabinetId, type CabinetId } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { site, whatsappUrl } from "@/lib/site";
import { fill } from "@/lib/template";
import { cn } from "@/lib/utils";

interface ClosingProps {
  t: Dictionary["contact"];
  address: string;
  items: Dictionary["cabinets"]["items"];
  sheet: string;
}

/** The one dark sheet: choose a classroom and open WhatsApp with the request already typed. */
export const Closing = ({ t, address, items, sheet }: ClosingProps): React.JSX.Element => {
  const [cabinet, setCabinet] = useState<CabinetId>("informatics");
  const selectId = useId();
  const message = fill(t.messageTemplate, { cabinet: items[cabinet].name });

  return (
    <section id="contact" aria-labelledby="contact-title" className="bg-ink py-20 text-white lg:py-28">
      <div className="container-axis grid gap-12 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-7">
          <p className="label-mono text-brand-light">
            {sheet} · {t.eyebrow}
          </p>
          <h2 id="contact-title" className="mt-6 text-[clamp(2.5rem,6vw,5.5rem)] leading-[0.92] font-semibold tracking-[-0.05em]">
            {t.title.map((line) => (
              <span key={line} className="block">
                {line}{" "}
              </span>
            ))}
          </h2>
          <p className="mt-6 max-w-[52ch] text-lg leading-relaxed text-pretty text-white/70">{t.text}</p>
          <ul className="mt-10 flex flex-col gap-3 text-white/85 sm:flex-row sm:flex-wrap sm:gap-x-8">
            <li>
              <a href={site.phoneHref} className="inline-flex items-center gap-2.5 font-medium tabular-nums hover:text-white">
                <Phone aria-hidden className="size-4 text-brand-light" />
                {site.phoneDisplay}
              </a>
            </li>
            <li>
              <a href={`mailto:${site.email}`} className="inline-flex items-center gap-2.5 font-medium hover:text-white">
                <Mail aria-hidden className="size-4 text-brand-light" />
                {site.email}
              </a>
            </li>
            <li className="inline-flex items-center gap-2.5 text-white/60">
              <MapPin aria-hidden className="size-4 text-brand-light" />
              {address}
            </li>
          </ul>
        </div>

        <div className="lg:col-span-5">
          <div className="border border-white/20 bg-white/[0.04] p-6 sm:p-8">
            <label htmlFor={selectId} className="label-mono text-white/60">
              {t.selectLabel}
            </label>
            <div className="relative mt-3">
              <select
                id={selectId}
                value={cabinet}
                onChange={(event) => {
                  const { value } = event.target;
                  if (isCabinetId(value)) setCabinet(value);
                }}
                className="h-14 w-full appearance-none border border-white/25 bg-ink pr-12 pl-4 text-base font-medium text-white outline-none hover:border-white/50 focus-visible:border-brand-light"
              >
                {cabinetIds.map((id) => (
                  <option key={id} value={id}>
                    {items[id].name}
                  </option>
                ))}
              </select>
              <ChevronDown aria-hidden className="pointer-events-none absolute top-1/2 right-4 size-5 -translate-y-1/2 text-white/60" />
            </div>
            <a
              href={whatsappUrl(message)}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(buttonVariants({ size: "lg" }), "mt-4 h-auto min-h-14 w-full justify-between py-3 text-left whitespace-normal")}
            >
              {t.submit}
              <MessageCircle aria-hidden />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};
```

- [ ] **Step 7: Футер-штамп** — `components/site-footer.tsx` целиком

```tsx
import { cacheLife } from "next/cache";
import Image from "next/image";
import Link from "next/link";

import { LanguageSwitcher } from "@/components/language-switcher";
import { cabinetIds, cabinets } from "@/content/cabinets";
import type { Dictionary } from "@/content/types";
import { localePath, type Locale } from "@/lib/i18n";
import { site, sitePaths, whatsappUrl } from "@/lib/site";

interface SiteFooterProps {
  locale: Locale;
  t: Dictionary;
}

const linkClass = "text-ink-2 transition-colors hover:text-brand";

/** Current year, cached so the footer stays part of the static prerender. */
const getCopyrightYear = async (): Promise<number> => {
  "use cache";
  cacheLife("days");
  return new Date().getFullYear();
};

/** Footer as the title block of the last sheet: about, solutions, navigation, contacts. */
export const SiteFooter = async ({ locale, t }: SiteFooterProps): Promise<React.JSX.Element> => {
  const year = await getCopyrightYear();
  const navigation = [
    { href: sitePaths.catalog, label: t.nav.catalog },
    { href: sitePaths.services, label: t.nav.services },
    { href: sitePaths.about, label: t.nav.about },
    { href: sitePaths.guide, label: t.footer.guide },
    { href: sitePaths.order70, label: t.footer.order70 },
  ];

  return (
    <footer className="py-10 lg:py-14">
      <div className="container-axis">
        <div className="grid gap-px border border-ink bg-line lg:grid-cols-12">
          <div className="bg-paper p-6 lg:col-span-4 lg:p-8">
            <Link href={localePath(locale)} aria-label="AXIS" className="inline-block">
              <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} className="h-7 w-auto" />
            </Link>
            <p className="mt-5 max-w-[34ch] leading-relaxed text-ink-muted">{t.footer.about}</p>
          </div>

          <nav aria-labelledby="footer-solutions" className="bg-paper p-6 lg:col-span-3 lg:p-8">
            <h2 id="footer-solutions" className="label-mono text-ink-faint">
              {t.footer.solutions}
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {cabinetIds.map((id) => (
                <li key={id}>
                  <a href={cabinets[id].href} className={linkClass}>
                    {t.cabinets.items[id].name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-navigation" className="bg-paper p-6 lg:col-span-2 lg:p-8">
            <h2 id="footer-navigation" className="label-mono text-ink-faint">
              {t.footer.navigation}
            </h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              {navigation.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="bg-paper p-6 lg:col-span-3 lg:p-8">
            <h2 className="label-mono text-ink-faint">{t.footer.contact}</h2>
            <ul className="mt-4 grid gap-2.5 text-sm">
              <li>
                <a href={site.phoneHref} className={`${linkClass} tabular-nums`}>
                  {site.phoneDisplay}
                </a>
              </li>
              <li>
                <a href={whatsappUrl()} target="_blank" rel="noopener noreferrer" className={linkClass}>
                  WhatsApp
                </a>
              </li>
              <li>
                <a href={`mailto:${site.email}`} className={linkClass}>
                  {site.email}
                </a>
              </li>
              <li className="text-ink-muted">{t.footer.address}</li>
            </ul>
          </div>

          <div className="flex flex-col gap-4 bg-paper px-6 py-4 font-mono text-[11px] text-ink-muted sm:flex-row sm:items-center sm:justify-between lg:col-span-12 lg:px-8">
            <p>
              © {year} AXIS. {t.footer.rights}
            </p>
            <LanguageSwitcher locale={locale} label={t.nav.languageLabel} />
            <p>{t.stamp.sheet} 08 / 08</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
```

- [ ] **Step 8: Плавающая кнопка** — в `components/whatsapp-fab.tsx` заменить `className` ссылки на

```tsx
    className="fixed right-4 bottom-4 z-30 grid size-14 place-items-center border border-line bg-surface shadow-[0_14px_34px_-14px_rgb(11_18_32/0.45)] transition-transform duration-300 hover:-translate-y-0.5 sm:right-6 sm:bottom-6"
```

- [ ] **Step 9: Страница** — `components/landing-page.tsx` целиком

```tsx
import { BlueprintIntro } from "@/components/intro/blueprint-intro";
import { JsonLd } from "@/components/json-ld";
import { CabinetIndex } from "@/components/sections/cabinet-index";
import { Closing } from "@/components/sections/closing";
import { FactsSuppliers } from "@/components/sections/facts-suppliers";
import { G8 } from "@/components/sections/g8";
import { HeroSheet } from "@/components/sections/hero-sheet";
import { Notes } from "@/components/sections/notes";
import { Order70Tool } from "@/components/sections/order70-tool";
import { Process } from "@/components/sections/process";
import { Production } from "@/components/sections/production";
import { Stages } from "@/components/sections/stages";
import { SheetRuler, sheetTag } from "@/components/sheet";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { WhatsappFab } from "@/components/whatsapp-fab";
import { getDictionary } from "@/content/dictionaries";
import type { Locale } from "@/lib/i18n";

/**
 * The whole landing for one locale, as a set of drawing sheets: 01 first screen, 02 Order No. 70,
 * 03 index, 04 process, 05 production, 06 brands, 07 notes, 08 closing.
 */
export const LandingPage = ({ locale }: { locale: Locale }): React.JSX.Element => {
  const t = getDictionary(locale);
  const sheet = (n: number): string => sheetTag(t.stamp, n);

  return (
    <>
      <JsonLd locale={locale} t={t} />
      <BlueprintIntro t={t.intro} />
      <SheetRuler />
      <SiteHeader locale={locale} t={t.nav} />
      <main id="main">
        <HeroSheet locale={locale} t={t} />
        <Stages t={t.stages} />
        <Order70Tool t={t.order70} items={t.cabinets.items} sheet={sheet(2)} />
        <CabinetIndex
          copy={t.index}
          items={t.cabinets.items}
          tour={t.cabinets.tour}
          quote={t.cabinets.quote}
          quoteTemplate={t.contact.messageTemplate}
          sheet={sheet(3)}
        />
        <Process t={t.process} sheet={sheet(4)} />
        <Production t={t} sheet={sheet(5)} />
        <FactsSuppliers locale={locale} t={t} sheet={sheet(6)} />
        <Notes t={t} sheet={sheet(7)} />
        <G8 t={t.g8} />
        <Closing t={t.contact} address={t.footer.address} items={t.cabinets.items} sheet={sheet(8)} />
      </main>
      <SiteFooter locale={locale} t={t} />
      <WhatsappFab label={t.whatsappFab} />
    </>
  );
};
```

Run: `git rm -q components/sections/faq.tsx components/sections/contact-cta.tsx components/section-title.tsx`

- [ ] **Step 10: Прогон**

Run: `npx tsc --noEmit && pnpm lint && rm -rf .next && pnpm test:e2e`
Expected: всё зелёное, closing: 2 passed.

- [ ] **Step 11: Commit**

```bash
git add -A components content e2e/closing.spec.ts
git commit -m "feat: notes, G8, dark closing sheet and title-block footer"
```

---

### Task 12: Зачистка, документация, финальная проверка

**Files:**
- Delete: `components/ui/marquee.tsx`, `components/ui/border-beam.tsx`, `components/ui/animated-grid-pattern.tsx`,
  `components/ui/blur-fade.tsx`, `components/ui/number-ticker.tsx`
- Modify: `app/globals.css`, `components/not-found-content.tsx`, `README.md`, `CLAUDE.md`,
  `docs/superpowers/specs/2026-10-22-blueprint-landing-design.md` (статус), wiki
- Create: `wiki/pages/entities/blueprint-intro.md`, `wiki/pages/entities/order70-tool.md`,
  `wiki/pages/sources/2026-10-22-screening-reference.md`

- [ ] **Step 1: Убедиться, что старое не используется**

Run: `grep -rnE "marquee|border-beam|BorderBeam|animated-grid-pattern|blur-fade|BlurFade|number-ticker|NumberTicker|rounded-card|rounded-control|SectionTitle|SplitTitle" app components content lib`
Expected: совпадения только в `components/ui/*` (удаляемые файлы) и `components/not-found-content.tsx` (`rounded-control`).

- [ ] **Step 2: Удалить компоненты и правила**

Run: `git rm -q components/ui/marquee.tsx components/ui/border-beam.tsx components/ui/animated-grid-pattern.tsx components/ui/blur-fade.tsx components/ui/number-ticker.tsx`

В `app/globals.css` удалить из `@theme inline` строки `--radius-card`, `--radius-control`, комментарий над ними,
`--animate-marquee`, `--animate-marquee-vertical`, `--animate-shine` и три `@keyframes` (`marquee`, `marquee-vertical`,
`shine`); в блоке `@media (prefers-reduced-motion: reduce)` удалить правило `.animate-marquee, ... { animation-play-state: paused; }`.

- [ ] **Step 3: 404 в новом стиле** — `components/not-found-content.tsx` целиком

```tsx
import Image from "next/image";
import Link from "next/link";

import { buttonVariants } from "@/components/ui/button";
import { getDictionary } from "@/content/dictionaries";
import { localeLabel, localePath, locales } from "@/lib/i18n";

/** 404 body as an empty drawing sheet: Russian copy first, links to every language version. */
export const NotFoundContent = (): React.JSX.Element => {
  const t = getDictionary("ru");

  return (
    <div className="bg-blueprint grid min-h-dvh place-items-center bg-paper px-4">
      <main className="w-full max-w-xl border border-ink bg-surface p-8 sm:p-10">
        <Image src="/brand/axis-logo.png" alt="AXIS" width={2108} height={640} className="h-7 w-auto" />
        <p className="mt-12 font-mono text-xs text-brand">404 · {t.stamp.sheet} 00</p>
        <h1 className="mt-3 text-4xl font-semibold tracking-[-0.04em] text-ink">{t.notFound.title}</h1>
        <p className="mt-3 text-lg leading-relaxed text-ink-muted">{t.notFound.text}</p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <Link href="/" className={buttonVariants({ size: "lg" })}>
            {t.notFound.home}
          </Link>
          {locales
            .filter((locale) => locale !== "ru")
            .map((locale) => (
              <Link key={locale} href={localePath(locale)} hrefLang={locale} className={buttonVariants({ variant: "outline", size: "lg" })}>
                {getDictionary(locale).notFound.home} ({localeLabel[locale]})
              </Link>
            ))}
        </div>
      </main>
    </div>
  );
};
```

- [ ] **Step 4: README и CLAUDE.md**
  - `README.md`: в «Stack» заменить Manrope на Geist/Geist Mono, убрать Magic UI; добавить раздел «Tests» с командами
    `pnpm test:py`, `pnpm test`, `pnpm test:e2e`; в «Where things live» добавить `components/intro/`, `content/order70.ts`,
    `scripts/`, `e2e/`; раздел «Order No. 70 data»: как обновить (`scripts/data/order70-raw.json` → `python3 scripts/extract_order70.py`);
    раздел «Intro»: `?intro=1` / `?intro=0`, показ раз за сессию; из «Before publishing» удалить пункт про заглушки 143/52.
  - `CLAUDE.md`: в «Правила проекта» заменить строку про токены на «острые углы, линии 1px, синий — единственный цвет»;
    добавить «Тайминги интро живут в двух местах: `components/intro/timeline.ts` и раздел Blueprint intro в `app/globals.css`»
    и «Перед сдачей: `pnpm test:py && pnpm test && npx tsc --noEmit && pnpm lint && pnpm test:e2e`».
  - Спецификация: строку «Статус» заменить на «Статус: реализовано (план `docs/superpowers/plans/2026-10-22-blueprint-landing.md`)».

- [ ] **Step 5: Вики**
  - `wiki/pages/concepts/design-system.md` — переписать под «Чертёж»: токены из Task 4, острые углы, Geist/Geist Mono,
    приёмы листа (линейка A–L, `SheetHeading`, `Stamp`, метки «Лист NN», сетка `gap-px`), список удалённых эффектов Magic UI
    и почему; движение: CSS-reveal первого экрана, интро, процесс.
  - `wiki/pages/entities/landing-sections.md` — таблица 8 листов + этапы + G8 в новом порядке с якорями `#order70`, `#index`,
    `#process`, `#contact`.
  - `wiki/pages/entities/blueprint-intro.md` (новая) — сценарий по секундам, правила показа, архитектура
    (inline-скрипт до отрисовки → CSS-таймлайн → клиентский перелёт), страховки, как тестировать (`?intro=1`, обход
    `navigator.webdriver` в e2e), где менять тайминги.
  - `wiki/pages/entities/order70-tool.md` (новая) — источник и дата данных, конвейер `raw.json → extract_order70.py →
    content/order70.ts`, формат, поведение инструмента, формат сообщения и обрезка до 1 800 символов.
  - `wiki/pages/sources/2026-10-22-screening-reference.md` (новая) — разбор референса screening-rho.vercel.app: видео-интро
    5 с с пропуском, персонаж «поселяется» в чёлке, ноутбук с роликом и рукописными выносками; что взяли (интро → интерфейс,
    пропуск, раз за сессию) и что нет (видео, персонаж, тёмная тема).
  - `wiki/pages/concepts/i18n.md` — Geist покрывает казахский (сабсет Onest удалён); заголовки как `Lines`; позиции
    Приказа № 70 не переводятся.
  - `wiki/pages/concepts/architecture.md` — интро-скрипт в `<head>` и `suppressHydrationWarning`; данные Приказа № 70;
    тестовая инфраструктура.
  - `wiki/pages/concepts/build-pitfalls.md` — добавить: `toHaveText` склеивает блоки без пробелов (между строками заголовка
    нужен `" "`); `navigator.webdriver` в Playwright отключает интро.
  - `wiki/pages/entities/process-illustration.md` — первый экран использует цветные слои + рисуемые размеры; интро — белые
    контуры (`room-outline.ts`, `room-furniture-outline.svg`).
  - `wiki/pages/analyses/redesign-decisions.md` — раздел «v2 (2026-10-22)»: почему v1 выглядела как AI, выбор A + C,
    интро по референсу, отказ от выдуманных цифр.
  - `wiki/index.md` — ссылки на три новые страницы; `wiki/log.md` — запись `## [2026-10-22] feat | Концепт «Чертёж»…`.

- [ ] **Step 6: Полная проверка**

Run: `pnpm test:py && pnpm test && npx tsc --noEmit && pnpm lint && rm -rf .next && pnpm test:e2e`
Expected: Python 8 OK, Vitest 7 passed, tsc и lint чисто, все e2e зелёные.

- [ ] **Step 7: Визуальная проверка** — `PORT=3100 pnpm start`, скриншоты 1440×900 и 390×844 для `/`, `/kk`, `/en`,
  полная страница и кадры интро `?intro=1`; проверить: нет горизонтального скролла, нет ошибок консоли, казахские буквы
  рисуются Geist, каждая секция с меткой «Лист NN», первый экран совпадает с концепт-макетом A.

- [ ] **Step 8: Commit**

```bash
git add -A
git commit -m "chore: remove unused effects, document the blueprint landing"
```
