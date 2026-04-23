import { limitNotify, validateNotifyInput, validateLeadInput, rateLimitResponse } from "../lib/ratelimit.js";

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

function escapeHtml(s) {
	return String(s ?? "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;");
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

	const body = req.body || {};
	const isLead = typeof body.restaurantName === "string" && body.restaurantName.length > 0;

	// Валидация
	const validError = isLead
		? validateLeadInput(body)
		: validateNotifyInput(body);
	if (validError) {
		res.status(400).json({ error: validError });
		return;
	}

	// Rate limit по IP
	const rl = await limitNotify(req);
	if (!rl.ok) {
		rateLimitResponse(res, rl);
		return;
	}

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
		lines.push("", `<i>Источник: ${escapeHtml(source || "сайт tablemind-site")}</i>`);
		text = lines.join("\n");
	} else {
		const { table, items, total } = body;
		text = `🍽 Стол №${escapeHtml(table)}\n\n${escapeHtml(items)}\n\nИтого: ${Number(total).toLocaleString("ru-RU")} ₽\n\nГость ждёт официанта`;
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
			const err = await tgRes.text();
			res.status(500).json({ error: "Telegram API error", details: err });
			return;
		}

		res.status(200).json({ ok: true, kind: isLead ? "lead" : "waiter-call" });
	} catch (err) {
		res.status(500).json({ error: err.message });
	}
}
