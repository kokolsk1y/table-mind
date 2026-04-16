---
phase: "2"
plan: "02-02"
name: "filter-components"
wave: 2
requires:
  - "01-02"
req_ids:
  - MENU-02
  - MENU-03
status: pending
autonomous: true
---

## Objective
Создать два компонента фильтрации: `CategoryFilter.svelte` (горизонтальный скролл чипов по категориям) и `TagFilter.svelte` (toggle-чипы для тегов: вегетарианское, острое, без глютена). Оба компонента принимают текущее состояние и пробрасывают события изменения наверх.

## Context
Executor должен читать перед началом:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-2\CONTEXT.md` — Фильтры UI: чипы
- `c:\Users\ikoko\Projects\table-mind\src\lib\data\catalog.js` (будет создан в 01-02) — `CATEGORY_ORDER`, `TAG_LIST`

Дизайн из CONTEXT.md:
- Первый ряд: горизонтальный скролл чипов-категорий. Первый чип «Все» (сброс фильтра). Активный чип — `btn-primary`, неактивные — `btn-ghost`
- Второй ряд: toggle-чипы тегов. Активный — `badge-primary`, неактивный — `badge-outline`. Можно включить несколько одновременно.
- На мобильном горизонтальный скролл: `overflow-x-auto`, `scrollbar-hide`, `flex-nowrap`
- Отступы: `gap-2`, `px-4` для padding по краям

## Tasks

### Task 02-02-01 — Создать CategoryFilter.svelte
- **What:** Создать файл `c:\Users\ikoko\Projects\table-mind\src\lib\components\CategoryFilter.svelte`
- **How:** Svelte 5 компонент:
  1. `<script>` блок:
     ```js
     import { CATEGORY_ORDER } from "$lib/data/catalog.js";
     let { selected = null, onchange } = $props();
     ```
     - `selected` — строка с текущей выбранной категорией или `null` (все)
     - `onchange(category)` — callback, вызывается при клике. Передаёт строку категории или `null`
  2. Шаблон:
     ```svelte
     <div class="flex gap-2 overflow-x-auto px-4 py-2 scrollbar-hide">
       <button
         class="btn btn-sm shrink-0 {selected === null ? 'btn-primary' : 'btn-ghost'}"
         onclick={() => onchange(null)}
       >
         Все
       </button>
       {#each CATEGORY_ORDER as cat}
         <button
           class="btn btn-sm shrink-0 {selected === cat ? 'btn-primary' : 'btn-ghost'}"
           onclick={() => onchange(cat)}
         >
           {cat}
         </button>
       {/each}
     </div>
     ```
  3. Добавить CSS в `<style>` для скрытия скроллбара:
     ```css
     .scrollbar-hide::-webkit-scrollbar { display: none; }
     .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }
     ```
  4. Стиль: табы, двойные кавычки

- **Done when:** файл существует, содержит `CATEGORY_ORDER`, `$props()`, `overflow-x-auto`, `btn-primary`, `btn-ghost`

### Task 02-02-02 — Создать TagFilter.svelte
- **What:** Создать файл `c:\Users\ikoko\Projects\table-mind\src\lib\components\TagFilter.svelte`
- **How:** Svelte 5 компонент:
  1. `<script>` блок:
     ```js
     import { TAG_LIST } from "$lib/data/catalog.js";
     let { active = [], ontoggle } = $props();
     ```
     - `active` — массив строк с ключами активных тегов (e.g., `["vegetarian", "gluten-free"]`)
     - `ontoggle(key)` — callback, вызывается при клике на тег. Родитель решает добавить/убрать
  2. Шаблон:
     ```svelte
     <div class="flex gap-2 px-4 py-1 flex-wrap">
       {#each TAG_LIST as tag}
         <button
           class="badge badge-lg cursor-pointer transition-colors
                  {active.includes(tag.key) ? 'badge-primary' : 'badge-outline'}"
           onclick={() => ontoggle(tag.key)}
         >
           {tag.label}
         </button>
       {/each}
     </div>
     ```
  3. Стиль: табы, двойные кавычки, без `<style>` блока

- **Done when:** файл существует, содержит `TAG_LIST`, `$props()`, `badge-primary`, `badge-outline`, `ontoggle`

## Tests Required
- `test -f c:/Users/ikoko/Projects/table-mind/src/lib/components/CategoryFilter.svelte`
- `test -f c:/Users/ikoko/Projects/table-mind/src/lib/components/TagFilter.svelte`
- `grep -q "CATEGORY_ORDER" c:/Users/ikoko/Projects/table-mind/src/lib/components/CategoryFilter.svelte`
- `grep -q "TAG_LIST" c:/Users/ikoko/Projects/table-mind/src/lib/components/TagFilter.svelte`
- `grep -q '\$props()' c:/Users/ikoko/Projects/table-mind/src/lib/components/CategoryFilter.svelte`
- `grep -q '\$props()' c:/Users/ikoko/Projects/table-mind/src/lib/components/TagFilter.svelte`
- `grep -q "overflow-x-auto" c:/Users/ikoko/Projects/table-mind/src/lib/components/CategoryFilter.svelte`
- `grep -q "btn-primary" c:/Users/ikoko/Projects/table-mind/src/lib/components/CategoryFilter.svelte`
- `grep -q "badge-primary" c:/Users/ikoko/Projects/table-mind/src/lib/components/TagFilter.svelte`
- `grep -q "badge-outline" c:/Users/ikoko/Projects/table-mind/src/lib/components/TagFilter.svelte`

## Definition of Done
- [ ] `src/lib/components/CategoryFilter.svelte` создан
- [ ] `src/lib/components/TagFilter.svelte` создан
- [ ] CategoryFilter: горизонтальный скролл с чипом «Все» + 14 категорий
- [ ] CategoryFilter: активная категория выделена `btn-primary`
- [ ] TagFilter: 3 toggle-чипа (Вегетарианское, Острое, Без глютена)
- [ ] TagFilter: активные теги выделены `badge-primary`
- [ ] Оба компонента используют Svelte 5 `$props()`
- [ ] Скроллбар скрыт на CategoryFilter
- [ ] Табы, двойные кавычки
