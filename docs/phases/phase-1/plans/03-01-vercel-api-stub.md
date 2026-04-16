---
phase: "1"
plan: "03-01"
name: "vercel-api-stub"
wave: 3
requires:
  - "01-02"
req_ids:
  - DEPLOY-02
  - DEPLOY-03
status: pending
autonomous: true
---

## Objective
Создать две заглушки Vercel Functions на Node.js runtime: `vercel-api/api/chat.js` и `vercel-api/api/notify.js`. Обе поддерживают OPTIONS (CORS preflight) и POST (отвечают `{ ok: true, stub: true, runtime: "nodejs" }`), прочие методы → 405.

## Context
Критично (RESEARCH.md Pitfall #6): у Node.js runtime сигнатура `handler(req, res)` — Express-like (`res.setHeader`, `res.status`, `res.json`), а НЕ Fetch API (`Request → Response`). **Код `chat.js` из ZalAssist копировать нельзя** — там Edge runtime.

Два слоя CORS:
1. Headers в `vercel.json` (уже настроено в 01-02)
2. Дублирование в коде функции (страховка — `vercel.json` headers иногда не применяются к OPTIONS preflight перед выполнением кода)

Тело ответа на POST — stub-объект, который в Фазе 3 будет заменён на реальный стриминговый прокси к OpenRouter. На Фазе 1 важно только то, что:
- GET/PUT/DELETE → 405
- OPTIONS → 204 + CORS headers
- POST → 200 + JSON + CORS headers

`notify.js` — зеркальная заглушка для ORDER-02 (Фаза 4). На Фазе 1 создаётся пустым, чтобы в Фазе 4 не надо было добавлять новый эндпоинт «на живую».

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Decision: Vercel runtime** (готовый код chat.js)

## Tasks

### Task 03-01-01 — vercel-api/api/chat.js
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\vercel-api\api\chat.js`
- **How:** дословно из RESEARCH.md (табы, двойные кавычки, ESM):
	```js
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
- **Done when:** файл существует, содержит `export default async function handler(req, res)`, `setCors`, `OPTIONS`, `res.status(405)`, `{ ok: true, stub: true, runtime: "nodejs" }`

### Task 03-01-02 — vercel-api/api/notify.js
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\vercel-api\api\notify.js`
- **How:** то же самое, что chat.js — одна и та же структура (handler с CORS, OPTIONS, POST → stub response, прочее → 405). Можно оформить как отдельный файл с дублированным кодом (оба независимо редактируются в Фазе 4). Содержимое идентично chat.js.
- **Done when:** файл существует, содержит `export default async function handler(req, res)`, `OPTIONS`, `stub: true`

### Task 03-01-03 — Локальная smoke-проверка (не автоматизирована)
- **What:** Задокументировать в README как проверить заглушки локально
- **Where:** добавить секцию в `c:\Users\ikoko\Projects\table-mind\vercel-api\README.md` (файл уже создан в 01-02)
- **How:** дописать в конец README следующий plain-text блок (без вложенных code fences — используем отступ в 4 пробела для команд):

		## Локальная проверка после npm install

		После первого `vercel login && vercel link` можно запустить:

		    cd vercel-api && vercel dev
		    curl -i -X OPTIONS http://localhost:3000/api/chat
		    curl -i -X POST http://localhost:3000/api/chat -H "Content-Type: application/json" -d '{}'

		Ожидаемо:
		- OPTIONS → HTTP 204 + Access-Control-Allow-Origin: *
		- POST → HTTP 200 + {"ok":true,"stub":true,"runtime":"nodejs"}
		- GET → HTTP 405
- **Done when:** README содержит секцию `Локальная проверка`

## Tests Required
- `test -f vercel-api/api/chat.js`
- `grep -q 'export default async function handler(req, res)' vercel-api/api/chat.js`
- `grep -q 'Access-Control-Allow-Origin' vercel-api/api/chat.js`
- `grep -q '"OPTIONS"' vercel-api/api/chat.js`
- `grep -q '"POST"' vercel-api/api/chat.js`
- `grep -q 'res.status(405)' vercel-api/api/chat.js`
- `grep -q 'stub: true' vercel-api/api/chat.js`
- `grep -q 'runtime: "nodejs"' vercel-api/api/chat.js`
- `test -f vercel-api/api/notify.js`
- `grep -q 'export default async function handler(req, res)' vercel-api/api/notify.js`
- `grep -q 'stub: true' vercel-api/api/notify.js`
- `grep -q 'Локальная проверка' vercel-api/README.md`
- `node --input-type=module -e "import('./vercel-api/api/chat.js').then(m => console.log(typeof m.default === 'function' ? 'OK' : 'FAIL'))"` — smoke-проверка что модуль парсится и экспортирует функцию

## Definition of Done
- [ ] `vercel-api/api/chat.js` создан, Node.js runtime сигнатура (`req, res`)
- [ ] CORS headers установлены в коде функции (дублирование vercel.json)
- [ ] OPTIONS → 204, POST → 200 stub, прочее → 405
- [ ] `vercel-api/api/notify.js` создан зеркально
- [ ] README обновлён секцией локальной проверки
- [ ] Динамический импорт `chat.js` успешно возвращает default-функцию
- [ ] Все grep-проверки проходят
