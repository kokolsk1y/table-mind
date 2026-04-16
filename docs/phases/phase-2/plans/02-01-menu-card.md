---
phase: "2"
plan: "02-01"
name: "menu-card"
wave: 2
requires:
  - "01-01"
req_ids:
  - MENU-01
status: pending
autonomous: true
---

## Objective
Создать компонент `src/lib/components/MenuCard.svelte` — карточка блюда в каталоге. Отображает фото, название, описание (1 строка, обрезается), цену, вес, теги (badge-чипы) и индикаторы (spicy, vegetarian). Компонент принимает объект dish и пробрасывает событие click.

## Context
Executor должен читать перед началом:
- `c:\Users\ikoko\Projects\table-mind\docs\phases\phase-2\CONTEXT.md` — структура dish объекта
- `c:\Users\ikoko\Projects\table-mind\src\app.css` — тема DaisyUI (цвета base-200, primary, badge-*)

Дизайн карточки (мобильный-first):
- Карточка занимает полную ширину на мобильном (1 колонка), 2 колонки на tablet (md:)
- Фото сверху, 100% ширины, aspect-ratio 4/3, object-cover, скруглённые углы сверху
- Под фото: название (font-bold, text-lg), цена (text-primary, font-semibold) и вес (text-sm, opacity-70) справа
- Описание: 1 строка с ellipsis (line-clamp-1)
- Теги: маленькие badge-чипы (badge-sm) внизу
- Индикаторы: если spicy — badge-error "Острое", если vegetarian — badge-success "Веган"
- Вся карточка кликабельна (onclick для Фазы 3 — InlineAI bottom sheet)
- Используем DaisyUI card component: `card bg-base-200 shadow-md`
- Фото с fallback: если изображение не загрузилось, показать плейсхолдер (div с bg-base-300 и иконкой)

## Tasks

### Task 02-01-01 — Создать MenuCard.svelte
- **What:** Создать файл `c:\Users\ikoko\Projects\table-mind\src\lib\components\MenuCard.svelte`
- **How:** Svelte 5 компонент с:
  1. `<script>` блок:
     - `let { dish, onclick } = $props();` — dish объект из catalog.json, onclick callback
     - `import { base } from "$app/paths";`
     - Переменная `let imgError = $state(false);` — для fallback фото
  2. Шаблон:
     ```svelte
     <button
       class="card bg-base-200 shadow-md overflow-hidden cursor-pointer
              hover:shadow-lg transition-shadow w-full text-left"
       onclick={() => onclick?.(dish)}
     >
       {#if !imgError}
         <figure>
           <img
             src="{base}/{dish.photo}"
             alt={dish.name}
             class="w-full aspect-[4/3] object-cover"
             loading="lazy"
             onerror={() => imgError = true}
           />
         </figure>
       {:else}
         <div class="w-full aspect-[4/3] bg-base-300 flex items-center justify-center">
           <span class="text-4xl opacity-30">🍽</span>
         </div>
       {/if}

       <div class="card-body p-3 gap-1">
         <div class="flex items-start justify-between gap-2">
           <h3 class="card-title text-base leading-tight">{dish.name}</h3>
           <div class="text-right shrink-0">
             <span class="text-primary font-semibold text-base">{dish.price} ₽</span>
             {#if dish.weight}
               <div class="text-xs opacity-60">{dish.weight}</div>
             {/if}
           </div>
         </div>

         <p class="text-sm opacity-70 line-clamp-1">{dish.description}</p>

         <div class="flex flex-wrap gap-1 mt-1">
           {#if dish.vegetarian}
             <span class="badge badge-success badge-sm">Веган</span>
           {/if}
           {#if dish.spicy}
             <span class="badge badge-error badge-sm">Острое</span>
           {/if}
           {#each dish.tags.filter(t => t !== "острое" && t !== "веган" && t !== "вегетарианское") as tag}
             <span class="badge badge-outline badge-sm">{tag}</span>
           {/each}
         </div>
       </div>
     </button>
     ```
  3. Стиль: табы для отступов, двойные кавычки
  4. Не добавлять `<style>` блок — всё через Tailwind/DaisyUI классы

- **Done when:** файл существует, содержит `$props()`, `dish.name`, `dish.price`, `dish.photo`, `badge`, `line-clamp`, `aspect-[4/3]`

## Tests Required
- `test -f c:/Users/ikoko/Projects/table-mind/src/lib/components/MenuCard.svelte`
- `grep -q '\$props()' c:/Users/ikoko/Projects/table-mind/src/lib/components/MenuCard.svelte`
- `grep -q 'dish.name' c:/Users/ikoko/Projects/table-mind/src/lib/components/MenuCard.svelte`
- `grep -q 'dish.price' c:/Users/ikoko/Projects/table-mind/src/lib/components/MenuCard.svelte`
- `grep -q 'dish.photo' c:/Users/ikoko/Projects/table-mind/src/lib/components/MenuCard.svelte`
- `grep -q 'line-clamp' c:/Users/ikoko/Projects/table-mind/src/lib/components/MenuCard.svelte`
- `grep -q 'badge' c:/Users/ikoko/Projects/table-mind/src/lib/components/MenuCard.svelte`
- `grep -q 'vegetarian' c:/Users/ikoko/Projects/table-mind/src/lib/components/MenuCard.svelte`
- `grep -q 'spicy' c:/Users/ikoko/Projects/table-mind/src/lib/components/MenuCard.svelte`

## Definition of Done
- [ ] `src/lib/components/MenuCard.svelte` создан
- [ ] Svelte 5 синтаксис (`$props()`, не `export let`)
- [ ] Отображает фото с lazy loading и fallback при ошибке
- [ ] Показывает название, цену, вес, описание (1 строка с ellipsis)
- [ ] Badge-чипы для vegetarian, spicy и дополнительных тегов
- [ ] Вся карточка — кликабельный button с onclick
- [ ] Использует `$app/paths` base для пути к фото
- [ ] Табы, двойные кавычки, без `<style>` блока
