---
phase: "1"
plan: "02-03"
name: "daisyui-theme"
wave: 2
requires:
  - "01-01"
req_ids:
  - UI-01
  - UI-02
status: pending
autonomous: true
---

## Objective
Создать `src/app.css` — единственный стилевой файл, который подключает Tailwind v4, DaisyUI v5 с выключенными встроенными темами и регистрирует кастомную тёмную тему `tablemind` (Modern Dark Premium: угольный фон, янтарный акцент, мягкие скругления).

## Context
Тема реализует решение из CONTEXT.md («Визуальный стиль темы»). DaisyUI v5 позволяет регистрировать тему через CSS-директиву `@plugin "daisyui/theme" { ... }` — никакого `tailwind.config.js` не нужно (Tailwind v4 конфигурируется через CSS).

Ключевые детали:
- `@plugin "daisyui" { themes: false; }` — отключить встроенные темы (Pitfall #8)
- `default: true; prefersdark: true; color-scheme: dark;` — тема применяется без JS
- OKLCH-значения для всех цветов (современнее и перцептивно-равномернее, чем hex)
- `--radius-box: 1rem` — мягкие скругления карточек (premium вид)
- `font-family: "Inter"` — должно совпадать с preconnect из `src/app.html`
- iOS-специфика: `font-size: max(16px, 1rem)` для input/textarea (Pitfall — иначе iOS зумит при фокусе)
- `overscroll-behavior-y: none` — защита от bounce-скролла
- `.safe-bottom` utility — padding-bottom: env(safe-area-inset-bottom)

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Decision: DaisyUI v5 тёмная тема** (готовый CSS)
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\CONTEXT.md` раздел **Визуальный стиль темы**

## Tasks

### Task 02-03-01 — src/app.css
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\src\app.css`
- **How:** дословно из RESEARCH.md раздел «Decision: DaisyUI v5 тёмная тема». Структура:
	1. `@import "tailwindcss";`
	2. `@plugin "daisyui" { themes: false; }`
	3. `@plugin "daisyui/theme" { name: "tablemind"; default: true; prefersdark: true; color-scheme: dark; ...переменные... }` — все OKLCH-цвета (base-100..300, base-content, primary, primary-content, secondary, secondary-content, accent, accent-content, neutral, neutral-content, info, success, warning, error) + `--radius-selector/-field/-box` + `--size-selector/-field` + `--border`, `--depth`, `--noise`
	4. `@layer base { html { font-family: "Inter", sans-serif; -webkit-tap-highlight-color: transparent; font-size: 16px; line-height: 1.5; } body { background: var(--color-base-100); color: var(--color-base-content); } }`
	5. `@layer utilities { .safe-bottom { padding-bottom: env(safe-area-inset-bottom, 0px); } }`
	6. `html, body { overscroll-behavior-y: none; }`
	7. `@supports (-webkit-touch-callout: none) { input, textarea { font-size: max(16px, 1rem); } }`
	- Отступы — **табами**
- **Done when:** файл существует и содержит все ключевые строки

## Tests Required
- `test -f src/app.css`
- `grep -q '@import "tailwindcss"' src/app.css`
- `grep -q '@plugin "daisyui"' src/app.css`
- `grep -q 'themes: false' src/app.css`
- `grep -q '@plugin "daisyui/theme"' src/app.css`
- `grep -q 'name: "tablemind"' src/app.css`
- `grep -q 'default: true' src/app.css`
- `grep -q 'color-scheme: dark' src/app.css`
- `grep -q '\-\-color-base-100' src/app.css`
- `grep -q '\-\-color-primary' src/app.css`
- `grep -q '\-\-radius-box' src/app.css`
- `grep -q 'Inter' src/app.css`
- `grep -q 'safe-area-inset-bottom' src/app.css`
- `grep -q 'overscroll-behavior-y: none' src/app.css`
- `grep -q 'max(16px, 1rem)' src/app.css`

## Definition of Done
- [ ] `src/app.css` создан
- [ ] Tailwind v4 импортирован через `@import "tailwindcss"`
- [ ] DaisyUI подключён с `themes: false` (встроенные темы выключены)
- [ ] Зарегистрирована кастомная тема `tablemind` с `default: true` и `color-scheme: dark`
- [ ] Все OKLCH-цвета из RESEARCH.md присутствуют
- [ ] `--radius-box: 1rem` для мягких скруглений
- [ ] Inter подключён через `font-family`
- [ ] iOS fix (`font-size: max(16px, 1rem)`) и `overscroll-behavior-y: none` присутствуют
- [ ] Utility `.safe-bottom` определён
