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
- `UPSTASH_REDIS_REST_URL` — Upstash Redis REST URL (для rate-limit)
- `UPSTASH_REDIS_REST_TOKEN` — Upstash Redis REST token (для rate-limit)

## Rate limiting

API защищён rate-limit'ом через Upstash Redis. Лимиты:

**`/api/chat`** (защита от выжигания токенов OpenRouter):
- 30 запросов в минуту на IP
- 300 запросов в час на IP
- 1000 запросов в день на IP
- 5000 запросов в день — глобальный circuit breaker

**`/api/notify`** (защита от спама Telegram):
- 5 запросов в минуту на IP
- 30 запросов в час на IP

При превышении возвращается **429 Too Many Requests** с заголовком `Retry-After`.

Если `UPSTASH_REDIS_REST_URL` / `UPSTASH_REDIS_REST_TOKEN` не заданы — rate-limit **выключается** (fail-open), в логах будет warning.

### Как включить rate-limit

1. Зарегистрироваться на [upstash.com](https://upstash.com) (бесплатно)
2. Создать Redis-базу: **Create Database** → выбрать регион (eu-west-1 близко к fra1 где деплоится API)
3. Скопировать **UPSTASH_REDIS_REST_URL** и **UPSTASH_REDIS_REST_TOKEN** из вкладки REST API
4. Добавить в Vercel Dashboard → Project Settings → Environment Variables
5. Redeploy проекта

## Валидация входа

Дополнительно к rate-limit'у всё проверяется до вызова OpenRouter/Telegram:

- `message` — непустая строка ≤ 500 символов
- `catalog` — строка ≤ 25 000 символов
- `history` — массив ≤ 20 элементов, каждый content ≤ 1000 символов
- `table` — строка/число ≤ 10 символов (notify)
- `items` — строка ≤ 2000 символов (notify)
