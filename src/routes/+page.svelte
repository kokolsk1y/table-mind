<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { session } from "$lib/stores/session.svelte.js";
	import { loadCatalog, getCategories, getTags } from "$lib/data/catalog.js";
	import { createSearchEngine, searchItems } from "$lib/search/engine.js";
	import MenuCard from "$lib/components/MenuCard.svelte";
	import CategoryFilter from "$lib/components/CategoryFilter.svelte";
	import TagFilter from "$lib/components/TagFilter.svelte";
	import CartPanel from "$lib/components/CartPanel.svelte";
	import { cart } from "$lib/stores/cart.svelte.js";
	import { guest } from "$lib/stores/guest.svelte.js";

	let allItems = $state([]);
	let categories = $state([]);
	let tags = $state([]);

	let selectedCategory = $state(null);
	let activeTags = $state(new Set());
	let searchQuery = $state("");
	let showCart = $state(false);
	let showFilters = $state(false);

	let filteredItems = $derived.by(() => {
		let items = allItems;

		if (searchQuery.trim()) {
			items = searchItems(searchQuery, items);
		}

		if (selectedCategory) {
			items = items.filter(i => i.category === selectedCategory);
		}

		if (activeTags.size > 0) {
			items = items.filter(i => {
				for (const tag of activeTags) {
					if (i.tags.includes(tag)) return true;
					if (tag === "вегетарианское" && i.vegetarian) return true;
					if (tag === "острое" && i.spicy) return true;
				}
				return false;
			});
		}

		return items;
	});

	let groupedItems = $derived.by(() => {
		if (searchQuery.trim() || activeTags.size > 0) {
			return [{ category: null, items: filteredItems }];
		}

		if (selectedCategory) {
			return [{ category: selectedCategory, items: filteredItems }];
		}

		const groups = [];
		const order = getCategories(filteredItems);
		for (const cat of order) {
			const catItems = filteredItems.filter(i => i.category === cat);
			if (catItems.length > 0) {
				groups.push({ category: cat, items: catItems });
			}
		}
		return groups;
	});

	let activeFilterCount = $derived((selectedCategory ? 1 : 0) + activeTags.size);

	function handleCategorySelect(cat) {
		selectedCategory = cat;
	}

	function handleTagToggle(tag) {
		const next = new Set(activeTags);
		if (next.has(tag)) {
			next.delete(tag);
		} else {
			next.add(tag);
		}
		activeTags = next;
	}

	function clearFilters() {
		selectedCategory = null;
		activeTags = new Set();
		searchQuery = "";
	}

	onMount(async () => {
		allItems = await loadCatalog();
		categories = getCategories(allItems);
		tags = getTags(allItems);
		createSearchEngine(allItems);
		cart.restore();
	});
</script>

<div class="max-w-2xl mx-auto px-4 pt-4 pb-24 bg-grain">
	<!-- Header -->
	<div class="flex items-center justify-between mb-5">
		<div>
			<h1 class="font-display text-2xl font-semibold text-primary tracking-wide">Янтарный берег</h1>
			<p class="text-[11px] text-base-content/30 tracking-widest uppercase">Калининград</p>
		</div>
		{#if !session.isDemoMode}
			<span class="text-xs text-base-content/30 bg-base-200 px-3 py-1 rounded-full">стол {session.tableNumber}</span>
		{/if}
	</div>

	<!-- Returning guest -->
	{#if guest.greeting}
		<p class="text-sm text-base-content/40 italic mb-3">{guest.greeting}</p>
	{/if}

	<!-- Search + Filter toggle -->
	<div class="flex gap-2 mb-3">
		<input
			type="text"
			placeholder="Поиск блюд..."
			class="input input-sm bg-base-200 flex-1"
			bind:value={searchQuery}
		/>
		<button
			class="btn btn-sm btn-ghost relative"
			onclick={() => showFilters = !showFilters}
		>
			Фильтры
			{#if activeFilterCount > 0}
				<span class="badge badge-primary badge-xs absolute -top-1 -right-1">{activeFilterCount}</span>
			{/if}
		</button>
	</div>

	<!-- Filters (collapsible) -->
	{#if showFilters}
		<div class="bg-base-200 rounded-xl p-3 mb-4 space-y-3">
			<div>
				<p class="text-xs text-base-content/40 mb-2">Категории</p>
				<CategoryFilter {categories} selected={selectedCategory} onSelect={handleCategorySelect} />
			</div>
			<div>
				<p class="text-xs text-base-content/40 mb-2">Предпочтения</p>
				<TagFilter {tags} {activeTags} onToggle={handleTagToggle} />
			</div>
			{#if activeFilterCount > 0}
				<button class="btn btn-xs btn-ghost text-error" onclick={clearFilters}>Сбросить фильтры</button>
			{/if}
		</div>
	{/if}

	<!-- Results info -->
	{#if searchQuery.trim() || activeFilterCount > 0}
		<p class="text-xs text-base-content/40 mb-3">
			Найдено: {filteredItems.length}
			{#if filteredItems.length === 0}
				— попробуйте другой запрос
			{/if}
		</p>
	{/if}

	<!-- Menu -->
	{#each groupedItems as group}
		{#if group.category}
			<div class="flex items-center gap-3 mt-8 mb-4">
				<h2 class="font-display text-xl font-semibold text-base-content/50">{group.category}</h2>
				<div class="flex-1 h-px bg-base-300/30"></div>
			</div>
		{/if}
		<div class="grid grid-cols-2 gap-3">
			{#each group.items as item, i (item.id)}
				<MenuCard {item} hero={i === 0 && !searchQuery.trim() && activeFilterCount === 0} />
			{/each}
		</div>
	{/each}

	{#if allItems.length === 0}
		<div class="flex items-center justify-center py-20">
			<span class="loading loading-spinner loading-lg text-primary"></span>
		</div>
	{/if}
</div>

<!-- Bottom navigation -->
<nav class="fixed bottom-0 left-0 right-0 glass-panel border-t border-base-300/30 safe-bottom z-40">
	<div class="max-w-2xl mx-auto flex">
		<a href="{base}/" class="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-primary">
			<span class="text-lg">🍽</span>
			<span class="text-[10px] font-medium tracking-wide">Меню</span>
		</a>
		<a href="{base}/quiz/" class="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-base-content/40 hover:text-primary transition-colors">
			<span class="text-lg">🎯</span>
			<span class="text-[10px] font-medium tracking-wide">Подбор</span>
		</a>
		<a href="{base}/chat/" class="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-base-content/40 hover:text-primary transition-colors">
			<span class="text-lg">💬</span>
			<span class="text-[10px] font-medium tracking-wide">AI-чат</span>
		</a>
		<button
			class="flex-1 flex flex-col items-center gap-0.5 py-2.5 text-base-content/40 hover:text-primary transition-colors relative"
			onclick={() => showCart = true}
		>
			<span class="text-lg">🛒</span>
			<span class="text-[10px] font-medium tracking-wide">Выбор</span>
			{#if cart.count > 0}
				<span class="absolute top-1.5 right-1/4 w-4 h-4 bg-primary text-primary-content text-[9px] font-bold rounded-full flex items-center justify-center">{cart.count}</span>
			{/if}
		</button>
	</div>
</nav>

<!-- Demo badge -->
{#if session.isDemoMode}
	<div class="fixed top-0 left-0 right-0 bg-warning/10 text-center py-1 z-30">
		<span class="text-xs text-warning">Демо-режим · QR-код для полного доступа</span>
	</div>
{/if}

{#if showCart}
	<CartPanel onClose={() => showCart = false} />
{/if}
