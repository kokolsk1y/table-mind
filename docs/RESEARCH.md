# Research Summary — TableMind

**Дата:** 2026-04-10
**Источники:** 4 параллельных исследования (стек, фичи, архитектура, подводные камни)

---

## Критические находки

### 1. Скоуп — главный риск
Текущий список фич (3 режима + голос + мульти-агент + память + Telegram + QR) — это 3-4 недели работы, не 1. Нужно жёстко резать v1.

**Решение — v1 за неделю:**
| Ship | Defer |
|---|---|
| Режим 1: меню + фильтры | Режим 3: интерактивный тест |
| Режим 2: инлайн AI + чат | Голосовой режим |
| 1 агент (Официант) + верификатор | Полная мульти-агентная система |
| Telegram-уведомление | Память гостя |
| QR-деплой + демо | Агент-менеджер |

### 2. Vercel Edge Functions — deprecated
Vercel Edge Functions (runtime: 'edge') официально deprecated в 2025. Использовать Vercel Functions с Node.js runtime (`runtime: 'nodejs'` или `'fluid'`).

### 3. iOS Safari блокирует Web Speech API в PWA
В standalone PWA режиме на iOS голос полностью недоступен. Feature detection + graceful fallback к текстовому вводу. Голос — только Android/Desktop Chrome. Не блокер, но нужно учесть.

### 4. Аллергены — юридический риск
TP TS 022/2011 обязывает рестораны предоставлять точную информацию об аллергенах. Если AI соврёт — ответственность на ресторане (и потенциально на разработчике).

**Обязательные меры:**
- Жёсткое правило в system prompt: «если нет данных об аллергенах — скажи спросить официанта»
- Постоянный дисклеймер в UI (не popup, а футер)
- Поле `allergens: string[]` в catalog.json — обязательное
- Пустой массив = «неизвестно», не «нет аллергенов»

### 5. Vercel Hobby — запрет коммерческого использования
Hobby plan ограничен personal/non-commercial use. Для клиентского продакшена нужен Pro ($20/мес) или альтернативный хост. Демо на Hobby — ок.

### 6. OpenRouter оплата из РФ
Российские Visa/Mastercard заблокированы для международных платежей. Клиенту нужно платить через крипто (USDT TRC-20) или альтернативные методы.

---

## Архитектурные решения

### Единый API-эндпоинт
Один `/api/chat` с параметром `agent` вместо отдельных эндпоинтов. Маршрутизация по системному промпту.

### Верификатор — fire-and-forget
Ответ AI показывается сразу (стриминг). После завершения — фоновый запрос верификатора (stream: false, timeout 8 сек). При обнаружении проблемы — мягкий значок ⚠️ под сообщением, текст не меняется.

### QR → стол → Telegram
- QR кодирует `?table=N` в URL
- sessionStorage (не localStorage — стол привязан к сессии)
- Telegram вызов через `/api/notify` на Vercel (BOT_TOKEN в env, не в браузере)

### Каталог
- 30-150 блюд ≈ 6000 токенов — помещается в system prompt целиком
- RAG избыточен для этого масштаба
- `selectItemsForAI()` из ZalAssist всё равно полезен для контекста чата
- Service worker: StaleWhileRevalidate для catalog.json

### Offline
- Меню + поиск: работают офлайн (service worker cache)
- AI + Telegram: только онлайн
- Graceful degradation: «Нет соединения. Меню доступно offline.»

### Инлайн AI в карточках
- Modal bottom sheet (не full-screen, не accordion)
- Локальный state в компоненте, не глобальный стор
- Стриминг ответа прямо в sheet
- Swipe down для закрытия

---

## Стек — уточнённый

| Компонент | Решение | Примечания |
|---|---|---|
| Фронтенд | SvelteKit 2 + adapter-static | `appDir: 'app'`, `trailingSlash: 'always'`, `static/.nojekyll` |
| UI | Tailwind 4 + DaisyUI v5 | Кастомная тёмная тема через `@plugin "daisyui/theme"` в CSS |
| Поиск | MiniSearch v7 | Fuzzy, prefix, синонимы. 7 KB gzip. |
| AI | OpenRouter → Claude Haiku 4.5 | ~$0.001-0.003 за диалог |
| API | Vercel Functions (Node.js runtime) | НЕ Edge. Регион: fra1 (Франкфурт) |
| Хостинг | GitHub Pages | CDN, бесплатно |
| PWA | @vite-pwa/sveltekit | `outDir: 'static'`, precache + StaleWhileRevalidate |
| Уведомления | Telegram Bot API | Через /api/notify на Vercel |

---

## SvelteKit + GitHub Pages — чеклист

1. `svelte.config.js`: `appDir: 'app'` (не `_app` — GitHub Pages блокирует `_`)
2. `static/.nojekyll` — отключить Jekyll
3. `trailingSlash: 'always'` в layout
4. `base` path = имя репозитория (если не custom domain)
5. `@vite-pwa/sveltekit` с `outDir: 'static'`

---

## Квиз (Режим 3) — паттерн для v2

- 5 вопросов, один на экран, progress bar
- Визуальные карточки-ответы (не радиокнопки)
- Результат: 3 именованных комплекса (не «Вариант 1/2/3»)
- Compromise effect: средний по цене — в центре
- Теги из catalog.json фильтруют каталог до передачи в промпт

---

## Голос (v2) — ограничения

- Android Chrome: работает (Google STT servers)
- iOS Safari PWA: **не работает** (WebKit не реализует SpeechRecognition в standalone)
- iOS Safari браузер: частично (нестабильно)
- Шумный зал (65-80 dB): снижает точность
- Рекомендация: tap-to-talk (не continuous), single-shot, feature detection

---

## Структура папок (рекомендуемая)

```
table-mind/
├── src/
│   ├── lib/
│   │   ├── ai/
│   │   │   ├── client.js          # streamChat() — из ZalAssist
│   │   │   ├── prompt.js          # selectItemsForAI() — из ZalAssist
│   │   │   ├── parse.js           # extractDishes() — по ID блюд
│   │   │   └── agents.js          # system prompts для агентов
│   │   ├── search/
│   │   │   ├── engine.js          # MiniSearch — из ZalAssist
│   │   │   └── filters.js         # фильтры по категориям/тегам
│   │   ├── stores/
│   │   │   ├── session.svelte.js  # tableNumber, currentMode
│   │   │   ├── cart.svelte.js     # выбранные блюда
│   │   │   ├── chat.svelte.js     # история чата (sessionStorage)
│   │   │   └── guest.svelte.js    # предпочтения (localStorage)
│   │   ├── data/
│   │   │   └── catalog.js         # loadCatalog() singleton
│   │   └── components/
│   │       ├── MenuCard.svelte
│   │       ├── InlineAI.svelte
│   │       ├── ChatMessage.svelte
│   │       ├── DishCard.svelte
│   │       ├── CallWaiterButton.svelte
│   │       └── VerificationBadge.svelte
│   ├── routes/
│   │   ├── +layout.svelte         # QR param, catalog, session
│   │   ├── +page.svelte           # меню (режим 1 + 2)
│   │   ├── chat/+page.svelte      # полноценный чат
│   │   └── quiz/+page.svelte      # тест (режим 3, v2)
│   └── app.css                    # Tailwind + DaisyUI theme
├── static/
│   ├── catalog.json
│   └── .nojekyll
├── vercel-api/
│   └── api/
│       ├── chat.js                # единый AI роутер
│       └── notify.js              # Telegram Bot API
├── svelte.config.js
├── vite.config.js
└── package.json
```

---

## Открытые вопросы

1. **Язык AI-ответов:** v1 только русский или автоопределение языка гостя?
2. **Верификатор для аллергенов:** асинхронный как всё остальное, или синхронный (блокирует UI) для аллергенных запросов?
3. **Демо-контент:** вымышленный ресторан (переиспользуемый) или реальный (убедительнее)?
4. **Fallback без ?table:** ручной ввод стола или заблокированная кнопка?
5. **Vercel account при handoff:** кто владеет аккаунтом после передачи?
6. **Base path:** имя репозитория на GitHub (влияет на все пути)
