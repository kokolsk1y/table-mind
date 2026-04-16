---
phase: "1"
plan: "02-04"
name: "session-store"
wave: 2
requires:
  - "01-01"
req_ids:
  - QR-02
status: pending
autonomous: true
---

## Objective
Создать Svelte 5 class-based singleton `src/lib/stores/session.svelte.js` с реактивными полями `tableNumber` и `currentMode`, геттером `isDemoMode` и методами `setTable`/`setMode`/`clear`. Это единый источник истины о сессии гостя — используется в `+layout.svelte` для сохранения номера стола и в следующих фазах для CallWaiterButton.

## Context
Паттерн Svelte 5 runes (`$state`) — идиоматичнее, чем `writable()` из Svelte 4. Class-based подход удобнее для singleton: экземпляр создаётся один раз при импорте модуля.

Правило: стор не обращается к `sessionStorage` сам. Логика записи/чтения — в `+layout.svelte` (потому что `sessionStorage` доступен только в браузере и только в `onMount` — Pitfall #3 из RESEARCH.md).

Контракт (см. RESEARCH.md «Outputs»):
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

Executor должен читать:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-1\RESEARCH.md` раздел **Integration Points → Outputs**
- `c:\Users\ikoko\Projects\ZalAssist\src\lib\stores\cart.svelte.js` (паттерн Svelte 5 class + `$state` как референс)

## Tasks

### Task 02-04-01 — session.svelte.js
- **What:** Создать `c:\Users\ikoko\Projects\table-mind\src\lib\stores\session.svelte.js`
- **How:** класс `SessionState` с:
	- `tableNumber = $state(null)` — `null` = демо-режим, иначе строка с номером стола
	- `currentMode = $state("menu")` — текущий экран (`"menu"` | `"chat"` | `"quiz"`); на Фазе 1 используется только `"menu"`
	- Getter `isDemoMode`: возвращает `this.tableNumber === null`
	- Метод `setTable(num)`: `this.tableNumber = String(num)` (принимает и число, и строку; всегда сохраняет строкой — иначе QR-01 сравнение упадёт)
	- Метод `setMode(mode)`: `this.currentMode = mode`
	- Метод `clear()`: сбрасывает оба поля к дефолтам
	- В конце файла: `export const session = new SessionState();` (singleton)
	- JSDoc-аннотации для методов — по желанию, не обязательно
	- Двойные кавычки, табы, ESM
- **Done when:** файл существует, содержит `class SessionState`, `$state(null)`, `$state("menu")`, `get isDemoMode`, `setTable`, `setMode`, `clear`, `export const session`

## Tests Required
- `test -f src/lib/stores/session.svelte.js`
- `grep -q 'class SessionState' src/lib/stores/session.svelte.js`
- `grep -q '\$state(null)' src/lib/stores/session.svelte.js`
- `grep -q '\$state("menu")' src/lib/stores/session.svelte.js`
- `grep -q 'get isDemoMode' src/lib/stores/session.svelte.js`
- `grep -q 'setTable' src/lib/stores/session.svelte.js`
- `grep -q 'setMode' src/lib/stores/session.svelte.js`
- `grep -q 'clear()' src/lib/stores/session.svelte.js`
- `grep -q 'export const session' src/lib/stores/session.svelte.js`
- `grep -q 'String(num)' src/lib/stores/session.svelte.js`

## Definition of Done
- [ ] `src/lib/stores/session.svelte.js` создан
- [ ] Использует runes (`$state`) — не `writable`
- [ ] `tableNumber` инициализирован `null` (демо-режим по умолчанию)
- [ ] `setTable` приводит вход к строке через `String()`
- [ ] Экспортируется singleton `session`
- [ ] Никаких обращений к `sessionStorage` / `window` / `document` внутри стора
