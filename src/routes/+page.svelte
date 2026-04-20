<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { session } from "$lib/stores/session.svelte.js";
	import { loadCatalog, getCategories } from "$lib/data/catalog.js";
	import { createSearchEngine, searchItems } from "$lib/search/engine.js";
	import MenuCard from "$lib/components/MenuCard.svelte";
	import CartPanel from "$lib/components/CartPanel.svelte";
	import { cart } from "$lib/stores/cart.svelte.js";
	import { guest } from "$lib/stores/guest.svelte.js";

	/** @type {any[]} */
	let allItems = $state([]);
	let searchQuery = $state("");
	let showCart = $state(false);

	const filteredItems = $derived.by(() => {
		if (searchQuery.trim()) return searchItems(searchQuery, allItems);
		return allItems;
	});

	// Группируем по категориям — как в печатном меню, без вкладок
	const groups = $derived.by(() => {
		if (searchQuery.trim()) {
			return [{ category: null, items: filteredItems }];
		}
		const order = getCategories(filteredItems);
		return order
			.map((cat) => ({
				category: cat,
				items: filteredItems.filter((i) => i.category === cat)
			}))
			.filter((g) => g.items.length > 0);
	});

	const slotRight = $derived(session.tableNumber ? `Стол ${session.tableNumber}` : "Демо");

	onMount(async () => {
		allItems = await loadCatalog();
		createSearchEngine(allItems);
		cart.restore();
	});
</script>

<div class="pb-32 min-h-screen">
	<!-- Простая шапка — логотип + номер стола -->
	<header class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-base-content/20">
		<div class="flex items-center gap-3">
			<img
				src="{base}/logo.png"
				alt="TableMind"
				class="w-11 h-11 object-contain"
				style="mix-blend-mode: multiply;"
				width="44"
				height="44"
			/>
			<span class="font-display italic text-xl font-semibold text-base-content tracking-wide">
				TableMind
			</span>
		</div>
		<span class="font-mono tabular text-sm {session.isDemoMode ? 'text-accent' : 'text-base-content/70'}">
			{slotRight}
		</span>
	</header>

	<!-- Hero-заголовок меню -->
	<div class="px-5 pt-8 pb-6 border-b border-base-content/20">
		<h1 class="font-display italic font-medium text-base-content leading-[0.95]" style="font-size: clamp(44px, 12vw, 64px); letter-spacing: -0.02em;">
			Карта дня
		</h1>
		<p class="font-display italic text-base text-base-content/65 mt-3">
			Всё что есть сейчас на кухне
		</p>
	</div>

	<!-- Search -->
	{#if allItems.length > 0}
		<div class="px-5 pt-4 pb-2 border-b border-base-content/20">
			<input
				type="text"
				placeholder="Найти блюдо…"
				class="w-full bg-transparent border-b border-base-content/30 py-2.5 text-base font-body text-base-content placeholder:text-base-content/45 focus:outline-none focus:border-base-content"
				bind:value={searchQuery}
			/>
		</div>
	{/if}

	<!-- Returning guest greeting -->
	{#if guest.greeting}
		<p class="px-5 pt-4 font-display italic text-base text-base-content/70">
			{guest.greeting}
		</p>
	{/if}

	<!-- Dishes by category -->
	<div class="px-5">
		{#if allItems.length === 0}
			<div class="py-24 flex flex-col items-center gap-4">
				<span class="loading loading-spinner loading-md text-primary"></span>
				<p class="font-display italic text-base text-base-content/65">загружаем меню…</p>
			</div>
		{:else if filteredItems.length === 0}
			<p class="py-20 text-center font-display italic text-lg text-base-content/55">
				ничего не нашлось — попробуйте иначе
			</p>
		{:else}
			{#each groups as group (group.category ?? "_search")}
				{#if group.category}
					<div class="flex items-baseline justify-between mt-10 mb-2 pb-3 border-b border-base-content">
						<h2 class="font-display italic text-[26px] font-medium text-base-content leading-tight">
							{group.category}
						</h2>
						<span class="font-mono tabular text-xs text-base-content/55">
							{String(group.items.length).padStart(2, "0")}
						</span>
					</div>
				{/if}
				{#each group.items as item, i (item.id)}
					<MenuCard {item} index={i} />
				{/each}
			{/each}
		{/if}
	</div>
</div>

<!-- Bottom Ask bar — человеческие кнопки -->
<nav class="fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-content safe-bottom z-40">
	<div class="flex items-stretch">
		<a
			href="{base}/chat/"
			class="flex-1 flex flex-col items-start justify-center gap-0.5 px-5 py-3.5 border-r border-base-content/20"
		>
			<span class="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">Спросите</span>
			<span class="font-display italic text-base text-base-content/85 leading-tight">AI-официанта</span>
		</a>
		<a
			href="{base}/quiz/"
			class="flex flex-col items-center justify-center gap-0.5 px-4 py-3.5 border-r border-base-content/20"
			aria-label="Подбор"
		>
			<span class="font-mono text-[10px] tracking-[0.18em] text-accent uppercase">Подбор</span>
			<span class="font-body text-sm text-base-content font-medium leading-tight">комплекс</span>
		</a>
		<button
			class="relative flex flex-col items-center justify-center gap-0.5 px-5 py-3.5 bg-primary text-primary-content"
			onclick={() => (showCart = true)}
			aria-label="Выбор"
		>
			<span class="font-mono text-[10px] tracking-[0.18em] opacity-75 uppercase">Выбор</span>
			<span class="font-body text-sm font-semibold leading-tight">корзина</span>
			{#if cart.count > 0}
				<span class="absolute -top-1.5 -right-1.5 w-5 h-5 bg-accent text-accent-content text-[10px] font-bold flex items-center justify-center font-mono tabular rounded-full">{cart.count}</span>
			{/if}
		</button>
	</div>
</nav>

{#if showCart}
	<CartPanel onClose={() => (showCart = false)} />
{/if}
