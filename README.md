# AXIS landing (axisgroup.kz)

Landing page for AXIS (AxisGroup), turnkey fit-out of school classrooms in Kazakhstan, in two design
versions that share content, data and logic:

- **v1 «Чертёж»** at `/`: the page is a set of drawing sheets.
- **v2 «Мягкая»** at `/v2`: the same story in a soft cartoon style (rounded stickers, own SVG art).

Both have a working kit tool based on Order No. 70 and a random intro on the first visit of a session.
Content and assets come from the live https://axisgroup.kz/. Production: https://kuni-brat.vercel.app

## Stack

- Next.js 16.4 (App Router, Turbopack, Cache Components, Partial Prefetching)
- TypeScript (strict), Tailwind CSS v4, shadcn/ui button primitive
- motion (`motion/react`) for the intro flight, process and menus
- lucide-react icons, Geist + Geist Mono (v1) and Nunito (v2) via `next/font` (full Kazakh alphabet)

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm lint
```

Analytics (GA4, Yandex Metrika) run only in production builds. Copy `.env.example` to `.env.local`.

## Tests

```bash
pnpm test:py        # Order No. 70 parser (Python unittest)
pnpm test           # Vitest: data and WhatsApp message logic
pnpm test:e2e       # builds, then Playwright (Chrome) against :3200
```

## Routes

| URL | Content |
|---|---|
| `/` | v1, Russian (default locale, keeps the live site's URL) |
| `/kk` | v1, Kazakh |
| `/en` | v1, English |
| `/v2`, `/kk/v2`, `/en/v2` | v2 in the three languages, `noindex`, not in the sitemap |
| `/ru` | 308 redirect to `/` |

Inner pages (`/kabinet-informatiki`, `/catalog`, `/services`, the 3D tours…) are **not part of this
project yet**. Links to them are plain `<a>` tags so they keep working while those pages live on the
current site. They return 404 when this app runs alone.

## Where things live

```
app/(ru)/                 root layout + pages for "/" and "/v2"
app/(intl)/[locale]/      root layout + pages for "/kk", "/en", "/kk/v2", "/en/v2"
app/global-not-found.tsx  routing-level 404 (needed for two root layouts)
app/styles/               intro.css (every intro scene) and v2.css (v2 tokens)
components/sections/      v1: one file per sheet of the landing
components/v2/            v2: page, sections, ui (softButton, Sticker), art (classroom, icons)
components/intro/         intro engine: boot script, controller (IntroStage), scenes/
components/sheet.tsx      v1 drawing-sheet primitives: ruler, heading, title block
hooks/                    useOrder70Kit: the kit tool's state, shared by v1 and v2
lib/intro.ts              intro kinds, pools per version, random pick
content/locales/          ru / kk / en copy, typed by content/types.ts
content/cabinets.ts       the eight classrooms: codes, images, links
content/order70.ts        Order No. 70 lists (generated, see below)
scripts/                  Order No. 70 parser and the furniture line-art generator
e2e/                      Playwright tests
assets/                   images, logos, SVG layers (static imports)
public/                   og.jpg, logo, WhatsApp icon
wiki/                     project knowledge base (Obsidian)
```

## Editing content

- Text: edit `content/locales/ru.ts`, then the same keys in `kk.ts` and `en.ts`.
  `Dictionary` in `content/types.ts` makes a missing translation a type error.
- Big titles are arrays of lines (`["Восемь кабинетов.", "Один подрядчик."]`): the design breaks them there.
- In Russian and Kazakh, write ` —` before a dash so it never starts a line. English copy has no dashes.
- Images: replace files in `assets/images/...` keeping the names, or update the imports.

## Order No. 70 data

`scripts/data/order70-raw.json` is the table scraped from the cabinet pages of the live site (2026-10-22).
After refreshing it, run `python3 scripts/extract_order70.py` to regenerate `content/order70.ts`,
then `pnpm test:py && pnpm test`. Item names are shown as written in the order, in every language.

## Intro

Five intros: `blueprint` («Синька»), `pop` («Поп-ап класс»), `blocks` («Фигуры-кубики»), `pencil`
(«Карандаш рисует»), `bell` («Школьный звонок»). v1 rotates all five, v2 the four cartoon ones
(`lib/intro.ts`). A random one plays once per browser session per version, never the same twice in a row,
never with reduced motion, for automated browsers or on URLs with an `#anchor`.

- `?intro=pop` (any kind) plays that one, `?intro=1` a random one, `?intro=0` none.
- Timings live in two places that must match: `components/intro/timeline.ts` and `app/styles/intro.css`.

## Before publishing

- [ ] `content/locales/kk.ts`: Kazakh translation needs a native-speaker proofread.
- [ ] Decide how inner pages are served (migrate them or proxy to the current site).

More detail: `wiki/index.md`.
