// Yandex Cloud Function — AI-чат для PWA TableMind (гость ресторана)
//
// Принимает сообщение гостя + историю + каталог, отдаёт ответ Тима (AI-официанта)
// через OpenRouter → Gemini 2.0 Flash.
//
// ВАЖНО: Anthropic Claude блочит российские IP (даже через Bedrock), поэтому
// модель — Gemini. У OpenRouter Gemini хорошо работает для русского.
//
// ВАЖНО: Yandex Cloud Functions НЕ поддерживает SSE-стриминг в ответе.
// Поэтому stream: false на стороне OpenRouter, на клиенте эмулируем
// word-by-word печать. Так же делает ZalAssist.
//
// Деплой:
//   1. Yandex Cloud Console → Cloud Functions → Создать функцию `tablemind-chat`
//   2. Среда: Node.js 18, точка входа: index.handler
//   3. Загрузить index.js (этот, package.json не нужен — нативный fetch)
//   4. Сделать публичной
//   5. Env: OPENROUTER_API_KEY = sk-or-v1-...
//   6. URL положить в GitHub Secret репо table-mind как PUBLIC_API_URL_CHAT

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const MODEL = "google/gemini-2.0-flash-001";

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

// ============ ПРОМПТЫ (скопированы из vercel-api/api/chat.js) ============

const MENU_RULES = `
ЖЁСТКИЕ ПРАВИЛА:
1. Ты можешь рекомендовать ТОЛЬКО блюда из каталога ниже. Никаких других.
2. Цены, аллергены, состав — только из каталога. Если информации нет — скажи «уточните у официанта».
3. Если гость спрашивает о блюде, которого нет в каталоге — скажи честно: «Этого блюда у нас нет, но могу предложить похожее».
4. Никогда не придумывай ингредиенты, которых нет в описании.
5. При вопросах об аллергенах: если поле allergens пустое — скажи «точные данные об аллергенах уточните у официанта».
6. ОТВЕЧАЙ НА ТОМ ЖЕ ЯЗЫКЕ, на котором пишет гость.
7. НЕ показывай технические ID блюд. Используй только красивые названия.
8. Пиши ТОЛЬКО обычным текстом. Без маркдауна, без звёздочек, без списков с точками, без форматирования. Просто живой разговорный текст, как настоящий официант говорит устно. Если гость пишет на английском — отвечай на английском. Если на немецком — на немецком. По умолчанию — русский.
`;

const STYLE_INTROS = {
	detailed: `Тебя зовут Тим. Ты — дружелюбный AI-официант ресторана «Янтарный берег» в Калининграде.
Если гость здоровается или первый раз обращается — можешь представиться по имени, но не каждый ответ.
Рассказывай о блюдах кратко но увлечённо: с чем сочетается, что особенного.
Отвечай в 2-3 предложения. Не больше.`,
	brief: `Тебя зовут Тим. Ты — AI-официант ресторана «Янтарный берег» в Калининграде.
Отвечай максимально кратко: название, цена, аллергены. 1-2 предложения.`,
	guide: `Тебя зовут Тим. Ты — AI-официант ресторана «Янтарный берег» в Калининграде.
Помоги гостю выбрать. Задай один короткий уточняющий вопрос, затем предложи 2-3 варианта.
Будь кратким — максимум 3-4 предложения.`
};

const VERIFIER_PROMPT = `Ты — верификатор ответов AI-официанта ресторана.
Тебе дан ответ AI-официанта и каталог блюд. Проверь:
1. Все упомянутые блюда есть в каталоге?
2. Цены совпадают?
3. Аллергены не выдуманы?
4. Ингредиенты соответствуют описанию?

Ответь СТРОГО в формате JSON:
{"verdict": "ok"} — если всё корректно
{"verdict": "warning", "note": "краткое описание проблемы"} — если найдено несоответствие

Ничего кроме JSON не пиши.`;

const MANAGER_PROMPT = `Ты — менеджер ресторана «Янтарный берег» в Калининграде.
Отвечай на вопросы о заведении: режим работы, бронирование, Wi-Fi, парковка, детские стулья и т.д.
НЕ рекомендуй блюда — для этого есть AI-официант.
Отвечай кратко, 1-2 предложения. Отвечай на языке гостя.

Информация о ресторане:
- Адрес: г. Калининград, ул. Ленинский проспект, 17
- Режим работы: Пн-Чт 12:00-23:00, Пт-Сб 12:00-01:00, Вс 12:00-22:00
- Бронирование: по телефону +7 (4012) 555-123 или через Telegram
- Wi-Fi: есть, бесплатный (сеть: YantarBereg, пароль: welcome2024)
- Парковка: бесплатная на 20 мест за зданием
- Детские стулья: есть, 5 штук
- Средний чек: 1500-2500₽ на персону
- Кухня закрывается за 1 час до закрытия ресторана`;

function buildSystemPrompt(agent, style, catalog) {
	if (agent === "verifier") {
		return VERIFIER_PROMPT + "\n\nКАТАЛОГ:\n" + (catalog || "");
	}
	if (agent === "manager") {
		return MANAGER_PROMPT;
	}
	const intro = STYLE_INTROS[style] || STYLE_INTROS.detailed;
	return `${intro}\n${MENU_RULES}\nКАТАЛОГ РЕСТОРАНА «ЯНТАРНЫЙ БЕРЕГ»:\n${catalog || ""}`;
}

// ============ RATE LIMIT (in-memory, мягкий) ============

const ipBuckets = new Map();
const RATE_LIMIT = 30; // запросов
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

// ============ ВАЛИДАЦИЯ ============

function validateInput({ message, catalog, history }) {
	if (!message || typeof message !== "string") return "message обязателен";
	if (message.length > 1500) return "message слишком длинный (макс 1500)";
	if (catalog && typeof catalog !== "string") return "catalog должен быть строкой";
	if (catalog && catalog.length > 100_000) return "catalog слишком большой (макс 100KB)";
	if (history && !Array.isArray(history)) return "history должен быть массивом";
	if (history && history.length > 40) return "history слишком длинный (макс 40)";
	return null;
}

// ============ HANDLER ============

module.exports.handler = async function (event, context) {
	if (event.httpMethod === "OPTIONS") {
		return { statusCode: 204, headers: CORS, body: "" };
	}

	if (event.httpMethod !== "POST") {
		return jsonResponse(405, { error: "Method not allowed" });
	}

	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) {
		return jsonResponse(500, { error: "OPENROUTER_API_KEY not configured" });
	}

	let body;
	try {
		body = typeof event.body === "string" ? JSON.parse(event.body) : event.body || {};
	} catch {
		return jsonResponse(400, { error: "Invalid JSON" });
	}

	const { agent = "waiter", style = "detailed", message, history = [], catalog = "" } = body;

	const validErr = validateInput({ message, catalog, history });
	if (validErr) {
		return jsonResponse(400, { error: validErr });
	}

	const ip =
		event.headers?.["x-forwarded-for"]?.split(",")[0]?.trim() ||
		event.requestContext?.identity?.sourceIp ||
		"unknown";
	const rl = checkRateLimit(ip);
	if (!rl.ok) {
		return {
			statusCode: 429,
			headers: { ...CORS, "Content-Type": "application/json" },
			body: JSON.stringify({ error: "Слишком много запросов. Попробуйте через минуту." })
		};
	}

	const systemPrompt = buildSystemPrompt(agent, style, catalog);
	const trimmedHistory = Array.isArray(history) ? history.slice(-20) : [];

	const messages = [
		{
			role: "system",
			content: [
				{
					type: "text",
					text: systemPrompt,
					cache_control: { type: "ephemeral" } // OpenRouter prompt caching
				}
			]
		},
		...trimmedHistory,
		{ role: "user", content: message }
	];

	const orBody = {
		model: MODEL,
		messages,
		max_tokens: agent === "verifier" ? 256 : 400,
		temperature: agent === "verifier" ? 0.1 : 0.3,
		stream: false // Yandex CF не поддерживает SSE — стрим эмулируется на клиенте
	};

	try {
		const orRes = await fetch(OPENROUTER_URL, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				"HTTP-Referer": "https://kokolsk1y.github.io/table-mind/",
				"X-Title": "TableMind"
			},
			body: JSON.stringify(orBody)
		});

		if (!orRes.ok) {
			const errText = await orRes.text().catch(() => "");
			return jsonResponse(orRes.status >= 500 ? 502 : orRes.status, {
				error: "OpenRouter error",
				detail: errText
			});
		}

		const data = await orRes.json();
		const text = data.choices?.[0]?.message?.content || "";

		// Verifier возвращает JSON-структуру — пытаемся распарсить
		if (agent === "verifier") {
			try {
				const parsed = JSON.parse(text);
				return jsonResponse(200, parsed);
			} catch {
				return jsonResponse(200, { verdict: "ok", raw: text });
			}
		}

		// Все остальные агенты — отдают plain text для word-by-word эмуляции стрима
		return jsonResponse(200, { text });
	} catch (err) {
		return jsonResponse(502, { error: err.message || "Network error" });
	}
};
