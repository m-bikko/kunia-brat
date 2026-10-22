---
title: Дизайн-система
type: concept
tags: [design, tokens, motion, magic-ui]
created: 2026-10-22
updated: 2026-10-22
sources: [app/globals.css, components/ui/, components/section-title.tsx]
---

# Дизайн-система

Язык бренда: светлая «архитектурная» эстетика чертежа. Тема только светлая (решение бренда), одна цветовая
инверсия — тёмный блок шоурума в [[landing-sections]], плюс тёмный футер.

## Токены (`app/globals.css`)

| Токен | Значение | Роль |
|---|---|---|
| `--ink` | #17283d | основной текст |
| `--ink-deep` | #0f1e36 | тёмные блоки, футер |
| `--brand` | #3059df | единственный акцент |
| `--brand-light` | #9db4f5 | акцент на тёмном фоне |
| `--paper` | #f5f7fc | фон страницы |
| `--line` / `--line-strong` | #d9e1ee / #c3cfe2 | границы |

Жёлтый `#f2b705` со старого сайта сознательно не используется: один акцент на страницу.
Токены shadcn (`--primary`, `--border`…) смаплены на бренд.

## Формы и слои

- Карточки и медиа — `rounded-card` (20px), контролы — `rounded-control` (12px), чипы — `rounded-full`.
- z-index: шапка 40, плавающий WhatsApp 30, мобильное меню 50, skip-link 60.
- Утилиты: `container-axis` (макс. 1320px), `bg-blueprint` (сетка 40px как на чертеже).

## Движение

- `MotionConfig reducedMotion="user"` на всё приложение; бесконечные CSS-циклы ставятся на паузу при reduced motion.
- Анимируются только transform и opacity.
- Каждое движение мотивировано: сборка класса рассказывает процесс ([[process-illustration]]), луч на форме выделяет
  точку конверсии, смена рендеров в hero показывает диапазон кабинетов.
- Hero появляется через CSS (`tw-animate-css`), а не через JS: заголовок — LCP-элемент и не должен ждать гидрации.

## Magic UI (владеем копиями в `components/ui`)

| Компонент | Где | Доработка |
|---|---|---|
| Marquee | бренды | aria-hidden + отдельный sr-only список |
| NumberTicker | полоса цифр | финальное значение для скринридеров и reduced motion, локальный формат |
| BorderBeam | форма заявки | выключается при reduced motion |
| AnimatedGridPattern | фон hero | без setState в эффекте, цвет клеток через `text-brand` |
| BlurFade | появление секций при скролле | без изменений |

`Button` из shadcn перекрашен под бренд; почти все CTA — ссылки со стилем `buttonVariants()`.
