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

	const today = new Date();
	const monthsRoman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
	const dateStr = `${String(today.getDate()).padStart(2, "0")} · ${monthsRoman[today.getMonth()]} · ${String(today.getFullYear()).slice(-2)}`;

	const slotRight = $derived(session.tableNumber ? `Стол · ${session.tableNumber}` : "Демо");

	onMount(async () => {
		allItems = await loadCatalog();
		createSearchEngine(allItems);
		cart.restore();
	});
</script>

<div class="pb-28 min-h-screen">
	<!-- Masthead strip -->
	<div class="px-5 pt-3 pb-2 border-b border-base-content/20 flex items-center justify-between masthead">
		<span>Карта — №003</span>
		<span>{dateStr}</span>
		<span class={session.isDemoMode ? "text-accent" : ""}>{slotRight}</span>
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

	<!-- Search -->
	{#if allItems.length > 0}
		<div class="px-5 pt-3 pb-2 border-b border-base-content/20">
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
		<p class="px-5 pt-3 font-display italic text-sm text-base-content/60">
			{guest.greeting}
		</p>
	{/if}

	<!-- Dishes by category (inline, no tabs) -->
	<div class="px-5">
		{#if allItems.length === 0}
			<div class="py-20 flex flex-col items-center gap-3">
				<span class="loading loading-spinner loading-md text-primary"></span>
				<p class="masthead">загружаем карту…</p>
			</div>
		{:else if filteredItems.length === 0}
			<p class="py-16 text-center font-display italic text-base-content/50">
				ничего не нашлось — попробуйте иначе
			</p>
		{:else}
			{#each groups as group (group.category ?? "_search")}
				{#if group.category}
					<div class="flex items-baseline justify-between mt-8 mb-1 pb-2 border-b border-base-content">
						<h2 class="font-display italic text-2xl font-medium text-base-content">
							{group.category}
						</h2>
						<span class="masthead tabular">
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

{#if showCart}
	<CartPanel onClose={() => (showCart = false)} />
{/if}
