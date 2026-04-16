---
phase: "1"
plan: "01-01"
name: "project-scaffold"
wave: 1
requires: []
req_ids:
  - DEPLOY-01
status: pending
autonomous: true
---

## Objective
Создать корневую файловую структуру SvelteKit-проекта: `package.json` с точными версиями из RESEARCH.md, служебные файлы (`.npmrc`, `.gitignore`, `jsconfig.json`) и пустые директории под будущий код.

## Context
Первый плагинный шаг Фазы 1. В репо пока только `docs/`, `ROADMAP.md`, `tasks.json` и служебные файлы. Нужно скопировать проверенный паттерн из ZalAssist (`c:\Users\ikoko\Projects\ZalAssist\package.json`, `.gitignore`, `.npmrc`), поменять имя, добавить `sharp`, `qrcode`, `pdfkit` в devDependencies.

Executor должен:
- Читать `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` (раздел **Технические заметки → Версии** и **Existing Patterns to Follow**)
- Читать `c:\Users\ikoko\Projects\ZalAssist\package.json`, `c:\Users\ikoko\Projects\ZalAssist\.gitignore`, `c:\Users\ikoko\Projects\ZalAssist\.npmrc`, `c:\Users\ikoko\Projects\ZalAssist\jsconfig.json` как референс
- Использовать табы для отступов в JSON (convention ZalAssist)

## Tasks

### Task 01-01-01 — package.json (root)
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\package.json`
- **Where:** корень репо
- **How:**
	- `"name": "table-mind"`, `"version": "0.1.0"`, `"private": true`, `"type": "module"`
	- `scripts`: `"dev": "vite dev"`, `"build": "vite build"`, `"preview": "vite preview"`, `"check": "svelte-kit sync && svelte-check --tsconfig ./jsconfig.json"`, `"generate:icons": "node scripts/generate-icons.js"`, `"generate:qr": "node scripts/generate-qr.js"`
	- `devDependencies` (точные версии из RESEARCH.md раздел «Версии»):
		- `@sveltejs/adapter-static`: `^3.0.10`
		- `@sveltejs/kit`: `^2.50.2`
		- `@sveltejs/vite-plugin-svelte`: `^6.2.4`
		- `@vite-pwa/sveltekit`: `^1.1.0`
		- `svelte`: `^5.54.0`
		- `svelte-check`: `^4.0.0`
		- `vite`: `^7.3.1`
		- `@tailwindcss/vite`: `^4.2.2`
		- `tailwindcss`: `^4.2.2`
		- `sharp`: `^0.33.0`
		- `qrcode`: `^1.5.3`
		- `pdfkit`: `^0.15.0`
	- `dependencies`:
		- `daisyui`: `^5.5.19`
	- `engines`: `{ "node": ">=20.0.0" }`
	- Отступы — табами
- **Done when:** файл существует, валидный JSON, `jq .name` возвращает `"table-mind"`

### Task 01-01-02 — .npmrc
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\.npmrc`
- **How:** одна строка `engine-strict=true`
- **Done when:** файл существует, содержит строку `engine-strict=true`

### Task 01-01-03 — .gitignore
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\.gitignore`
- **How:** скопировать содержимое `c:\Users\ikoko\Projects\ZalAssist\.gitignore`. Убедиться что игнорируются: `node_modules`, `build`, `.svelte-kit`, `.vercel`, `.env*` (кроме `.env.example`), `*.log`, `.DS_Store`. Добавить `qr-output/` (выход скрипта QR не коммитится).
- **Done when:** файл существует, содержит строки `node_modules`, `build`, `.svelte-kit`, `.vercel`, `qr-output`

### Task 01-01-04 — jsconfig.json
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\jsconfig.json`
- **How:** скопировать из ZalAssist; ключевые опции:
	- `"extends": "./.svelte-kit/tsconfig.json"`
	- `"compilerOptions"`: `"allowJs": true`, `"checkJs": true`, `"esModuleInterop": true`, `"forceConsistentCasingInFileNames": true`, `"resolveJsonModule": true`, `"skipLibCheck": true`, `"sourceMap": true`, `"strict": true`, `"moduleResolution": "bundler"`
- **Done when:** файл существует, валидный JSON, содержит `".svelte-kit/tsconfig.json"` в extends

### Task 01-01-05 — Пустая структура директорий
- **What:** Создать пустые директории под будущий код
- **Where:**
	- `c:\Users\ikoko\Projects\table-mind\src\routes`
	- `c:\Users\ikoko\Projects\table-mind\src\lib\stores`
	- `c:\Users\ikoko\Projects\table-mind\src\lib\components`
	- `c:\Users\ikoko\Projects\table-mind\static\icons`
	- `c:\Users\ikoko\Projects\table-mind\scripts`
- **How:** `mkdir -p` для каждой; в пустые директории положить `.gitkeep` чтобы git зафиксировал (кроме `static/icons` — туда будут файлы от Wave 3)
- **Done when:** все директории существуют

## Tests Required
- `test -f package.json && node --input-type=commonjs -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"` — валидный JSON
- `grep -q '"name": "table-mind"' package.json`
- `grep -q '"adapter-static"' package.json`
- `grep -q '"sharp"' package.json`
- `grep -q '"qrcode"' package.json`
- `grep -q '"daisyui"' package.json`
- `test -f .npmrc && grep -q 'engine-strict=true' .npmrc`
- `test -f .gitignore && grep -q 'node_modules' .gitignore && grep -q 'qr-output' .gitignore`
- `test -f jsconfig.json`
- `test -d src/routes && test -d src/lib/stores && test -d static && test -d scripts`

## Definition of Done
- [ ] `package.json` создан со всеми зависимостями из RESEARCH.md
- [ ] `.npmrc`, `.gitignore`, `jsconfig.json` созданы
- [ ] Структура директорий `src/routes`, `src/lib/stores`, `src/lib/components`, `static/icons`, `scripts` создана
- [ ] `node --input-type=commonjs -e "JSON.parse(require('fs').readFileSync('package.json','utf8'))"` проходит без ошибок
- [ ] Все команды из «Tests Required» возвращают успех
