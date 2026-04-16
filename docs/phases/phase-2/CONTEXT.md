# Phase 2 Context

**Phase:** 2 — Каталог меню
**Discussion date:** 2026-04-16
**Status:** ready-to-plan

## Decisions

### Демо-ресторан: «Янтарный берег»
**Decision:** Вымышленный ресторан с калининградским акцентом — балтийская рыба, европейская классика, крафтовые напитки. Название: «Янтарный берег».
**Rationale:** Рассылка идёт по ресторанам Калининграда — демо должно говорить на их языке. Туристическая тема (Балтика, янтарь) резонирует с целевой аудиторией.
**Implications:** catalog.json содержит блюда с калининградским колоритом (строганина из палтуса, балтийская корюшка, клопсы), но и универсальную классику (стейки, паста, цезарь).

### Структура catalog.json
**Decision:** Плоский массив объектов. Каждое блюдо:
```json
{
  "id": "string",
  "name": "string",
  "category": "string",
  "description": "string (2-3 предложения, для AI-контекста)",
  "price": "number (в рублях)",
  "photo": "string (путь к WebP в static/photos/)",
  "tags": ["string"],
  "allergens": ["string"],
  "weight": "string",
  "spicy": "boolean",
  "vegetarian": "boolean"
}
```
**Rationale:** Плоский массив проще для MiniSearch индексации и для передачи в AI system prompt. Нет необходимости в реляционной структуре для 40-50 позиций.
**Implications:**
- `allergens` — обязательное поле (REQ AI-06). Пустой массив `[]` = «неизвестно», не «нет аллергенов»
- `description` — развёрнутое (2-3 предложения), потому что AI использует его для ответов
- `photo` — относительный путь от `static/` (e.g., `photos/borshch.webp`)
- Поле `available` отложено — в демо все блюда доступны

### 14 категорий
**Decision:** Холодные закуски, Тёплые закуски, Салаты, Супы, Рыба и морепродукты, Стейки и мясо, Паста и ризотто, Гарниры, Детское меню, Десерты, Безалкогольные напитки, Авторские коктейли, Вино, Пиво и сидр.
**Rationale:** Детальные категории = AI точнее рекомендует, не путает рыбу с мясом, десерт с закуской. 14 категорий × ~3-4 позиции = 40-50 блюд.
**Implications:** Категории — строковые значения в поле `category`. Фильтрация — exact match. Порядок категорий захардкожен в UI (не алфавитный — пользовательский: от закусок к десертам, потом напитки).

### Фотографии: стоковые WebP
**Decision:** Скачать бесплатные фото еды из Unsplash/Pexels. Формат WebP, ~400x300px. Хранить в `static/photos/`.
**Rationale:** Для демо стоковые фото достаточно. WebP — оптимальный размер/качество для мобильного PWA. AI-генерация и реальные фото — для реальных клиентов.
**Implications:** Фотографии коммитятся в репо (как иконки). ~40 WebP файлов × ~30-50 KB = ~1.5-2 MB суммарно. Приемлемо для GitHub Pages.

### MiniSearch конфигурация
**Decision:** Индексируемые поля: `name` (boost 3), `description` (boost 1), `category` (boost 1.5), `tags` (boost 2). Fuzzy 0.2, prefix true.
**Rationale:** Паттерн из ZalAssist с адаптацией для ресторанного контекста. Boost на `name` — гость чаще ищет по названию блюда.
**Implications:** Создать `src/lib/search/engine.js` по паттерну ZalAssist, адаптировать поля.

### Фильтры UI: чипы
**Decision:** Горизонтальный скролл чипов для категорий (первый ряд). Отдельные toggle-чипы для тегов: «Веган», «Без глютена», «Острое» (второй ряд). Комбинируются: категория + теги.
**Rationale:** Мобильный-first — горизонтальный скролл экономит вертикальное пространство. Чипы DaisyUI — готовый компонент.
**Implications:** Состояние фильтров — локальный `$state` в `+page.svelte`, не глобальный стор (фильтры не нужны на других страницах).

### Режим демо (UI-04)
**Decision:** Если `session.isDemoMode === true` (нет `?table`), кнопка «позвать официанта» показывается но disabled с текстом «Отсканируйте QR-код на столе». Всё остальное работает полностью.
**Rationale:** Демо должно быть полностью интерактивным для рассылки. Единственное ограничение — нельзя вызвать реального официанта.
**Implications:** Кнопка CallWaiterButton (Фаза 4) проверяет `session.isDemoMode`. В Фазе 2 просто показываем disabled badge внизу страницы.

## Canonical References

| Reference | File path | Notes |
|-----------|-----------|-------|
| Session store | src/lib/stores/session.svelte.js | isDemoMode, tableNumber — Фаза 2 использует для UI-04 |
| Layout | src/routes/+layout.svelte | Фаза 2 заменяет +page.svelte, layout не трогает |
| MiniSearch паттерн | ZalAssist/src/lib/search/engine.js | Копировать структуру, менять поля |
| Catalog loader | ZalAssist/src/lib/data/catalog.js | loadCatalog() singleton — переиспользовать |
| PWA cache | vite.config.js workbox runtimeCaching | catalog.json уже в StaleWhileRevalidate |

## Code Insights

Из Фазы 1 готово:
- `src/routes/+page.svelte` — заглушка, будет полностью заменена на каталог с карточками
- `src/lib/stores/session.svelte.js` — `isDemoMode` getter уже есть
- `vite.config.js` — workbox уже кеширует `*.json` (catalog.json попадёт автоматически)
- DaisyUI тема `tablemind` — карточки используют `bg-base-200`, бейджи `badge-primary` и т.д.
- `static/` директория готова для `photos/` и `catalog.json`

## Deferred Ideas

- Сортировка блюд по цене / популярности — V2
- Фото-галерея блюда (несколько фото) — V2
- Поле `available: boolean` для стоп-листа — при первом реальном клиенте
- Синонимы в MiniSearch (как в ZalAssist) — при необходимости, пока 40-50 позиций достаточно без них
