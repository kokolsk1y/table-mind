---
phase: "2"
plan: "03-02"
name: "build-verify"
wave: 3
requires:
  - "01-01"
  - "01-02"
  - "01-03"
  - "02-01"
  - "02-02"
  - "02-03"
  - "03-01"
req_ids:
  - MENU-01
  - MENU-02
  - MENU-03
  - MENU-04
  - AI-06
  - UI-03
  - UI-04
status: pending
autonomous: true
---

## Objective
Проверить что проект собирается без ошибок (`npm run build`), все артефакты Фазы 2 на месте, каталог валиден, поисковый движок подключён, компоненты используют правильный синтаксис. Это финальная верификация перед отметкой Фазы 2 как complete.

## Context
Executor должен читать перед началом:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-2\CONTEXT.md` — полный список ожидаемых артефактов
- `c:\Users\ikoko\Projects\table-mind\docs\ROADMAP.md` — критерии готовности Фазы 2

Критерии готовности из ROADMAP.md:
1. catalog.json содержит >= 30 позиций с заполненными полями включая allergens
2. Поиск по «том» находит «Том-ям» при 1 опечатке (fuzzy) — проверяется визуально при preview
3. Открытие без `?table` — демо-бейдж отображается
4. `npm run build` завершается без ошибок

## Tasks

### Task 03-02-01 — npm run build
- **What:** Собрать проект и убедиться в отсутствии ошибок
- **How:** Выполнить `cd c:/Users/ikoko/Projects/table-mind && npm run build` из корня проекта. Команда должна завершиться с кодом 0. Если есть ошибки — исправить и пересобрать.
- **Done when:** `npm run build` выходит с кодом 0

### Task 03-02-02 — Валидация catalog.json
- **What:** Проверить полноту и корректность каталога
- **How:** Выполнить серию Node.js проверок:
  ```bash
  cd c:/Users/ikoko/Projects/table-mind

  # Проверка количества
  node -e "const d=require('./static/catalog.json'); console.log('Items:', d.length); if(d.length<40) {console.error('FAIL: <40 items'); process.exit(1)}"

  # Проверка полей
  node -e "const d=require('./static/catalog.json'); const f=['id','name','category','description','price','photo','tags','allergens','weight','spicy','vegetarian']; let ok=true; d.forEach((item,i)=>{f.forEach(k=>{if(!(k in item)){console.error('Missing',k,'in',item.id||i);ok=false}})}); if(!ok)process.exit(1); console.log('Fields OK')"

  # Проверка allergens — массив для каждого
  node -e "const d=require('./static/catalog.json'); let ok=true; d.forEach(item=>{if(!Array.isArray(item.allergens)){console.error('allergens not array:',item.id);ok=false}}); if(!ok)process.exit(1); console.log('Allergens OK')"

  # Проверка уникальности id
  node -e "const d=require('./static/catalog.json'); const ids=d.map(i=>i.id); const u=new Set(ids); if(u.size!==ids.length){console.error('Duplicate IDs'); process.exit(1)}; console.log('IDs unique')"

  # Проверка категорий
  node -e "const d=require('./static/catalog.json'); const cats=[...new Set(d.map(i=>i.category))]; console.log('Categories ('+cats.length+'):', cats.join(', ')); if(cats.length<12) process.exit(1)"
  ```
- **Done when:** все 5 проверок проходят

### Task 03-02-03 — Проверка артефактов
- **What:** Убедиться что все файлы Фазы 2 существуют
- **How:** Проверить существование каждого файла:
  ```bash
  cd c:/Users/ikoko/Projects/table-mind
  test -f static/catalog.json && echo "OK catalog.json" || echo "FAIL catalog.json"
  test -f src/lib/data/catalog.js && echo "OK catalog.js" || echo "FAIL catalog.js"
  test -f src/lib/search/engine.js && echo "OK engine.js" || echo "FAIL engine.js"
  test -f src/lib/components/MenuCard.svelte && echo "OK MenuCard" || echo "FAIL MenuCard"
  test -f src/lib/components/CategoryFilter.svelte && echo "OK CategoryFilter" || echo "FAIL CategoryFilter"
  test -f src/lib/components/TagFilter.svelte && echo "OK TagFilter" || echo "FAIL TagFilter"
  test -d static/photos && echo "OK photos dir" || echo "FAIL photos dir"
  ```
- **Done when:** все файлы существуют, нет FAIL

### Task 03-02-04 — Проверка ключевых импортов в +page.svelte
- **What:** Убедиться что главная страница импортирует все необходимые модули
- **How:** Серия grep-проверок:
  ```bash
  cd c:/Users/ikoko/Projects/table-mind
  grep -q "loadCatalog" src/routes/+page.svelte && echo "OK loadCatalog" || echo "FAIL loadCatalog"
  grep -q "buildIndex" src/routes/+page.svelte && echo "OK buildIndex" || echo "FAIL buildIndex"
  grep -q "MenuCard" src/routes/+page.svelte && echo "OK MenuCard" || echo "FAIL MenuCard"
  grep -q "CategoryFilter" src/routes/+page.svelte && echo "OK CategoryFilter" || echo "FAIL CategoryFilter"
  grep -q "TagFilter" src/routes/+page.svelte && echo "OK TagFilter" || echo "FAIL TagFilter"
  grep -q "isDemoMode" src/routes/+page.svelte && echo "OK isDemoMode" || echo "FAIL isDemoMode"
  grep -q "Янтарный берег" src/routes/+page.svelte && echo "OK restaurant name" || echo "FAIL restaurant name"
  ```
- **Done when:** все 7 проверок — OK

### Task 03-02-05 — Проверка minisearch в зависимостях
- **What:** Убедиться что minisearch установлен
- **How:** `grep -q "minisearch" c:/Users/ikoko/Projects/table-mind/package.json && echo "OK" || echo "FAIL"`
- **Done when:** minisearch присутствует в package.json

## Tests Required
- `cd c:/Users/ikoko/Projects/table-mind && npm run build` — код выхода 0
- Все проверки из Task 03-02-02 проходят
- Все проверки из Task 03-02-03 проходят
- Все проверки из Task 03-02-04 проходят

## Definition of Done
- [ ] `npm run build` завершается без ошибок
- [ ] `static/catalog.json` содержит >= 40 позиций с правильными полями
- [ ] Все файлы Фазы 2 существуют на месте
- [ ] `minisearch` установлен как dependency
- [ ] `+page.svelte` импортирует все компоненты и модули
- [ ] Демо-бейдж присутствует в разметке
- [ ] `static/photos/` содержит WebP placeholder-файлы
