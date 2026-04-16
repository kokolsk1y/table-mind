# TableMind API

Vercel Functions для TableMind. Node.js runtime (НЕ Edge — deprecated).

## Важно: настройка Vercel

При подключении этого репо к Vercel **обязательно** укажите:

- **Root Directory:** `vercel-api`
- **Framework Preset:** Other

Без этого Vercel попытается сбилдить SvelteKit из корня и упадёт.

## Endpoints

- `POST /api/chat` — AI-роутер (waiter/tester/manager/verifier)
- `POST /api/notify` — Telegram-уведомление официанту

## Environment Variables (настроить в Vercel Dashboard)

- `OPENROUTER_API_KEY` — ключ OpenRouter
- `TELEGRAM_BOT_TOKEN` — токен Telegram-бота
- `TELEGRAM_CHAT_ID` — ID чата для уведомлений
