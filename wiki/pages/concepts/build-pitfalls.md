---
title: Подводные камни сборки
type: concept
tags: [nextjs, turbopack, tailwind, pitfalls]
created: 2026-10-22
updated: 2026-10-22
sources: [node_modules/next/dist/docs/01-app/02-guides/migrating-to-cache-components.md]
---

# Подводные камни сборки (Next 16.4 + cacheComponents)

Документация лежит локально в `node_modules/next/dist/docs/`; читать её до правок (так требует `AGENTS.md`).

- **`dynamicParams` запрещён** при `cacheComponents`: сборка падает. Неизвестные params отсекаются `notFound()` в странице.
- **`new Date()` / `Math.random()` в серверном компоненте** валят пререндер. Год в футере получаем через `"use cache"` + `cacheLife`.
- **Устаревший CSS после правки `@theme`.** `@tailwindcss/turbopack` может не пересобрать CSS при изменении темы в `globals.css`:
  в сборке остаются старые значения. Симптом этого проекта: шрифт стал Times, потому что стек ссылался на удалённую CSS-переменную.
  Лечение — `rm -rf .next && pnpm build`.
- **Порядок шрифтов next/font.** Переменная `--font-manrope` содержит `"Manrope", "Manrope Fallback"`, а фолбэк — локальный Arial без
  `unicode-range`. Любой шрифт, поставленный *после* неё, никогда не используется. Поэтому сабсет для казахских букв стоит первым
  (см. [[i18n]]).
- **Типы маршрутов.** После переноса файлов в route groups `tsc` ругается на устаревшие `.next/types`: `pnpm next typegen`.
- **`next/link` на страницы вне приложения** вызывает префетч и 404 в консоли. Для них — обычный `<a>` ([[architecture]]).
