import { getName, getDescription } from "$lib/data/catalog.js";

/**
 * Формирует строковое представление каталога для AI-промпта.
 * Каждый item — одна строка вида:
 *   [id] Имя | Категория | 690₽ | 120 г | Описание | Аллергены: рыба, соя | Теги: хит
 *
 * @param {any[]} items
 * @param {string} [lang="ru"] — язык name/description для отображения. Состав/аллергены
 *   всегда RU (ground truth) — AI должен их трактовать как технические термины.
 */
export function formatCatalogForAI(items, lang = "ru") {
	return (items || [])
		.map((item) => {
			const name = getName(item, lang);
			const description = getDescription(item, lang);
			const allergens =
				Array.isArray(item.allergens) && item.allergens.length > 0
					? item.allergens.join(", ")
					: "не указаны";
			const tags = Array.isArray(item.tags) && item.tags.length > 0 ? item.tags.join(", ") : "";
			const weight = item.weight || "";
			return `[${item.id}] ${name} | ${item.price}₽ | ${weight} | ${description} | Аллергены: ${allergens}${tags ? " | Теги: " + tags : ""}`;
		})
		.join("\n");
}

export function selectItemsForAI(message, history, searchEngine, allItems, maxItems = 40) {
	const itemMap = new Map();

	// 1. Search by current message
	if (searchEngine && message) {
		const results = searchEngine.search(message);
		for (const r of results.slice(0, maxItems)) {
			const item = allItems.find((i) => i.id === r.id);
			if (item) itemMap.set(item.id, item);
		}
	}

	// 2. Add items mentioned in previous AI responses
	if (history && history.length > 0) {
		const assistantText = history
			.filter((m) => m.role === "assistant")
			.map((m) => m.content)
			.join(" ");
		for (const item of allItems) {
			if (assistantText.includes(item.id)) {
				itemMap.set(item.id, item);
			}
		}
	}

	// 3. If too few results, add popular items
	if (itemMap.size < 10) {
		for (const item of allItems) {
			if ((item.tags || []).includes("хит")) {
				itemMap.set(item.id, item);
			}
			if (itemMap.size >= maxItems) break;
		}
	}

	// 4. If still too few, return all (catalog is small enough)
	if (itemMap.size < 10) {
		return allItems;
	}

	return [...itemMap.values()].slice(0, maxItems);
}
