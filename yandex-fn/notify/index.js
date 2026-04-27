// Yandex Cloud Function — вызов официанта (стол + заказ → Telegram)
//
// Деплой:
//   1. Создать функцию `tablemind-pwa-notify`, Node.js 18, точка входа index.handler
//   2. Сделать публичной
//   3. Env: TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID
//   4. URL положить в GitHub Secret репо table-mind как PUBLIC_API_URL_NOTIFY

const CORS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type, Cache-Control, Pragma"
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

// In-memory rate limit
const ipBuckets = new Map();
const RATE_LIMIT = 5; // вызовов
const RATE_WINDOW_MS = 60_000; // в минуту

function checkRateLimit(ip) {
	const now = Date.now();
	const bucket = ipBuckets.get(ip);
	if (!bucket || bucket.resetAt < now) {
		ipBuckets.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
		return { ok: true };
	}
	if (bucket.count >= RATE_LIMIT) {
		return { ok: false, retryAfterMs: bucket.resetAt - now };
	}
	bucket.count++;
	return { ok: true };
}

setInterval(() => {
	const now = Date.now();
	for (const [ip, bucket] of ipBuckets.entries()) {
		if (bucket.resetAt < now) ipBuckets.delete(ip);
	}
}, 5 * 60 * 1000).unref?.();

function validateInput(body) {
	const isLead = typeof body.restaurantName === "string" && body.restaurantName.length > 0;
	if (isLead) {
		if (!body.contact || typeof body.contact !== "string") return "contact обязателен";
		if (body.restaurantName.length > 200) return "restaurantName слишком длинный";
		if (body.contact.length > 200) return "contact слишком длинный";
		return null;
	}
	// Вызов официанта
	if (!body.table) return "table обязателен";
	if (!body.items || typeof body.items !== "string") return "items обязателен";
	if (body.items.length > 4000) return "items слишком длинный";
	return null;
}

module.exports.handler = async function (event, context) {
	if (event.httpMethod === "OPTIONS") {
		return { statusCode: 204, headers: CORS, body: "" };
	}

	if (event.httpMethod !== "POST") {
		return jsonResponse(405, { error: "Method not allowed" });
	}

	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;
	if (!botToken || !chatId) {
		return jsonResponse(500, { error: "Telegram not configured" });
	}

	let body;
	try {
		body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
	} catch {
		return jsonResponse(400, { error: "Invalid JSON" });
	}

	const validErr = validateInput(body);
	if (validErr) return jsonResponse(400, { error: validErr });

	const ip =
		event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
		event.requestContext?.identity?.sourceIp ||
		"unknown";
	const rl = checkRateLimit(ip);
	if (!rl.ok) {
		return {
			statusCode: 429,
			headers: { ...CORS, "Content-Type": "application/json", "Retry-After": String(Math.ceil(rl.retryAfterMs / 1000)) },
			body: JSON.stringify({ error: "Слишком много запросов" })
		};
	}

	const isLead = typeof body.restaurantName === "string" && body.restaurantName.length > 0;
	let text;
	if (isLead) {
		const { restaurantName, contact, email, menuInfo, source } = body;
		const lines = [
			"🆕 <b>НОВАЯ ЗАЯВКА НА ПИЛОТ</b>",
			"",
			`<b>Ресторан:</b> ${escapeHtml(restaurantName)}`,
			`<b>Контакт:</b> ${escapeHtml(contact)}`
		];
		if (email) lines.push(`<b>Email:</b> ${escapeHtml(email)}`);
		if (menuInfo) lines.push("", `<b>Про меню:</b>`, escapeHtml(menuInfo));
		lines.push("", `<i>Источник: ${escapeHtml(source || "PWA")}</i>`);
		text = lines.join("\n");
	} else {
		const { table, items, total } = body;
		text = `🍽 <b>Стол №${escapeHtml(table)}</b>\n\n${escapeHtml(items)}\n\nИтого: ${Number(total).toLocaleString("ru-RU")} ₽\n\n<i>Гость ждёт официанта</i>`;
	}

	try {
		const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: chatId,
				text,
				parse_mode: "HTML",
				disable_web_page_preview: true
			})
		});

		if (!tgRes.ok) {
			const errText = await tgRes.text().catch(() => "");
			return jsonResponse(500, { error: "Telegram API error", detail: errText });
		}

		return jsonResponse(200, { ok: true, kind: isLead ? "lead" : "waiter-call" });
	} catch (err) {
		return jsonResponse(500, { error: err.message || "Network error" });
	}
};
