// Одноразовый endpoint для инициализации бота:
// - setWebhook → регистрирует /api/tg-webhook как приёмник апдейтов
// - setMyCommands → устанавливает кнопки в меню бота
// - getMe → sanity-check что токен валиден
//
// Использование: просто открой в браузере
// https://table-mind-seven.vercel.app/api/tg-setup
//
// Можно вызывать повторно — идемпотентно.

export const config = { maxDuration: 10 };

export default async function handler(req, res) {
	const token = process.env.TELEGRAM_BOT_TOKEN;
	if (!token) {
		return res.status(500).json({ error: "TELEGRAM_BOT_TOKEN не задан" });
	}

	// URL webhook'а на этом же Vercel-проекте
	const host = req.headers.host || "table-mind-seven.vercel.app";
	const webhookUrl = `https://${host}/api/tg-webhook`;
	const secret = process.env.TELEGRAM_WEBHOOK_SECRET || null;

	const results = {};

	// 1. getMe — проверяем что токен валидный
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

	// 3. setMyCommands — кнопки в меню бота (рядом с полем ввода)
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

	// 4. setMyDescription — длинное описание (показывается в профиле бота)
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

	// 5. setMyShortDescription — короткое (до 120 симв, показывается в превью)
	try {
		const r = await fetch(`https://api.telegram.org/bot${token}/setMyShortDescription`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				short_description:
					"AI-официант для ресторанов. Пилот бесплатно."
			})
		});
		results.setMyShortDescription = await r.json();
	} catch (e) {
		results.setMyShortDescription = { error: e.message };
	}

	res.setHeader("Content-Type", "application/json");
	res.status(200).json({
		ok: true,
		message:
			"Webhook зарегистрирован, команды и описания установлены. Напиши боту /start чтобы проверить.",
		results
	});
}
