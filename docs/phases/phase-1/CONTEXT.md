# Phase 1 Context

**Phase:** 1 — Фундамент
**Discussion date:** 2026-04-11
**Status:** ready-to-plan

## Decisions

### Структура репозитория и разделение фронт/API
**Decision:** Monorepo (Вариант A). Один репо `table-mind`. SvelteKit фронт в корне, Vercel Functions в подпапке `vercel-api/`. Vercel-проект подключается с `Root Directory = vercel-api`, полностью игнорируя код SvelteKit. У каждой части свой `package.json` и свои зависимости.
**Rationale:** Solo-dev не хочет плодить репы. Vercel и GitHub Pages триггерятся независимо и работают параллельно. Паттерн уже обкатан в ZalAssist (`ZalAssist/vercel-api/api/chat.js`).
**Implications:**
- Создать `vercel-api/` с собственным `package.json` на этапе Фазы 1
- При подключении к Vercel сразу задать `Root Directory: vercel-api` (иначе Vercel попытается собрать SvelteKit)
- GitHub Actions workflow собирает только корень и публикует `build/` на GitHub Pages
- CORS обязателен на `/api/chat` и `/api/notify` — фронт и API на разных доменах

### Стратегия генерации QR-кодов
**Decision:** Build-time скрипт `scripts/generate-qr.js`. Принимает количество столов и base URL, выдаёт набор PNG (`table-01.png`...) + готовый `tables.pdf` с сеткой для печати. Запускается локально разработчиком под каждого клиента.
**Rationale:** Для v1 и первых клиентов самообслуживания не нужно — один прогон скрипта отдаёт готовый PDF. Runtime-админка добавила бы +защиту, +UI, +PDF-в-браузере и не вписывается в неделю.
**Implications:**
- Добавить зависимости: `qrcode` (генерация PNG), `pdfkit` (сборка PDF)
- Скрипт параметризуется: `--tables N --base URL --output DIR`
- Для демо: сгенерировать 10 QR для вымышленного ресторана, один выложить в рассылке
- Самообслуживающаяся админка — в бэклог V2

### Иконки и лого PWA
**Decision:** Временный плейсхолдер на Фазу 1 — простая монограмма «TM» на тёмном фоне (один SVG → набор размеров через sharp-скрипт). Замена на настоящее лого — когда пользователь сгенерирует.
**Rationale:** Не блокирует деплой и не тратит время на дизайн в первой фазе. Лого заменяется за 5 минут прогоном одного скрипта, когда будет готово.
**Implications:**
- В Фазе 1 создать `scripts/generate-icons.js` с входом из одного SVG
- Манифест ссылается на `192x192`, `512x512`, `maskable`, `apple-touch-icon 180x180`, splash screens для iOS
- Плейсхолдер генерится один раз и коммитится в `static/icons/`
- Повторная генерация при замене лого — одна команда

### Визуальный стиль темы
**Decision:** Modern Dark Premium. Почти чёрный фон (#0e0e0e), угольные карточки, янтарно-медный акцент (#d97706), sans-serif типографика (Inter или Space Grotesk). Нейтрально-премиальный — подходит максимуму ресторанов без привязки к кухне.
**Rationale:** Продукт продаётся разным ресторанам, тема должна быть универсальной. Премиум вид помогает продавать дороже. Цвета легко перекрашиваются через CSS-переменные DaisyUI под конкретного клиента за ~30 секунд.
**Implications:**
- Создать кастомную тему DaisyUI v5 через `@plugin "daisyui/theme"` в `src/app.css`
- Переменные: `--color-primary` (янтарный), `--color-base-100` (угольный), `--color-base-200` (карточки), `--color-base-content` (кремовый текст)
- Подключить Inter через Google Fonts или Fontsource (локально — быстрее загрузка)
- Скругления карточек: `--radius-box: 1rem` (мягкий премиум вид)
- Под конкретного клиента — новый theme с переопределением переменных

## Canonical References

| Reference | File path | Notes |
|-----------|-----------|-------|
| Стриминг SSE proxy | `ZalAssist/vercel-api/api/chat.js` | Паттерн Edge proxy к OpenRouter — переиспользовать почти без изменений (runtime: 'nodejs', НЕ 'edge') |
| streamChat клиент | `ZalAssist/src/lib/ai/client.js` | Переиспользуется в Фазе 3, но заглушка вызова /api/chat нужна уже в Фазе 1 |
| loadCatalog singleton | `ZalAssist/src/lib/data/catalog.js` | Паттерн in-memory singleton — применить в Фазе 2, но структура каталога должна быть учтена в Фазе 1 (PWA precache) |
| Cart store | `ZalAssist/src/lib/stores/cart.svelte.js` | Паттерн Svelte 5 $state singleton — применяется для session store в Фазе 1 |
| Layout + onMount QR read | новый `src/routes/+layout.svelte` | Читает `?table` из `$page.url.searchParams`, пишет в sessionStorage |

## Code Insights

Кода в репо пока нет — проект на этапе инициализации. Все паттерны берутся из референс-проекта ZalAssist:

- **SvelteKit 5 + Svelte runes (`$state`, `$effect`)** — ZalAssist уже на этом
- **Vercel Functions** — ZalAssist использует `runtime: 'edge'`, но это deprecated. В TableMind с первого коммита использовать `runtime: 'nodejs'` или `'fluid'`
- **CORS паттерн** — в ZalAssist `vercel-api/api/chat.js` уже настроен `Access-Control-Allow-Origin: *`, скопировать
- **ReadableStream proxy** — в ZalAssist `chat.js` есть рабочий паттерн стриминга OpenRouter → клиент, критичные хедеры: `Accept-Encoding: identity`, `X-Accel-Buffering: no` (в Фазе 3)
- **@vite-pwa/sveltekit** — в ZalAssist не использовался (это не PWA). В TableMind — новое подключение, нужна свежая конфигурация с `outDir: 'static'`

## Deferred Ideas

- **Самообслуживающаяся админка для QR** — отложено в V2, после первых клиентов
- **Per-restaurant тема через URL-параметр или subdomain** — отложено до запроса клиента
- **Custom domain для production** — отложено до первого платного клиента (на демо — `kokolsk1y.github.io/table-mind/`)
- **Vercel Pro plan** — отложено до первого платного клиента (на демо — Hobby допустим)
- **Настоящее лого TableMind** — пользователь сгенерирует отдельно, заменим через `scripts/generate-icons.js`
