import MiniSearch from "minisearch";

let searchEngine = null;

export function createSearchEngine(items) {
	searchEngine = new MiniSearch({
		fields: ["name", "description", "category", "tagsJoined"],
		storeFields: ["id"],
		searchOptions: {
			boost: { name: 3, tagsJoined: 2, category: 1.5, description: 1 },
			fuzzy: 0.2,
			prefix: true
		}
	});

	const docs = items.map(item => ({
		...item,
		tagsJoined: item.tags.join(" ")
	}));

	searchEngine.addAll(docs);
	return searchEngine;
}

export function searchItems(query, items) {
	if (!searchEngine) return items;
	if (!query || !query.trim()) return items;

	const results = searchEngine.search(query.trim());
	if (results.length === 0) return [];

	const idSet = new Set(results.map(r => r.id));
	return items.filter(item => idSet.has(item.id));
}
