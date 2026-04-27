# План миграции PWA `table-mind` с Vercel на GitHub Pages + Yandex Cloud

> **Зачем:** Сейчас QR-сканирование со стола не работает в РФ — PWA хостится
> на Vercel, который заблочен ТСПУ. Гость в ресторане откроет QR без VPN — и
> увидит пустую страницу. AI-чат вообще не работает — Anthropic Claude
> блочит российские IP даже через Bedrock.
>
> Переезжаем на ZalAssist-стек:
> - Фронт PWA → GitHub Pages (`kokolsk1y.github.io/table-mind/`)
> - AI чат → Yandex Cloud Function `tablemind-chat` через OpenRouter → **Gemini 2.0 Flash**
>   (вместо Claude — Anthropic блочит РФ)
> - Вызов официанта → Yandex Cloud Function `tablemind-pwa-notify` → Telegram
> - Telegram-бот @tablemind_orders_bot → Yandex Cloud Functions
>   (`tablemind-tg-webhook` + `tablemind-tg-setup`)
>
> **Состояние кода:** ВСЁ ГОТОВО, изменения сделаны но НЕ запушены.
> Перед `git push` нужно пройти все админские шаги ниже.

---

## ЧЕКЛИСТ — В КАКОМ ПОРЯДКЕ ДЕЛАТЬ

### 1. Yandex Cloud Function `tablemind-chat` ⏱ ~15 мин

Это AI-сердце PWA. Принимает сообщение гостя + меню → отдаёт ответ Тима.

1. https://console.yandex.cloud → **Cloud Functions** → создать функцию
   - Имя: `tablemind-chat`, регион `ru-central1`
2. Создать версию:
   - Среда: **Node.js 18**, точка входа: `index.handler`
   - Загрузить ZIP с `yandex-fn/chat/index.js`:
     ```bash
     cd yandex-fn/chat
     zip chat.zip index.js
     ```
   - Таймаут: **30 секунд** (длинные ответы Gemini)
   - Память: **256 МБ** (не критично, но больше rate limit table fits)
   - **Env:**
     - `OPENROUTER_API_KEY` = `sk-or-v1-...` (из openrouter.ai)
3. Сделать **публичной** (вкладка «Доступ» → «Открытые вызовы»)
4. **Скопировать URL** → запиши

📋 **URL функции chat — нужен в шаге 5.**

---

### 2. Yandex Cloud Function `tablemind-pwa-notify` ⏱ ~10 мин

Принимает вызов официанта (стол + заказ) → шлёт в Telegram.

1. Создать функцию `tablemind-pwa-notify`, Node.js 18, `index.handler`
2. Загрузить `yandex-fn/notify/index.js`:
   ```bash
   cd yandex-fn/notify
   zip notify.zip index.js
   ```
3. Таймаут: 10 сек, память: 128 МБ
4. **Env:**
   - `TELEGRAM_BOT_TOKEN` = тот же что на Vercel
   - `TELEGRAM_CHAT_ID` = твой chat_id
5. Сделать публичной
6. **Скопировать URL**

📋 **URL функции notify — нужен в шаге 5.**

---

### 3. Yandex Cloud Function `tablemind-tg-webhook` ⏱ ~10 мин

Принимает inbound сообщения боту от пользователей.

1. Создать функцию `tablemind-tg-webhook`, Node.js 18, `index.handler`
2. Загрузить `yandex-fn/tg-webhook/index.js`
3. Таймаут: 10 сек, память: 128 МБ
4. **Env:**
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_CHAT_ID`
   - `TELEGRAM_WEBHOOK_SECRET` (опционально — придумай случайную строку для верификации)
5. Сделать публичной
6. **Скопировать URL** (используется в шаге 4)

---

### 4. Yandex Cloud Function `tablemind-tg-setup` (одноразовая) ⏱ ~10 мин

Регистрирует webhook бота на новый URL и обновляет команды/описания.

1. Создать функцию `tablemind-tg-setup`, Node.js 18, `index.handler`
2. Загрузить `yandex-fn/tg-setup/index.js`
3. Таймаут: 10 сек, память: 128 МБ
4. **Env:**
   - `TELEGRAM_BOT_TOKEN`
   - `TELEGRAM_WEBHOOK_URL` = URL функции tg-webhook из шага 3
   - `TELEGRAM_WEBHOOK_SECRET` (если ставил в шаге 3 — то же самое)
5. Сделать публичной
6. **Открыть URL функции в браузере один раз:**
   ```
   https://functions.yandexcloud.net/<setup-id>
   ```
   Или с явным указанием webhook (если не задал в env):
   ```
   https://functions.yandexcloud.net/<setup-id>?webhook=https://functions.yandexcloud.net/<webhook-id>
   ```
7. Должен вернуться JSON с `"ok": true` — это значит webhook зарегистрирован, команды бота обновлены, описание обновлено.

После этого setup-функцию можно удалить (одноразовая) или оставить — она идемпотентная.

---

### 5. GitHub Secrets в репо `table-mind` ⏱ ~3 мин

https://github.com/kokolsk1y/table-mind/settings/secrets/actions

Создать **два секрета**:

| Name | Value |
|------|-------|
| `PUBLIC_API_URL_CHAT` | URL функции `tablemind-chat` (из шага 1) |
| `PUBLIC_API_URL_NOTIFY` | URL функции `tablemind-pwa-notify` (из шага 2) |

---

### 6. GitHub Pages — включить ⏱ ~2 мин

https://github.com/kokolsk1y/table-mind/settings/pages

- Source: **GitHub Actions**
- Custom domain: пока **пусто** (пока живём на `kokolsk1y.github.io/table-mind/`,
  как ZalAssist на `/zalassist/`)

Если позже захочется купить отдельный домен (например `app.tablemind.ru`) —
добавить CNAME-запись в Cloudflare и заполнить custom domain.

---

### 7. Запушить новый деплой ⏱ ~2 мин

```bash
cd c:/Users/ikoko/Projects/table-mind
git push origin main
```

GitHub Actions запустит:
- `npm ci`
- `npm run build` с подставленными `PUBLIC_API_URL_*` из secrets
- Deploy to Pages

После успеха PWA доступна на `https://kokolsk1y.github.io/table-mind/`.

---

### 8. Перепечатать QR-коды для столов ⏱ переменно

QR-коды должны вести на новый URL. Если на наклейках столов уже напечатан
старый Vercel-URL (`table-mind-seven.vercel.app`) — гость попадёт на мёртвый
сайт.

Новый URL для QR:
```
https://kokolsk1y.github.io/table-mind/?table=N
```
где `N` — номер стола.

В репо есть скрипт `scripts/generate-qr.js` — запустить:
```bash
npm run generate-qr
```
Должны получиться обновлённые PNG в `qr-output/`.

⚠️ Проверь скрипт `scripts/generate-qr.js` — там может быть зашит старый URL.
Если да — поменять на `https://kokolsk1y.github.io/table-mind/`.

---

### 9. Vercel — отключить (опционально) ⏱ ~3 мин

Старый Vercel-проект `table-mind-seven` можно удалить или просто
отсоединить от GitHub чтобы он не тратил деплои.

В коде остался fallback на Vercel-URL для разработки, но если функции
Yandex настроены — fallback не сработает (потому что URL поменяется через
env).

---

## ЧТО ИЗМЕНЕНО В КОДЕ

### `yandex-fn/` (новая папка)
4 функции в формате Yandex Cloud Function (handler `(event, context)`):
- `chat/index.js` — AI-чат через **Gemini 2.0 Flash** (не Claude!)
- `notify/index.js` — вызов официанта в Telegram
- `tg-webhook/index.js` — приём сообщений от пользователей бота
- `tg-setup/index.js` — одноразовый bootstrap бота

Все используют:
- CORS preflight (OPTIONS → 204) с `Access-Control-Allow-Headers: Content-Type, Cache-Control, Pragma`
- In-memory rate limit (мягкий, в идеале мигрировать на YDB при росте нагрузки)
- Нативный `fetch` (Node 18+) — без npm-зависимостей, отдельные `package.json` не нужны

### `src/lib/ai/client.js`
**Полностью переписан.** Раньше парсил OpenRouter SSE-стрим напрямую.
Теперь:
- Делает обычный POST к Yandex CF
- Получает `{text: "..."}` целиком
- Эмулирует word-by-word печать через `onChunk` (20мс между словами)

URL берётся из `import.meta.env.PUBLIC_API_URL_CHAT` с fallback на Vercel.

### `src/lib/components/CallWaiterButton.svelte`
URL заменён на `import.meta.env.PUBLIC_API_URL_NOTIFY` с fallback.

### `src/routes/call/+page.svelte`
URL заменён на `import.meta.env.PUBLIC_API_URL_NOTIFY` с fallback.

### `.github/workflows/deploy.yml`
Добавлен `env` блок для подстановки `PUBLIC_API_URL_*` секретов в build.

### `static/.nojekyll`
Уже был, не трогали.

### `svelte.config.js`
Не трогали — там уже было правильно (`adapter-static`, `paths.base = "/table-mind"`).

### Что НЕ трогали (намеренно)
- `vercel-api/` — оставили как backup. Если нужно откатиться — Vercel-функции
  ещё работают с фронтом по fallback URL. После успеха миграции можно удалить.

---

## КРИТИЧЕСКИЕ ОТЛИЧИЯ ОТ СТАРОГО СТЕКА

### Модель: Claude Haiku → Gemini 2.0 Flash
- Anthropic блочит РФ-IP, **никак не обойти**.
- Gemini 2.0 Flash через OpenRouter — работает в РФ, ~$0.001/запрос (дёшево).
- Качество для русского ресторанного сценария — сравнимое с Claude Haiku.
- Стиль ответа может слегка отличаться, но system prompts оставлены без изменений.

### Стрим: SSE → word-by-word на клиенте
- Yandex Cloud Functions **не поддерживают** SSE-стриминг в ответе (response
  можно отдать только целиком).
- Поэтому функция отдаёт `{text: "..."}`, а клиент эмулирует печатающийся
  текст через постепенную выдачу слов (20мс между ними).
- Для пользователя визуально не отличается от настоящего стрима.

### Rate limit: Upstash Redis → in-memory
- Upstash Redis блочится в РФ, заменили на Map в памяти функции.
- Минус: Yandex запускает несколько параллельных инстансов, они не делятся
  памятью → атакующий может «обмануть» лимит, попадая на разные инстансы.
- Для MVP с малой нагрузкой — норм. Если начнётся реальный спам — мигрировать
  на Yandex Managed Service for Redis или YDB.

---

## ЕСЛИ ЧТО-ТО ПОШЛО НЕ ТАК

### AI-чат не отвечает / 502 ошибка
- Проверь `OPENROUTER_API_KEY` в env функции `tablemind-chat`
- Yandex Console → функция → «Логи» — там полные стектрейсы ошибок
- Может быть кончились деньги на OpenRouter — проверь баланс на openrouter.ai

### Вызов официанта не приходит в Telegram
- Проверь `TELEGRAM_BOT_TOKEN` и `TELEGRAM_CHAT_ID` в env функции `tablemind-pwa-notify`
- Проверь что функция публичная
- DevTools → Network → найди запрос, посмотри ответ

### Telegram-бот не отвечает на /start
- Проверь webhook был зарегистрирован: открой
  `https://api.telegram.org/bot<TOKEN>/getWebhookInfo` — должен показать URL
  Yandex функции `tablemind-tg-webhook`
- Если webhook на старом URL → запустить функцию `tablemind-tg-setup` ещё раз

### Хочу откатиться к Vercel
- В коде fallback URL ведут на старый Vercel — если убрать GitHub secrets,
  build возьмёт fallback, но… GitHub Pages всё равно отдаёт build с GitHub
  Pages URL. Чтобы реально откатиться:
- В Vercel — включить автодеплой обратно
- DNS не трогали в этом проекте, поэтому ничего возвращать не надо
- Старые QR-коды на столах ведут на Vercel — они снова заработают

---

## АРХИТЕКТУРА ПОСЛЕ МИГРАЦИИ

```
[Гость в ресторане, телефон без VPN]
        ↓
        QR со стола → kokolsk1y.github.io/table-mind/?table=7
        ↓
[GitHub Pages — раздаёт PWA]   (статика, работает в РФ)
        ↓
        Фронт делает POST:
        ↓
[Yandex Cloud Function tablemind-chat]   (Россия, ru-central1, работает в РФ)
        ↓
        Function делает POST с OPENROUTER_API_KEY (env, не на фронте):
        ↓
[OpenRouter API]   (работает из РФ)
        ↓
        Модель: google/gemini-2.0-flash-001
        ↓
[Ответ возвращается обратно]

Параллельно:
- Вызов официанта → Yandex Function tablemind-pwa-notify → Telegram API
- @tablemind_orders_bot ↔ Yandex Function tablemind-tg-webhook
```

DNS:
- Нет custom-домена. PWA на `kokolsk1y.github.io/table-mind/`.
- Если хочется domain (`app.tablemind.ru`) — отдельный шаг (Cloudflare DNS only).

---

## БЛОК ССЫЛОК

- Yandex Cloud Console: https://console.yandex.cloud
- OpenRouter: https://openrouter.ai
- GitHub repo: https://github.com/kokolsk1y/table-mind
- ZalAssist (рабочий пример того же стека): https://github.com/kokolsk1y/zalassist

---

## КОГДА ВСЁ ВЫПОЛНЕНО

После успешной миграции:
1. ✅ QR со стола без VPN ведёт на работающее меню
2. ✅ AI-чат с Тимом отвечает (через Gemini)
3. ✅ Вызов официанта приходит в Telegram
4. ✅ Бот @tablemind_orders_bot отвечает на /start, /menu, /help
5. ✅ Можно удалить старый Vercel-проект (оба: фронт + API)

После этого можно обновить ROADMAP.md и tasks.json.
