<script>
	let { tags, activeTags, onToggle } = $props();
</script>

<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
	{#each tags as tag}
		<button
			class="btn btn-xs whitespace-nowrap {activeTags.has(tag) ? 'btn-accent' : 'btn-outline btn-ghost'}"
			onclick={() => onToggle(tag)}
		>
			{tag}
		</button>
	{/each}
</div>
