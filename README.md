# AXIS landing (axisgroup.kz)

New landing page for AXIS (AxisGroup), turnkey fit-out of school classrooms in Kazakhstan.
Rebuilt from scratch on 2026-10-22 from the content and assets of the live https://axisgroup.kz/.

## Stack

- Next.js 16.4 (App Router, Turbopack, Cache Components, Partial Prefetching)
- TypeScript (strict), Tailwind CSS v4, shadcn/ui registry
- motion (`motion/react`) for animation, Magic UI components (owned copies in `components/ui`)
- lucide-react icons, Manrope via `next/font`

## Getting started

```bash
pnpm install
pnpm dev            # http://localhost:3000
pnpm build && pnpm start
pnpm lint
```

Analytics (GA4, Yandex Metrika) run only in production builds. Copy `.env.example` to `.env.local`.

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
app/(ru)/            root layout + page for "/"
app/(intl)/[locale]/ root layout + page for "/kk" and "/en"
app/global-not-found.tsx  routing-level 404 (needed for two root layouts)
components/sections/ one file per landing section
components/ui/       Magic UI + shadcn primitives (adapted, see comments)
content/locales/     ru / kk / en copy, typed by content/types.ts
content/cabinets.ts  the eight classroom directions, images and links
content/stats.ts     trust-strip numbers (see placeholders below)
assets/              images, logos, SVG layers, Kazakh glyph font (static imports)
public/              og.jpg, logo, WhatsApp icon
wiki/                project knowledge base (Obsidian)
```

## Editing content

- Text: edit `content/locales/ru.ts`, then the same keys in `kk.ts` and `en.ts`.
  `Dictionary` in `content/types.ts` makes a missing translation a type error.
- In Russian and Kazakh, write ` —` before a dash so it never starts a line.
- Images: replace files in `assets/images/...` keeping the names, or update the imports.

## Before publishing

- [ ] `content/stats.ts`: **143** classrooms and **52** schools are placeholders. Replace with real numbers.
- [ ] `content/locales/kk.ts`: Kazakh translation needs a native-speaker proofread.
- [ ] Decide how inner pages are served (migrate them or proxy to the current site).

More detail: `wiki/index.md`.
