---
phase: "1"
plan: "01-02"
name: "vercel-api-scaffold"
wave: 1
requires: []
req_ids:
  - DEPLOY-02
  - DEPLOY-03
status: pending
autonomous: true
---

## Objective
Создать каркас `vercel-api/` — отдельный npm-пакет с собственным `package.json` и `vercel.json`, который Vercel будет собирать независимо от SvelteKit (Root Directory = `vercel-api`).

## Context
Решение из CONTEXT.md: monorepo, Vercel смотрит в подпапку `vercel-api/`. На Фазе 1 подготавливаем только каркас без самих хендлеров — хендлеры (`chat.js`, `notify.js`) добавляются в Wave 3 (плагин 03-01). Тут только `package.json`, `vercel.json` с CORS и регионом `fra1`.

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Decision: Vercel runtime**
- `c:\Users\ikoko\Projects\ZalAssist\vercel-api\package.json` и `c:\Users\ikoko\Projects\ZalAssist\vercel-api\vercel.json` как референс

## Tasks

### Task 01-02-01 — Директория vercel-api
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\vercel-api\` с поддиректорией `api\`
- **How:** `mkdir -p vercel-api/api`; в пустую `api/` положить `.gitkeep`
- **Done when:** `test -d vercel-api/api`

### Task 01-02-02 — vercel-api/package.json
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\vercel-api\package.json`
- **How:** содержимое (отступы табами):
	```json
	{
		"name": "table-mind-api",
		"version": "1.0.0",
		"private": true,
		"type": "module"
	}
	```
- **Done when:** валидный JSON, `grep -q 'table-mind-api' vercel-api/package.json`

### Task 01-02-03 — vercel-api/vercel.json (CORS + fra1)
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\vercel-api\vercel.json`
- **How:** из RESEARCH.md раздел **Decision: Vercel runtime**, с отступами табами:
	```json
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
- **Done when:** валидный JSON, содержит `"fra1"` и `"Access-Control-Allow-Origin"`

### Task 01-02-04 — README-заметка про Root Directory
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\vercel-api\README.md`
- **How:** короткая инструкция (2-3 абзаца, русский):
	- «Этот подкаталог — отдельный проект Vercel»
	- «При подключении в UI Vercel обязательно установить **Root Directory = `vercel-api`**, иначе Vercel попытается собрать SvelteKit из корня и упадёт»
	- «Регион — `fra1`, runtime — Node.js (default)»
- **Done when:** файл существует, содержит `Root Directory` и `vercel-api`

## Tests Required
- `test -f vercel-api/package.json && node -e "JSON.parse(require('fs').readFileSync('vercel-api/package.json','utf8'))"`
- `grep -q '"name": "table-mind-api"' vercel-api/package.json`
- `grep -q '"type": "module"' vercel-api/package.json`
- `test -f vercel-api/vercel.json && node -e "JSON.parse(require('fs').readFileSync('vercel-api/vercel.json','utf8'))"`
- `grep -q '"fra1"' vercel-api/vercel.json`
- `grep -q 'Access-Control-Allow-Origin' vercel-api/vercel.json`
- `test -d vercel-api/api`
- `test -f vercel-api/README.md && grep -q 'Root Directory' vercel-api/README.md`

## Definition of Done
- [ ] Каталог `vercel-api/api/` существует
- [ ] `vercel-api/package.json` валидный, `name = table-mind-api`, `type = module`
- [ ] `vercel-api/vercel.json` содержит регион `fra1` и CORS headers
- [ ] `vercel-api/README.md` предупреждает про Root Directory
- [ ] Все команды из «Tests Required» проходят
