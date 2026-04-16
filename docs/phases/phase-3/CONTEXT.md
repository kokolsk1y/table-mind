# Phase 3 Context

**Phase:** 3 — AI-официант
**Discussion date:** 2026-04-16
**Status:** ready-to-plan

## Decisions

### OpenRouter API ключ
**Decision:** Ключ есть у пользователя. Хранится в Vercel Dashboard как `OPENROUTER_API_KEY`. В коде — только `process.env.OPENROUTER_API_KEY`. Никогда не попадает в репо, чат или фронтенд.
**Implications:** Vercel нужно подключить до тестирования AI. Код пишется с реальными вызовами, не заглушками.

### Модель: Claude Haiku 4.5
**Decision:** `anthropic/claude-haiku-4-5` через OpenRouter. ~$1/$5 за 1M токенов. При ~50 запросах/день ≈ 200-400 ₽/мес.
**Rationale:** Точнее чем 3.5 (критично для аллергенов), проверено в продакшне (ZalAssist использовал 3.5, мы берём новее).
**Implications:** Модель указывается в vercel-api/api/chat.js как константа. Легко заменить.

### 3 стиля общения AI (выбирает гость)
**Decision:** При входе в чат гость видит 3 кнопки:
1. **«Расскажи подробно»** — развёрнутый стиль, история блюда, рекомендации пар, эмоциональный
2. **«Кратко и по делу»** — только факты: состав, цена, аллергены, вес
3. **«Помоги выбрать»** — AI задаёт вопросы, ведёт к выбору, предлагает варианты
**Rationale:** Демо-вау-фактор — ресторатор видит гибкость. Технически = один агент с 3 вариантами вводной части system prompt. Почти ноль лишней работы.
**Implications:**
- Параметр `style: "detailed" | "brief" | "guide"` в запросе к /api/chat
- Инлайн AI (bottom sheet) всегда использует стиль "detailed" — это не чат, а описание блюда
- Стиль хранится в sessionStorage, не спрашивается каждый раз
- Ресторатор может задать базовый тон при покупке (конфиг, V2)

### Инлайн AI: bottom sheet
**Decision:** Нажатие на карточку блюда → modal bottom sheet с AI-описанием. Стриминг прямо в sheet. Dismiss — swipe down или tap outside. Локальный state в MenuCard, не глобальный стор.
**Rationale:** Bottom sheet > full-screen modal (гость видит контекст меню за полупрозрачным фоном). Bottom sheet > accordion (больше места для AI-текста).
**Implications:** Новый компонент InlineAI.svelte. Вызывает /api/chat с agent: "waiter", style: "detailed", одно конкретное блюдо в каталоге.

### Чат: отдельная страница /chat/
**Decision:** Полноценный чат на /chat/+page.svelte. История в sessionStorage. Стриминг word-by-word. Парсинг ID блюд из ответа → карточки блюд под сообщением.
**Rationale:** Паттерн из ZalAssist (routes/chat/+page.svelte) — проверен в продакшне.
**Implications:** Переиспользовать из ZalAssist: streamChat(), extractProducts() (адаптировать для ID вместо артикулов), ChatMessage.svelte.

### System prompt: всё меню в контексте
**Decision:** Все 47 блюд форматируются компактно и вставляются в system prompt. ~6000 токенов — помещается с запасом. selectItemsForAI() из ZalAssist для чата (отправлять ~30-50 релевантных), для инлайн — только одно блюдо.
**Rationale:** RAG избыточен для 47 позиций. Системный промпт + жёсткий запрет выдумывать = достаточно.
**Implications:**
- Жёсткие правила в промпте: не выдумывать блюда, не выдумывать цены/состав, при отсутствии данных об аллергенах — «уточните у официанта»
- formatCatalogForAI() форматирует меню как компактную таблицу

### Верификатор: fire-and-forget
**Decision:** После каждого ответа AI — фоновый запрос с agent: "verifier", stream: false, timeout 8 сек. Если найдено несоответствие → значок ⚠️ под сообщением. Текст ответа не меняется.
**Rationale:** Асинхронный — не блокирует UX. Мягкое предупреждение — не пугает гостя.
**Implications:** Верификатор = тот же /api/chat с другим system prompt. Возвращает JSON { verdict: "ok" | "warning", note: "..." }.

### Дисклеймер по аллергенам
**Decision:** Постоянный текст внизу чата и bottom sheet: «Информация об аллергенах может быть неполной. Уточняйте у официанта.» Не popup, не dismissible — всегда виден.
**Rationale:** Юридическая защита (TP TS 022/2011). Исследование Фазы initial показало реальный риск.

### iOS overlay
**Decision:** При определении iOS + не standalone PWA → показать инструкцию «Добавить на Home Screen» с иконкой Share → «На экран Домой». Закрывается нажатием. Показывается один раз (localStorage).
**Rationale:** iOS не поддерживает beforeinstallprompt. Без инструкции гость на iPhone не установит PWA.

## Canonical References

| Reference | File path | Notes |
|-----------|-----------|-------|
| API заглушка | vercel-api/api/chat.js | Заменяем на реальный AI-роутер |
| Каталог | static/catalog.json | 47 блюд, загружается через catalog.js |
| MenuCard | src/lib/components/MenuCard.svelte | Добавляем кнопку AI и bottom sheet |
| Session store | src/lib/stores/session.svelte.js | isDemoMode, tableNumber |
| ZalAssist стриминг | ZalAssist/src/lib/ai/client.js | streamChat() — адаптировать |
| ZalAssist промпт | ZalAssist/src/lib/ai/prompt.js | selectItemsForAI(), formatCatalogForAI() |
| ZalAssist парсинг | ZalAssist/src/lib/ai/parse.js | extractProducts() → extractDishes() |
| ZalAssist чат | ZalAssist/src/routes/chat/+page.svelte | Паттерн UI чата |

## Deferred Ideas

- Голосовой ввод (Web Speech API) — Фаза 5
- Агент-менеджер (FAQ о заведении) — Фаза 6
- Мультиязычность AI — Фаза 6
- Chips-подсказки из ответа AI — V2
- Синхронный верификатор для аллергенных запросов — V2
