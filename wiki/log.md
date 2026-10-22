# Log

## [2026-10-22] feat | Лендинг пересобран с нуля
Новый Next.js-проект вместо недоступных исходников живого сайта. Созданы страницы:
[[architecture]], [[i18n]], [[design-system]], [[build-pitfalls]], [[landing-sections]],
[[process-illustration]], [[2026-10-22-live-site-audit]], [[redesign-decisions]].

## [2026-10-22] feat | Концепт «Чертёж», интро «Синька», инструмент «Приказ № 70»
Переписаны [[design-system]], [[landing-sections]]; обновлены [[i18n]], [[architecture]], [[build-pitfalls]],
[[process-illustration]], [[redesign-decisions]]; новые [[blueprint-intro]], [[order70-tool]],
[[2026-10-22-screening-reference]].

## [2026-10-22] fix | Логотип ARG и переполнение на /kk
Белый на прозрачном логотип ARG был невидим в белой ячейке: добавлен флаг `Brand.invert` ([[landing-sections]]).
Слово «жабдықтаймыз» вылезало за колонку 360 px: у h1 героя нижняя граница шрифта 2.25rem и `overflow-wrap:anywhere`.

## [2026-10-22] fix | Замечания финального ревью v1
Фокус-обводка у кнопок, контраст подписей (`ink-faint` → #646d7b), кнопка WhatsApp не закрывает инструмент,
интро без вспышки при медленном JS и без пустого первого экрана без JS. Обновлены [[design-system]],
[[blueprint-intro]], [[landing-sections]], [[build-pitfalls]].

## [2026-10-22] docs | Спецификация v2 «Мягкая» и ротации интро
Решения владельца и ссылка на спецификацию — в [[redesign-decisions]].
