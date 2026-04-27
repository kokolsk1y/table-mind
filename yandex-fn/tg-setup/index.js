// Yandex Cloud Function — одноразовый bootstrap бота TableMind
//
// Что делает:
//   1. setWebhook → регистрирует tg-webhook URL как приёмник Telegram-апдейтов
//   2. setMyCommands → команды /start /menu /help в меню бота
//   3. setMyDescription / setMyShortDescription → тексты в профиле бота
//   4. getMe → sanity check
//
// Использование: открыть в браузере
//   https://functions.yandexcloud.net/<этой-функции-id>?webhook=https://functions.yandexcloud.net/<tg-webhook-id>
//
// Webhook URL передаётся через query-param `webhook` или env var TELEGRAM_WEBHOOK_URL.
// Идемпотентно — можно вызывать повторно.
//
// Деплой:
//   1. Создать функцию `tablemind-tg-setup`, Node.js 18, точка входа: index.handler
//   2. Сделать публичной (для удобного вызова из браузера)
//   3. Env:
//        TELEGRAM_BOT_TOKEN = ...
//        TELEGRAM_WEBHOOK_URL = https://functions.yandexcloud.net/<tg-webhook-id> (опционально)
//        TELEGRAM_WEBHOOK_SECRET = ... (опционально, если используется в webhook'е)

const CORS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "GET, POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type"
};

function jsonResponse(statusCode, payload) {
	return {
		statusCode,
		headers: { ...CORS, "Content-Type": "application/json" },
		body: JSON.stringify(payload, null, 2)
	};
}

module.exports.handler = async function (event, context) {
	if (event.httpMethod === "OPTIONS") {
		return { statusCode: 204, headers: CORS, body: "" };
	}

	const token = process.env.TELEGRAM_BOT_TOKEN;
	if (!token) {
		return jsonResponse(500, { error: "TELEGRAM_BOT_TOKEN не задан в env функции" });
	}

	// Webhook URL — из query param или env
	const queryWebhook = event.queryStringParameters?.webhook;
	const webhookUrl = queryWebhook || process.env.TELEGRAM_WEBHOOK_URL;
	if (!webhookUrl) {
		return jsonResponse(400, {
			error:
				"Передай webhook URL через ?webhook=https://... или env TELEGRAM_WEBHOOK_URL. Это URL Yandex функции tg-webhook."
		});
	}

	const secret = process.env.TELEGRAM_WEBHOOK_SECRET || null;
	const results = {};

	// 1. getMe
	try {
		const r = await fetch(`https://api.telegram.org/bot${token}/getMe`);
		results.getMe = await r.json();
	} catch (e) {
		results.getMe = { error: e.message };
	}

	// 2. setWebhook
	try {
		const payload = {
			url: webhookUrl,
			allowed_updates: ["message", "edited_message"],
			drop_pending_updates: true
		};
		if (secret) payload.secret_token = secret;

		const r = await fetch(`https://api.telegram.org/bot${token}/setWebhook`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(payload)
		});
		results.setWebhook = { webhookUrl, response: await r.json() };
	} catch (e) {
		results.setWebhook = { error: e.message };
	}

	// 3. setMyCommands
	try {
		const r = await fetch(`https://api.telegram.org/bot${token}/setMyCommands`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				commands: [
					{ command: "start", description: "О TableMind" },
					{ command: "menu", description: "Подробнее о продукте" },
					{ command: "help", description: "Справка" }
				]
			})
		});
		results.setMyCommands = await r.json();
	} catch (e) {
		results.setMyCommands = { error: e.message };
	}

	// 4. setMyDescription
	try {
		const r = await fetch(`https://api.telegram.org/bot${token}/setMyDescription`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				description:
					"AI-официант для ресторанов. Гость сканирует QR со стола — и получает собеседника, который знает ваше меню. Первые 3 ресторана — пилот бесплатно. tablemind.ru"
			})
		});
		results.setMyDescription = await r.json();
	} catch (e) {
		results.setMyDescription = { error: e.message };
	}

	// 5. setMyShortDescription
	try {
		const r = await fetch(`https://api.telegram.org/bot${token}/setMyShortDescription`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				short_description: "AI-официант для ресторанов. Пилот бесплатно."
			})
		});
		results.setMyShortDescription = await r.json();
	} catch (e) {
		results.setMyShortDescription = { error: e.message };
	}

	return jsonResponse(200, {
		ok: true,
		message:
			"Webhook зарегистрирован, команды и описания установлены. Напиши боту /start чтобы проверить.",
		results
	});
};
