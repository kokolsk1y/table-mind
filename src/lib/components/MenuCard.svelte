<script>
	import InlineAI from "./InlineAI.svelte";

	let { item, compact = false, index = null, hero = false } = $props();
	let showAI = $state(false);

	function openAI() {
		showAI = true;
	}

	const displayNum = $derived(
		index != null ? String(index + 1).padStart(2, "0") : null
	);
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div
	class="flex items-baseline gap-3 py-5 cursor-pointer border-b border-dotted border-base-content/25 active:bg-base-200/60 transition-colors"
	role="button"
	tabindex="0"
	onclick={openAI}
>
	{#if displayNum}
		<span class="font-mono tabular text-xs text-accent tracking-[0.14em] w-7 shrink-0 pt-0.5">{displayNum}</span>
	{/if}
	<div class="flex-1 min-w-0">
		<div class="font-body font-semibold {compact ? 'text-base' : hero ? 'text-xl' : 'text-[17px]'} text-base-content leading-snug">
			{item.name}
		</div>
		{#if item.description}
			<div class="font-display italic {compact ? 'text-[13px]' : 'text-[15px]'} text-base-content/70 mt-2 leading-snug line-clamp-2">
				{item.description}
			</div>
		{/if}
		<div class="flex gap-2 mt-3 flex-wrap">
			{#if item.vegetarian}
				<span class="font-mono tabular text-[10px] tracking-[0.14em] uppercase border border-accent text-accent px-2 py-0.5 font-medium">веган</span>
			{/if}
			{#if item.spicy}
				<span class="font-mono tabular text-[10px] tracking-[0.14em] uppercase border border-error text-error px-2 py-0.5 font-medium">острое</span>
			{/if}
			{#each item.tags.slice(0, 2) as tag (tag)}
				<span class="font-mono tabular text-[10px] tracking-[0.14em] uppercase border border-base-content/40 text-base-content/65 px-2 py-0.5 font-medium">{tag}</span>
			{/each}
		</div>
	</div>
	<span class="font-mono tabular {compact ? 'text-base' : 'text-lg'} text-base-content font-medium shrink-0 self-start pt-1">
		{item.price}
	</span>
</div>

{#if showAI}
	<InlineAI {item} onClose={() => (showAI = false)} />
{/if}
