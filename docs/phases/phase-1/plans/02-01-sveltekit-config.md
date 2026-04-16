---
phase: "1"
plan: "02-01"
name: "sveltekit-config"
wave: 2
requires:
  - "01-01"
  - "01-04"
req_ids:
  - DEPLOY-01
  - UI-02
status: pending
autonomous: true
---

## Objective
Настроить SvelteKit под GitHub Pages: `svelte.config.js` с `adapter-static`, `appDir: "app"`, `paths.base`, + `src/app.html` с мобильными мета-тегами, + `src/routes/+layout.js` с `prerender = true`.

## Context
Ключевое требование DEPLOY-01:
1. `adapter-static` — prerender-only, fallback 404.html для SPA роутинга
2. `appDir: "app"` — чтобы обойти Jekyll-игнор `_`-папок (дополнительно к `.nojekyll` из 01-04)
3. `paths.base = "/table-mind"` в production — репо GitHub Pages работает по подпути `/table-mind/`

В `src/app.html` — обязательные мобильные теги (`viewport-fit=cover` для iOS safe-area), Inter через Google Fonts, apple-touch-icon ссылка, data-theme="tablemind".

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md`:
	- раздел **Decision: Структура SvelteKit + adapter-static** (код svelte.config.js)
	- раздел **Code Examples → src/app.html**
- `c:\Users\ikoko\Projects\ZalAssist\svelte.config.js` и `c:\Users\ikoko\Projects\ZalAssist\src\app.html` как референс

## Tasks

### Task 02-01-01 — svelte.config.js
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\svelte.config.js`
- **How:** дословно из RESEARCH.md раздел «Decision: Структура SvelteKit + adapter-static» (отступы **табами**):
	```js
	import adapter from "@sveltejs/adapter-static";

	const dev = process.argv.includes("dev");

	const config = {
		kit: {
			adapter: adapter({
				pages: "build",
				assets: "build",
				fallback: "404.html",
				strict: false
			}),
			paths: {
				base: dev ? "" : "/table-mind"
			},
			appDir: "app"
		}
	};

	export default config;
	```
- **Done when:** файл существует, содержит `adapter-static`, `"/table-mind"`, `appDir: "app"`, `fallback: "404.html"`

### Task 02-01-02 — src/app.html
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\src\app.html`
- **How:** дословно из RESEARCH.md раздел «Code Examples → src/app.html»:
	- `<html lang="ru" data-theme="tablemind">`
	- `<link rel="icon" href="%sveltekit.assets%/icons/favicon-32x32.png" />`
	- `<link rel="apple-touch-icon" href="%sveltekit.assets%/icons/apple-touch-icon.png" />`
	- `<meta name="apple-mobile-web-app-capable" content="yes" />`
	- `<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />`
	- `<meta name="apple-mobile-web-app-title" content="TableMind" />`
	- `<meta name="mobile-web-app-capable" content="yes" />`
	- `<meta name="theme-color" content="#0e0e0e" />`
	- preconnect fonts.googleapis.com + fonts.gstatic.com
	- `<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />`
	- `<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />`
	- `%sveltekit.head%` перед закрытием `</head>`
	- `<body data-sveltekit-preload-data="hover">` + `<div style="display: contents">%sveltekit.body%</div>`
- **Done when:** файл существует, содержит `data-theme="tablemind"`, `viewport-fit=cover`, `theme-color", "content="#0e0e0e"`, `apple-touch-icon`, `%sveltekit.head%`, `%sveltekit.body%`

### Task 02-01-03 — src/routes/+layout.js
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\src\routes\+layout.js`
- **How:** из RESEARCH.md раздел «Code Examples → +layout.js»:
	```js
	export const prerender = true;
	export const trailingSlash = "always";
	```
- **Done when:** файл существует, содержит обе строки

## Tests Required
- `test -f svelte.config.js`
- `grep -q 'adapter-static' svelte.config.js`
- `grep -q '"/table-mind"' svelte.config.js`
- `grep -q 'appDir: "app"' svelte.config.js`
- `grep -q 'fallback: "404.html"' svelte.config.js`
- `test -f src/app.html`
- `grep -q 'data-theme="tablemind"' src/app.html`
- `grep -q 'viewport-fit=cover' src/app.html`
- `grep -q '#0e0e0e' src/app.html`
- `grep -q 'apple-touch-icon' src/app.html`
- `grep -q '%sveltekit.head%' src/app.html`
- `grep -q '%sveltekit.body%' src/app.html`
- `test -f src/routes/+layout.js`
- `grep -q 'prerender = true' src/routes/+layout.js`
- `grep -q 'trailingSlash = "always"' src/routes/+layout.js`

## Definition of Done
- [ ] `svelte.config.js` настроен на adapter-static с базовым путём `/table-mind` и `appDir: "app"`
- [ ] `src/app.html` содержит все мобильные меты (viewport-fit=cover, theme-color, apple-touch-icon, data-theme)
- [ ] `src/routes/+layout.js` включает prerender
- [ ] Все grep-проверки проходят
