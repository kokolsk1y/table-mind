# Phase 1 Research — Фундамент

**Phase:** 1 — Фундамент (DEPLOY-01..03, UI-01..02, PWA-01..02, QR-01..02)
**Date:** 2026-04-11

## Scope

Исследование готовых паттернов для деплоя SvelteKit 2 + Svelte 5 на GitHub Pages с PWA, прокси Vercel Functions для API, генерации QR-кодов и иконок, а также конфигурации тёмной темы DaisyUI v5. Главный источник готовых решений — `c:\Users\ikoko\Projects\ZalAssist`, в котором реализована та же связка GitHub Pages + Vercel-API.

Главные точки риска:
1. Связка `adapter-static` + `@vite-pwa/sveltekit` (нужен корректный `outDir`)
2. Vercel Functions Node.js runtime (Edge deprecated — нужен явный конфиг и другая сигнатура хендлера)
3. CORS между `*.github.io` и `*.vercel.app`
4. Sharp-генерация PWA-иконок (включая maskable safe area 80%)
5. Чтение `?table` в `+layout.svelte` без SSR-проблем (prerender + sessionStorage)

## Codebase Audit Findings

В репо `table-mind` пока нет кода — только `docs/`. Все паттерны заимствуются из ZalAssist.

### Existing Patterns to Follow (из ZalAssist)

| Паттерн | Где в ZalAssist | Правило для планнера |
|---------|----------------|----------------------|
| ESM модули | `package.json` → `"type": "module"` | В корневом и в `vercel-api/package.json` ставить `"type": "module"`, файлы `.js` (без `.mjs`/`.cjs`) |
| Tabs для отступов | весь `src/` ZalAssist | Использовать табы, не пробелы |
| Двойные кавычки | весь `src/` | `"foo"`, не `'foo'` |
| Имена компонентов PascalCase | `src/lib/components/CartPanel.svelte` | `MenuCard.svelte`, `CallWaiterButton.svelte` и т.д. |
| Имена сторов | `src/lib/stores/cart.svelte.js` | Файлы со Svelte 5 runes — суффикс `.svelte.js` |
| Singleton + хук | `cart.js` (writable) + `cart.svelte.js` (`useCart()`) | Логика сторов — в чистом JS, реактивная обёртка — в `.svelte.js`. Для TableMind — сразу class-based с `$state` (более идиоматично для Svelte 5) |
| `app.html` lang/data-theme | `<html lang="ru" data-theme="electrocentr">` | Аналогично: `<html lang="ru" data-theme="tablemind">` |
| `viewport-fit=cover` | `app.html` `<meta>` | Обязательно для iOS safe area |
| `+layout.js` prerender | `export const prerender = true; export const trailingSlash = "always";` | Без `prerender = true` adapter-static не сгенерирует страницу |
| onMount для browser-only | `+layout.svelte` → onMount → `matchMedia` | Любое чтение `window`, `sessionStorage` — только в `onMount` |
| `.npmrc` engine-strict | `engine-strict=true` | Скопировать |
| Ignore .vercel/.svelte-kit/build | `.gitignore` ZalAssist | Скопировать целиком |
| Inter через Google Fonts | `app.html` `<link>` preconnect + css2 | Аналогично; для офлайна позже подключить `@fontsource/inter` |
| GitHub Actions deploy | `.github/workflows/deploy.yml` (build → upload-pages-artifact → deploy-pages) | Скопировать с `node-version: 20`, `path: "build"` |
| CORS на /api/* | `vercel-api/vercel.json` headers + дублирование в коде функции | Делать оба слоя |

### Files This Phase Will Touch

| Файл | Текущее состояние | Требуемое изменение |
|------|------------------|---------------------|
| `package.json` (root) | отсутствует | Создать (SvelteKit 2.50, Svelte 5.54, adapter-static 3.0.10, vite-pwa 1.1, daisyui 5.5, tailwindcss 4.2, vite 7.3, sharp/qrcode/pdfkit в devDeps) |
| `svelte.config.js` | отсутствует | adapter-static + `appDir: "app"` + `paths.base = "/table-mind"` |
| `vite.config.js` | отсутствует | sveltekit + tailwindcss + SvelteKitPWA с `outDir: "build"` |
| `src/app.html` | отсутствует | lang=ru, data-theme=tablemind, viewport-fit=cover, Inter preconnect, apple-touch-icon |
| `src/app.css` | отсутствует | `@import tailwindcss; @plugin daisyui { themes: false }; @plugin "daisyui/theme" { name: "tablemind"; ... }` |
| `src/routes/+layout.js` | отсутствует | `prerender = true; trailingSlash = "always"` |
| `src/routes/+layout.svelte` | отсутствует | onMount → читает `?table` → sessionStorage → session store |
| `src/routes/+page.svelte` | отсутствует | Заглушка с heading «TableMind — добро пожаловать» |
| `src/lib/stores/session.svelte.js` | отсутствует | class SessionState с `$state` полями: tableNumber, currentMode |
| `static/.nojekyll` | отсутствует | пустой файл |
| `static/icons/*` | отсутствует | сгенерировать через `scripts/generate-icons.js` и закоммитить |
| `scripts/source-icon.svg` | отсутствует | плейсхолдер «TM» на тёмном фоне |
| `scripts/generate-icons.js` | отсутствует | sharp, читает один SVG, выдаёт 192/512/maskable/180/favicons |
| `scripts/generate-qr.js` | отсутствует | qrcode + pdfkit, аргументы `--tables --base --output` |
| `vercel-api/package.json` | отсутствует | `"type": "module"`, `"private": true`, name `table-mind-api` |
| `vercel-api/vercel.json` | отсутствует | CORS headers + `regions: ["fra1"]` |
| `vercel-api/api/chat.js` | отсутствует | Заглушка Node.js runtime: OPTIONS+POST, отвечает `{"ok": true, "stub": true}` |
| `vercel-api/api/notify.js` | отсутствует | Аналогичная заглушка для будущей фазы 4 |
| `.github/workflows/deploy.yml` | отсутствует | Скопировать из ZalAssist 1-в-1 |
| `.gitignore` | отсутствует | Скопировать из ZalAssist |
| `.npmrc` | отсутствует | `engine-strict=true` |
| `jsconfig.json` | отсутствует | Скопировать из ZalAssist для path-aliases |

### Potential Conflicts

- **GitHub Pages base path.** Репо называется `table-mind` → URL будет `kokolsk1y.github.io/table-mind/`. Все ссылки и `start_url`/`scope` PWA должны учитывать `/table-mind/` в production и пустой base в dev.
- **Vercel root directory.** Vercel при подключении репо ДОЛЖЕН быть настроен на Root Directory = `vercel-api` (через UI Vercel, не файлом). Иначе попытается сбилдить SvelteKit и упадёт. Решается ОДИН раз — нужно задокументировать в README.
- **Icon generation коммитится в репо.** `static/icons/*.png` коммитятся, потому что GitHub Actions не должен запускать sharp при каждом деплое. Скрипт запускается локально → результат коммитится.

## Recommended Approach

### Decision: Структура SvelteKit + adapter-static

**Chosen approach:** Скопировать конфиг ZalAssist 1-в-1, поменять имя проекта, base path и тему.
**Reason:** ZalAssist — рабочий продакшн на GitHub Pages с тем же стеком, проверенная связка.

```js
// svelte.config.js
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

**Почему `appDir: "app"`** — GitHub Pages исторически использовал Jekyll, который игнорирует папки, начинающиеся с `_`. SvelteKit по умолчанию кладёт чанки в `_app/`. `.nojekyll` это решает, но для надёжности дополнительно меняем `_app` → `app`. Это требование DEPLOY-01.

**Почему `fallback: "404.html"` и `strict: false`** — для prerender-only приложения SvelteKit генерирует `404.html`, который GitHub Pages автоматически использует для SPA-роутинга.

### Decision: PWA-плагин

**Chosen approach:** `@vite-pwa/sveltekit` с настройкой `outDir: "build"`.
**Reason:** Без правильного `outDir` adapter-static перезаписывает `manifest.webmanifest` и `sw.js`, сгенерированные плагином.

```js
// vite.config.js
import { sveltekit } from "@sveltejs/kit/vite";
import { SvelteKitPWA } from "@vite-pwa/sveltekit";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit(),
		SvelteKitPWA({
			registerType: "autoUpdate",
			outDir: "build",
			scope: "/table-mind/",
			base: "/table-mind/",
			manifest: {
				name: "TableMind — AI-официант",
				short_name: "TableMind",
				description: "AI-помощник в ресторане. Меню, рекомендации, вызов официанта.",
				start_url: "/table-mind/",
				scope: "/table-mind/",
				display: "standalone",
				background_color: "#0e0e0e",
				theme_color: "#0e0e0e",
				lang: "ru",
				orientation: "portrait",
				icons: [
					{ src: "icons/pwa-192x192.png", sizes: "192x192", type: "image/png" },
					{ src: "icons/pwa-512x512.png", sizes: "512x512", type: "image/png" },
					{ src: "icons/pwa-maskable-512x512.png", sizes: "512x512", type: "image/png", purpose: "maskable" }
				]
			},
			workbox: {
				globPatterns: ["client/**/*.{js,css,ico,png,svg,webp,woff,woff2,json}"],
				navigateFallback: "/table-mind/",
				navigateFallbackDenylist: [/^\/api\//],
				cleanupOutdatedCaches: true,
				skipWaiting: true,
				clientsClaim: true,
				runtimeCaching: [
					{
						urlPattern: ({ url }) => url.pathname.endsWith("/catalog.json"),
						handler: "StaleWhileRevalidate",
						options: {
							cacheName: "catalog-cache",
							expiration: { maxAgeSeconds: 86400 }
						}
					}
				]
			},
			devOptions: {
				enabled: false
			}
		})
	]
});
```

**Важно про `outDir`:** В документации формулировка «set outDir to static» вводит в заблуждение. Реально нужно указать **финальную папку, в которую adapter-static положит билд** — это `build`.

### Decision: Vercel runtime

**Chosen approach:** Node.js runtime (default), регион `fra1` через `vercel.json`.
**Reason:** Edge runtime deprecated. Node.js — дефолт.

```js
// vercel-api/api/chat.js (заглушка для Фазы 1)
export const config = {
	maxDuration: 30
};

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type"
};

function setCors(res) {
	for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

export default async function handler(req, res) {
	setCors(res);
	if (req.method === "OPTIONS") {
		res.status(204).end();
		return;
	}
	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}
	res.status(200).json({ ok: true, stub: true, runtime: "nodejs" });
}
```

**КРИТИЧНО — разница API между Edge и Node.js runtime:**
- Edge: `export default async function handler(req: Request): Promise<Response>` — Web API (Fetch-style)
- Node.js: `export default async function handler(req, res)` — Express-like, `res.setHeader`, `res.status`, `res.json`

**Код ZalAssist `chat.js` нельзя копировать 1-в-1** — сигнатуры функций разные.

```json
// vercel-api/vercel.json
{
	"regions": ["fra1"],
	"headers": [
		{
			"source": "/api/(.*)",
			"headers": [
				{ "key": "Access-Control-Allow-Origin", "value": "*" },
				{ "key": "Access-Control-Allow-Methods", "value": "POST, OPTIONS" },
				{ "key": "Access-Control-Allow-Headers", "value": "Content-Type" }
			]
		}
	]
}
```

```json
// vercel-api/package.json
{
	"name": "table-mind-api",
	"version": "1.0.0",
	"private": true,
	"type": "module"
}
```

### Decision: DaisyUI v5 тёмная тема

**Chosen approach:** Custom theme через `@plugin "daisyui/theme"` в `src/app.css` с OKLCH-цветами, `default: true`, `color-scheme: dark`.

```css
/* src/app.css */
@import "tailwindcss";
@plugin "daisyui" {
	themes: false;
}

@plugin "daisyui/theme" {
	name: "tablemind";
	default: true;
	prefersdark: true;
	color-scheme: dark;

	--color-base-100: oklch(14% 0 0);
	--color-base-200: oklch(18% 0 0);
	--color-base-300: oklch(22% 0 0);
	--color-base-content: oklch(92% 0.01 80);

	--color-primary: oklch(70% 0.17 60);
	--color-primary-content: oklch(15% 0.02 60);

	--color-secondary: oklch(60% 0.12 30);
	--color-secondary-content: oklch(98% 0.01 30);

	--color-accent: oklch(75% 0.15 80);
	--color-accent-content: oklch(15% 0.02 80);

	--color-neutral: oklch(25% 0 0);
	--color-neutral-content: oklch(92% 0.01 80);

	--color-info: oklch(70% 0.14 220);
	--color-success: oklch(70% 0.17 150);
	--color-warning: oklch(80% 0.17 80);
	--color-error: oklch(65% 0.22 25);

	--radius-selector: 0.5rem;
	--radius-field: 0.75rem;
	--radius-box: 1rem;

	--size-selector: 0.25rem;
	--size-field: 0.25rem;

	--border: 1px;
	--depth: 1;
	--noise: 0;
}

@layer base {
	html {
		font-family: "Inter", sans-serif;
		-webkit-tap-highlight-color: transparent;
		font-size: 16px;
		line-height: 1.5;
	}
	body {
		background: var(--color-base-100);
		color: var(--color-base-content);
	}
}

@layer utilities {
	.safe-bottom {
		padding-bottom: env(safe-area-inset-bottom, 0px);
	}
}

html, body {
	overscroll-behavior-y: none;
}

@supports (-webkit-touch-callout: none) {
	input, textarea {
		font-size: max(16px, 1rem);
	}
}
```

## Technology Notes

### Версии

```json
{
	"devDependencies": {
		"@sveltejs/adapter-static": "^3.0.10",
		"@sveltejs/kit": "^2.50.2",
		"@sveltejs/vite-plugin-svelte": "^6.2.4",
		"@vite-pwa/sveltekit": "^1.1.0",
		"svelte": "^5.54.0",
		"vite": "^7.3.1",
		"@tailwindcss/vite": "^4.2.2",
		"tailwindcss": "^4.2.2",
		"sharp": "^0.33.0",
		"qrcode": "^1.5.3",
		"pdfkit": "^0.15.0"
	},
	"dependencies": {
		"daisyui": "^5.5.19"
	}
}
```

## Integration Points

### Outputs (для следующих фаз)

- **`src/lib/stores/session.svelte.js`** — class SessionState с `$state` полями:
```js
class SessionState {
	tableNumber = $state(null);
	currentMode = $state("menu");

	get isDemoMode() { return this.tableNumber === null; }
	setTable(num) { this.tableNumber = String(num); }
	setMode(mode) { this.currentMode = mode; }
	clear() { this.tableNumber = null; this.currentMode = "menu"; }
}
export const session = new SessionState();
```

- **Контракт API заглушки:** POST `/api/chat` → `{ ok: true, stub: true, runtime: "nodejs" }`, OPTIONS → 204, прочие методы → 405. Все с CORS headers.

- **Контракт URL-параметра ?table:** читается в onMount, пишется в sessionStorage + session store. Всегда string или null (демо-режим).

## Pitfalls to Avoid

1. **adapter-static перезаписывает service worker.** Фикс: `outDir: "build"` в SvelteKitPWA.
2. **GitHub Pages base path в манифесте PWA.** Фикс: `/table-mind/` везде (start_url, scope, base, paths.base).
3. **sessionStorage на SSR/prerender.** Фикс: только внутри `onMount`.
4. **Vercel пытается сбилдить SvelteKit.** Фикс: Root Directory = `vercel-api` в UI Vercel.
5. **CORS preflight.** Фикс: обработать OPTIONS явно, дублировать headers в vercel.json и в коде.
6. **Edge runtime API в Node.js функции.** Фикс: использовать `req, res` (не `Request → Response`).
7. **Tailwind v4 без CSS-конфига.** Фикс: `@import "tailwindcss"` в app.css, `@tailwindcss/vite` в vite.config.js, никакого `tailwind.config.js`.
8. **DaisyUI v5 без `themes: false`.** Фикс: отключить встроенные темы.
9. **QR на тёмном фоне.** Фикс: `dark: "#0e0e0e", light: "#ffffff"`.
10. **PDFKit + кириллица.** Фикс: английский «Table N» на Phase 1.
11. **Sharp в production deps.** Фикс: только в devDependencies, иконки коммитятся в static/icons/.
12. **Lighthouse PWA score < 90.** Фикс: maskable icon обязателен, theme-color, apple-touch-icon.
13. **`navigateFallback` без denylist.** Фикс: `navigateFallbackDenylist: [/^\/api\//]`.

## Code Examples

### `src/routes/+layout.svelte`

```svelte
<script>
	import "../app.css";
	import { onMount } from "svelte";
	import { session } from "$lib/stores/session.svelte.js";

	let { children } = $props();

	onMount(() => {
		const stored = sessionStorage.getItem("tableNumber");
		if (stored) {
			session.setTable(stored);
		}

		const url = new URL(window.location.href);
		const tableParam = url.searchParams.get("table");
		if (tableParam) {
			const cleaned = tableParam.trim();
			if (cleaned && /^\d+$/.test(cleaned)) {
				session.setTable(cleaned);
				sessionStorage.setItem("tableNumber", cleaned);
			}
		}

		const standalone = window.matchMedia("(display-mode: standalone)").matches
			|| window.navigator.standalone === true;
		if (standalone) {
			document.documentElement.classList.add("pwa-standalone");
		}
	});
</script>

<svelte:head>
	<title>TableMind — AI-официант</title>
	<meta name="description" content="AI-помощник в ресторане. Меню, рекомендации, вызов официанта." />
	<meta name="theme-color" content="#0e0e0e" />
</svelte:head>

<main class="min-h-screen bg-base-100 text-base-content">
	{@render children()}
</main>
```

### `src/routes/+layout.js`

```js
export const prerender = true;
export const trailingSlash = "always";
```

### `scripts/generate-qr.js`

```js
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import fs from "node:fs/promises";
import { createWriteStream } from "node:fs";
import path from "node:path";

function parseArgs() {
	const args = process.argv.slice(2);
	const out = { tables: 10, base: "https://kokolsk1y.github.io/table-mind/", output: "./qr-output" };
	for (let i = 0; i < args.length; i++) {
		if (args[i] === "--tables") out.tables = parseInt(args[++i], 10);
		else if (args[i] === "--base") out.base = args[++i];
		else if (args[i] === "--output") out.output = args[++i];
	}
	return out;
}

async function main() {
	const { tables, base, output } = parseArgs();
	await fs.mkdir(output, { recursive: true });

	const buffers = [];
	for (let i = 1; i <= tables; i++) {
		const url = `${base}?table=${i}`;
		const fname = `table-${String(i).padStart(2, "0")}.png`;
		const buf = await QRCode.toBuffer(url, {
			type: "png",
			errorCorrectionLevel: "M",
			margin: 2,
			width: 512,
			color: { dark: "#0e0e0e", light: "#ffffff" }
		});
		await fs.writeFile(path.join(output, fname), buf);
		buffers.push({ buf, num: i });
		console.log(`OK ${fname} -> ${url}`);
	}

	const doc = new PDFDocument({ size: "A4", margin: 36 });
	doc.pipe(createWriteStream(path.join(output, "tables.pdf")));

	const PAGE_W = 595, PAGE_H = 842, MARGIN = 36;
	const COLS = 2, ROWS = 3;
	const CELL_W = (PAGE_W - MARGIN * 2) / COLS;
	const CELL_H = (PAGE_H - MARGIN * 2) / ROWS;
	const QR_SIZE = Math.min(CELL_W, CELL_H) - 40;

	buffers.forEach((item, i) => {
		const idx = i % (COLS * ROWS);
		if (i > 0 && idx === 0) doc.addPage();
		const col = idx % COLS;
		const row = Math.floor(idx / COLS);
		const x = MARGIN + col * CELL_W + (CELL_W - QR_SIZE) / 2;
		const y = MARGIN + row * CELL_H + 10;
		doc.image(item.buf, x, y, { width: QR_SIZE });
		doc.fontSize(16).text(`Table ${item.num}`, MARGIN + col * CELL_W, y + QR_SIZE + 8, {
			width: CELL_W,
			align: "center"
		});
	});
	doc.end();
	console.log(`\nGenerated ${tables} QR codes + tables.pdf in ${output}`);
}

main().catch((e) => { console.error(e); process.exit(1); });
```

### `scripts/generate-icons.js`

```js
import sharp from "sharp";
import fs from "node:fs/promises";
import path from "node:path";

const SOURCE = "scripts/source-icon.svg";
const OUT = "static/icons";

await fs.mkdir(OUT, { recursive: true });
const svgBuffer = await fs.readFile(SOURCE);
const BG = { r: 14, g: 14, b: 14, alpha: 1 };

const sizes = [
	{ name: "pwa-192x192.png", size: 192, padding: 0 },
	{ name: "pwa-512x512.png", size: 512, padding: 0 },
	{ name: "pwa-maskable-512x512.png", size: 512, padding: 51 },
	{ name: "apple-touch-icon.png", size: 180, padding: 0 },
	{ name: "favicon-32x32.png", size: 32, padding: 0 },
	{ name: "favicon-16x16.png", size: 16, padding: 0 }
];

for (const { name, size, padding } of sizes) {
	const inner = size - padding * 2;
	await sharp(svgBuffer)
		.resize(inner, inner, { fit: "contain", background: BG })
		.extend({ top: padding, bottom: padding, left: padding, right: padding, background: BG })
		.png()
		.toFile(path.join(OUT, name));
	console.log(`OK ${name}`);
}
```

### `.github/workflows/deploy.yml`

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: ["main"]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: "pages"
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npm run build
      - uses: actions/upload-pages-artifact@v3
        with:
          path: "build"

  deploy:
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    runs-on: ubuntu-latest
    needs: build
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

### `src/app.html`

```html
<!doctype html>
<html lang="ru" data-theme="tablemind">
	<head>
		<meta charset="utf-8" />
		<link rel="icon" href="%sveltekit.assets%/icons/favicon-32x32.png" />
		<link rel="apple-touch-icon" href="%sveltekit.assets%/icons/apple-touch-icon.png" />
		<meta name="apple-mobile-web-app-capable" content="yes" />
		<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
		<meta name="apple-mobile-web-app-title" content="TableMind" />
		<meta name="mobile-web-app-capable" content="yes" />
		<meta name="theme-color" content="#0e0e0e" />
		<link rel="preconnect" href="https://fonts.googleapis.com" />
		<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
		<link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
		<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover" />
		%sveltekit.head%
	</head>
	<body data-sveltekit-preload-data="hover">
		<div style="display: contents">%sveltekit.body%</div>
	</body>
</html>
```

## Open Questions for Planner

1. **Точное доменное имя Vercel** — будет известно после первого деплоя. Хардкод плейсхолдер, обновить в README.
2. **Шрифт PDFKit с кириллицей** — Phase 1 использует английское «Table N» (это для разработчика).
3. **iOS splash screens** — НЕ генерировать на Phase 1, отложить в Phase 3 (PWA-03).
4. **`scripts/source-icon.svg`** — плейсхолдер «TM» на тёмном фоне.
5. **Hover dark mode при desktop** — тема хардкодится через `data-theme`, prefers-color-scheme игнорируется.

## Релевантные файлы (абсолютные пути)

**Reference (ZalAssist):**
- `c:\Users\ikoko\Projects\ZalAssist\svelte.config.js`
- `c:\Users\ikoko\Projects\ZalAssist\vite.config.js`
- `c:\Users\ikoko\Projects\ZalAssist\package.json`
- `c:\Users\ikoko\Projects\ZalAssist\src\app.css`
- `c:\Users\ikoko\Projects\ZalAssist\src\app.html`
- `c:\Users\ikoko\Projects\ZalAssist\src\routes\+layout.svelte`
- `c:\Users\ikoko\Projects\ZalAssist\src\routes\+layout.js`
- `c:\Users\ikoko\Projects\ZalAssist\src\lib\stores\cart.svelte.js`
- `c:\Users\ikoko\Projects\ZalAssist\vercel-api\api\chat.js` (только структура)
- `c:\Users\ikoko\Projects\ZalAssist\vercel-api\vercel.json`
- `c:\Users\ikoko\Projects\ZalAssist\vercel-api\package.json`
- `c:\Users\ikoko\Projects\ZalAssist\.github\workflows\deploy.yml`
- `c:\Users\ikoko\Projects\ZalAssist\.gitignore`
- `c:\Users\ikoko\Projects\ZalAssist\.npmrc`
