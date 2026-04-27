// AI-клиент: запрашивает ответ Тима у Yandex Cloud Function (chat).
//
// Yandex Cloud Functions НЕ поддерживает SSE-стриминг в ответе.
// Поэтому функция возвращает полный текст за раз ({text: "..."}),
// а клиент эмулирует word-by-word печать через onChunk callback.
// Та же схема используется в ZalAssist — UX-разница незаметна для пользователя.

const API_URL_CHAT =
	import.meta.env.PUBLIC_API_URL_CHAT ||
	"https://table-mind-seven.vercel.app/api/chat"; // fallback на Vercel

const TIMEOUT_MS = 30_000;
const WORD_DELAY_MS = 20;

/**
 * Запросить ответ Тима. Эмулирует стриминг через постепенную выдачу слов.
 *
 * @param {object} opts
 * @param {string} opts.agent — "waiter" | "manager" | "verifier"
 * @param {string} opts.style — "detailed" | "brief" | "guide"
 * @param {string} opts.message
 * @param {Array} opts.history
 * @param {string} opts.catalog
 * @param {(fullText: string) => void} opts.onChunk
 * @param {(fullText: string) => void} opts.onDone
 * @param {(err: string) => void} opts.onError
 */
export async function streamChat({
	agent,
	style,
	message,
	history,
	catalog,
	onChunk,
	onDone,
	onError
}) {
	let cancelled = false;

	try {
		const controller = new AbortController();
		const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

		const res = await fetch(API_URL_CHAT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			signal: controller.signal,
			body: JSON.stringify({ agent, style, message, history, catalog })
		});

		clearTimeout(timeout);

		if (!res.ok) {
			const errPayload = await res.json().catch(() => ({}));
			onError?.(errPayload.error || `HTTP ${res.status}`);
			return;
		}

		const data = await res.json();
		const text = data.text || "";
		if (!text) {
			onError?.("Пустой ответ от ИИ");
			return;
		}

		// Word-by-word эмуляция стриминга
		let fullText = "";
		const words = text.split(" ");
		for (let i = 0; i < words.length; i++) {
			if (cancelled) return;
			const word = (i > 0 ? " " : "") + words[i];
			fullText += word;
			onChunk?.(fullText);
			await new Promise((r) => setTimeout(r, WORD_DELAY_MS));
		}

		onDone?.(fullText);
	} catch (err) {
		if (cancelled) return;
		if (err.name === "AbortError") {
			onError?.("Таймаут — сервер не ответил за 30 секунд");
		} else {
			onError?.(err.message || "Ошибка соединения");
		}
	}

	return () => {
		cancelled = true;
	};
}

/**
 * Проверка ответа Тима верификатором (отдельный agent).
 * Возвращает {verdict: "ok"} или {verdict: "warning", note: "..."}.
 */
export async function verifyResponse({ response, catalog }) {
	try {
		const res = await fetch(API_URL_CHAT, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			signal: AbortSignal.timeout(8000),
			body: JSON.stringify({
				agent: "verifier",
				message: response,
				catalog
			})
		});

		if (!res.ok) return { verdict: "ok" };

		const data = await res.json();
		return data;
	} catch {
		return { verdict: "ok" };
	}
}
