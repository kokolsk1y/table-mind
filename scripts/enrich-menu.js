#!/usr/bin/env node

/**
 * AI-обогащение меню ресторана.
 *
 * Вход: минимальный JSON (name, category, price, ingredients, weight?)
 * Выход: каталог с описаниями, тегами, аллергенами, spicy/vegetarian флагами.
 *
 * Использование:
 *   OPENROUTER_API_KEY=sk-... node scripts/enrich-menu.js input.json output.json
 *   npm run enrich -- input.json output.json
 *
 * Время: ~2-4 сек на блюдо (пачками по 8). Стоимость: ~$0.003 за блюдо на Haiku 4.5.
 */

import { readFile, writeFile } from "node:fs/promises";
import { argv, env, exit } from "node:process";

const MODEL = "anthropic/claude-haiku-4-5";
const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";
const BATCH_SIZE = 8;

const ALLERGENS = [
	"рыба", "ракообразные", "моллюски", "молоко", "яйца",
	"глютен", "орехи", "арахис", "соя", "кунжут",
	"сельдерей", "горчица", "сульфиты", "люпин"
];

const TAGS = [
	"хит", "локальное", "авторское", "новинка",
	"вегетарианское", "веганское", "без глютена", "без лактозы",
	"острое", "халяль", "кошер", "безалкогольное", "детское"
];

const SYSTEM_PROMPT = `Ты — ассистент шефа ресторана. Получаешь минимальные данные о блюдах и должен дописать профессиональное описание, проставить теги и аллергены.

Для КАЖДОГО блюда из входа верни объект:
{
  "description": "2-3 предложения — что это, ключевые ингредиенты, способ приготовления или подачи. Без штампов ('тает во рту', 'нежнейший', 'божественный'). Профессиональный тон, как в авторской меню-карте.",
  "tags": ["массив из списка: ${TAGS.join(", ")}"],
  "allergens": ["массив из списка: ${ALLERGENS.join(", ")}"],
  "spicy": boolean,
  "vegetarian": boolean
}

КРИТИЧНО:
- Аллергены определяй консервативно — лучше указать сомнительный чем пропустить.
- Если в ингредиентах мука/хлеб/паста/панировка — добавь "глютен".
- Если сливки/сыр/сливочное масло/молоко/сметана — добавь "молоко".
- Если креветки/крабы/лангустины — "ракообразные".
- Если мидии/устрицы/осьминог — "моллюски".
- Если соевый соус/тофу — "соя".
- Если кунжутное масло/кунжут — "кунжут".
- Если любая рыба — "рыба".
- Если орехи любые (грецкий, миндаль, фундук, кешью) — "орехи".
- Если арахис отдельно — "арахис" (это не орехи по классификации).
- Если указан чили/перец острый/васаби/харисса — spicy: true.
- Если в составе мясо/рыба/морепродукты/бульон — vegetarian: false.

Возвращай СТРОГО JSON array в том же порядке что вход. Без markdown, без комментариев, без ключа "items", только массив.`;

function slugify(text) {
	const map = {
		а: "a", б: "b", в: "v", г: "g", д: "d", е: "e", ё: "yo", ж: "zh",
		з: "z", и: "i", й: "y", к: "k", л: "l", м: "m", н: "n", о: "o",
		п: "p", р: "r", с: "s", т: "t", у: "u", ф: "f", х: "h", ц: "ts",
		ч: "ch", ш: "sh", щ: "sch", ъ: "", ы: "y", ь: "", э: "e", ю: "yu", я: "ya"
	};
	return text
		.toLowerCase()
		.split("")
		.map((ch) => map[ch] ?? ch)
		.join("")
		.replace(/[^a-z0-9а-яё\s-]/gi, "")
		.replace(/\s+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "");
}

async function enrichBatch(batch, apiKey) {
	const userContent = JSON.stringify(
		batch.map((d) => ({
			name: d.name,
			category: d.category,
			ingredients: d.ingredients ?? "",
			price: d.price,
			weight: d.weight ?? ""
		})),
		null,
		2
	);

	const res = await fetch(OPENROUTER_URL, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${apiKey}`,
			"Content-Type": "application/json",
			"HTTP-Referer": "https://tablemind.ru",
			"X-Title": "TableMind Enrich"
		},
		body: JSON.stringify({
			model: MODEL,
			messages: [
				{ role: "system", content: SYSTEM_PROMPT },
				{ role: "user", content: userContent }
			],
			max_tokens: 2000,
			temperature: 0.4
		})
	});

	if (!res.ok) {
		const txt = await res.text();
		throw new Error(`OpenRouter ${res.status}: ${txt}`);
	}

	const data = await res.json();
	const content = data.choices?.[0]?.message?.content ?? "";

	// Claude иногда оборачивает в ```json ... ```
	const cleaned = content
		.replace(/^```json\s*/i, "")
		.replace(/^```\s*/i, "")
		.replace(/\s*```$/i, "")
		.trim();

	try {
		const parsed = JSON.parse(cleaned);
		if (!Array.isArray(parsed)) {
			throw new Error("response is not an array");
		}
		if (parsed.length !== batch.length) {
			throw new Error(`expected ${batch.length} items, got ${parsed.length}`);
		}
		return parsed;
	} catch (err) {
		throw new Error(`JSON parse failed: ${err.message}\n\nRaw: ${content.slice(0, 500)}`);
	}
}

function merge(input, enrichment) {
	return {
		id: slugify(input.name),
		name: input.name,
		category: input.category,
		description: enrichment.description ?? "",
		price: input.price,
		photo: input.photo ?? "",
		tags: Array.isArray(enrichment.tags) ? enrichment.tags : [],
		allergens: Array.isArray(enrichment.allergens) ? enrichment.allergens : [],
		weight: input.weight ?? "",
		spicy: Boolean(enrichment.spicy),
		vegetarian: Boolean(enrichment.vegetarian)
	};
}

async function main() {
	const [, , inPath, outPath] = argv;

	if (!inPath || !outPath) {
		console.error("Использование: node scripts/enrich-menu.js input.json output.json");
		exit(1);
	}

	const apiKey = env.OPENROUTER_API_KEY;
	if (!apiKey) {
		console.error("ERROR: OPENROUTER_API_KEY не установлен в окружении.");
		console.error("Запусти: OPENROUTER_API_KEY=sk-... node scripts/enrich-menu.js ...");
		exit(1);
	}

	let raw;
	try {
		raw = await readFile(inPath, "utf-8");
	} catch (err) {
		console.error(`Не удалось прочитать ${inPath}: ${err.message}`);
		exit(1);
	}

	let items;
	try {
		items = JSON.parse(raw);
		if (!Array.isArray(items)) throw new Error("input must be an array");
	} catch (err) {
		console.error(`Невалидный JSON: ${err.message}`);
		exit(1);
	}

	console.log(`Входящих блюд: ${items.length}`);
	console.log(`Пачек по ${BATCH_SIZE}: ${Math.ceil(items.length / BATCH_SIZE)}`);
	console.log(`Модель: ${MODEL}`);
	console.log(`Стартуем...\n`);

	const enriched = [];
	for (let i = 0; i < items.length; i += BATCH_SIZE) {
		const batch = items.slice(i, i + BATCH_SIZE);
		const batchNum = Math.floor(i / BATCH_SIZE) + 1;
		const totalBatches = Math.ceil(items.length / BATCH_SIZE);

		process.stdout.write(`[${batchNum}/${totalBatches}] обрабатываю ${batch.length} блюд... `);
		const t0 = Date.now();

		try {
			const enrichments = await enrichBatch(batch, apiKey);
			for (let j = 0; j < batch.length; j++) {
				enriched.push(merge(batch[j], enrichments[j]));
			}
			const ms = Date.now() - t0;
			console.log(`готово за ${(ms / 1000).toFixed(1)}с`);
		} catch (err) {
			console.log(`ОШИБКА`);
			console.error(`  ${err.message}`);
			console.error(`  Прерываю. Частичный результат не сохраняю.`);
			exit(1);
		}
	}

	await writeFile(outPath, JSON.stringify(enriched, null, 2), "utf-8");
	console.log(`\n✓ Сохранено ${enriched.length} блюд в ${outPath}`);

	// Короткий итог по тегам/аллергенам
	const allTags = enriched.flatMap((d) => d.tags);
	const allAllergens = enriched.flatMap((d) => d.allergens);
	const uniqTags = [...new Set(allTags)].sort();
	const uniqAllergens = [...new Set(allAllergens)].sort();

	console.log(`\nТеги в меню: ${uniqTags.join(", ") || "нет"}`);
	console.log(`Аллергены в меню: ${uniqAllergens.join(", ") || "нет"}`);
	console.log(`Острых блюд: ${enriched.filter((d) => d.spicy).length}`);
	console.log(`Вегетарианских: ${enriched.filter((d) => d.vegetarian).length}`);
	console.log(`\nСледующий шаг: проверь описания глазами шефа, поправь что нужно, потом замени static/catalog.json`);
}

main().catch((err) => {
	console.error(`Неожиданная ошибка: ${err.message}`);
	exit(1);
});
