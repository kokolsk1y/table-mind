<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { loadCatalog } from "$lib/data/catalog.js";
	import { formatCatalogForAI } from "$lib/ai/prompt.js";
	import { streamChat } from "$lib/ai/client.js";

	let allItems = $state([]);
	let step = $state(0);
	let answers = $state({});
	let loading = $state(false);
	let results = $state(null);
	let resultText = $state("");

	const questions = [
		{
			key: "mood",
			text: "На что вы настроены?",
			options: [
				{ label: "Лёгкий перекус", icon: "🥗", value: "лёгкое" },
				{ label: "Плотный ужин", icon: "🥩", value: "сытное" },
				{ label: "Что-то особенное", icon: "✨", value: "необычное" }
			]
		},
		{
			key: "restriction",
			text: "Есть ограничения?",
			options: [
				{ label: "Нет ограничений", icon: "👍", value: "нет" },
				{ label: "Без мяса", icon: "🌱", value: "без мяса" },
				{ label: "Без глютена", icon: "🌾", value: "без глютена" },
				{ label: "Без молочного", icon: "🥛", value: "без молочного" }
			]
		},
		{
			key: "spicy",
			text: "Острое?",
			options: [
				{ label: "Люблю", icon: "🌶", value: "люблю" },
				{ label: "Нейтрально", icon: "👌", value: "нейтрально" },
				{ label: "Не ем", icon: "🚫", value: "не ем" }
			]
		},
		{
			key: "portion",
			text: "Формат?",
			options: [
				{ label: "Одно блюдо", icon: "🍽", value: "одно блюдо" },
				{ label: "Полный сет", icon: "🎯", value: "полный сет" },
				{ label: "Закуски на компанию", icon: "🫂", value: "закуски" }
			]
		},
		{
			key: "drink",
			text: "Напиток?",
			options: [
				{ label: "Алкоголь", icon: "🍷", value: "алкоголь" },
				{ label: "Безалкогольное", icon: "🧃", value: "безалкогольное" },
				{ label: "На ваш выбор", icon: "🤷", value: "на выбор AI" }
			]
		}
	];

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

		const prefs = Object.entries(answers).map(([k, v]) => `${k}: ${v}`).join(", ");
		const catalog = formatCatalogForAI(allItems);

		const message = `Гость прошёл тест. Предпочтения: ${prefs}.
Составь 3 комплекса. Каждому дай короткое яркое название с эмодзи.
Используй ТОЛЬКО блюда из каталога.

ВАЖНО: пиши ТОЛЬКО простым текстом. Без маркдауна, без звёздочек, без решёток, без ---. Просто текст.

Формат ответа (строго):

🌶 Острый балтийский вечер

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
			catalog,
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

	onMount(async () => {
		allItems = await loadCatalog();
	});
</script>

<div class="flex flex-col min-h-screen max-w-md mx-auto">
	<!-- Header -->
	<div class="flex items-center gap-3 p-4 border-b border-base-300">
		<a href="{base}/" class="text-base-content/50 text-sm">← Меню</a>
		<h1 class="font-semibold flex-1 text-center">Подбор ужина</h1>
		<div class="w-12"></div>
	</div>

	{#if results || loading}
		<!-- Results -->
		<div class="flex-1 p-5 overflow-y-auto">
			<h2 class="text-lg font-semibold text-primary mb-4">Ваши комплексы</h2>
			<div class="bg-base-200 rounded-2xl p-5">
				{#if resultText}
					<p class="whitespace-pre-wrap text-sm leading-relaxed">{resultText}</p>
				{:else}
					<div class="flex items-center gap-3 py-8 justify-center">
						<span class="loading loading-dots loading-md text-primary"></span>
						<span class="text-base-content/40">Подбираю...</span>
					</div>
				{/if}
			</div>
			{#if !loading}
				<div class="flex gap-3 mt-5">
					<button class="btn btn-sm btn-ghost flex-1" onclick={restart}>Заново</button>
					<a href="{base}/" class="btn btn-sm btn-primary flex-1">К меню</a>
				</div>
			{/if}
		</div>
	{:else}
		<!-- Quiz -->
		<div class="flex-1 flex flex-col p-5">
			<!-- Progress dots -->
			<div class="flex gap-2 justify-center mb-8">
				{#each questions as _, i}
					<div class="w-2.5 h-2.5 rounded-full transition-colors {i < step ? 'bg-primary' : i === step ? 'bg-primary scale-125' : 'bg-base-300'}"></div>
				{/each}
			</div>

			<!-- Question -->
			<div class="text-center mb-8">
				<h2 class="text-2xl font-bold">{questions[step].text}</h2>
			</div>

			<!-- Options -->
			<div class="flex flex-col gap-3 flex-1 justify-center">
				{#each questions[step].options as opt}
					<button
						class="flex items-center gap-4 p-4 bg-base-200 rounded-2xl text-left hover:bg-base-300 transition-colors active:scale-[0.98]"
						onclick={() => selectAnswer(questions[step].key, opt.value)}
					>
						<span class="text-2xl">{opt.icon}</span>
						<span class="font-medium">{opt.label}</span>
					</button>
				{/each}
			</div>

			<!-- Step counter -->
			<p class="text-center text-xs text-base-content/30 mt-6">{step + 1} / {questions.length}</p>
		</div>
	{/if}

	<div class="p-3">
		<p class="text-[10px] text-base-content/20 text-center">
			Аллергены уточняйте у официанта
		</p>
	</div>
</div>
