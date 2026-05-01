import { base } from "$app/paths";

/** @type {any} */
let catalogCache = null;

/**
 * Загружает каталог. Поддерживает обе схемы:
 *  - schema 2 (новая, multi-lang): объект { restaurant, categories, items }
 *  - schema 1 (legacy): плоский массив items с category-string
 *
 * При schema 1 — на лету конвертирует в schema 2 чтобы UI работал единообразно.
 */
export async function loadCatalog() {
	if (catalogCache) return catalogCache;
	const response = await fetch(`${base}/catalog.json`);
	const data = await response.json();
	catalogCache = normalizeSchema(data);
	return catalogCache;
}

/** Schema 1 (плоский массив) → Schema 2 (объект). Совместимость.
 * @param {any} data */
function normalizeSchema(data) {
	if (!Array.isArray(data)) return data; // уже schema 2
	const categoryNames = [...new Set(data.map((i) => i.category))];
	return {
		schema_version: 2,
		restaurant: { id: "default", name: { ru: "Ресторан" }, languages: ["ru"] },
		categories: categoryNames.map((name, idx) => ({
			id: name,
			order: idx + 1,
			name: { ru: name }
		})),
		items: data.map((item) => ({
			...item,
			category_id: item.category,
			name: { ru: item.name },
			description: { ru: item.description ?? "" },
			ingredients: []
		}))
	};
}

// ============================================================
// HELPERS — используются UI компонентами для multi-lang выборки
// ============================================================

/** Возвращает локализованное имя блюда. Fallback на RU если перевода нет. */
export function getName(item, lang = "ru") {
	if (!item?.name) return "";
	if (typeof item.name === "string") return item.name; // legacy fallback
	return item.name[lang] || item.name.ru || "";
}

/** Локализованное описание блюда. */
export function getDescription(item, lang = "ru") {
	if (!item?.description) return "";
	if (typeof item.description === "string") return item.description;
	return item.description[lang] || item.description.ru || "";
}

/** Локализованное имя категории. */
export function getCategoryName(category, lang = "ru") {
	if (!category?.name) return "";
	if (typeof category.name === "string") return category.name;
	return category.name[lang] || category.name.ru || "";
}

/** Имя ресторана на нужном языке. */
export function getRestaurantName(catalog, lang = "ru") {
	const r = catalog?.restaurant;
	if (!r?.name) return "";
	if (typeof r.name === "string") return r.name;
	return r.name[lang] || r.name.ru || "";
}

// ============================================================
// QUERIES — выборки по каталогу
// ============================================================

/** Возвращает items, отсортированные по порядку категорий из catalog.categories. */
export function getItems(catalog) {
	return catalog?.items || [];
}

/** Возвращает категории каталога в правильном порядке (отсортированные по order). */
export function getCategories(catalog) {
	const cats = catalog?.categories || [];
	return [...cats].sort((a, b) => (a.order || 999) - (b.order || 999));
}

/** Возвращает items конкретной категории. */
export function getItemsByCategory(catalog, categoryId) {
	return (catalog?.items || []).filter((i) => i.category_id === categoryId);
}

/** Уникальные теги из items, отсортированные по приоритету. */
export function getTags(items) {
	const tagSet = new Set();
	(items || []).forEach((item) => (item.tags || []).forEach((t) => tagSet.add(t)));
	const priority = [
		"веган",
		"вегетарианское",
		"без глютена",
		"острое",
		"детское",
		"хит",
		"новинка",
		"авторское",
		"сезонное",
		"локальное"
	];
	return priority.filter((t) => tagSet.has(t));
}
