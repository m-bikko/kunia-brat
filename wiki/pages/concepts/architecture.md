---
title: Архитектура
type: concept
tags: [architecture, nextjs, routing]
created: 2026-10-22
updated: 2026-10-22
sources: [app/, components/landing-page.tsx, next.config.ts]
---

# Архитектура

Один лендинг на трёх языках. Next.js 16.4 (App Router, Turbopack) с включёнными
`cacheComponents` и `partialPrefetching` — это дефолт шаблона, семантика отличается от Next 14/15
(см. [[build-pitfalls]]).

## Маршруты и root layouts

- `app/(ru)/` — свой root layout с `lang="ru"`, страница `/`. Русский без префикса, чтобы сохранить URL живого сайта.
- `app/(intl)/[locale]/` — второй root layout для `/kk` и `/en` (`generateStaticParams`). Неизвестный сегмент → `notFound()` в странице.
- `app/global-not-found.tsx` — 404 уровня роутинга; нужен, потому что root layout два (флаг `experimental.globalNotFound`).
- `/ru` → 308 на `/` (redirect в `next.config.ts`).

Оба layout рендерят общий `SiteDocument` (html/body, шрифты, MotionProvider, аналитика).
Обе страницы рендерят `LandingPage` с локалью. Подробно о текстах — [[i18n]].

## Статичность

Страницы помечены `ensureStatic = "navigation"`: весь маршрут обязан пререндериться.
Единственный «живой» кусок — год в футере через `"use cache"` + `cacheLife("days")`, поэтому в отчёте сборки
у страниц revalidate 1d.

## Ссылки на старый сайт

Внутренние страницы (кабинеты, каталог, услуги, 3D-туры, гиды) пока живут на старом приложении. На них ведут
обычные `<a>`, не `next/link`: иначе Next префетчит несуществующие RSC-маршруты и сыплет 404. Решение и
альтернативы — [[redesign-decisions]].

## Безопасность и аналитика

- CSP и security-заголовки задаются в `next.config.ts` только для production. CSP разрешает GA4 и Яндекс.Метрику
  (живой сайт их блокирует, см. [[2026-10-22-live-site-audit]]).
- `components/analytics.tsx` подключает GA4/Метрику только в production и только при валидных ID из env.
- JSON-LD: Organization + WebSite + FAQPage (`components/json-ld.tsx`).
