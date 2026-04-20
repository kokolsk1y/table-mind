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

function setCors(res) {
	for (const [k, v] of Object.entries(CORS_HEADERS)) res.setHeader(k, v);
}

function buildSystemPrompt(agent, style, catalog) {
	if (agent === "verifier") {
		return VERIFIER_PROMPT + "\n\nКАТАЛОГ:\n" + catalog;
	}
	if (agent === "manager") {
		return MANAGER_PROMPT;
	}
	const intro = STYLE_INTROS[style] || STYLE_INTROS.detailed;
	return `${intro}\n${MENU_RULES}\nКАТАЛОГ РЕСТОРАНА «ЯНТАРНЫЙ БЕРЕГ»:\n${catalog}`;
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

	const { agent = "waiter", style = "detailed", message, history = [], catalog = "", stream = true } = req.body || {};

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
		messagePreview: message.slice(0, 100),
		timestamp: new Date().toISOString()
	}));

	const systemPrompt = buildSystemPrompt(agent, style, catalog);

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
