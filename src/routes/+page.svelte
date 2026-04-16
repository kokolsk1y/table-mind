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

	onMount(async () => {
		allItems = await loadCatalog();
		categories = getCategories(allItems);
		tags = getTags(allItems);
		createSearchEngine(allItems);
		cart.restore();
	});
</script>

<div class="max-w-2xl mx-auto px-4 py-6">
	<!-- Header -->
	<div class="flex items-center justify-between mb-6">
		<div>
			<h1 class="text-2xl font-bold text-primary">Янтарный берег</h1>
			<p class="text-sm text-base-content/50">AI-меню ресторана</p>
		</div>
		{#if !session.isDemoMode}
			<div class="badge badge-primary badge-outline">Стол №{session.tableNumber}</div>
		{/if}
	</div>

	<!-- Returning guest greeting -->
	{#if guest.greeting}
		<div class="alert bg-base-200 border-primary/20 mb-4">
			<span class="text-sm">{guest.greeting}</span>
		</div>
	{/if}

	<!-- Search -->
	<div class="mb-4">
		<input
			type="text"
			placeholder="Поиск блюд..."
			class="input input-bordered w-full bg-base-200"
			bind:value={searchQuery}
		/>
	</div>

	<!-- Category filter -->
	{#if categories.length > 0}
		<div class="mb-3">
			<CategoryFilter {categories} selected={selectedCategory} onSelect={handleCategorySelect} />
		</div>
	{/if}

	<!-- Tag filter -->
	{#if tags.length > 0}
		<div class="mb-4">
			<TagFilter {tags} {activeTags} onToggle={handleTagToggle} />
		</div>
	{/if}

	<!-- Results count -->
	{#if searchQuery.trim() || activeTags.size > 0 || selectedCategory}
		<p class="text-sm text-base-content/40 mb-4">
			Найдено: {filteredItems.length}
			{#if filteredItems.length === 0}
				— попробуйте изменить фильтры
			{/if}
		</p>
	{/if}

	<!-- Menu grid -->
	{#each groupedItems as group}
		{#if group.category}
			<h2 class="text-lg font-semibold text-base-content/80 mt-6 mb-3">{group.category}</h2>
		{/if}
		<div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
			{#each group.items as item (item.id)}
				<MenuCard {item} />
			{/each}
		</div>
	{/each}

	<!-- Floating buttons -->
	<div class="fixed bottom-20 right-4 flex flex-col gap-3">
		{#if cart.count > 0}
			<button
				class="btn btn-secondary btn-circle shadow-lg relative"
				onclick={() => showCart = true}
				title="Мой выбор"
			>
				🛒
				<span class="badge badge-primary badge-xs absolute -top-1 -right-1">{cart.count}</span>
			</button>
		{/if}
		<a
			href="{base}/chat/"
			class="btn btn-primary btn-circle shadow-lg text-xl"
			title="AI-официант"
		>
			✨
		</a>
	</div>

	<!-- Demo mode badge -->
	{#if session.isDemoMode}
		<div class="fixed bottom-4 left-4 right-4 max-w-2xl mx-auto">
			<div class="alert bg-base-200 border-base-300 shadow-lg">
				<span class="text-sm">📱 Демо-режим. Отсканируйте QR-код на столе для полного доступа.</span>
			</div>
		</div>
	{/if}
</div>

{#if showCart}
	<CartPanel onClose={() => showCart = false} />
{/if}
