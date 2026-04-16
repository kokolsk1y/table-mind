<script>
	import { base } from "$app/paths";
	import InlineAI from "./InlineAI.svelte";
	import { cart } from "$lib/stores/cart.svelte.js";

	let { item, compact = false } = $props();
	let imgFailed = $state(false);
	let showAI = $state(false);
	let added = $state(false);

	function addToCart() {
		cart.add(item);
		added = true;
		setTimeout(() => { added = false; }, 1000);
	}

	function formatPrice(price) {
		return price.toLocaleString("ru-RU") + " ₽";
	}

	function handleImgError() {
		imgFailed = true;
	}
</script>

<div class="card bg-base-200 shadow-md hover:shadow-lg transition-shadow">
	<figure class="relative h-48 overflow-hidden">
		{#if !imgFailed}
			<img
				src="{base}/{item.photo}"
				alt={item.name}
				class="w-full h-full object-cover"
				loading="lazy"
				onerror={handleImgError}
			/>
		{:else}
			<div class="flex items-center justify-center w-full h-full bg-base-300 text-base-content/30 text-4xl">
				🍽
			</div>
		{/if}
		{#if item.spicy}
			<span class="badge badge-error badge-sm absolute top-2 right-2">🌶</span>
		{/if}
	</figure>

	<div class="card-body p-4 gap-2">
		<h3 class="card-title text-base font-semibold leading-tight">{item.name}</h3>

		<p class="text-sm text-base-content/60 line-clamp-2">{item.description}</p>

		<div class="flex flex-wrap gap-1 mt-1">
			{#each item.tags as tag}
				<span class="badge badge-outline badge-xs">{tag}</span>
			{/each}
		</div>

		{#if item.allergens.length > 0}
			<p class="text-xs text-warning/70 mt-1">
				Аллергены: {item.allergens.join(", ")}
			</p>
		{/if}

		<div class="card-actions justify-between items-center mt-2">
			<span class="text-xs text-base-content/40">{item.weight}</span>
			<div class="flex items-center gap-2">
				{#if !compact}
					<button
						class="btn btn-ghost btn-xs text-primary"
						onclick={() => showAI = true}
						title="Спросить AI"
					>
						✨
					</button>
					<button
						class="btn btn-ghost btn-xs"
						onclick={addToCart}
						title="Добавить в выбор"
					>
						{added ? "✓" : "+"}
					</button>
				{/if}
				<span class="text-lg font-bold text-primary">{formatPrice(item.price)}</span>
			</div>
		</div>
	</div>
</div>

{#if showAI}
	<InlineAI {item} onClose={() => showAI = false} />
{/if}
