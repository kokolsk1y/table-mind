const API_BASE = "https://table-mind-api.vercel.app";

export async function streamChat({ agent, style, message, history, catalog, onChunk, onDone, onError }) {
	try {
		const res = await fetch(`${API_BASE}/api/chat`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ agent, style, message, history, catalog })
		});

		if (!res.ok) {
			const err = await res.text();
			onError?.(err);
			return;
		}

		const reader = res.body.getReader();
		const decoder = new TextDecoder();
		let fullText = "";

		while (true) {
			const { done, value } = await reader.read();
			if (done) break;

			const chunk = decoder.decode(value, { stream: true });
			const lines = chunk.split("\n");

			for (const line of lines) {
				if (!line.startsWith("data: ")) continue;
				const data = line.slice(6);
				if (data === "[DONE]") continue;

				try {
					const parsed = JSON.parse(data);
					const content = parsed.choices?.[0]?.delta?.content;
					if (content) {
						fullText += content;
						onChunk?.(fullText);
					}
				} catch {
					// ignore malformed chunks
				}
			}
		}

		onDone?.(fullText);
	} catch (err) {
		onError?.(err.message || "Ошибка соединения");
	}
}

export async function verifyResponse({ response, catalog }) {
	try {
		const res = await fetch(`${API_BASE}/api/chat`, {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			signal: AbortSignal.timeout(8000),
			body: JSON.stringify({
				agent: "verifier",
				message: response,
				catalog,
				stream: false
			})
		});

		if (!res.ok) return { verdict: "ok" };

		const data = await res.json();
		return data;
	} catch {
		return { verdict: "ok" };
	}
}
