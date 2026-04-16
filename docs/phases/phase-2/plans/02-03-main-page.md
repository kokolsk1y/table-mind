---
phase: "2"
plan: "02-03"
name: "main-page"
wave: 2
requires:
  - "01-01"
  - "01-02"
  - "01-03"
  - "02-01"
  - "02-02"
req_ids:
  - MENU-01
  - MENU-02
  - MENU-03
  - MENU-04
  - UI-04
status: pending
autonomous: true
---

## Objective
Полностью заменить `src/routes/+page.svelte` — из заглушки Фазы 1 в полноценную страницу каталога меню. Страница загружает каталог, строит поисковый индекс, отображает фильтры (категории + теги), поле поиска, сетку карточек с реактивной фильтрацией, и демо-бейдж когда нет `?table`.

## Context
Executor должен читать перед началом:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-2\CONTEXT.md` — все решения
- `c:\Users\ikoko\Projects\table-mind\src\lib\stores\session.svelte.js` — `session.isDemoMode`
- `c:\Users\ikoko\Projects\table-mind\src\lib\data\catalog.js` (создан в 01-02)
- `c:\Users\ikoko\Projects\table-mind\src\lib\search\engine.js` (создан в 01-03)
- `c:\Users\ikoko\Projects\table-mind\src\lib\components\MenuCard.svelte` (создан в 02-01)
- `c:\Users\ikoko\Projects\table-mind\src\lib\components\CategoryFilter.svelte` (создан в 02-02)
- `c:\Users\ikoko\Projects\table-mind\src\lib\components\TagFilter.svelte` (создан в 02-02)

Архитектура страницы:
1. `onMount` — загрузить каталог через `loadCatalog()`, построить индекс через `buildIndex()`
2. Реактивное состояние (Svelte 5 `$state`):
   - `searchQuery` — строка поиска
   - `selectedCategory` — выбранная категория (null = все)
   - `activeTags` — массив активных тегов
   - `catalog` — загруженный массив блюд
3. Derived `$derived` — `filteredItems`:
   - Если `searchQuery` непустой — получить IDs из `search(searchQuery)`, фильтровать каталог по ним
   - Если `selectedCategory` !== null — фильтровать по `category === selectedCategory`
   - Для каждого активного тега:
     - `vegetarian`: оставить только `dish.vegetarian === true`
     - `spicy`: оставить только `dish.spicy === true`
     - `gluten-free`: оставить только блюда где `dish.allergens` НЕ содержит `"глютен"`
   - Результат отсортирован по порядку категорий из `CATEGORY_ORDER`
4. Layout:
   - Хедер: название ресторана «Янтарный берег» + подзаголовок
   - Поле поиска: `input` с placeholder «Поиск блюд...», иконка поиска
   - CategoryFilter компонент
   - TagFilter компонент
   - Сетка карточек: 1 колонка на мобильном, 2 на md+
   - Между категориями: заголовок-разделитель с названием категории
   - Демо-бейдж внизу (sticky bottom) если `session.isDemoMode`
   - Пустое состояние: «Ничего не найдено» когда фильтры отсеяли все
5. Демо-бейдж (UI-04):
   - Sticky к низу экрана
   - Текст: «Отсканируйте QR-код на столе»
   - Стиль: `bg-warning/10 text-warning` или `badge badge-warning`
   - Показывается только при `session.isDemoMode === true`

## Tasks

### Task 02-03-01 — Заменить +page.svelte
- **What:** Полностью переписать файл `c:\Users\ikoko\Projects\table-mind\src\routes\+page.svelte`
- **How:** Svelte 5 компонент со следующей структурой:

  **Script блок:**
  ```js
  import { onMount } from "svelte";
  import { session } from "$lib/stores/session.svelte.js";
  import { loadCatalog, CATEGORY_ORDER, TAG_LIST } from "$lib/data/catalog.js";
  import { buildIndex, search } from "$lib/search/engine.js";
  import MenuCard from "$lib/components/MenuCard.svelte";
  import CategoryFilter from "$lib/components/CategoryFilter.svelte";
  import TagFilter from "$lib/components/TagFilter.svelte";

  let catalog = $state([]);
  let searchQuery = $state("");
  let selectedCategory = $state(null);
  let activeTags = $state([]);
  let loading = $state(true);

  onMount(async () => {
    catalog = await loadCatalog();
    buildIndex(catalog);
    loading = false;
  });

  function toggleTag(key) {
    if (activeTags.includes(key)) {
      activeTags = activeTags.filter(t => t !== key);
    } else {
      activeTags = [...activeTags, key];
    }
  }

  function applyTagFilter(items, tags) {
    let result = items;
    for (const key of tags) {
      const tagDef = TAG_LIST.find(t => t.key === key);
      if (!tagDef) continue;
      if (tagDef.field) {
        result = result.filter(item => item[tagDef.field] === true);
      } else if (tagDef.allergen) {
        result = result.filter(item => !item.allergens.includes(tagDef.allergen));
      }
    }
    return result;
  }

  let filteredItems = $derived.by(() => {
    let items = catalog;

    // Поиск
    if (searchQuery.trim()) {
      const results = search(searchQuery);
      const ids = new Set(results.map(r => r.id));
      items = items.filter(item => ids.has(item.id));
    }

    // Категория
    if (selectedCategory) {
      items = items.filter(item => item.category === selectedCategory);
    }

    // Теги
    if (activeTags.length > 0) {
      items = applyTagFilter(items, activeTags);
    }

    return items;
  });

  // Группировка по категориям для отображения с разделителями
  let groupedItems = $derived.by(() => {
    const groups = [];
    const catOrder = selectedCategory ? [selectedCategory] : CATEGORY_ORDER;
    for (const cat of catOrder) {
      const catItems = filteredItems.filter(item => item.category === cat);
      if (catItems.length > 0) {
        groups.push({ category: cat, items: catItems });
      }
    }
    return groups;
  });
  ```

  **Template:**
  - Если `loading`: показать skeleton/spinner (DaisyUI `loading loading-dots`)
  - Хедер: `<header>` с `<h1>Янтарный берег</h1>` и подзаголовком
  - Поиск: `<div class="px-4 py-2">` с `<input type="search" class="input input-bordered w-full" placeholder="Поиск блюд..." bind:value={searchQuery} />`
  - `<CategoryFilter selected={selectedCategory} onchange={(cat) => selectedCategory = cat} />`
  - `<TagFilter active={activeTags} ontoggle={toggleTag} />`
  - Основной контент: `{#each groupedItems as group}` с заголовком категории `<h2>` и сеткой `<div class="grid grid-cols-1 md:grid-cols-2 gap-4 px-4">` с `{#each group.items as dish}` `<MenuCard {dish} onclick={() => {}} />`
  - Пустое состояние: `{#if !loading && filteredItems.length === 0}` — «Ничего не найдено. Попробуйте изменить фильтры.»
  - Демо-бейдж: `{#if session.isDemoMode}` — sticky bottom bar с текстом «Отсканируйте QR-код на столе»

  **Конкретная разметка демо-бейджа:**
  ```svelte
  {#if session.isDemoMode}
    <div class="fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-300 p-3 text-center safe-bottom z-50">
      <div class="badge badge-warning badge-lg gap-2">
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="w-4 h-4 stroke-current">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        Отсканируйте QR-код на столе
      </div>
    </div>
  {/if}
  ```

  - Добавить `pb-20` к основному контейнеру если `session.isDemoMode` — чтобы контент не перекрывался бейджем

- **Done when:** файл полностью заменён, содержит `loadCatalog`, `buildIndex`, `search`, `MenuCard`, `CategoryFilter`, `TagFilter`, `isDemoMode`, `filteredItems`, `groupedItems`, `searchQuery`, `selectedCategory`, `activeTags`, `Янтарный берег`, `QR-код`

## Tests Required
- `grep -q "loadCatalog" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "buildIndex" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "search" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "MenuCard" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "CategoryFilter" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "TagFilter" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "isDemoMode" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "filteredItems" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "searchQuery" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "selectedCategory" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "activeTags" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "Янтарный берег" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "QR-код" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`
- `grep -q "Ничего не найдено" c:/Users/ikoko/Projects/table-mind/src/routes/+page.svelte`

## Definition of Done
- [ ] `src/routes/+page.svelte` полностью заменён (не содержит «Меню загружается...» из Фазы 1)
- [ ] Каталог загружается через `loadCatalog()` в `onMount`
- [ ] Поисковый индекс строится через `buildIndex()`
- [ ] Поиск работает реактивно при вводе в поле
- [ ] Фильтр по категориям через CategoryFilter
- [ ] Фильтр по тегам через TagFilter (комбинируется с категорией)
- [ ] Карточки отображаются через MenuCard в сетке 1/2 колонки
- [ ] Группировка по категориям с заголовками-разделителями
- [ ] Пустое состояние «Ничего не найдено»
- [ ] Демо-бейдж при `isDemoMode` — sticky bottom, «Отсканируйте QR-код на столе»
- [ ] Loading state на время загрузки каталога
- [ ] Svelte 5 синтаксис: `$state`, `$derived`, `$props()`
