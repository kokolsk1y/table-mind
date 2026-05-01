import { limitChat, validateChatInput, rateLimitResponse } from "../lib/ratelimit.js";

export const config = {
	maxDuration: 30
};

const CORS_HEADERS = {
	"Access-Control-Allow-Origin": "*",
	"Access-Control-Allow-Methods": "POST, OPTIONS",
	"Access-Control-Allow-Headers": "Content-Type"
};

const MODEL = "anthropic/claude-haiku-4-5";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

// Multi-lang: {{lang}} → подставляется LANG_NAMES[langCode]. AI обязан отвечать
// строго на этом языке, не переключаясь даже если гость спросил на другом.
// Multi-tenant: {{restaurant}} → подставляется restaurantName из payload.
const MENU_RULES = `
ЖЁСТКИЕ ПРАВИЛА:
1. Ты можешь рекомендовать ТОЛЬКО блюда из каталога ниже. Никаких других.
2. Цены, аллергены, состав — только из каталога. Если информации нет — скажи «уточните у официанта» (на языке гостя).
3. Если гость спрашивает о блюде, которого нет в каталоге — скажи честно: «Этого блюда у нас нет, но могу предложить похожее».
4. Никогда не придумывай ингредиенты, которых нет в описании.
5. При вопросах об аллергенах: если поле allergens пустое — скажи «точные данные об аллергенах уточните у официанта».
6. НЕ показывай технические ID блюд. Используй только красивые названия (они уже в каталоге на нужном языке).
7. Пиши ТОЛЬКО обычным текстом. Без маркдауна, без звёздочек, без списков с точками, без форматирования. Живой разговорный текст, как настоящий официант говорит устно.
8. ОТВЕЧАЙ СТРОГО НА ЯЗЫКЕ: {{lang}}. Не переключайся на другой язык даже если гость спросил на нём.
`;

const STYLE_INTROS = {
	detailed: `Тебя зовут Тим. Ты — дружелюбный AI-помощник ресторана «{{restaurant}}».
Если гость здоровается или первый раз обращается — можешь представиться по имени, но не каждый ответ.
Рассказывай о блюдах кратко но увлечённо: с чем сочетается, что особенного.
Отвечай в 2-3 предложения. Не больше.`,
	brief: `Тебя зовут Тим. Ты — AI-помощник ресторана «{{restaurant}}».
Отвечай максимально кратко: название, цена, аллергены. 1-2 предложения.`,
	guide: `Тебя зовут Тим. Ты — AI-помощник ресторана «{{restaurant}}».
Помоги гостю выбрать. Задай один короткий уточняющий вопрос, затем предложи 2-3 варианта.
Будь кратким — максимум 3-4 предложения.`
};

const LANG_NAMES = {
	ru: "русский",
	en: "английский",
	de: "немецкий",
	pl: "польский",
	lt: "литовский",
	fr: "французский",
	it: "итальянский",
	es: "испанский",
	fi: "финский",
	sv: "шведский",
	no: "норвежский",
	zh: "китайский (упрощённый)"
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

// Manager-промпт пока не multi-tenant — данные ресторана прибиты к "Янтарному берегу".
// TODO: вынести в restaurant config (multi-tenant) когда появится /admin CMS.
const MANAGER_PROMPT = `Ты — менеджер ресторана «{{restaurant}}».
Отвечай на вопросы о заведении: режим работы, бронирование, Wi-Fi, парковка, детские стулья и т.д.
НЕ рекомендуй блюда — для этого есть AI-помощник.
Отвечай кратко, 1-2 предложения. Отвечай СТРОГО на языке: {{lang}}.

Информация о ресторане (пример для Янтарного берега — будет заменена на per-tenant config):
- Адрес: г. Калининград, ул. Ленинский проспект, 17
- Режим работы: Пн-Чт 12:00-23:00, Пт-Сб 12:00-01:00, Вс 12:00-22:00
- Бронирование: по телефону +7 (4012) 555-123
- Wi-Fi: есть, бесплатный
- Парковка: бесплатная на 20 мест за зданием
- Детские стулья: есть, 5 штук
- Средний чек: 1500-2500₽ на персону
- Кухня закрывается за 1 час до закрытия ресторана`;

function setCors(res) {
	for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

function buildSystemPrompt(agent, style, catalog, restaurantName, lang) {
	const restName = restaurantName || "наш ресторан";
	const langName = LANG_NAMES[lang] || LANG_NAMES.ru;

	if (agent === "verifier") {
		return VERIFIER_PROMPT + "\n\nКАТАЛОГ:\n" + catalog;
	}
	if (agent === "manager") {
		return MANAGER_PROMPT
			.replaceAll("{{restaurant}}", restName)
			.replaceAll("{{lang}}", langName);
	}
	const intro = (STYLE_INTROS[style] || STYLE_INTROS.detailed).replaceAll("{{restaurant}}", restName);
	const rules = MENU_RULES.replaceAll("{{lang}}", langName);
	return `${intro}\n${rules}\nКАТАЛОГ РЕСТОРАНА «${restName}»:\n${catalog}`;
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

	const apiKey = process.env.OPENROUTER_API_KEY;
	if (!apiKey) {
		res.status(500).json({ error: "OPENROUTER_API_KEY not configured" });
		return;
	}

	const {
		agent = "waiter",
		style = "detailed",
		message,
		history = [],
		catalog = "",
		lang = "ru",
		restaurantName = "",
		stream = true
	} = req.body || {};

	// Валидация входа — отсечь мусор до OpenRouter
	const validError = validateChatInput({ message, catalog, history });
	if (validError) {
		res.status(400).json({ error: validError });
		return;
	}

	// Rate limit по IP — защита от злоупотребления токенами
	const rl = await limitChat(req);
	if (!rl.ok) {
		rateLimitResponse(res, rl);
		return;
	}

	// Analytics logging — visible in Vercel Function Logs
	console.log(JSON.stringify({
		event: "chat",
		agent,
		style,
		lang,
		restaurantName,
		messagePreview: message.slice(0, 100),
		timestamp: new Date().toISOString()
	}));

	const systemPrompt = buildSystemPrompt(agent, style, catalog, restaurantName, lang);

	const messages = [
		{ role: "system", content: systemPrompt },
		...history.slice(-20),
		{ role: "user", content: message }
	];

	const orBody = {
		model: MODEL,
		messages,
		max_tokens: agent === "verifier" ? 256 : 400,
		temperature: agent === "verifier" ? 0.1 : 0.3,
		stream: stream !== false
	};

	try {
		const orRes = await fetch(OPENROUTER_URL, {
			method: "POST",
			headers: {
				"Authorization": `Bearer ${apiKey}`,
				"Content-Type": "application/json",
				"Accept-Encoding": "identity",
				"HTTP-Referer": "https://kokolsk1y.github.io/table-mind/",
				"X-Title": "TableMind"
			},
			body: JSON.stringify(orBody)
		});

		if (!orRes.ok) {
			const errText = await orRes.text();
			res.status(orRes.status).json({ error: errText });
			return;
		}

		// Non-streaming (verifier)
		if (stream === false) {
			const data = await orRes.json();
			const content = data.choices?.[0]?.message?.content || "";
			try {
				const parsed = JSON.parse(content);
				res.status(200).json(parsed);
			} catch {
				res.status(200).json({ verdict: "ok", raw: content });
			}
			return;
		}

		// Streaming
		res.setHeader("Content-Type", "text/event-stream");
		res.setHeader("Cache-Control", "no-cache, no-transform");
		res.setHeader("Connection", "keep-alive");
		res.setHeader("X-Accel-Buffering", "no");
		res.setHeader("Transfer-Encoding", "chunked");
		res.flushHeaders();

		const reader = orRes.body.getReader();
		const decoder = new TextDecoder();

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;
			const chunk = decoder.decode(value, { stream: true });
			res.write(chunk);
			if (typeof res.flush === "function") res.flush();
		}

		res.end();
	} catch (err) {
		if (!res.headersSent) {
			res.status(500).json({ error: err.message || "Internal server error" });
		} else {
			res.end();
		}
	}
}
