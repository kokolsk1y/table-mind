export function extractDishes(text, catalogItems) {
	const found = [];
	const seen = new Set();

	for (const item of catalogItems) {
		if (!item.id || item.id.length < 3) continue;
		if (text.includes(item.id) && !seen.has(item.id)) {
			found.push(item);
			seen.add(item.id);
		}
	}

	return found;
}
