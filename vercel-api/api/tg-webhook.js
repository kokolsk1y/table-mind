// Telegram bot webhook: принимает сообщения от пользователей,
// пересылает владельцу (TELEGRAM_CHAT_ID), даёт лиду автоответ.
// Бот: @tablemind_orders_bot

import { Redis } from "@upstash/redis";
import { Ratelimit } from "@upstash/ratelimit";

export const config = { maxDuration: 10 };

const HAS_UPSTASH = Boolean(
	process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

let redis = null;
if (HAS_UPSTASH) {
	try {
		redis = Redis.fromEnv();
	} catch (e) {
		console.error("[tg-webhook] Upstash init failed", e);
	}
}

// Per-user rate-limit — защита от флуда бота
const perUserLimit = redis
	? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(10, "1 m"), prefix: "rl:tg-bot" })
	: null;

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

export default async function handler(req, res) {
	if (req.method !== "POST") {
		return res.status(405).json({ ok: false });
	}

	// Опциональная верификация секретным токеном (если настроен)
	const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
	if (expectedSecret) {
		const gotSecret = req.headers["x-telegram-bot-api-secret-token"];
		if (gotSecret !== expectedSecret) {
			return res.status(401).json({ ok: false });
		}
	}

	const update = req.body || {};
	const msg = update.message || update.edited_message;

	// Игнорируем callback_query, inline_query и пустые апдейты
	if (!msg || !msg.text) {
		return res.status(200).json({ ok: true });
	}

	const text = msg.text.trim();
	const chatId = msg.chat?.id;
	const fromId = msg.from?.id;
	const ownerChatId = process.env.TELEGRAM_CHAT_ID;

	if (!chatId || !fromId) {
		return res.status(200).json({ ok: true });
	}

	const isOwner = ownerChatId && String(fromId) === String(ownerChatId);

	// Rate-limit: не применяется к владельцу
	if (perUserLimit && !isOwner) {
		const { success } = await perUserLimit.limit(String(fromId));
		if (!success) {
			try {
				await sendMessage(chatId, "Слишком много сообщений — подождите минуту.");
			} catch {}
			return res.status(200).json({ ok: true });
		}
	}

	try {
		// Commands
		if (text === "/start" || text.startsWith("/start ")) {
			await sendMessage(chatId, WELCOME);

			// Уведомим владельца о новом пользователе (кроме самого владельца)
			if (ownerChatId && !isOwner) {
				const name = `${msg.from.first_name || ""} ${msg.from.last_name || ""}`.trim();
				const uname = msg.from.username ? `@${escapeHtml(msg.from.username)}` : "(без username)";
				await sendMessage(
					ownerChatId,
					`🟢 <b>Новый контакт в боте</b>\n\n${escapeHtml(name)} · ${uname}\nID: <code>${fromId}</code>\n\n<i>Нажал /start — пока ничего не писал.</i>`
				);
			}
			return res.status(200).json({ ok: true });
		}

		if (text === "/menu" || text === "/about") {
			await sendMessage(chatId, MENU_INFO);
			return res.status(200).json({ ok: true });
		}

		if (text === "/help") {
			await sendMessage(chatId, HELP);
			return res.status(200).json({ ok: true });
		}

		// Любой другой текст — пересылаем владельцу + даём лиду автоответ
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

			// Автоответ лиду
			await sendMessage(
				chatId,
				`Получил ваше сообщение — спасибо!\n\nК. (автор TableMind) вернётся лично за 1–2 дня.\n\nПока можно посмотреть сайт и заполнить форму для ускорения: https://tablemind.ru`
			);
		}

		return res.status(200).json({ ok: true });
	} catch (err) {
		console.error("[tg-webhook] error", err);
		return res.status(200).json({ ok: true, error: err?.message });
	}
}
