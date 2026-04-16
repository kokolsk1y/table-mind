---
phase: "1"
plan: "03-04"
name: "build-and-verify"
wave: 3
requires:
  - "02-05"
  - "03-02"
req_ids:
  - DEPLOY-01
  - PWA-01
  - PWA-02
status: pending
autonomous: true
---

## Objective
Проверить, что полный SvelteKit build (`npm run build`) завершается без ошибок и все PWA-артефакты (`sw.js`, `manifest.webmanifest`, `404.html`, `index.html`) попадают в `build/`. Это прямое выполнение exit criterion #1 фазы 1 из `ROADMAP.md`.

## Context
`ROADMAP.md` Phase 1 exit criterion #1: «`npm run build` completes without errors, `npm run preview` shows page». Все предыдущие плагины только создают файлы, но ни один не запускает билд — без этого нельзя убедиться, что конфигурация `svelte.config.js` (adapter-static, `paths.base = "/table-mind"`), `vite.config.js` (VitePWA с `registerType: "autoUpdate"`, `navigateFallbackDenylist`), `app.html`, `+layout.svelte`, `+page.svelte` и сгенерированные иконки действительно работают вместе.

На этом шаге executor запускает билд ОДИН раз (после всех Wave 1 и Wave 2 плагинов и после `03-02` — генерации иконок) и проверяет выход. Если что-то упало — откатываемся к соответствующему Wave 2 плагину и чиним.

Почему именно Wave 3: зависит от `02-05` (routes должны существовать) и `03-02` (иконки должны быть в `static/icons/` — иначе VitePWA выбросит warning, manifest не попадёт в outDir корректно).

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\ROADMAP.md` (раздел Phase 1 exit criteria)
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Decision: Adapter config** (ожидаемая структура `build/`)

## Tasks

### Task 03-04-01 — npm install (idempotent)
- **What:** Убедиться, что все зависимости установлены
- **How:** `cd c:/Users/ikoko/Projects/table-mind && npm install`
- **Note:** если `03-02-02` уже выполнял `npm install`, команда отработает мгновенно и ничего не изменит — это ожидаемо
- **Done when:** `test -d node_modules/@sveltejs/kit && test -d node_modules/@vite-pwa/sveltekit && test -d node_modules/daisyui`

### Task 03-04-02 — npm run build
- **What:** Запустить полную сборку SvelteKit
- **How:** `cd c:/Users/ikoko/Projects/table-mind && npm run build`
- **Done when:** команда завершается с кодом 0, в stdout видны строки про `vite build`, `prerendered`, отсутствуют строки `ERROR`/`Failed`

### Task 03-04-03 — Проверка структуры build/
- **What:** Убедиться, что все артефакты появились в ожидаемых местах
- **Checks:**
	- `test -d build` — директория билда существует
	- `test -d build/app` — кастомный `appDir: "app"` применился
	- `test -f build/index.html` — prerendered главная
	- `test -f build/404.html` — SPA fallback для adapter-static
	- `test -f build/sw.js` — service worker сгенерирован VitePWA
	- `test -f build/manifest.webmanifest` — PWA manifest
- **Done when:** все 6 проверок проходят

### Task 03-04-04 — Проверка base path в manifest
- **What:** Убедиться, что `paths.base = "/table-mind"` применён к путям в `manifest.webmanifest`
- **How:** `grep -q '/table-mind/' build/manifest.webmanifest`
- **Done when:** grep находит подстроку `/table-mind/` (в `start_url`, `scope`, или путях иконок)

### Task 03-04-05 — Проверка workbox-конфига в sw.js
- **What:** Убедиться, что `navigateFallbackDenylist` (исключающий `/api/*` из кэша) попал в скомпилированный service worker
- **How:** `grep -qE 'navigateFallbackDenylist|/api/' build/sw.js`
- **Done when:** grep находит либо `navigateFallbackDenylist`, либо упоминание `/api/` — это означает что workbox-конфиг из `vite.config.js` применён

## Tests Required
- `test -d build`
- `test -d build/app`
- `test -f build/index.html`
- `test -f build/404.html`
- `test -f build/sw.js`
- `test -f build/manifest.webmanifest`
- `grep -q '/table-mind/' build/manifest.webmanifest`
- `grep -qE 'navigateFallbackDenylist|/api/' build/sw.js`
- `test -s build/sw.js` — файл ненулевого размера
- `test -s build/manifest.webmanifest` — файл ненулевого размера

## Definition of Done
- [ ] `npm install` выполнен (или уже был выполнен ранее)
- [ ] `npm run build` завершился с exit code 0 без ошибок
- [ ] `build/` содержит `app/`, `index.html`, `404.html`, `sw.js`, `manifest.webmanifest`
- [ ] `manifest.webmanifest` содержит `/table-mind/` (подтверждение base path)
- [ ] `sw.js` содержит `navigateFallbackDenylist` или `/api/` (подтверждение workbox config)
- [ ] Все тесты из «Tests Required» проходят
