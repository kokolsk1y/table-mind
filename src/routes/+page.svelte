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
	/** @type {string | null} */
	let activeCategory = $state(null);
	let searchQuery = $state("");
	let showCart = $state(false);

	const categories = $derived(getCategories(allItems));

	const displayedItems = $derived.by(() => {
		let items = allItems;
		if (searchQuery.trim()) items = searchItems(searchQuery, items);
		if (activeCategory) items = items.filter((i) => i.category === activeCategory);
		return items;
	});

	const today = new Date();
	const monthsRoman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
	const dateStr = `${String(today.getDate()).padStart(2, "0")} · ${monthsRoman[today.getMonth()]} · ${String(today.getFullYear()).slice(-2)}`;

	onMount(async () => {
		allItems = await loadCatalog();
		createSearchEngine(allItems);
		cart.restore();
		if (categories.length > 0 && !activeCategory) {
			activeCategory = categories[0];
		}
	});
</script>

<div class="pb-28 min-h-screen">
	<!-- Masthead strip -->
	<div class="px-5 pt-3 pb-2 border-b border-base-content/20 flex items-center justify-between masthead">
		<span>Карта — №003</span>
		<span>{dateStr}</span>
		<span>Стол · {session.tableNumber ?? "07"}</span>
	</div>

	<!-- Title -->
	<div class="px-5 pt-5 pb-4 border-b border-base-content/20">
		<div class="flex items-center gap-2.5 eyebrow mb-3">
			<span class="inline-block w-6 h-6 border border-base-content flex items-center justify-center">
				<span class="font-display italic text-sm text-base-content leading-none">T</span>
			</span>
			<span class="text-base-content font-display italic text-base not-italic font-semibold tracking-wide">TableMind</span>
		</div>
		<h1 class="font-display italic text-4xl font-medium text-base-content leading-none">
			Карта дня
		</h1>
		<p class="text-xs text-base-content/60 mt-1.5">сегодняшнее предложение шефа</p>
	</div>

	<!-- Search (когда юзер активно ищет) -->
	{#if searchQuery || allItems.length > 0}
		<div class="px-5 pt-3 pb-2">
			<input
				type="text"
				placeholder="поиск по меню…"
				class="w-full bg-transparent border-b border-base-content/30 py-2 text-base font-body text-base-content placeholder:text-base-content/40 placeholder:font-display placeholder:italic focus:outline-none focus:border-base-content"
				bind:value={searchQuery}
			/>
		</div>
	{/if}

	<!-- Returning guest greeting -->
	{#if guest.greeting}
		<p class="px-5 pt-2 font-display italic text-sm text-base-content/60">
			{guest.greeting}
		</p>
	{/if}

	<!-- Category tabs -->
	{#if categories.length > 0 && !searchQuery.trim()}
		<div class="flex overflow-x-auto px-5 pt-3 border-b border-base-content/20 no-scrollbar">
			{#each categories as cat (cat)}
				<button
					class="pb-3 mr-6 font-body font-medium text-[13px] whitespace-nowrap shrink-0 transition-colors {activeCategory === cat ? 'text-base-content border-b-2 border-accent -mb-[1.5px]' : 'text-base-content/50 hover:text-base-content/80'}"
					onclick={() => (activeCategory = cat)}
				>
					{cat}
				</button>
			{/each}
		</div>
	{/if}

	<!-- Dishes list -->
	<div class="px-5">
		{#if displayedItems.length === 0 && allItems.length > 0}
			<p class="py-16 text-center font-display italic text-base-content/50">
				ничего не нашлось — попробуйте иначе
			</p>
		{/if}

		{#each displayedItems as item, i (item.id)}
			<MenuCard {item} index={i} hero={i === 0 && !searchQuery.trim()} />
		{/each}

		{#if allItems.length === 0}
			<div class="py-20 flex flex-col items-center gap-3">
				<span class="loading loading-spinner loading-md text-primary"></span>
				<p class="masthead">загружаем карту…</p>
			</div>
		{/if}
	</div>
</div>

<!-- Bottom Ask bar (AI-официант) -->
<nav class="fixed bottom-0 left-0 right-0 bg-base-200 border-t border-base-content/25 safe-bottom z-40">
	<div class="px-5 py-3 border-b border-dotted border-base-content/20 masthead">
		<span>№ → AI-официант</span>
	</div>
	<div class="flex items-center gap-2 px-5 py-3">
		<a href="{base}/chat/" class="flex-1 font-display italic text-base text-base-content/70 py-1">
			спросите шефа…
		</a>
		<a href="{base}/quiz/" class="px-3 py-2.5 border border-base-content/60 masthead text-base-content" aria-label="Подбор">
			Подбор
		</a>
		<button
			class="relative px-3 py-2.5 bg-primary text-primary-content masthead"
			onclick={() => (showCart = true)}
			aria-label="Выбор"
		>
			Выбор
			{#if cart.count > 0}
				<span class="absolute -top-1.5 -right-1.5 w-4 h-4 bg-accent text-accent-content text-[9px] font-bold flex items-center justify-center font-mono tabular">{cart.count}</span>
			{/if}
		</button>
	</div>
</nav>

<!-- Demo badge -->
{#if session.isDemoMode}
	<div class="fixed top-0 left-0 right-0 bg-accent/15 text-center py-1 z-30">
		<span class="masthead text-accent">Демо-режим · QR-код для полного доступа</span>
	</div>
{/if}

{#if showCart}
	<CartPanel onClose={() => (showCart = false)} />
{/if}

<style>
	.no-scrollbar::-webkit-scrollbar { display: none; }
	.no-scrollbar { scrollbar-width: none; }
</style>
