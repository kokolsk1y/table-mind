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
	class="flex items-baseline gap-2.5 py-3.5 cursor-pointer border-b border-dotted border-base-content/25 active:bg-base-200/60 transition-colors"
	role="button"
	tabindex="0"
	onclick={openAI}
>
	{#if displayNum}
		<span class="eyebrow tabular w-7 shrink-0">{displayNum}</span>
	{/if}
	<div class="flex-1 min-w-0">
		<div class="font-body font-semibold {compact ? 'text-sm' : hero ? 'text-[17px]' : 'text-[15px]'} text-base-content leading-snug">
			{item.name}
		</div>
		{#if item.description}
			<div class="font-display italic {compact ? 'text-[11px]' : 'text-xs'} text-base-content/60 mt-1 leading-snug line-clamp-2">
				{item.description}
			</div>
		{/if}
		<div class="flex gap-1.5 mt-2 flex-wrap">
			{#if item.vegetarian}
				<span class="eyebrow text-[8px] border border-accent text-accent px-1.5 py-0.5">· веган</span>
			{/if}
			{#if item.spicy}
				<span class="eyebrow text-[8px] border border-error text-error px-1.5 py-0.5">· острое</span>
			{/if}
			{#each item.tags.slice(0, 2) as tag (tag)}
				<span class="eyebrow text-[8px] border border-base-content/40 text-base-content/60 px-1.5 py-0.5">· {tag}</span>
			{/each}
		</div>
	</div>
	<span class="font-mono tabular {compact ? 'text-xs' : 'text-[13px]'} text-base-content font-medium shrink-0 self-start pt-0.5">
		{item.price}
	</span>
</div>

{#if showAI}
	<InlineAI {item} onClose={() => (showAI = false)} />
{/if}
