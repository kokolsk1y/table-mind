<script>
	import MenuCard from "./MenuCard.svelte";

	let { message, dishes = [], index = 0 } = $props();
	const isAI = $derived(message.role !== "user");
	const labelNum = $derived(String(index + 1).padStart(2, "0"));
</script>

<div class="mb-5">
	<div class="eyebrow mb-1.5 {isAI ? 'text-primary' : ''}">
		{isAI ? "AI · TM" : `ГОСТЬ · ${labelNum}`}
	</div>
	<div class="font-body text-base text-base-content leading-relaxed whitespace-pre-wrap">
		{message.content}
	</div>

	{#if message.warning}
		<div class="mt-2 pt-1.5 border-t border-dotted border-base-content/25 masthead text-error">
			⚠ {message.warning}
		</div>
	{/if}

	{#if dishes.length > 0}
		<div class="mt-3 border-y border-base-content/40">
			{#each dishes as dish, di (dish.id)}
				<MenuCard item={dish} compact={true} index={di} />
			{/each}
		</div>
	{/if}
</div>
