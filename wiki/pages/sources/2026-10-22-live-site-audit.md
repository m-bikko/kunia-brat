---
title: Аудит живого axisgroup.kz (2026-10-22)
type: source
tags: [audit, live-site, seo, analytics]
created: 2026-10-22
updated: 2026-10-22
sources: [https://axisgroup.kz/]
---

# Аудит живого axisgroup.kz (2026-10-22)

## Что это за сайт

- Стек: vinext (Next.js-совместимый фреймворк на Vite), three.js для 3D-моделей, Cloudflare.
  Исходников на машине разработчика не нашлось, поэтому лендинг пересобран с нуля ([[redesign-decisions]]).
- Шрифт Manrope + Noto Sans с `unicode-range` для казахских букв (подход повторён лучше, см. [[i18n]]).
- Токены: ink #17283d, blue #3059df, accent #f2b705, радиусы 2–8px.

## Найденные проблемы

- **CSP блокирует Яндекс.Метрику** (`mc.yandex.ru` нет в `script-src`), а также Cloudflare Insights,
  `stats.g.doubleclick.net` и `google.kz/ads/ga-audiences`. Метрика на живом сайте, судя по всему, не собирает данные.
  В новом проекте CSP это разрешает ([[architecture]]).
- В hero — фото системного блока на белой подложке поверх голубого фона.
- Один из двух IP Cloudflare (188.114.97.3) из сети разработчика не отвечал по TLS, второй (188.114.96.3) работал.
  Для браузерных проверок пригодилось `--host-resolver-rules`.

## Контент, перенесённый в новый лендинг

Тексты hero, 8 направлений с особенностями, блок 3D-шоурума, 11 брендов, 4 шага процесса, цех и магазин Ranzen,
SEO-блок «Что входит в оснащение», G8, финальная форма, футер. Рендеры кабинетов и логотипы скачаны в `assets/`.

## Внутренние URL живого сайта

`/kabinet-informatiki`, `/art-kabinet`, `/shveynaya-masterskaya`, `/goncharnaya-studiya`, `/masterskaya-truda`,
`/kabinet-kazakhskogo-yazyka`, `/kabinet-russkogo-yazyka`, `/kabinet-angliyskogo-yazyka`, `/virtual-classroom`,
`/art-classroom`, `/sewing-classroom`, `/catalog`, `/services`, `/about`, `/cart`,
`/guides/osnashchenie-shkolnogo-kabineta`, `/guides/prikaz-70-osnashchenie-shkol`.
