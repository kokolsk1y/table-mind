---
phase: "2"
plan: "01-02"
name: "catalog-loader"
wave: 1
requires: []
req_ids:
  - MENU-01
status: pending
autonomous: true
---

## Objective
Создать модуль `src/lib/data/catalog.js` — singleton-загрузчик каталога. Функция `loadCatalog()` загружает `catalog.json` один раз, кеширует результат в переменной модуля и возвращает промис с массивом блюд. Также экспортирует `CATEGORY_ORDER` — массив из 14 категорий в правильном порядке (от закусок к напиткам).

## Context
Executor должен читать перед началом:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-2\CONTEXT.md` — паттерн из ZalAssist/src/lib/data/catalog.js
- `c:\Users\ikoko\Projects\table-mind\svelte.config.js` — `paths.base` для корректного URL

Важно: SvelteKit использует `base` path `/table-mind` в production. Fetch URL для catalog.json должен учитывать это: `${base}/catalog.json`. Импортировать `base` из `$app/paths`.

Паттерн singleton:
```js
import { base } from "$app/paths";

let cached = null;

export async function loadCatalog() {
	if (cached) return cached;
	const res = await fetch(`${base}/catalog.json`);
	cached = await res.json();
	return cached;
}
```

## Tasks

### Task 01-02-01 — Создать src/lib/data/catalog.js
- **What:** Создать файл `c:\Users\ikoko\Projects\table-mind\src\lib\data\catalog.js`
- **How:** Модуль с:
  1. `import { base } from "$app/paths";` — для корректного пути к JSON
  2. Переменная модуля `let cached = null;` — кеш загруженного каталога
  3. Экспортируемая функция `loadCatalog()`:
     - Если `cached` не null — возвращает `cached`
     - Иначе: `fetch(`${base}/catalog.json`)`, парсит JSON, сохраняет в `cached`, возвращает
     - Не ловит ошибки (пусть пробрасываются наверх)
  4. Экспортируемый массив `CATEGORY_ORDER` — 14 строк в точном порядке:
     ```js
     export const CATEGORY_ORDER = [
       "Холодные закуски",
       "Тёплые закуски",
       "Салаты",
       "Супы",
       "Рыба и морепродукты",
       "Стейки и мясо",
       "Паста и ризотто",
       "Гарниры",
       "Детское меню",
       "Десерты",
       "Безалкогольные напитки",
       "Авторские коктейли",
       "Вино",
       "Пиво и сидр",
     ];
     ```
  5. Экспортируемый массив `TAG_LIST` — теги для фильтров:
     ```js
     export const TAG_LIST = [
       { key: "vegetarian", label: "Вегетарианское", field: "vegetarian" },
       { key: "spicy", label: "Острое", field: "spicy" },
       { key: "gluten-free", label: "Без глютена", allergen: "глютен" },
     ];
     ```
     Теги `vegetarian` и `spicy` фильтруют по boolean-полю. Тег `gluten-free` фильтрует по отсутствию `"глютен"` в массиве `allergens`.
  6. Стиль: табы для отступов, двойные кавычки, ESM

- **Done when:** файл существует, содержит `loadCatalog`, `CATEGORY_ORDER`, `TAG_LIST`, `$app/paths`

## Tests Required
- `test -f c:/Users/ikoko/Projects/table-mind/src/lib/data/catalog.js`
- `grep -q "export async function loadCatalog" c:/Users/ikoko/Projects/table-mind/src/lib/data/catalog.js`
- `grep -q "CATEGORY_ORDER" c:/Users/ikoko/Projects/table-mind/src/lib/data/catalog.js`
- `grep -q "TAG_LIST" c:/Users/ikoko/Projects/table-mind/src/lib/data/catalog.js`
- `grep -q 'from "\$app/paths"' c:/Users/ikoko/Projects/table-mind/src/lib/data/catalog.js`
- `grep -q "catalog.json" c:/Users/ikoko/Projects/table-mind/src/lib/data/catalog.js`
- `grep -c "Холодные закуски" c:/Users/ikoko/Projects/table-mind/src/lib/data/catalog.js` — должно вернуть 1

## Definition of Done
- [ ] `src/lib/data/catalog.js` создан
- [ ] `loadCatalog()` использует `${base}/catalog.json`
- [ ] Singleton кеширование (повторный вызов не делает fetch)
- [ ] `CATEGORY_ORDER` содержит все 14 категорий в правильном порядке
- [ ] `TAG_LIST` содержит 3 фильтра-тега
- [ ] Табы для отступов, двойные кавычки
