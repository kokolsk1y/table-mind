---
phase: "2"
plan: "01-03"
name: "search-engine"
wave: 1
requires: []
req_ids:
  - MENU-04
status: pending
autonomous: true
---

## Objective
Создать модуль `src/lib/search/engine.js` — обёртка над MiniSearch для полнотекстового поиска по каталогу. Экспортирует функции `buildIndex(items)` для построения индекса и `search(query)` для поиска с fuzzy-matching и prefix. Также установить npm-пакет `minisearch`.

## Context
Executor должен читать перед началом:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-2\CONTEXT.md` — MiniSearch конфигурация: поля, boost, fuzzy, prefix

Конфигурация MiniSearch (из CONTEXT.md):
- Индексируемые поля: `name` (boost 3), `description` (boost 1), `category` (boost 1.5), `tags` (boost 2)
- Поле `id` — идентификатор документа
- `tags` — массив, нужно сконвертировать в строку при индексации
- `fuzzy: 0.2` — нечёткий поиск (допуск 20% ошибок)
- `prefix: true` — поиск по префиксу (начало слова)

Паттерн из ZalAssist (адаптировать для ресторана):
```js
import MiniSearch from "minisearch";

let index = null;

export function buildIndex(items) {
  index = new MiniSearch({
    fields: ["name", "description", "category", "tagsText"],
    storeFields: ["id"],
    searchOptions: {
      boost: { name: 3, tagsText: 2, category: 1.5, description: 1 },
      fuzzy: 0.2,
      prefix: true,
    },
  });
  const docs = items.map(item => ({
    ...item,
    tagsText: item.tags.join(" "),
  }));
  index.addAll(docs);
  return index;
}

export function search(query) {
  if (!index || !query.trim()) return [];
  return index.search(query);
}
```

## Tasks

### Task 01-03-01 — Установить minisearch
- **What:** Добавить `minisearch` в dependencies проекта
- **How:** Выполнить `npm install minisearch` из корня проекта `c:\Users\ikoko\Projects\table-mind`
- **Done when:** `minisearch` появился в `dependencies` (или `devDependencies`) в `package.json`

### Task 01-03-02 — Создать src/lib/search/engine.js
- **What:** Создать файл `c:\Users\ikoko\Projects\table-mind\src\lib\search\engine.js`
- **How:** Модуль с:
  1. `import MiniSearch from "minisearch";`
  2. Переменная модуля `let index = null;`
  3. Экспортируемая функция `buildIndex(items)`:
     - Создаёт новый `MiniSearch` с конфигурацией:
       - `fields: ["name", "description", "category", "tagsText"]`
       - `storeFields: ["id"]` — возвращает только id, полный объект ищем по id в каталоге
       - `searchOptions.boost`: `{ name: 3, tagsText: 2, category: 1.5, description: 1 }`
       - `searchOptions.fuzzy: 0.2`
       - `searchOptions.prefix: true`
     - Маппит `items` в docs: для каждого item добавляет поле `tagsText: item.tags.join(" ")`
     - Вызывает `index.addAll(docs)`
     - Сохраняет в модульную переменную `index`
     - Возвращает `index`
  4. Экспортируемая функция `search(query)`:
     - Если `index` не создан или `query.trim()` пустой — возвращает пустой массив `[]`
     - Иначе: `return index.search(query.trim())` — возвращает массив результатов MiniSearch (каждый с `id`, `score`, `match`)
  5. Стиль: табы для отступов, двойные кавычки, ESM

- **Done when:** файл существует, содержит `MiniSearch`, `buildIndex`, `search`, `fuzzy: 0.2`, `prefix: true`, `boost`

## Tests Required
- `test -f c:/Users/ikoko/Projects/table-mind/src/lib/search/engine.js`
- `grep -q "import MiniSearch" c:/Users/ikoko/Projects/table-mind/src/lib/search/engine.js`
- `grep -q "export function buildIndex" c:/Users/ikoko/Projects/table-mind/src/lib/search/engine.js`
- `grep -q "export function search" c:/Users/ikoko/Projects/table-mind/src/lib/search/engine.js`
- `grep -q "fuzzy: 0.2" c:/Users/ikoko/Projects/table-mind/src/lib/search/engine.js`
- `grep -q "prefix: true" c:/Users/ikoko/Projects/table-mind/src/lib/search/engine.js`
- `grep -q "name: 3" c:/Users/ikoko/Projects/table-mind/src/lib/search/engine.js`
- `grep -q 'from "minisearch"' c:/Users/ikoko/Projects/table-mind/src/lib/search/engine.js`
- `node -e "const pkg=require('./package.json'); if(!pkg.dependencies?.minisearch && !pkg.devDependencies?.minisearch){console.error('minisearch not installed');process.exit(1)}; console.log('OK')"` (из корня проекта)

## Definition of Done
- [ ] `minisearch` установлен как dependency
- [ ] `src/lib/search/engine.js` создан
- [ ] `buildIndex(items)` создаёт индекс с правильными полями и boost
- [ ] `search(query)` возвращает результаты с fuzzy 0.2 и prefix true
- [ ] `tags` массив конвертируется в `tagsText` строку при индексации
- [ ] `storeFields` содержит `["id"]`
- [ ] Табы для отступов, двойные кавычки
