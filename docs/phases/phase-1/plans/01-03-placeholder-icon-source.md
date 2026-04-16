---
phase: "1"
plan: "01-03"
name: "placeholder-icon-source"
wave: 1
requires: []
req_ids:
  - PWA-01
status: pending
autonomous: true
---

## Objective
Создать SVG-плейсхолдер логотипа TableMind — монограмма «TM» на тёмном фоне #0e0e0e с янтарным акцентом. Этот единственный SVG используется скриптом `scripts/generate-icons.js` (Wave 3) как источник всех растровых иконок.

## Context
Решение из CONTEXT.md: временный плейсхолдер на Фазу 1, настоящее лого пользователь сгенерирует позже. Цвета должны соответствовать теме Modern Dark Premium: фон `#0e0e0e`, текст — янтарный `#d97706`. Размер холста — `512x512` (нейтральный квадрат, `sharp` потом уменьшит).

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\CONTEXT.md` раздел **Визуальный стиль темы**
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Open Questions for Planner → источник иконки**

## Tasks

### Task 01-03-01 — SVG-исходник
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\scripts\source-icon.svg`
- **Where:** `scripts/source-icon.svg`
- **How:** SVG 512x512 с viewBox `0 0 512 512`:
	- `<rect width="512" height="512" fill="#0e0e0e" rx="96" />` — тёмный фон с закруглёнными углами (premium вид)
	- `<text x="256" y="256" text-anchor="middle" dominant-baseline="central" font-family="Inter, system-ui, sans-serif" font-size="240" font-weight="700" fill="#d97706">TM</text>`
	- Оборачивается в `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512">...</svg>`
	- Файл — это plain SVG, без внешних зависимостей (шрифт Inter может отсутствовать у sharp — это нормально, sharp отрисует fallback sans-serif, визуальный результат на Фазе 1 не критичен; настоящее лого всё равно будет заменено)
- **Done when:** файл существует, содержит строку `<svg`, строку `#0e0e0e`, строку `TM`, строку `#d97706`, валидный XML

### Task 01-03-02 — Проверка парсинга SVG
- **What:** Убедиться что sharp сможет открыть этот SVG (офлайновая проверка — вызов node-скрипта в одну строку после `npm install`; **на этапе планирования проверку не делаем**, Done-критерий — синтаксическая валидность XML)
- **How:** `node -e "require('fs').readFileSync('scripts/source-icon.svg','utf8')"` не должно падать; `xmllint --noout scripts/source-icon.svg` если доступно (не обязательно)
- **Done when:** файл читается как текст, содержит закрывающий `</svg>`

## Tests Required
- `test -f scripts/source-icon.svg`
- `grep -q '<svg' scripts/source-icon.svg`
- `grep -q '#0e0e0e' scripts/source-icon.svg`
- `grep -q '#d97706' scripts/source-icon.svg`
- `grep -q '>TM<' scripts/source-icon.svg`
- `grep -q '</svg>' scripts/source-icon.svg`
- `grep -q 'viewBox="0 0 512 512"' scripts/source-icon.svg`

## Definition of Done
- [ ] `scripts/source-icon.svg` создан
- [ ] Размер холста 512x512, viewBox корректный
- [ ] Фон `#0e0e0e` (base-100 из темы)
- [ ] Текст «TM» цветом `#d97706` (primary янтарный)
- [ ] Файл — валидный self-contained SVG без внешних ссылок
