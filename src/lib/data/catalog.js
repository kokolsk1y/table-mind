import { base } from "$app/paths";

let catalogCache = null;

export async function loadCatalog() {
	if (catalogCache) return catalogCache;
	const response = await fetch(`${base}/catalog.json`);
	catalogCache = await response.json();
	return catalogCache;
}

export function getCategories(items) {
	const order = [
		"Холодные закуски", "Тёплые закуски", "Салаты", "Супы",
		"Рыба и морепродукты", "Стейки и мясо", "Паста и ризотто",
		"Гарниры", "Детское меню", "Десерты",
		"Безалкогольные напитки", "Авторские коктейли", "Вино", "Пиво и сидр"
	];
	const present = new Set(items.map(i => i.category));
	return order.filter(c => present.has(c));
}

export function getTags(items) {
	const tagSet = new Set();
	items.forEach(item => item.tags.forEach(t => tagSet.add(t)));
	const priority = ["веган", "вегетарианское", "без глютена", "острое", "детское", "хит", "новинка", "авторское", "сезонное", "локальное"];
	return priority.filter(t => tagSet.has(t));
}
