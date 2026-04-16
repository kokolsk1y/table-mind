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
		setTimeout(() => { added = false; }, 1200);
	}
</script>

<div class="bg-base-200 rounded-2xl overflow-hidden shadow-sm">
	<!-- Photo -->
	<!-- svelte-ignore a11y_click_events_have_key_events -->
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div class="relative h-40 overflow-hidden cursor-pointer" role="button" tabindex="0" onclick={() => showAI = true}>
		{#if !imgFailed}
			<img
				src="{base}/{item.photo}"
				alt={item.name}
				class="w-full h-full object-cover"
				loading="lazy"
				onerror={() => imgFailed = true}
			/>
		{:else}
			<div class="flex items-center justify-center w-full h-full bg-base-300 text-base-content/20 text-5xl">
				🍽
			</div>
		{/if}
		{#if item.spicy}
			<span class="absolute top-2 right-2 bg-error/90 text-white text-xs px-2 py-0.5 rounded-full">🌶 острое</span>
		{/if}
		{#if item.vegetarian}
			<span class="absolute top-2 left-2 bg-success/90 text-white text-xs px-2 py-0.5 rounded-full">🌱</span>
		{/if}
	</div>

	<!-- Content -->
	<div class="p-3">
		<!-- Name + Price row -->
		<div class="flex items-start justify-between gap-2 mb-1">
			<h3 class="font-semibold text-sm leading-snug flex-1">{item.name}</h3>
			<span class="text-primary font-bold text-base whitespace-nowrap">{item.price} ₽</span>
		</div>

		<!-- Weight -->
		<p class="text-xs text-base-content/40 mb-2">{item.weight}</p>

		<!-- Allergens (important — visible) -->
		{#if item.allergens.length > 0}
			<p class="text-xs text-warning/80 mb-2">
				⚠ {item.allergens.join(", ")}
			</p>
		{/if}

		<!-- Actions -->
		{#if !compact}
			<button
				class="btn btn-sm btn-primary w-full"
				onclick={addToCart}
			>
				{added ? "✓ Добавлено" : "+ В выбор"}
			</button>
		{/if}
	</div>
</div>

{#if showAI}
	<InlineAI {item} onClose={() => showAI = false} />
{/if}
