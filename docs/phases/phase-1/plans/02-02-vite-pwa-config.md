---
phase: "1"
plan: "02-02"
name: "vite-pwa-config"
wave: 2
requires:
  - "01-01"
req_ids:
  - PWA-01
  - PWA-02
status: pending
autonomous: true
---

## Objective
Создать `vite.config.js` с тремя плагинами: `@tailwindcss/vite`, `sveltekit()`, `SvelteKitPWA` — с корректным `outDir: "build"`, правильными `scope`/`base`/`start_url` под GitHub Pages (`/table-mind/`), манифестом PWA и Workbox-конфигом для офлайн-меню.

## Context
Главный подводный камень (см. RESEARCH.md «Pitfalls #1»): `adapter-static` перезаписывает `manifest.webmanifest` и `sw.js`, если PWA-плагин пишет в `static/`. Фикс — указать `outDir: "build"` (финальная папка adapter-static).

Манифест обязан ссылаться на иконки по путям `icons/pwa-192x192.png`, `icons/pwa-512x512.png`, `icons/pwa-maskable-512x512.png`. Сами PNG сгенерируются в Wave 3 (плагин 03-02) через `scripts/generate-icons.js` и лягут в `static/icons/`. На момент этого плагина иконки могут отсутствовать — билд всё равно пройдёт (VitePWA не валидирует пути иконок в момент сборки), но Lighthouse оценит ≥ 90 только после появления иконок.

Workbox-конфиг:
- Прекэш JS/CSS/шрифтов/иконок (globPatterns)
- `navigateFallback: "/table-mind/"` с `navigateFallbackDenylist: [/^\/api\//]` — чтобы API не попадали в SPA-фоллбек
- Runtime кэш для `catalog.json` (StaleWhileRevalidate, 24 часа) — подготовка к Фазе 2

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md`:
	- раздел **Decision: PWA-плагин** (код vite.config.js)
	- раздел **Pitfalls to Avoid** пункты 1, 2, 7, 13

## Tasks

### Task 02-02-01 — vite.config.js
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\vite.config.js`
- **How:** дословно из RESEARCH.md раздел «Decision: PWA-плагин» (отступы **табами**):
	- Импорты: `sveltekit` из `@sveltejs/kit/vite`, `SvelteKitPWA` из `@vite-pwa/sveltekit`, `tailwindcss` из `@tailwindcss/vite`, `defineConfig` из `vite`
	- `plugins: [tailwindcss(), sveltekit(), SvelteKitPWA({...})]`
	- SvelteKitPWA options:
		- `registerType: "autoUpdate"`
		- `outDir: "build"`
		- `scope: "/table-mind/"`
		- `base: "/table-mind/"`
		- `manifest`:
			- `name: "TableMind — AI-официант"`
			- `short_name: "TableMind"`
			- `description: "AI-помощник в ресторане. Меню, рекомендации, вызов официанта."`
			- `start_url: "/table-mind/"`
			- `scope: "/table-mind/"`
			- `display: "standalone"`
			- `background_color: "#0e0e0e"`
			- `theme_color: "#0e0e0e"`
			- `lang: "ru"`
			- `orientation: "portrait"`
			- `icons`: массив из 3 объектов (192, 512, 512 maskable)
		- `workbox`:
			- `globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2,json}"]`
			- `navigateFallback: "/table-mind/"`
			- `navigateFallbackDenylist: [/^\/api\//]`
			- `cleanupOutdatedCaches: true`
			- `skipWaiting: true`
			- `clientsClaim: true`
			- `runtimeCaching`: один элемент для `catalog.json` (StaleWhileRevalidate, cacheName `catalog-cache`, maxAgeSeconds 86400)
		- `devOptions: { enabled: false }`
- **Done when:** файл существует, содержит все ключевые строки (см. Tests Required)

## Tests Required
- `test -f vite.config.js`
- `grep -q 'SvelteKitPWA' vite.config.js`
- `grep -q 'outDir: "build"' vite.config.js`
- `grep -q '"/table-mind/"' vite.config.js`
- `grep -q 'registerType: "autoUpdate"' vite.config.js`
- `grep -q 'TableMind' vite.config.js`
- `grep -q 'background_color: "#0e0e0e"' vite.config.js`
- `grep -q 'pwa-maskable-512x512.png' vite.config.js`
- `grep -q 'purpose: "maskable"' vite.config.js`
- `grep -q 'navigateFallbackDenylist' vite.config.js`
- `grep -q 'catalog-cache' vite.config.js`
- `grep -q '@tailwindcss/vite' vite.config.js`
- `grep -q 'sveltekit()' vite.config.js`

## Definition of Done
- [ ] `vite.config.js` создан с тремя плагинами в правильном порядке
- [ ] `outDir: "build"` — иначе adapter-static перезаписывает SW
- [ ] `scope`/`base`/`start_url` = `/table-mind/`
- [ ] Манифест ссылается на 192/512/maskable иконки из `icons/`
- [ ] Workbox precache + runtime кэш для `catalog.json`
- [ ] `navigateFallbackDenylist: [/^\/api\//]` — API не попадают в SPA-fallback
- [ ] Все grep-проверки проходят
