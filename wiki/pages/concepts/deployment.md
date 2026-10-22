---
title: Деплой
type: concept
tags: [deploy, vercel, github]
created: 2026-10-23
updated: 2026-10-23
sources: [package.json, pnpm-lock.yaml, .env.example]
---

# Деплой

- Код: GitHub `m-bikko/kunia-brat` (публичный). Ветка `main` = продакшен.
- Хостинг: Vercel, проект `kuni-brat` (подключён к репозиторию). Каждый пуш в `main` собирается и выкатывается
  на https://kuni-brat.vercel.app. Превью-адреса других веток закрыты входом в Vercel.
- Сборка Vercel: Node 24.x, pnpm 10 (lockfile v9, `packageManager: pnpm@10.28.2`), `pnpm install
  --frozen-lockfile` и `next build`. Все страницы — статический пререндер ([[architecture]]).
- Аналитика включается переменными `NEXT_PUBLIC_GA_ID` и `NEXT_PUBLIC_YM_ID` в настройках проекта Vercel
  (значения — в `.env.example`); без них сайт собирается и работает, просто без счётчиков.

## Как проверить перед пушем

1. Чистый клон ветки во временную папку, `CI=1 pnpm install --frozen-lockfile`, `CI=1 VERCEL=1 pnpm build`:
   ловит файлы, которые есть только локально, и рассинхрон lockfile.
2. Полный набор тестов (`CLAUDE.md`).
3. После пуша — статус «Vercel» у коммита на GitHub, затем страницы на проде: `/`, `/kk`, `/en`, `/v2`,
   `/kk/v2`, `/en/v2` отдают 200, v2 с `noindex`, в `sitemap.xml` нет `/v2`.

Связанное: [[build-pitfalls]], [[soft-landing-v2]].
