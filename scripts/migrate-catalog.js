#!/usr/bin/env node

/**
 * Миграция catalog.json со старой плоской схемы на новую multi-lang.
 *
 * Старая (flat array):
 *   [{ id, name: "string", category: "Холодные закуски", description: "string", ... }]
 *
 * Новая (multi-lang object):
 *   {
 *     restaurant: { id, name: {ru, en, ...}, languages },
 *     categories: [{ id, order, name: {ru, en, ...} }],
 *     items: [{ id, category_id, name: {ru, ...}, description: {ru, ...}, ingredients: [], ... }]
 *   }
 *
 * Запуск:
 *   node scripts/migrate-catalog.js [input.json] [output.json]
 *   По умолчанию: static/catalog.json → static/catalog.json (с backup'ом catalog-legacy.json)
 *
 * AI вызовов НЕ делает — только структурное преобразование. Все языки
 * кроме `ru` остаются пустыми, заполняются позже через translate-menu.js.
 */

import { readFile, writeFile, copyFile } from "node:fs/promises";
import { argv, exit } from "node:process";
import path from "node:path";

const SUPPORTED_LANGUAGES = ["ru", "en", "de", "pl", "lt", "fr", "it", "es", "fi", "sv", "no", "zh"];

// Дефолтный ресторан — будет переопределяться при подключении новых клиентов.
const DEFAULT_RESTAURANT = {
	id: "yantarniy-bereg",
	name: {
		ru: "Янтарный берег",
		en: "Amber Coast"
	},
	city: "Калининград",
	languages: SUPPORTED_LANGUAGES
};

// Каноничный порядок категорий (был захардкожен в catalog.js — теперь в данных).
const CATEGORY_ORDER = [
	"Холодные закуски",
	"Тёплые закуски",
	"Салаты",
	"Супы",
	"Рыба и морепродукты",
	"Стейки и мясо",
	"Паста и ризотто",
	"Гарниры",
	"Детское меню",
	"Десерты",
	"Безалкогольные напитки",
	"Авторские коктейли",
	"Вино",
	"Пиво и сидр"
];

/** Slugify русского названия в id-friendly строку. */
function categorySlug(name) {
	const map = {
		а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "e", ж: "zh",
		з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
		п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "c",
		ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
	};
	return name
		.toLowerCase()
		.split("")
		.map((ch) => map[ch] ?? ch)
		.join("")
		.replace(/[^a-z0-9\s-]/gi, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

/** Создаёт пустой multilang объект с заданным RU значением. */
function mlString(ruValue) {
	const obj = { ru: ruValue };
	// Остальные языки оставляем undefined — translate-menu.js заполнит.
	return obj;
}

/** Парсит description строку и пытается выделить ingredients-список (наивно).
 *  Из старых описаний типа "Блюдо с А, Б и В. Подаётся с Г." вытаскиваем "А, Б, В, Г".
 *  Если не получилось — возвращаем пустой массив, ресторан заполнит руками в /admin.
 */
function extractIngredientsFromDescription(description) {
	// На текущем этапе НЕ извлекаем — слишком ненадёжно.
	// Старая структура не содержала отдельного поля ingredients,
	// поэтому в migrated данных оставляем пустой массив.
	// Ресторан заполнит точный состав через /admin (когда CMS будет готова),
	// либо через ручной enrich скрипт.
	return [];
}

async function migrate(inputPath, outputPath) {
	console.log(`📖 Читаю ${inputPath}...`);
	const raw = await readFile(inputPath, "utf-8");
	const oldData = JSON.parse(raw);

	if (!Array.isArray(oldData)) {
		console.error("❌ Ожидался массив (старая схема). Получено:", typeof oldData);
		console.error("   Возможно, файл уже мигрирован.");
		exit(1);
	}

	console.log(`✓ Старый каталог: ${oldData.length} блюд`);

	// 1) Собираем уникальные категории.
	const categoryNames = [...new Set(oldData.map((item) => item.category))];
	const orderedCategories = CATEGORY_ORDER.filter((c) => categoryNames.includes(c));
	const unknownCategories = categoryNames.filter((c) => !CATEGORY_ORDER.includes(c));
	if (unknownCategories.length > 0) {
		console.warn(`⚠️  Категории не из CATEGORY_ORDER, добавляю в конец:`, unknownCategories);
		orderedCategories.push(...unknownCategories);
	}

	const categories = orderedCategories.map((name, idx) => ({
		id: categorySlug(name),
		order: idx + 1,
		name: mlString(name)
	}));
	const categoryIdByName = Object.fromEntries(
		categories.map((c) => [c.name.ru, c.id])
	);

	console.log(`✓ Категорий: ${categories.length}`);

	// 2) Преобразуем items.
	const items = oldData.map((old) => {
		const newItem = {
			id: old.id,
			category_id: categoryIdByName[old.category],
			price: old.price,
			weight: old.weight ?? "",
			photo: old.photo ?? "",
			name: mlString(old.name),
			description: mlString(old.description ?? ""),
			ingredients: extractIngredientsFromDescription(old.description ?? ""),
			allergens: Array.isArray(old.allergens) ? old.allergens : [],
			tags: Array.isArray(old.tags) ? old.tags : [],
			spicy: Boolean(old.spicy),
			vegetarian: Boolean(old.vegetarian)
		};
		return newItem;
	});

	// 3) Собираем итоговую структуру.
	const newData = {
		schema_version: 2,
		restaurant: DEFAULT_RESTAURANT,
		categories,
		items
	};

	// 4) Backup старого + запись нового.
	if (inputPath === outputPath) {
		const dir = path.dirname(inputPath);
		const backupPath = path.join(dir, "catalog-legacy.json");
		console.log(`💾 Бэкаплю старый в ${backupPath}...`);
		await copyFile(inputPath, backupPath);
	}

	console.log(`💾 Пишу новый ${outputPath}...`);
	await writeFile(outputPath, JSON.stringify(newData, null, 2), "utf-8");

	console.log(`✅ Готово.`);
	console.log(``);
	console.log(`Что дальше:`);
	console.log(`  1. Запустить translate-menu.js для перевода name+description на 11 языков`);
	console.log(`  2. Обновить src/lib/data/catalog.js — использовать новые helpers`);
	console.log(`  3. Заполнить ingredients вручную через /admin (когда будет готов)`);
}

const [, , inputArg, outputArg] = argv;
const inputPath = inputArg || "static/catalog.json";
const outputPath = outputArg || inputPath;

migrate(inputPath, outputPath).catch((err) => {
	console.error("❌ Ошибка миграции:", err);
	exit(1);
});
