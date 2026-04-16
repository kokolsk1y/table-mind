<script>
	import { base } from "$app/paths";
	import InlineAI from "./InlineAI.svelte";
	import { cart } from "$lib/stores/cart.svelte.js";

	let { item, compact = false, hero = false } = $props();
	let imgFailed = $state(false);
	let showAI = $state(false);
	let added = $state(false);

	function addToCart(e) {
		e.stopPropagation();
		cart.add(item);
		added = true;
		setTimeout(() => { added = false; }, 1200);
	}

	function openAI() {
		showAI = true;
	}
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="group relative rounded-[20px] overflow-hidden cursor-pointer {hero ? 'col-span-2' : ''}"
	role="button"
	tabindex="0"
	onclick={openAI}
>
	<!-- Photo fills entire card -->
	<div class="relative {hero ? 'h-56' : 'h-44'} overflow-hidden">
		{#if !imgFailed}
			<img
				src="{base}/{item.photo}"
				alt={item.name}
				class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
				loading="lazy"
				onerror={() => imgFailed = true}
			/>
		{:else}
			<div class="flex items-center justify-center w-full h-full bg-base-300/30 text-base-content/10 text-6xl">
				🍽
			</div>
		{/if}

		<!-- Dark gradient overlay -->
		<div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

		<!-- Tags top -->
		<div class="absolute top-3 left-3 flex gap-1.5">
			{#if item.vegetarian}
				<span class="text-[10px] bg-white/15 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full">🌱 вег</span>
			{/if}
			{#if item.spicy}
				<span class="text-[10px] bg-white/15 backdrop-blur-md text-white/90 px-2 py-0.5 rounded-full">🌶 острое</span>
			{/if}
		</div>

		<!-- Content overlay at bottom -->
		<div class="absolute bottom-0 left-0 right-0 p-4">
			<h3 class="font-display {hero ? 'text-2xl' : 'text-lg'} font-semibold text-white leading-tight mb-1">{item.name}</h3>
			<div class="flex items-baseline justify-between">
				<span class="font-display {hero ? 'text-xl' : 'text-base'} text-primary font-semibold">{item.price} ₽</span>
				<span class="text-[11px] text-white/40">{item.weight}</span>
			</div>

			{#if item.allergens.length > 0}
				<p class="text-[10px] text-white/35 mt-1">⚠ {item.allergens.join(" · ")}</p>
			{/if}
		</div>
	</div>

	<!-- Add to cart button (floating) -->
	{#if !compact}
		<button
			class="absolute top-3 right-3 w-9 h-9 rounded-full flex items-center justify-center text-sm transition-all duration-200 {added ? 'bg-success text-success-content scale-110' : 'bg-white/15 backdrop-blur-md text-white/90 hover:bg-primary hover:text-primary-content active:scale-90'}"
			onclick={addToCart}
		>
			{added ? "✓" : "+"}
		</button>
	{/if}
</div>

{#if showAI}
	<InlineAI {item} onClose={() => showAI = false} />
{/if}
