// Rate limiting helper for TableMind Vercel API.
// Uses Upstash Redis (free tier) via @upstash/ratelimit sliding windows.
// Fails open (allows request) if Upstash credentials are missing — чтобы API
// не падал при отсутствии настройки, но логи будут предупреждать.

import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const HAS_UPSTASH = Boolean(
	process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN
);

let redis = null;
if (HAS_UPSTASH) {
	try {
		redis = Redis.fromEnv();
	} catch (e) {
		console.error("[ratelimit] Upstash Redis init failed", e);
	}
} else {
	console.warn("[ratelimit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN не заданы — rate-limit выключен (fail-open)");
}

// Chat: 30 запросов в минуту на IP, 300 в час, 1000 в день.
const chatPerMinute = redis
	? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 m"), prefix: "rl:chat:m" })
	: null;
const chatPerHour = redis
	? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(300, "1 h"), prefix: "rl:chat:h" })
	: null;
const chatPerDay = redis
	? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(1000, "1 d"), prefix: "rl:chat:d" })
	: null;

// Global circuit breaker — если весь сервис делает больше 5000 req/сутки,
// blokuje всех. Защита от глобальной атаки / бага в клиенте.
const globalPerDay = redis
	? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5000, "1 d"), prefix: "rl:global:d" })
	: null;

// Notify (вызов официанта) — агрессивнее, чтобы не спамить Telegram.
// 5 запросов в минуту на IP, 30 в час.
const notifyPerMinute = redis
	? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(5, "1 m"), prefix: "rl:notify:m" })
	: null;
const notifyPerHour = redis
	? new Ratelimit({ redis, limiter: Ratelimit.slidingWindow(30, "1 h"), prefix: "rl:notify:h" })
	: null;

function getIp(req) {
	const fwd = req.headers["x-forwarded-for"];
	if (typeof fwd === "string" && fwd.length > 0) {
		return fwd.split(",")[0].trim();
	}
	return req.headers["x-real-ip"] || req.socket?.remoteAddress || "unknown";
}

async function checkLimiters(limiters, key) {
	for (const [label, limiter] of limiters) {
		if (!limiter) continue;
		const r = await limiter.limit(key);
		if (!r.success) {
			return {
				ok: false,
				retryAfter: Math.max(1, Math.ceil((r.reset - Date.now()) / 1000)),
				reason: label
			};
		}
	}
	return { ok: true };
}

export async function limitChat(req) {
	if (!redis) return { ok: true, softBypass: true };
	const ip = getIp(req);

	const perIp = await checkLimiters(
		[
			["chat per minute", chatPerMinute],
			["chat per hour", chatPerHour],
			["chat per day", chatPerDay]
		],
		ip
	);
	if (!perIp.ok) return perIp;

	const perGlobal = await checkLimiters([["global per day", globalPerDay]], "__global__");
	if (!perGlobal.ok) return perGlobal;

	return { ok: true };
}

export async function limitNotify(req) {
	if (!redis) return { ok: true, softBypass: true };
	const ip = getIp(req);
	return checkLimiters(
		[
			["notify per minute", notifyPerMinute],
			["notify per hour", notifyPerHour]
		],
		ip
	);
}

// ─────────────────────────────────────────────────────────────
// Валидация входа. Лучше отрезать мусор ДО обращения к OpenRouter.
// ─────────────────────────────────────────────────────────────

const MAX_MESSAGE = 500;
const MAX_CATALOG = 25000;
const MAX_HISTORY = 20;
const MAX_HISTORY_ENTRY = 1000;
const MAX_TABLE = 10;
const MAX_ITEMS_TEXT = 2000;

export function validateChatInput({ message, catalog, history }) {
	if (typeof message !== "string" || message.trim().length === 0) {
		return "message required";
	}
	if (message.length > MAX_MESSAGE) {
		return `message too long (max ${MAX_MESSAGE})`;
	}
	if (catalog != null && typeof catalog !== "string") {
		return "catalog must be string";
	}
	if (typeof catalog === "string" && catalog.length > MAX_CATALOG) {
		return `catalog too long (max ${MAX_CATALOG})`;
	}
	if (history != null && !Array.isArray(history)) {
		return "history must be array";
	}
	if (Array.isArray(history)) {
		if (history.length > MAX_HISTORY) {
			return `history too long (max ${MAX_HISTORY})`;
		}
		for (const m of history) {
			if (!m || typeof m !== "object") return "history item invalid";
			if (typeof m.content !== "string" || m.content.length > MAX_HISTORY_ENTRY) {
				return "history item content invalid";
			}
		}
	}
	return null;
}

export function validateNotifyInput({ table, items }) {
	if (!table || typeof table !== "string" && typeof table !== "number") {
		return "table required";
	}
	if (String(table).length > MAX_TABLE) {
		return "table too long";
	}
	if (typeof items !== "string" || items.length === 0) {
		return "items required";
	}
	if (items.length > MAX_ITEMS_TEXT) {
		return `items too long (max ${MAX_ITEMS_TEXT})`;
	}
	return null;
}

export function rateLimitResponse(res, info) {
	res.setHeader("Retry-After", String(info.retryAfter ?? 60));
	res.status(429).json({
		error: "Слишком много запросов — попробуйте позже",
		retryAfter: info.retryAfter,
		reason: info.reason
	});
}
