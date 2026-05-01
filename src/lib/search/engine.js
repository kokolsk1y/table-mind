import MiniSearch from "minisearch";
import { getName, getDescription } from "$lib/data/catalog.js";

let searchEngine = null;

/**
 * Создаёт MiniSearch индекс по items.
 * Multi-lang: индексируем все языки в одно поле, чтобы поиск работал
 * вне зависимости от текущего языка гостя ("strogonina" найдётся и по EN
 * и по RU запросу).
 */
export function createSearchEngine(items) {
	searchEngine = new MiniSearch({
		fields: ["nameAll", "descriptionAll", "tagsJoined"],
		storeFields: ["id"],
		searchOptions: {
			boost: { nameAll: 3, tagsJoined: 2, descriptionAll: 1 },
			fuzzy: 0.2,
			prefix: true
		}
	});

	const docs = (items || []).map((item) => {
		// Для multi-lang структуры name = {ru, en, ...} — собираем все языки в одну строку.
		// Для legacy structure name = "string" — getName с разными lang вернёт ту же строку.
		const nameAll = item?.name && typeof item.name === "object"
			? Object.values(item.name).filter(Boolean).join(" ")
			: getName(item, "ru");
		const descriptionAll = item?.description && typeof item.description === "object"
			? Object.values(item.description).filter(Boolean).join(" ")
			: getDescription(item, "ru");
		return {
			id: item.id,
			nameAll,
			descriptionAll,
			tagsJoined: (item.tags || []).join(" ")
		};
	});

	searchEngine.addAll(docs);
	return searchEngine;
}

export function searchItems(query, items) {
	if (!searchEngine) return items;
	if (!query || !query.trim()) return items;

	const results = searchEngine.search(query.trim());
	if (results.length === 0) return [];

	const idSet = new Set(results.map((r) => r.id));
	return (items || []).filter((item) => idSet.has(item.id));
}
