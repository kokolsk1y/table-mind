<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { session } from "$lib/stores/session.svelte.js";
	import { loadCatalog } from "$lib/data/catalog.js";
	import { formatCatalogForAI } from "$lib/ai/prompt.js";
	import { streamChat } from "$lib/ai/client.js";

	/** @type {any} */
	let catalog = $state(null);
	/** @type {any[]} */
	let allItems = $derived(catalog?.items || []);
	/** @type {string} */
	let restaurantName = $derived(catalog?.restaurant?.name?.ru || "");
	let step = $state(0);
	/** @type {Record<string, string>} */
	let answers = $state({});
	let loading = $state(false);
	/** @type {string | null} */
	let results = $state(null);
	let resultText = $state("");

	const questions = [
		{
			key: "mood",
			text: "На что вы настроены?",
			options: [
				{ label: "Лёгкий перекус", value: "лёгкое" },
				{ label: "Плотный ужин", value: "сытное" },
				{ label: "Что-то особенное", value: "необычное" }
			]
		},
		{
			key: "restriction",
			text: "Есть ограничения?",
			options: [
				{ label: "Нет ограничений", value: "нет" },
				{ label: "Без мяса", value: "без мяса" },
				{ label: "Без глютена", value: "без глютена" },
				{ label: "Без молочного", value: "без молочного" }
			]
		},
		{
			key: "spicy",
			text: "Острое?",
			options: [
				{ label: "Люблю", value: "люблю" },
				{ label: "Нейтрально", value: "нейтрально" },
				{ label: "Не ем", value: "не ем" }
			]
		},
		{
			key: "portion",
			text: "Формат?",
			options: [
				{ label: "Одно блюдо", value: "одно блюдо" },
				{ label: "Полный сет", value: "полный сет" },
				{ label: "Закуски на компанию", value: "закуски" }
			]
		},
		{
			key: "drink",
			text: "Напиток?",
			options: [
				{ label: "Алкоголь", value: "алкоголь" },
				{ label: "Безалкогольное", value: "безалкогольное" },
				{ label: "На ваш выбор", value: "на выбор AI" }
			]
		}
	];

	/** @param {string} key; @param {string} value */
	function selectAnswer(key, value) {
		answers = { ...answers, [key]: value };
		if (step < questions.length - 1) {
			step++;
		} else {
			generateResult();
		}
	}

	async function generateResult() {
		loading = true;
		resultText = "";

		const prefs = Object.entries(answers)
			.map(([k, v]) => `${k}: ${v}`)
			.join(", ");
		const lang = session.currentLang;
		const catalogText = formatCatalogForAI(allItems, lang);

		const message = `Гость прошёл тест. Предпочтения: ${prefs}.
Составь 3 комплекса. Каждому дай короткое яркое название.
Используй ТОЛЬКО блюда из каталога.

ВАЖНО: пиши ТОЛЬКО простым текстом. Без маркдауна, без звёздочек, без решёток, без ---. Просто текст.

Формат ответа (строго):

Острый балтийский вечер

Креветки в чесночном масле — 750₽
Том-ям с морепродуктами — 690₽
Янтарь Шприц — 590₽
Итого: 2 030₽

(пустая строка между комплексами, итого без звёздочек)`;

		streamChat({
			agent: "waiter",
			style: "detailed",
			message,
			history: [],
			catalog: catalogText,
			lang,
			restaurantName,
			onChunk(text) {
				resultText = text;
			},
			onDone(text) {
				resultText = text;
				loading = false;
				results = text;
			},
			onError(err) {
				resultText = `Ошибка: ${err}`;
				loading = false;
			}
		});
	}

	function restart() {
		step = 0;
		answers = {};
		results = null;
		resultText = "";
	}

	const today = new Date();
	const monthsRoman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
	const dateStr = `${String(today.getDate()).padStart(2, "0")} · ${monthsRoman[today.getMonth()]} · ${String(today.getFullYear()).slice(-2)}`;

	const stepRoman = $derived(["I", "II", "III", "IV", "V"][step] ?? String(step + 1));

	onMount(async () => {
		catalog = await loadCatalog();
		if (catalog?.restaurant?.id) {
			session.setRestaurant(catalog.restaurant.id);
		}
	});
</script>

<div class="flex flex-col min-h-screen">
	<!-- Masthead -->
	<div class="px-5 pt-3 pb-2 border-b border-base-content/20 flex items-center justify-between masthead shrink-0">
		<span>Карта — №003</span>
		<span>{dateStr}</span>
		<span>Стол · {session.tableNumber ?? "07"}</span>
	</div>

	<!-- Header -->
	<div class="flex items-center justify-between px-5 py-3 border-b border-base-content/20 shrink-0">
		<a href="{base}/" class="masthead text-base-content flex items-center gap-2">
			<span class="text-base text-base-content leading-none">×</span>
			<span>К меню</span>
		</a>
		<div class="text-center">
			<div class="font-display italic text-xl text-base-content leading-none">Подбор</div>
			<div class="font-mono text-[10px] tracking-[0.18em] text-base-content/55 uppercase mt-1.5">собираем комплекс</div>
		</div>
		<div class="w-14"></div>
	</div>

	{#if results || loading}
		<!-- Results -->
		<div class="flex-1 px-5 py-7 overflow-y-auto">
			<div class="font-mono text-[11px] tracking-[0.18em] text-accent uppercase mb-4">Тим подобрал комплексы</div>
			<h2 class="font-display italic text-[32px] font-medium text-base-content mb-6 leading-tight">
				Ваши комплексы
			</h2>
			<div class="border-t border-base-content/40 border-b py-6">
				{#if resultText}
					<pre class="whitespace-pre-wrap text-base text-base-content leading-relaxed font-body">{resultText}</pre>
				{:else}
					<div class="flex items-center gap-3 py-10 justify-center">
						<span class="loading loading-dots loading-md text-primary"></span>
						<span class="font-display italic text-base text-base-content/65">подбираю…</span>
					</div>
				{/if}
			</div>
			{#if !loading}
				<div class="flex gap-3 mt-7">
					<button
						class="flex-1 border-[1.5px] border-base-content py-4 font-body font-medium text-base text-base-content active:bg-base-200"
						onclick={restart}
					>
						Заново
					</button>
					<a
						href="{base}/"
						class="flex-1 bg-primary text-primary-content py-4 font-body font-semibold text-base flex items-center justify-center"
					>
						К меню
					</a>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Quiz -->
		<div class="flex-1 flex flex-col px-5 py-7 max-w-md mx-auto w-full">
			<!-- Progress dots -->
			<div class="flex gap-1.5 justify-center mb-12">
				{#each questions as _q, i (i)}
					<div
						class="w-7 h-[3px] transition-colors {i < step ? 'bg-primary' : i === step ? 'bg-accent' : 'bg-base-content/20'}"
					></div>
				{/each}
			</div>

			<!-- Question -->
			<div class="mb-10">
				<div class="font-mono text-[11px] tracking-[0.18em] text-accent uppercase mb-3">Вопрос {stepRoman}</div>
				<h2 class="font-display italic text-[32px] font-medium text-base-content leading-[1.1]">
					{questions[step].text}
				</h2>
			</div>

			<!-- Options -->
			<div class="flex flex-col flex-1">
				{#each questions[step].options as opt, oi (opt.value)}
					<button
						class="flex items-baseline gap-3 py-5 px-2 border-b border-dotted border-base-content/30 active:bg-base-200 transition-colors text-left group"
						onclick={() => selectAnswer(questions[step].key, opt.value)}
					>
						<span class="font-mono tabular text-xs text-accent tracking-[0.14em] w-7 shrink-0 pt-1">{String(oi + 1).padStart(2, "0")}</span>
						<span class="flex-1 font-body font-semibold text-[17px] text-base-content leading-snug">
							{opt.label}
						</span>
						<span class="font-mono tabular text-base text-accent shrink-0 group-active:translate-x-1 transition-transform">→</span>
					</button>
				{/each}
			</div>

			<!-- Step counter -->
			<p class="text-center font-mono text-xs tracking-[0.16em] text-base-content/55 mt-7 uppercase">
				{step + 1} из {questions.length}
			</p>
		</div>
	{/if}

	<div class="px-5 py-3 border-t border-base-content/15 safe-bottom">
		<p class="font-display italic text-xs text-base-content/50 text-center">
			Данные об аллергенах уточняйте у официанта
		</p>
	</div>
</div>
