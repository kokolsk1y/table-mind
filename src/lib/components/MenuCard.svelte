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

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="group bg-base-200 rounded-2xl overflow-hidden border border-base-300/50 hover:border-primary/20 transition-all duration-300">
	<!-- Photo -->
	<div class="relative h-36 overflow-hidden cursor-pointer" role="button" tabindex="0" onclick={() => showAI = true}>
		{#if !imgFailed}
			<img
				src="{base}/{item.photo}"
				alt={item.name}
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
				loading="lazy"
				onerror={() => imgFailed = true}
			/>
		{:else}
			<div class="flex items-center justify-center w-full h-full bg-base-300/50 text-base-content/10 text-5xl">
				🍽
			</div>
		{/if}
		<!-- Overlay hint -->
		<div class="absolute inset-0 bg-gradient-to-t from-base-100/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end justify-center pb-2">
			<span class="text-xs text-base-content/60">нажмите для подробностей</span>
		</div>
		{#if item.spicy}
			<span class="absolute top-2 right-2 text-xs bg-error/80 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">🌶</span>
		{/if}
		{#if item.vegetarian}
			<span class="absolute top-2 left-2 text-xs bg-success/80 text-white px-1.5 py-0.5 rounded-full backdrop-blur-sm">🌱</span>
		{/if}
	</div>

	<!-- Content -->
	<div class="p-3 space-y-1.5">
		<!-- Name (serif) -->
		<h3 class="font-display text-base font-semibold leading-snug">{item.name}</h3>

		<!-- Price + Weight -->
		<div class="flex items-baseline justify-between">
			<span class="font-display text-lg text-primary font-semibold">{item.price} ₽</span>
			<span class="text-[11px] text-base-content/30">{item.weight}</span>
		</div>

		<!-- Allergens -->
		{#if item.allergens.length > 0}
			<p class="text-[11px] text-warning/60 leading-tight">
				⚠ {item.allergens.join(" · ")}
			</p>
		{/if}

		<!-- Add button -->
		{#if !compact}
			<button
				class="w-full mt-1 py-2 rounded-xl text-sm font-medium transition-all duration-200 {added ? 'bg-success/20 text-success' : 'bg-base-300/50 text-base-content/60 hover:bg-primary/10 hover:text-primary active:scale-[0.97]'}"
				onclick={addToCart}
			>
				{added ? "✓ добавлено" : "+ в выбор"}
			</button>
		{/if}
	</div>
</div>

{#if showAI}
	<InlineAI {item} onClose={() => showAI = false} />
{/if}
