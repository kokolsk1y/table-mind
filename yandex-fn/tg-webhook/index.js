// Yandex Cloud Function — Telegram webhook бота @tablemind_orders_bot
// Принимает inbound сообщения от пользователей бота, отвечает на /start /menu /help,
// пересылает свободный текст владельцу + автоответ лиду.
//
// Деплой:
//   1. Создать функцию `tablemind-tg-webhook`, Node.js 18, точка входа: index.handler
//   2. Сделать публичной
//   3. Env:
//        TELEGRAM_BOT_TOKEN = ...
//        TELEGRAM_CHAT_ID = <chat_id владельца>
//        TELEGRAM_WEBHOOK_SECRET = <случайная строка> (опционально, для верификации)
//   4. Скопировать URL функции
//   5. Открыть один раз tg-setup function (см. tg-setup/index.js) чтобы перерегистрировать
//      webhook на этот новый URL.

const CORS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, X-Telegram-Bot-Api-Secret-Token"
};

function jsonResponse(statusCode, payload) {
	return {
		statusCode,
		headers: { ...CORS, "Content-Type": "application/json" },
		body: JSON.stringify(payload)
	};
}

function escapeHtml(s) {
	return String(s ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
}

async function sendMessage(chatId, text, opts = {}) {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	if (!token) throw new Error("TELEGRAM_BOT_TOKEN not set");
	return fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
		method: "POST",
		headers: { "Content-Type": "application/json" },
		body: JSON.stringify({
			chat_id: chatId,
			text,
			parse_mode: "HTML",
			disable_web_page_preview: true,
			...opts
		})
	});
}

// Per-user in-memory rate limit (10/мин)
const userBuckets = new Map();
const PER_USER_LIMIT = 10;
const WINDOW_MS = 60_000;

function checkUserRateLimit(userId) {
	const now = Date.now();
	const bucket = userBuckets.get(userId);
	if (!bucket || bucket.resetAt < now) {
		userBuckets.set(userId, { count: 1, resetAt: now + WINDOW_MS });
		return true;
	}
	if (bucket.count >= PER_USER_LIMIT) return false;
	bucket.count++;
	return true;
}

setInterval(() => {
	const now = Date.now();
	for (const [id, bucket] of userBuckets.entries()) {
		if (bucket.resetAt < now) userBuckets.delete(id);
	}
}, 5 * 60 * 1000).unref?.();

const WELCOME = `Здравствуйте! Это бот <b>TableMind</b>.

Я делаю AI-официанта для ресторанов: гость сканирует QR со стола, открывается меню + собеседник, который знает вашу карту наизусть и отвечает на вопросы о блюдах.

<b>Первые 3 ресторана — пилот бесплатно.</b> Я собираю каталог сам, настраиваю QR и Telegram-бот за 1–2 дня.

<b>Как связаться:</b>
• Заполните форму (30 сек, я получу в Telegram): https://tablemind.ru/#contact
• Или просто напишите мне прямо здесь — название вашего заведения, пара слов про меню. К. (автор) вернётся лично за 1–2 дня.

/menu — коротко о продукте
/help — справка`;

const MENU_INFO = `<b>TableMind · AI-официант в браузере гостя</b>

Формат: PWA (веб-приложение без установки). Гость сканирует QR со стола → открывается меню → рядом кнопка «спросить Тима» — AI-ассистент.

<b>Тим:</b>
• Знает только ваше меню (JSON-каталог) — не выдумывает блюда и состав
• Отвечает на вопросы об аллергенах, составе, подбирает комплексы
• Отдельный верификатор проверяет каждый ответ перед отправкой
• Говорит на 12 языках (важно для туристов)

<b>Тариф:</b>
• Пилот — 0 ₽, первые 3 ресторана
• Кафе — 9 900 ₽/мес (хостинг, AI-токены, обновление меню, мониторинг)
• Сеть — обсуждаем

Подробнее: https://tablemind.ru`;

const HELP = `<b>Команды:</b>

/start — о TableMind
/menu — подробнее о продукте
/help — эта справка

Или напишите любой текст — я передам К. (автору), он ответит лично за 1–2 дня.`;

module.exports.handler = async function (event, context) {
	if (event.httpMethod === "OPTIONS") {
		return { statusCode: 204, headers: CORS, body: "" };
	}

	if (event.httpMethod !== "POST") {
		return jsonResponse(405, { ok: false });
	}

	// Опциональная верификация секретным токеном
	const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
	if (expectedSecret) {
		const gotSecret =
			event.headers?.["x-telegram-bot-api-secret-token"] ||
			event.headers?.["X-Telegram-Bot-Api-Secret-Token"];
		if (gotSecret !== expectedSecret) {
			return jsonResponse(401, { ok: false });
		}
	}

	let update;
	try {
		update = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
	} catch {
		return jsonResponse(400, { ok: false, error: "Invalid JSON" });
	}

	const msg = update.message || update.edited_message;
	if (!msg || !msg.text) {
		return jsonResponse(200, { ok: true });
	}

	const text = msg.text.trim();
	const chatId = msg.chat?.id;
	const fromId = msg.from?.id;
	const ownerChatId = process.env.TELEGRAM_CHAT_ID;

	if (!chatId || !fromId) return jsonResponse(200, { ok: true });

	const isOwner = ownerChatId && String(fromId) === String(ownerChatId);

	// Rate-limit (не применяется к владельцу)
	if (!isOwner && !checkUserRateLimit(String(fromId))) {
		try {
			await sendMessage(chatId, "Слишком много сообщений — подождите минуту.");
		} catch {}
		return jsonResponse(200, { ok: true });
	}

	try {
		// Commands
		if (text === "/start" || text.startsWith("/start ")) {
			await sendMessage(chatId, WELCOME);
			if (ownerChatId && !isOwner) {
				const name = `${msg.from.first_name || ""} ${msg.from.last_name || ""}`.trim();
				const uname = msg.from.username ? `@${escapeHtml(msg.from.username)}` : "(без username)";
				await sendMessage(
					ownerChatId,
					`🟢 <b>Новый контакт в боте</b>\n\n${escapeHtml(name)} · ${uname}\nID: <code>${fromId}</code>\n\n<i>Нажал /start — пока ничего не писал.</i>`
				);
			}
			return jsonResponse(200, { ok: true });
		}

		if (text === "/menu" || text === "/about") {
			await sendMessage(chatId, MENU_INFO);
			return jsonResponse(200, { ok: true });
		}

		if (text === "/help") {
			await sendMessage(chatId, HELP);
			return jsonResponse(200, { ok: true });
		}

		// Свободный текст — пересылаем владельцу + автоответ
		if (ownerChatId && !isOwner) {
			const name = `${msg.from.first_name || ""} ${msg.from.last_name || ""}`.trim();
			const uname = msg.from.username ? `@${escapeHtml(msg.from.username)}` : "(без username)";
			const trimmed = text.length > 3500 ? text.slice(0, 3500) + "…" : text;
			const forwarded =
				`💬 <b>Сообщение боту TableMind</b>\n\n` +
				`<b>От:</b> ${escapeHtml(name)} · ${uname}\n` +
				`<b>ID:</b> <code>${fromId}</code>\n\n` +
				`<b>Текст:</b>\n${escapeHtml(trimmed)}\n\n` +
				`<i>Ответить: <a href="tg://user?id=${fromId}">открыть диалог</a></i>`;
			await sendMessage(ownerChatId, forwarded);
			await sendMessage(
				chatId,
				`Получил ваше сообщение — спасибо!\n\nК. (автор TableMind) вернётся лично за 1–2 дня.\n\nПока можно посмотреть сайт и заполнить форму для ускорения: https://tablemind.ru`
			);
		}

		return jsonResponse(200, { ok: true });
	} catch (err) {
		console.error("[tg-webhook] error", err);
		return jsonResponse(200, { ok: true, error: err?.message });
	}
};
