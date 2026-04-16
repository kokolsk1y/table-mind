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
			text: "На что вы сегодня настроены?",
			options: [
				{ label: "Лёгкий перекус", value: "лёгкое" },
				{ label: "Плотный ужин", value: "сытное" },
				{ label: "Что-то особенное", value: "необычное" }
			]
		},
		{
			key: "restriction",
			text: "Есть ограничения в еде?",
			options: [
				{ label: "Нет ограничений", value: "нет" },
				{ label: "Без мяса", value: "без мяса" },
				{ label: "Без глютена", value: "без глютена" },
				{ label: "Без молочного", value: "без молочного" }
			]
		},
		{
			key: "spicy",
			text: "Как относитесь к острому?",
			options: [
				{ label: "Люблю острое", value: "люблю" },
				{ label: "Нейтрально", value: "нейтрально" },
				{ label: "Не ем острое", value: "не ем" }
			]
		},
		{
			key: "portion",
			text: "Формат ужина?",
			options: [
				{ label: "Одно основное блюдо", value: "одно блюдо" },
				{ label: "Полный сет (закуска + основное + десерт)", value: "полный сет" },
				{ label: "Несколько закусок для компании", value: "закуски" }
			]
		},
		{
			key: "drink",
			text: "Что будете пить?",
			options: [
				{ label: "Алкоголь (вино/пиво/коктейль)", value: "алкоголь" },
				{ label: "Безалкогольное", value: "безалкогольное" },
				{ label: "Пусть AI подберёт", value: "на выбор AI" }
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
Составь 3 именованных комплекса (закуска + основное + напиток + десерт если выбран полный сет).
Каждому комплексу дай характерное название (не "Вариант 1").
Средний по цене покажи вторым.
Используй ТОЛЬКО блюда из каталога. Не показывай технические ID.
Формат: название комплекса, затем список блюд с ценами, итого по комплексу.`;

		streamChat({
			agent: "waiter",
			style: "detailed",
			message,
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

<div class="flex flex-col min-h-screen max-w-2xl mx-auto">
	<div class="flex items-center gap-3 p-4 border-b border-base-300">
		<a href="{base}/" class="btn btn-ghost btn-sm">← Меню</a>
		<h1 class="font-semibold flex-1">Подбор ужина</h1>
	</div>

	<div class="flex-1 p-6">
		{#if results || loading}
			<!-- Results -->
			<div class="mb-4">
				<h2 class="text-xl font-bold text-primary mb-4">Ваши комплексы</h2>
				<div class="bg-base-200 rounded-xl p-4">
					{#if resultText}
						<p class="whitespace-pre-wrap text-sm leading-relaxed">{resultText}</p>
					{:else}
						<div class="flex items-center gap-2">
							<span class="loading loading-dots loading-sm text-primary"></span>
							<span class="text-base-content/40">Подбираю комплексы...</span>
						</div>
					{/if}
				</div>
				{#if !loading}
					<button class="btn btn-outline btn-sm mt-4" onclick={restart}>Пройти заново</button>
				{/if}
			</div>
		{:else}
			<!-- Progress -->
			<div class="flex gap-1 mb-6">
				{#each questions as _, i}
					<div class="h-1 flex-1 rounded-full {i <= step ? 'bg-primary' : 'bg-base-300'}"></div>
				{/each}
			</div>

			<!-- Question -->
			<div class="text-center mb-8">
				<p class="text-sm text-base-content/40 mb-2">{step + 1} из {questions.length}</p>
				<h2 class="text-xl font-bold">{questions[step].text}</h2>
			</div>

			<!-- Options -->
			<div class="flex flex-col gap-3 max-w-sm mx-auto">
				{#each questions[step].options as opt}
					<button
						class="btn btn-outline btn-primary btn-lg justify-start"
						onclick={() => selectAnswer(questions[step].key, opt.value)}
					>
						{opt.label}
					</button>
				{/each}
			</div>
		{/if}
	</div>

	<div class="p-4">
		<p class="text-xs text-base-content/30 text-center">
			Информация об аллергенах может быть неполной. Уточняйте у официанта.
		</p>
	</div>
</div>
