---
phase: "1"
plan: "02-05"
name: "layout-and-page"
wave: 3
requires:
  - "02-01"
  - "02-02"
  - "02-03"
  - "02-04"
req_ids:
  - QR-02
  - UI-01
  - UI-02
status: pending
autonomous: true
---

## Objective
Создать `src/routes/+layout.svelte` (читает `?table` из URL → пишет в sessionStorage и session store; импортирует `app.css`) и `src/routes/+page.svelte` (заглушка с приветствием «TableMind — добро пожаловать»).

## Context
Это сердце фичи QR-02 — передача номера стола через sessionStorage. Логика:
1. В `onMount` прочитать `sessionStorage.getItem("tableNumber")` — если уже есть, восстановить в стор (гость вернулся после перехода по ссылкам)
2. Прочитать `?table=N` из `window.location.search` — если есть и валидно (только цифры), записать в стор и в sessionStorage (перезаписывает предыдущее значение — это намеренно, свежий QR имеет приоритет)
3. Определить standalone-режим (PWA запущена как приложение) через `matchMedia("(display-mode: standalone)")` и `window.navigator.standalone` (iOS) → добавить класс `pwa-standalone` на `<html>` (для будущих стилей Фазы 3)

**Критически важно**: ВСЯ работа с `window`/`sessionStorage`/`matchMedia` — ТОЛЬКО внутри `onMount` (Pitfall #3). В SSR-контексте prerender эти API отсутствуют.

Валидация `?table`: принимаются только цифры (`/^\d+$/`). Пустые/мусорные значения игнорируются — остаётся демо-режим.

Стартовая страница (+page.svelte) — минимальная заглушка с DaisyUI-классами, чтобы визуально проверить тему.

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md`:
	- раздел **Code Examples → src/routes/+layout.svelte** (готовый код)
	- раздел **Pitfalls to Avoid** пункт 3

## Tasks

### Task 02-05-01 — src/routes/+layout.svelte
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\src\routes\+layout.svelte`
- **How:** дословно из RESEARCH.md раздел «Code Examples → +layout.svelte»:
	- `<script>`:
		- `import "../app.css";`
		- `import { onMount } from "svelte";`
		- `import { session } from "$lib/stores/session.svelte.js";`
		- `let { children } = $props();`
		- `onMount(() => { ... })`:
			1. `const stored = sessionStorage.getItem("tableNumber");` → если truthy → `session.setTable(stored);`
			2. `const url = new URL(window.location.href);` → `const tableParam = url.searchParams.get("table");`
			3. Если `tableParam` и `/^\d+$/.test(cleaned)` → `session.setTable(cleaned); sessionStorage.setItem("tableNumber", cleaned);`
			4. Определение standalone: `const standalone = window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true;` → если `true` → `document.documentElement.classList.add("pwa-standalone");`
	- `<svelte:head>`:
		- `<title>TableMind — AI-официант</title>`
		- `<meta name="description" content="AI-помощник в ресторане. Меню, рекомендации, вызов официанта." />`
		- `<meta name="theme-color" content="#0e0e0e" />`
	- `<main class="min-h-screen bg-base-100 text-base-content">{@render children()}</main>`
	- Табы, двойные кавычки
- **Done when:** файл существует, содержит `import "../app.css"`, `onMount`, `sessionStorage.setItem`, `searchParams.get("table")`, `/^\\d+\$/`, `session.setTable`, `{@render children()}`

### Task 02-05-02 — src/routes/+page.svelte
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\src\routes\+page.svelte`
- **How:** минимальная заглушка (табы, двойные кавычки):
	```svelte
	<script>
		import { session } from "$lib/stores/session.svelte.js";
	</script>

	<section class="min-h-screen flex flex-col items-center justify-center gap-6 p-6 text-center">
		<h1 class="text-4xl font-bold text-primary">TableMind</h1>
		<p class="text-lg text-base-content/80 max-w-md">
			AI-помощник в ресторане. Меню, рекомендации, вызов официанта.
		</p>
		{#if session.isDemoMode}
			<div class="badge badge-warning badge-lg">Демо-режим</div>
		{:else}
			<div class="badge badge-primary badge-lg">Стол №{session.tableNumber}</div>
		{/if}
	</section>
	```
- **Done when:** файл существует, содержит импорт `session`, рендер `session.isDemoMode` и `session.tableNumber`

## Tests Required
- `test -f src/routes/+layout.svelte`
- `grep -q 'import "../app.css"' src/routes/+layout.svelte`
- `grep -q 'onMount' src/routes/+layout.svelte`
- `grep -q 'sessionStorage' src/routes/+layout.svelte`
- `grep -q 'searchParams.get("table")' src/routes/+layout.svelte`
- `grep -q 'session.setTable' src/routes/+layout.svelte`
- `grep -q '@render children' src/routes/+layout.svelte`
- `grep -q 'display-mode: standalone' src/routes/+layout.svelte`
- `grep -q 'theme-color' src/routes/+layout.svelte`
- `test -f src/routes/+page.svelte`
- `grep -q 'TableMind' src/routes/+page.svelte`
- `grep -q 'session.isDemoMode' src/routes/+page.svelte`
- `grep -q 'session.tableNumber' src/routes/+page.svelte`

## Definition of Done
- [ ] `src/routes/+layout.svelte` создан
- [ ] Импортирует `app.css` и `session` store
- [ ] Вся работа с `window`/`sessionStorage` — внутри `onMount`
- [ ] Валидация `?table` регулярным выражением `/^\d+$/`
- [ ] При наличии валидного `?table` значение пишется в `session` и `sessionStorage`
- [ ] Standalone-режим детектируется и добавляет класс `pwa-standalone`
- [ ] `src/routes/+page.svelte` создан и отображает разное содержимое для демо/стола
- [ ] Все grep-проверки проходят
