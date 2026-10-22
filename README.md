# AXIS landing (axisgroup.kz)

Landing page for AXIS (AxisGroup), turnkey fit-out of school classrooms in Kazakhstan.
Concept «Чертёж» (the page is a set of drawing sheets), a blueprint intro on the first visit
and a working kit tool based on Order No. 70. Content and assets come from the live https://axisgroup.kz/.

## Stack

- Next.js 16.4 (App Router, Turbopack, Cache Components, Partial Prefetching)
- TypeScript (strict), Tailwind CSS v4, shadcn/ui button primitive
- motion (`motion/react`) for the intro flight, process and menus
- lucide-react icons, Geist + Geist Mono via `next/font` (full Kazakh alphabet)

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
| `/` | Russian (default locale, keeps the live site's URL) |
| `/kk` | Kazakh |
| `/en` | English |
| `/ru` | 308 redirect to `/` |

Inner pages (`/kabinet-informatiki`, `/catalog`, `/services`, the 3D tours…) are **not part of this
project yet**. Links to them are plain `<a>` tags so they keep working while those pages live on the
current site. They return 404 when this app runs alone.

## Where things live

```
app/(ru)/                 root layout + page for "/"
app/(intl)/[locale]/      root layout + page for "/kk" and "/en"
app/global-not-found.tsx  routing-level 404 (needed for two root layouts)
components/sections/      one file per sheet of the landing
components/intro/         blueprint intro: boot script, timeline, line-art, component
components/sheet.tsx      drawing-sheet primitives: ruler, heading, title block
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

Plays once per browser session, never with reduced motion, for automated browsers or on URLs with an
`#anchor`. Force it with `?intro=1`, disable with `?intro=0`. Timings live in two places that must match:
`components/intro/timeline.ts` and the «Blueprint intro» section of `app/globals.css`.

## Before publishing

- [ ] `content/locales/kk.ts`: Kazakh translation needs a native-speaker proofread.
- [ ] Decide how inner pages are served (migrate them or proxy to the current site).

More detail: `wiki/index.md`.
