import { limitNotify, validateNotifyInput, rateLimitResponse } from "../lib/ratelimit.js";

export const config = {
	maxDuration: 10
};

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type"
};

function setCors(res) {
	for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

export default async function handler(req, res) {
	setCors(res);

	if (req.method === "OPTIONS") {
		res.status(204).end();
		return;
	}

	if (req.method !== "POST") {
		res.status(405).json({ error: "Method not allowed" });
		return;
	}

	const botToken = process.env.TELEGRAM_BOT_TOKEN;
	const chatId = process.env.TELEGRAM_CHAT_ID;

	if (!botToken || !chatId) {
		res.status(500).json({ error: "Telegram not configured" });
		return;
	}

	const { table, items, total } = req.body || {};

	// Валидация входа
	const validError = validateNotifyInput({ table, items });
	if (validError) {
		res.status(400).json({ error: validError });
		return;
	}

	// Rate limit по IP — защита от спама в Telegram
	const rl = await limitNotify(req);
	if (!rl.ok) {
		rateLimitResponse(res, rl);
		return;
	}

	const text = `🍽 Стол №${table}\n\n${items}\n\nИтого: ${Number(total).toLocaleString("ru-RU")} ₽\n\nГость ждёт официанта`;

	try {
		const tgRes = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				chat_id: chatId,
				text,
				parse_mode: "HTML"
			})
		});

		if (!tgRes.ok) {
			const err = await tgRes.text();
			res.status(500).json({ error: "Telegram API error", details: err });
			return;
		}

		res.status(200).json({ ok: true });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}
