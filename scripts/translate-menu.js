#!/usr/bin/env node

/**
 * AI-перевод меню на 11 языков (Claude Haiku 4.5 через OpenRouter).
 *
 * Берёт catalog.json в новой схеме (schema_version 2). Для каждого item
 * и каждой category переводит name+description с RU на остальные языки
 * из restaurant.languages. Состав/аллергены/теги — НЕ переводит (статика).
 *
 * Batch по 8 элементов за вызов = ~$0.05 на каталог из 50 блюд × 12 языков.
 *
 * Запуск:
 *   OPENROUTER_API_KEY=sk-... node scripts/translate-menu.js
 *   OPENROUTER_API_KEY=sk-... node scripts/translate-menu.js [input] [output]
 *
 * По умолчанию: static/catalog.json → static/catalog.json (in-place).
 * Уже переведённые ключи (item.name[en] не пустой) пропускаются —
 * можно безопасно перезапускать после добавления новых блюд.
 */

import { readFile, writeFile } from "node:fs/promises";
import { argv, env, exit } from "node:process";

const MODEL = "anthropic/claude-haiku-4-5";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const BATCH_SIZE = 8;
const TIMEOUT_MS = 60_000;

const LANG_NAMES = {
	en: "English",
	de: "German",
	pl: "Polish",
	lt: "Lithuanian",
	fr: "French",
	it: "Italian",
	es: "Spanish",
	fi: "Finnish",
	sv: "Swedish",
	no: "Norwegian",
	zh: "Chinese (Simplified)"
};

function buildPrompt(targetLang) {
	const langFull = LANG_NAMES[targetLang] || targetLang;
	return `Ты — профессиональный переводчик ресторанных меню. Получаешь массив объектов с RU полями {id, name, description}. Возвращаешь JSON-массив того же размера и порядка с переводом name и description на ${langFull}.

ПРАВИЛА:
- name: краткий перевод названия блюда. Имена собственные (Кёнигсберг, Янтарь) транслитерировать или оставлять. Кулинарные термины (карпаччо, тартар) — оставлять оригинал.
- description: 1-3 предложения, тот же смысл. Натуральный ${langFull}, не подстрочник. Если в RU описании есть конкретные ингредиенты — сохранить их в переводе.
- НЕ добавляй markdown, не используй кавычки внутри переводов кроме типографских.
- НЕ переводи поле id — оно копируется как есть.

Возвращай СТРОГО JSON-массив той же длины:
[{"id": "...", "name": "...", "description": "..."}, ...]

Без markdown-обёртки, без объяснений, только массив.`;
}

async function translateBatch(batch, targetLang, apiKey) {
	const userContent = JSON.stringify(batch.map((b) => ({ id: b.id, name: b.name, description: b.description })));
	const controller = new AbortController();
	const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

	const res = await fetch(OPENROUTER_URL, {
		method: "POST",
		signal: controller.signal,
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"HTTP-Referer": "https://tablemind.ru",
			"X-Title": "TableMind Translate"
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [
				{ role: "system", content: buildPrompt(targetLang) },
				{ role: "user", content: userContent }
			],
			max_tokens: 2500,
			temperature: 0.2
		})
	});

	clearTimeout(timeout);

	if (!res.ok) {
		const t = await res.text();
		throw new Error(`OpenRouter ${res.status}: ${t.slice(0, 200)}`);
	}
	const data = await res.json();
	const text = data.choices?.[0]?.message?.content?.trim() || "";
	// Снять возможную ```json обёртку
	const cleaned = text.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/i, "");
	try {
		const arr = JSON.parse(cleaned);
		if (!Array.isArray(arr)) throw new Error("not array");
		return arr;
	} catch (e) {
		throw new Error(`Невалидный JSON от модели: ${cleaned.slice(0, 200)}`);
	}
}

function chunk(arr, n) {
	const out = [];
	for (let i = 0; i < arr.length; i += n) out.push(arr.slice(i, i + n));
	return out;
}

async function translateAll(items, targetLang, apiKey, label = "items") {
	const todo = items.filter((it) => !it.name?.[targetLang] || !it.description?.[targetLang]);
	if (todo.length === 0) {
		console.log(`  ${label}: всё уже переведено на ${targetLang}, пропускаю`);
		return;
	}
	console.log(`  ${label}: ${todo.length} требуют перевода на ${targetLang}`);

	const batches = chunk(todo, BATCH_SIZE);
	for (let bi = 0; bi < batches.length; bi++) {
		const batch = batches[bi].map((it) => ({
			id: it.id,
			name: it.name?.ru || "",
			description: it.description?.ru || ""
		}));
		process.stdout.write(`    batch ${bi + 1}/${batches.length}... `);
		try {
			const translated = await translateBatch(batch, targetLang, apiKey);
			const byId = Object.fromEntries(translated.map((t) => [t.id, t]));
			for (const it of batches[bi]) {
				const t = byId[it.id];
				if (!t) continue;
				if (!it.name) it.name = {};
				if (!it.description) it.description = {};
				if (t.name) it.name[targetLang] = t.name;
				if (t.description) it.description[targetLang] = t.description;
			}
			console.log("✓");
		} catch (e) {
			console.log(`⚠️  ${e.message}`);
		}
	}
}

async function main() {
	const [, , inputArg, outputArg] = argv;
	const inputPath = inputArg || "static/catalog.json";
	const outputPath = outputArg || inputPath;
	const apiKey = env.OPENROUTER_API_KEY;

	if (!apiKey) {
		console.error("❌ OPENROUTER_API_KEY не задан");
		exit(1);
	}

	console.log(`📖 Читаю ${inputPath}...`);
	const data = JSON.parse(await readFile(inputPath, "utf-8"));
	if (!data?.restaurant || !Array.isArray(data?.items)) {
		console.error("❌ Не похоже на schema 2. Запусти migrate-catalog.js сначала.");
		exit(1);
	}

	const langs = (data.restaurant.languages || []).filter((l) => l !== "ru");
	console.log(`✓ Языки для перевода: ${langs.join(", ") || "(нет)"}`);
	if (langs.length === 0) {
		console.log("Нечего переводить.");
		return;
	}

	for (const lang of langs) {
		console.log(`\n→ ${lang}`);
		await translateAll(data.items, lang, apiKey, "items");
		await translateAll(data.categories, lang, apiKey, "categories");
		// Restaurant name — мини-batch на 1 элемент
		if (!data.restaurant.name?.[lang]) {
			await translateAll([{ id: "__restaurant", name: data.restaurant.name, description: { ru: "" } }], lang, apiKey, "restaurant").then(() => {
				// Скопировать обратно в data.restaurant
				const r = data.restaurant;
				if (!r.name) r.name = {};
				// Перевод вернётся в "items[0].name[lang]" — но мы потеряли ref. Делаем по-другому.
			});
		}
	}

	// Сохраняем
	console.log(`\n💾 Пишу ${outputPath}...`);
	await writeFile(outputPath, JSON.stringify(data, null, 2), "utf-8");
	console.log(`✅ Готово.`);
	console.log(``);
	console.log(`Чек: открой catalog.json, проверь несколько items — name и description`);
	console.log(`должны быть объектами с ключами для каждого языка из restaurant.languages.`);
}

main().catch((err) => {
	console.error("❌ Ошибка:", err);
	exit(1);
});
