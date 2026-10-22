# AXIS v2 «Мягкая» + intro rotation: implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: superpowers:executing-plans (owner chose inline execution and
> skipped plan review). Steps use checkbox (`- [ ]`) syntax.

**Goal:** A soft cartoon second version of the landing at `/v2`, `/kk/v2`, `/en/v2`, plus four new cartoon intros
rotated at random on both versions.

**Architecture:** One intro engine for both versions. A boot script picks a kind from the version's pool before
paint; every kind is a server-rendered CSS scene; one client controller runs skip, hand-off and failsafe. v2 is a
separate component tree (`components/v2/`) on the same root layouts, data and dictionaries, with logic shared
through hooks extracted from v1.

**Tech stack:** Next.js 16.4 (Cache Components, `ensureStatic`), Tailwind v4, motion 14, next/font (Nunito),
Vitest, Playwright (Chrome, port 3200).

**Spec:** `docs/superpowers/specs/2026-10-22-soft-landing-v2-design.md` (approved 2026-10-22).

## Global constraints

- Strict TypeScript, no `any`. No new dependencies.
- Every visible string in `content/locales/{ru,kk,en}.ts`; `Dictionary` enforces it. ru/kk dashes ` —`; en no dashes.
- No emojis; icons are lucide-react or own SVG.
- Animate only `transform`, `opacity`, `stroke-dashoffset`. Reduced motion: no intro, no transforms.
- v1 behaviour does not change except: intro rotation, scroll lock during the intro, `data-plan-target` →
  `data-intro-target`, en WhatsApp "To source" line.
- Intro contract (ms): action 0–3400, hand-off 3400–4300 (`flightMs` 900), CSS failsafe exit 4000–4400, boot timer 4400.
- v2 tokens: navy #1b2559, navy-muted #4b5584, brand #3059df, sky #dfe8ff, cloud #f4f7ff, surface #fff,
  sun #ffc845, coral #ff7f66, ok #15803d. Radii: card 28px, tile 20px, field 14px, pills. Sticker: 2.5px navy
  border + `0 6px 0` navy shadow (`0 3px 0` small). Focus: 3px brand, offset 3px; `sun` on navy.
- Suite: `pnpm test:py && pnpm test && npx tsc --noEmit && pnpm lint && pnpm test:e2e`.

## Review Focus

1. A random cartoon intro on v1 hands over to the line drawing: the cartoon room fades out at the target, no
   console errors, the drawing then plays. Test: `?intro=pop` on `/` in `e2e/intro-rotation.spec.ts`.
2. Storage blocked (Safari private mode, disabled cookies): `localStorage` throws, the intro still plays a pool
   kind. Test: init script that makes `localStorage` throw.
3. `/v2` first, then `/` in the same session: each version plays its intro once. Test in rotation spec.
4. Kazakh v2 at 360 px: long words in pills, chips and headings do not overflow. Test: v2 smoke at 360/390.
5. v2 tool by keyboard only: arrows switch tabs, Space ticks, Tab reaches «Отправить», focus visible. Test in v2 spec.

---

### Task 1: Intro engine (kinds, pools, boot, controller, scroll lock)

**Files:** create `lib/intro.ts`, `lib/intro.test.ts`, `components/intro/intro-stage.tsx`,
`components/intro/scenes/blueprint-scene.tsx`, `components/intro/intro-scene.tsx`, `app/styles/intro.css`;
modify `components/intro/intro-boot.tsx`, `components/intro/timeline.ts`, `components/landing-page.tsx`,
`components/sections/plan-drawing.tsx`, `app/globals.css`, `content/types.ts`, `content/locales/*.ts`,
`e2e/intro.spec.ts`, `e2e/hero.spec.ts`; delete `components/intro/blueprint-intro.tsx`.

**Produces:**
```ts
// lib/intro.ts
export const introKinds: readonly ["blueprint", "pop", "blocks", "pencil", "bell"];
export type IntroKind; export type SiteVersion = "v1" | "v2";
export const isIntroKind: (value: string | null) => value is IntroKind;
export const introPools: Record<SiteVersion, readonly IntroKind[]>; // T1: v1 ["blueprint"], v2 []; T7–T10 add kinds
export const introHandoff: Record<IntroKind, "flight" | "reveal">; // bell: reveal
export const introStorageKeys: Record<SiteVersion, { session: string; last: string }>;
export const versionOfPath: (pathname: string) => SiteVersion;     // self-contained, serialized into boot
export const pickIntro: (pool: readonly IntroKind[], last: string | null, random: number) => IntroKind; // self-contained
export const landsExactly: (version: SiteVersion, kind: IntroKind) => boolean; // v1+blueprint, v2+(pop|blocks|pencil)
// components/intro/timeline.ts
INTRO = { flightAt: 3400, flightMs: 900, revealEndMs: 3650, failsafeAt: 4000, failsafeMs: 4400 }
// components/intro/intro-stage.tsx
IntroStage({ version, t: Dictionary["intro"], children }) // children = scenes of the pool
// components/intro/intro-scene.tsx
IntroScene({ kind, version, caption }) // switch over kinds
// Dictionary
intro: { captions: Record<IntroKind, string>; skip: string }
```
Scene contract: root `<div class="intro-scene" data-kind="<kind>">`, a background `[data-intro-bg]`, the flying
element `[data-intro-subject]` (flight kinds), caption `<p>` from the dictionary.

- [ ] **Step 1: unit tests** `lib/intro.test.ts`
```ts
import { describe, expect, it } from "vitest";
import { introPools, isIntroKind, landsExactly, pickIntro, versionOfPath } from "@/lib/intro";

describe("intro rotation", () => {
  it("never repeats the last kind when the pool has a choice", () => {
    for (let r = 0; r < 1; r += 0.05) expect(pickIntro(["pop", "bell"], "pop", r)).toBe("bell");
  });
  it("covers the whole pool", () => {
    const seen = new Set([0, 0.3, 0.6, 0.99].map((r) => pickIntro(["pop", "blocks", "pencil", "bell"], null, r)));
    expect(seen.size).toBe(4);
  });
  it("repeats when the pool has one kind", () => {
    expect(pickIntro(["blueprint"], "blueprint", 0.5)).toBe("blueprint");
  });
  it("tells v2 paths from v1", () => {
    expect(["/v2", "/kk/v2", "/en/v2/"].map(versionOfPath)).toEqual(["v2", "v2", "v2"]);
    expect(["/", "/kk", "/en", "/v2x"].map(versionOfPath)).toEqual(["v1", "v1", "v1", "v1"]);
  });
  it("works when serialized into the boot script", () => {
    const pick = new Function(`return (${pickIntro.toString()})`)() as typeof pickIntro;
    expect(pick(["pop", "bell"], "bell", 0.1)).toBe("pop");
  });
  it("knows kinds and exact hand-offs", () => {
    expect(isIntroKind("pencil")).toBe(true);
    expect(isIntroKind("x")).toBe(false);
    expect(landsExactly("v1", "blueprint")).toBe(true);
    expect(landsExactly("v1", "pop")).toBe(false);
    expect(landsExactly("v2", "pop")).toBe(true);
    expect(introPools.v2).not.toContain("blueprint");
  });
});
```
- [ ] **Step 2:** `pnpm test` → FAIL (module missing).
- [ ] **Step 3: e2e changes** in `e2e/intro.spec.ts` (RED before Step 5): every `?intro=1` that expects the blueprint
  becomes `?intro=blueprint`; `[data-plan-target]` → `[data-intro-target]` (also `e2e/hero.spec.ts`); add:
```ts
test("the chosen kind is marked on <html> and only its scene shows", async ({ page }) => {
  await page.goto("/?intro=blueprint");
  await expect(page.locator("html")).toHaveAttribute("data-intro-kind", "blueprint");
  await expect(page.locator('.intro-scene[data-kind="blueprint"]')).toBeVisible();
});

test("the page does not scroll under the intro", async ({ page }) => {
  await page.goto("/?intro=blueprint");
  await page.waitForTimeout(500);
  await page.keyboard.press("PageDown");
  await page.keyboard.press("PageDown");
  expect(await page.evaluate(() => window.scrollY)).toBe(0);
});
```
- [ ] **Step 4:** build + `playwright test e2e/intro.spec.ts e2e/hero.spec.ts` → the new and renamed tests FAIL.
- [ ] **Step 5: implement.** `lib/intro.ts` as in Produces (`pickIntro` throws on an empty pool; both serialized
  functions reference nothing outside themselves). Boot script (inline, first in `<body>`):
```js
(function(){try{var d=document.documentElement,q=new URLSearchParams(location.search).get("intro"),
v=(VERSION_OF_PATH)(location.pathname),pool=POOLS[v],keys=KEYS[v];
var play=(q!==null&&q!=="0")||(q!=="0"&&!location.hash&&sessionStorage.getItem(keys.session)!=="seen"
&&!navigator.webdriver&&!matchMedia("(prefers-reduced-motion: reduce)").matches);
if(!play||!pool.length)return;var last=null;try{last=localStorage.getItem(keys.last)}catch(e){}
var kind=pool.indexOf(q)>=0?q:(PICK_INTRO)(pool,last,Math.random());
d.setAttribute("data-intro","play");d.setAttribute("data-intro-kind",kind);
window.__axisIntroStart=performance.now();window.__axisIntroTimer=setTimeout(function(){d.removeAttribute("data-intro")},FAILSAFE);
try{sessionStorage.setItem(keys.session,"seen");localStorage.setItem(keys.last,kind)}catch(e){}}catch(e){}})();
```
  `IntroStage` = the old `BlueprintIntro` effect generalized: reads `data-intro-kind`, returns early when JS arrives
  ≥ `failsafeAt`, clears the boot timer, sets `data-js`; at `flightAt` runs the hand-off of the kind: `reveal` →
  `end` at `revealEndMs`; `flight` → measure `[data-intro-subject]` of the scene and `[data-intro-target]`, animate
  `x/y/scale` (`flightMs`, ease `[0.65,0,0.35,1]`), fade `[data-intro-bg]`, and when `!landsExactly` also fade the
  subject out over the last 300 ms; narrow (< 1024) or target off-screen → fade the root out 500 ms. Own safety
  `end` at `flightAt + flightMs + 1000`. Skip on button, Escape, wheel, touchmove. `BlueprintScene` = the old
  markup (caption from `captions.blueprint`), the room wrapper gets `data-intro-subject`, `.intro-bg` gets
  `data-intro-bg`. Move all intro CSS from `globals.css` into `app/styles/intro.css` (imported from globals) and add:
```css
.intro-scene { display: none; position: absolute; inset: 0; }
html[data-intro-kind="blueprint"] .intro-scene[data-kind="blueprint"],
html[data-intro-kind="pop"] .intro-scene[data-kind="pop"],
html[data-intro-kind="blocks"] .intro-scene[data-kind="blocks"],
html[data-intro-kind="pencil"] .intro-scene[data-kind="pencil"],
html[data-intro-kind="bell"] .intro-scene[data-kind="bell"] { display: block; }
html[data-intro="play"] { overflow: hidden; scrollbar-gutter: stable; }
html[data-intro] [data-intro-target] { visibility: hidden; }
```
  Dictionary: `intro.caption` → `intro.captions` with all five kinds in ru/kk/en (texts below).
  `LandingPage` renders `<IntroStage version="v1">{introPools.v1.map(kind => <IntroScene …/>)}</IntroStage>`.

  Captions — ru: blueprint «Каждый кабинет начинается с оси», pop «Открываем коробку — а там готовый класс»,
  blocks «Класс собирается из простых деталей», pencil «Сначала рисуем, потом оснащаем», bell «Звонок! Кабинет
  готов к уроку». kk: blueprint (as is), pop «Қорапты ашамыз — ішінде дайын сынып», blocks «Сынып қарапайым
  бөлшектерден құралады», pencil «Алдымен саламыз, содан кейін жабдықтаймыз», bell «Қоңырау! Кабинет сабаққа
  дайын». en: blueprint (as is), pop «Open the box: the classroom is ready», blocks «A classroom built from simple
  pieces», pencil «We draw it first, then fit it out», bell «There goes the bell: the classroom is ready».
- [ ] **Step 6:** `pnpm test`, build, `playwright test e2e/intro.spec.ts e2e/hero.spec.ts` → PASS; full suite green.
- [ ] **Step 7:** commit `feat(intro): kind registry, random pick and a shared intro controller`.

### Task 2: v2 foundation (tokens, font, primitives, routes, shell)

**Files:** create `app/styles/v2.css`, `lib/fonts-v2.ts`, `lib/versions.ts`, `components/v2/ui/soft-button.tsx`,
`components/v2/ui/sticker.tsx`, `components/v2/landing-v2.tsx`, `components/v2/header-v2.tsx`,
`components/v2/footer-v2.tsx`, `app/(ru)/v2/page.tsx`, `app/(intl)/[locale]/v2/page.tsx`, `e2e/v2.spec.ts`;
modify `lib/metadata.ts` (v2 metadata), `components/language-switcher.tsx` (`version` prop),
`components/whatsapp-fab.tsx` (`variant`), `app/globals.css` (import v2.css).

**Produces:** `versionPath(locale, version)` (`/v2`, `/kk/v2`, `/en/v2`); `buildV2Metadata(locale)` = v1 metadata
with `robots: { index: false, follow: false }` and no alternates; `nunito` (`--font-nunito`); `softButton({ variant:
"primary" | "navy" | "outline" | "light", size: "md" | "lg" })`; `Sticker({ tone: "sun" | "coral" | "sky" | "white", children })`;
`LandingV2({ locale })`. Theme tokens in `@theme inline` of `v2.css`: `--color-navy`, `--color-navy-muted`,
`--color-sky`, `--color-cloud`, `--color-sun`, `--color-coral`, `--radius-card: 28px`, `--radius-tile: 20px`,
`--radius-field: 14px`, `--shadow-sticker: 0 6px 0 var(--color-navy)`, `--shadow-sticker-sm: 0 3px 0 var(--color-navy)`,
`--font-soft: var(--font-nunito), ui-rounded, system-ui, sans-serif`. Root of v2: `.v2` (font, cloud background,
navy text, focus ring rule); `body:has(.v2)` gets the cloud background.

- [ ] **Step 1: e2e** `e2e/v2.spec.ts`
```ts
import { expect, test } from "@playwright/test";

const pages = [
  { path: "/v2", lang: "ru" },
  { path: "/kk/v2", lang: "kk" },
  { path: "/en/v2", lang: "en" },
] as const;

for (const { path, lang } of pages) {
  test(`${path} renders the soft version in ${lang}, closed to indexing`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
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
  const covered = await page.evaluate(async () => {
    const family = getComputedStyle(document.querySelector("h1") as Element).fontFamily.split(",")[0]?.trim() ?? "";
    const faces = await document.fonts.load(`800 32px ${family}`, "әғқңөұүһі");
    return faces.some((face) => /4D9|4D8-|400-|0400/i.test(face.unicodeRange) || face.unicodeRange.includes("U+0460"));
  });
  expect(covered).toBe(true);
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
```
- [ ] **Step 2:** build + run → FAIL (404).
- [ ] **Step 3: implement.** Pages mirror v1 pages (`ensureStatic = "navigation"`, intl page `notFound()` for
  bad/default locale) with `export const metadata`/`generateMetadata` = `buildV2Metadata`. `LandingV2` renders
  `.v2` root (`nunito.variable`), `IntroStage version="v2"` with `introPools.v2` scenes, `HeaderV2`, `<main id="main">`
  (sections added by later tasks), `FooterV2`, `WhatsappFab variant="soft"`. Header: sticky `top-3` white pill
  (`rounded-full border-[2.5px] border-navy shadow-sticker-sm`), logo, anchors `#index #order70 #process`, `/about`
  `<a>`, language switcher capsule (`version="v2"`), CTA `#contact`. Mobile menu: `role="dialog" aria-modal` panel
  containing its own close button, focus moves into it, Tab cycles inside, Escape closes and restores focus.
  Footer: navy, `rounded-t-[40px]`, columns from `t.footer` (about, solutions = 8 cabinet links, navigation,
  contact), copyright year via `"use cache"` like v1.
- [ ] **Step 4:** add to `e2e/v2.spec.ts` and make pass:
```ts
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
```
- [ ] **Step 5:** suite green → commit `feat(v2): routes, soft tokens, Nunito and the page shell`.

### Task 3: Classroom art, first screen, stages

**Files:** create `components/v2/art/classroom.tsx`, `components/v2/art/deco.tsx`, `components/v2/hero-v2.tsx`,
`components/v2/stages-v2.tsx`; modify `components/v2/landing-v2.tsx`, `content/types.ts` + locales
(`v2.hero.illustrationAlt`), `e2e/v2.spec.ts`.

**Produces:** `ClassroomArt({ stage = 3, outline = false, className })` — inline SVG, `viewBox="0 0 640 440"`,
front view of a classroom, parts grouped as `<g data-part="…">`: `room` (back wall `sky`, floor, skirting, two
windows with a sun), `board` (wide brand-blue interactive panel with «AXIS» and two white squiggles), `teacher`
(teacher desk with laptop), `desks` (six student capsule desks in two rows with round-back chairs, each desk its
own `<g data-part="desk">`), `clock` (circle), `shelf` (shelf with sun/coral/brand books), `plant` (coral pot,
round leaves), `stars` (three small sun stars). `stage`: 0 room · 1 + teacher/desks/shelf · 2 + board/clock ·
3 + plant/stars/books. `outline`: every shape `fill="none"`, `pathLength={1}`, for the pencil drawing. Style:
`stroke="var(--color-navy)" strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round"`, flat fills, rounded
`rx`, no gradients, no people. `Deco` exports `Star`, `Squiggle`, `Dots` (aria-hidden).

- [ ] **Step 1: e2e** (append to `e2e/v2.spec.ts`)
```ts
test("the first screen shows the classroom as the intro target with three labels", async ({ page }) => {
  await page.goto("/v2");
  const art = page.locator("[data-intro-target]");
  await expect(art).toBeVisible();
  await expect(art).toHaveAttribute("role", "img");
  await expect(page.locator("[data-callout]")).toHaveCount(3);
  await expect(page.getByRole("link", { name: /Приказу № 70/ }).first()).toHaveAttribute("href", "#order70");
  await expect(page.locator("#stages li")).toHaveCount(4);
});
```
- [ ] **Step 2:** RED. **Step 3:** implement hero (two columns ≥ lg; left: kicker `Sticker`, `h1` lines from
  `t.hero.title` `font-black text-[clamp(2.5rem,6.4vw,5.75rem)] leading-[0.95] tracking-[-0.03em]` with
  `[overflow-wrap:anywhere]`, subtitle, `softButton` primary → `#order70`, outline → `#index` with «08»; right:
  `rounded-card border-[2.5px] border-navy bg-sky shadow-sticker` window holding
  `<ClassroomArt data-intro-target role="img" aria-label={t.v2.hero.illustrationAlt}>` and three `data-callout`
  stickers from `t.hero.callouts`; decorative stars). First-screen entrance uses `.reveal` (paused by the intro).
  Stages: `<section id="stages">` with `t.stages.label`, `<ol>` of 4 items: round numbered badges (brand, sun,
  coral, navy) over an SVG wavy dashed path (`aria-hidden`).
- [ ] **Step 4:** GREEN + screenshot check (desktop 1440, phone 390, kk). **Step 5:** commit
  `feat(v2): cartoon classroom, first screen and stages`.

### Task 4: Shared kit hook and the v2 Order No. 70 tool

**Files:** create `hooks/use-order70-kit.ts`, `components/v2/order70-v2.tsx`; modify
`components/sections/order70-tool.tsx` (uses the hook, markup unchanged), `content/types.ts` + locales
(`v2.order70`), `content/locales/en.ts` (`order70.message.need`), `lib/quote-message.test.ts`, `e2e/v2.spec.ts`.

**Produces:**
```ts
useOrder70Kit({ items, templates }) => {
  active, select(id), tabRefs, onTabKeyDown(event, index), baseId, panelId,
  groups, isChecked(key), toggle(key), reset(), total, have, need, message, href
}
itemKey(group, item): string
// Dictionary
v2.order70: { send: PluralForms /* "{n}" */; liveSummary: string /* "{have}", "{total}" */; shareLabel: string }
```
- [ ] **Step 1: tests.** `lib/quote-message.test.ts`:
```ts
it("English request reads correctly with one item left", () => {
  const message = buildQuoteMessage({ cabinet: "Informatics", total: 2, haveItems: ["Desk"], templates: en.order70.message });
  expect(message).not.toMatch(/\b1 items\b/);
});
```
  `e2e/v2.spec.ts`:
```ts
test("v2 tool: tick, count, send N items, keyboard only", async ({ page }) => {
  await page.goto("/v2#order70");
  const tool = page.locator("#order70");
  const tabs = tool.getByRole("tab");
  await tabs.first().focus();
  await page.keyboard.press("ArrowRight");
  await expect(tabs.nth(1)).toHaveAttribute("aria-selected", "true");
  await page.keyboard.press("ArrowLeft");
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
```
- [ ] **Step 2:** RED. **Step 3:** extract the hook from `order70-tool.tsx` (v1 e2e must stay green); en
  `need: "Items to source: {need}."`; build the v2 tool: heading `t.order70.title` + lead; card
  `rounded-card border-[2.5px] border-navy bg-surface shadow-sticker`; tablist of pill chips (code + name; selected
  navy), panel lists by category with round custom checkbox (native input overlaid, `peer`, tick pops with spring
  scale), "есть" badge; side panel: three bubbles (total navy, have ok, need brand) with `data-testid`s as v1,
  share bar (`have/total`, `aria-hidden`), visually hidden live sentence `fill(liveSummary)`, send link label
  `fill(plural(locale, need, send), { n: need })` (generic `t.order70.send` when `need === 0`), reset button,
  hint, source note. Sticky panel on phones as v1; WhatsApp FAB already hides over `#order70`.
- [ ] **Step 4:** GREEN; v1 `e2e/order70.spec.ts` green. **Step 5:** commit `feat(v2): Order No. 70 tool on a shared kit hook`.

### Task 5: Cabinet icons, cabinet cards, process

**Files:** create `components/v2/art/cabinet-icons.tsx`, `components/v2/cabinets-v2.tsx`,
`components/v2/process-v2.tsx`; modify landing, types + locales (`v2.index.items: PluralForms`,
`v2.process.states: [string, string, string, string]`), `e2e/v2.spec.ts`.

**Produces:** `CabinetIcon({ id, className })` — `viewBox="0 0 120 120"`, a soft blob background in the
cabinet's colour plus one object: informatics monitor + keyboard, art easel + palette, sewing machine, pottery
wheel + vase, workshop workbench + hammer, kazakh dombra + book «Әә», russian open book «Аа», english speech
bubble «Hello». Same stroke rules as the classroom.

- [ ] **Step 1: e2e**
```ts
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
```
- [ ] **Step 2:** RED. **Step 3:** cards grid (2 cols < md, 4 cols ≥ lg): sticker card with icon, code chip, name
  (`t.cabinets.items[id].name`), `fill(plural(locale, countItems(id), t.v2.index.items), { n })`, links to
  `cabinets[id].href` and `tourHref` (`t.cabinets.tour`); on hover/focus-within the icon crossfades to the concept
  render (`next/image`, caption `t.index.previewCaption`). Process: `t.process.title`, steps as cards
  (`data-step`, number badge, label, title, text); illustration `ClassroomArt stage={n}` per step: desktop one
  sticky art switching with the step in view (IntersectionObserver, `data-stage`), phones one small art per card.
- [ ] **Step 4:** GREEN + screenshots. **Step 5:** commit `feat(v2): cabinet cards with own icons and the process`.

### Task 6: Production, facts and brands, notes, G8, closing

**Files:** create `components/v2/production-v2.tsx`, `facts-v2.tsx`, `notes-v2.tsx`, `g8-v2.tsx`,
`closing-v2.tsx`; modify landing, types + locales (`v2.production.sticker`), `e2e/v2.spec.ts`.

- [ ] **Step 1: e2e**
```ts
test("closing card sends the chosen classroom to WhatsApp", async ({ page }) => {
  await page.goto("/v2#contact");
  await page.locator("#contact select").selectOption("pottery");
  const href = await page.locator("#contact").getByRole("link", { name: /WhatsApp/ }).getAttribute("href");
  expect(new URL(href ?? "").searchParams.get("text")).toContain("Гончарная");
});

test("notes open one at a time and brands show every logo", async ({ page }) => {
  await page.goto("/v2");
  const notes = page.locator("#notes details");
  await notes.nth(0).locator("summary").click();
  await notes.nth(1).locator("summary").click();
  await expect(notes.nth(0)).not.toHaveAttribute("open", "");
  await expect(page.locator("#brands img")).toHaveCount(11);
});
```
- [ ] **Step 2:** RED. **Step 3:** production — two rounded photo frames (`t.team.workshop`, `t.team.store`)
  with stickers (`t.v2.production.sticker` on the workshop); facts — four bubbles (`plural` facts like v1:
  8, 398, 11, own workshop) in brand/sun/coral/sky; brands (`id="brands"`) — rounded white tiles, ARG `invert`,
  last tile `t.brands.more`; notes (`id="notes"`) — `details name="notes-v2"` rounded items with a rotating plus,
  directory of cabinet links (`directoryLabel`); G8 — sticker card `t.g8`; closing (`id="contact"`) — navy
  `rounded-card` mega card, select (rounded field) → `fill(t.contact.messageTemplate)` WhatsApp link, phone, email,
  address, deco stars and pencils.
- [ ] **Step 4:** GREEN + screenshots. **Step 5:** commit `feat(v2): production, facts, brands, notes, G8 and closing`.

### Tasks 7–10: Cartoon intro scenes

One task per kind, same shape. **Files:** `components/intro/scenes/<kind>-scene.tsx`, art in
`components/v2/art/` (box, pencil, bell), CSS block in `app/styles/intro.css` («Intro: <kind>»), add the kind to
both pools in `lib/intro.ts`, `IntroScene` switch, `e2e/intro-rotation.spec.ts`.

Shared CSS easings (Task 7 adds them):
```css
:root {
  --ease-spring: linear(0, 0.009, 0.035 2.1%, 0.141, 0.281 6.7%, 0.723 12.9%, 0.938 16.7%, 1.017, 1.077, 1.121,
    1.149 24.3%, 1.159, 1.163, 1.161, 1.154 29.9%, 1.129 32.8%, 1.051 39.6%, 1.017 43.1%, 0.991, 0.977 51%,
    0.974 53.8%, 0.975 57.1%, 0.997 69.8%, 1.003 76.9%, 1.004 83.8%, 1);
  --ease-bounce: linear(0, 0.004, 0.016, 0.035, 0.063, 0.098, 0.141 13.6%, 0.25, 0.391, 0.563, 0.765, 1,
    0.891 40.9%, 0.848, 0.813, 0.785, 0.766, 0.754, 0.75, 0.754, 0.766, 0.785, 0.813, 0.848, 0.891 68.2%, 1 72.7%,
    0.973, 0.953, 0.941, 0.938, 0.941, 0.953, 0.973, 1, 0.988, 0.984, 0.988, 1);
}
```
Scenes animate `[data-part]` groups of `ClassroomArt` by CSS selectors scoped to the scene, so the art stays one
component. Backgrounds `navy`; captions `font-soft`, white, bottom 16%.

- **T7 `pop`:** box (`sky` body, `brand` lid with logo) pops 0.1 s (spring); lid rotates open 0.7 s; floor/room
  scale-y from the bottom 1.0–1.3 s (spring); desks drop with `--ease-bounce` staggered 0.08 s from 1.7 s; board
  slides up 2.1 s; plant rocks once 2.3 s; box sinks away 2.4 s.
- **T8 `blocks`:** every part of `ClassroomArt` starts above the screen, rotated (deterministic −25°…25°), and
  falls with `--ease-bounce` 0.1–1.2 s in a scattered order; 1.4–2.4 s parts travel to their places
  (translate back to 0 with spring); 2.6 s whole room «pop» scale 1.06 → 1.
- **T9 `pencil`:** pencil character (`sun` body, `coral` eraser, face with blinking eyes) flies in 0.1 s;
  `ClassroomArt outline` strokes draw via `stroke-dashoffset` 0.4–2.0 s while the pencil moves along waypoints
  (transform keyframes); colour `ClassroomArt` parts pop in (scale from 0.6 + opacity, spring) 2.0–2.6 s; pencil
  bows and exits 2.7 s. The colour art is the subject.
- **T10 `bell`:** bell (`sun`, navy outline) appears 0.1 s, swings 0.4–1.4 s; three ring waves (`sky`/`brand`
  outlines) scale out 0.6–2.2 s; logo + caption 2.2 s; the navy backdrop is a huge circle around the bell that
  scales to 0 from 2.8 to 3.6 s, taking the bell with it (reveal; `introHandoff.bell = "reveal"`).

- [ ] **Step 1 (each):** add to `e2e/intro-rotation.spec.ts`:
```ts
for (const path of ["/", "/v2"]) {
  test(`${KIND} plays on ${path} and hands over by 4.6 s`, async ({ page }) => {
    const errors: string[] = [];
    page.on("console", (message) => { if (message.type() === "error") errors.push(message.text()); });
    await page.goto(`${path}?intro=${KIND}`);
    await expect(page.locator("html")).toHaveAttribute("data-intro-kind", KIND);
    await expect(page.locator(`.intro-scene[data-kind="${KIND}"]`)).toBeVisible();
    await expect(page.locator("html")).not.toHaveAttribute("data-intro", { timeout: 4600 });
    await expect(page.locator("[data-intro-target]").first()).toBeVisible();
    expect(errors).toEqual([]);
  });
}
```
- [ ] **Step 2:** RED (kind not in pool → random/none). **Step 3:** scene + art + CSS + pool. Frame screenshots
  at 0.5/1.2/2.2/3.0/3.6/4.0 s on v2 and v1, check the hand-off geometry on v2 (subject rect = target rect at
  `flightAt + flightMs`). **Step 4:** GREEN. **Step 5:** commit `feat(intro): <kind> intro`.

### Task 11: Rotation guarantees, accessibility, budget, docs

**Files:** `e2e/intro-rotation.spec.ts`, `e2e/a11y.spec.ts`, `README.md`, `CLAUDE.md`, wiki
(`pages/entities/soft-landing-v2.md`, `pages/entities/intro-rotation.md`, `blueprint-intro.md`, `index.md`, `log.md`).

- [ ] **Step 1: tests**
```ts
test("v2 never plays the blueprint and two visits in a row differ", async ({ browser }) => {
  const context = await browser.newContext();
  const page = await context.newPage();
  const kinds: string[] = [];
  for (let i = 0; i < 8; i += 1) {
    await page.goto("/v2?intro=1");
    kinds.push((await page.locator("html").getAttribute("data-intro-kind")) ?? "none");
  }
  expect(kinds).not.toContain("blueprint");
  expect(kinds).not.toContain("none");
  kinds.slice(1).forEach((kind, index) => expect(kind).not.toBe(kinds[index]));
  await context.close();
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
    Object.defineProperty(window, "localStorage", { get: () => { throw new Error("blocked"); } });
  });
  await page.goto("/v2?intro=1");
  await expect(page.locator("html")).toHaveAttribute("data-intro", "play");
});

for (const path of ["/", "/v2"]) {
  test(`intro markup on ${path} stays under 80 KB`, async ({ page }) => {
    await page.goto(path);
    expect(await page.evaluate(() => document.querySelector(".intro")?.outerHTML.length ?? 0)).toBeLessThan(80_000);
  });
}
```
  `e2e/a11y.spec.ts`: contrast loop over `["/", "/en", "/v2", "/kk/v2", "/en/v2"]`; focus test also on `/v2`
  (v2 buttons carry `group/button` too).
- [ ] **Step 2:** run, fix what fails (RED→GREEN per failure).
- [ ] **Step 3:** docs: README (v2 routes, intro keys, rotation), CLAUDE.md (v2 rules: tokens, components/v2,
  intro scenes contract), wiki pages + index + log.
- [ ] **Step 4:** full suite, visual pass on all six pages × desktop/phone, all five intros on both versions.
- [ ] **Step 5:** commit `test(v2): rotation guarantees, AA on v2, intro budget; docs`.

### Finish

Final whole-branch review (fresh reviewer, most capable model) with this plan's Review Focus; one fix pass;
fast-forward `main`, push, verify the Vercel deployment and `/v2` in production.
