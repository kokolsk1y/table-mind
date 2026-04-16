<script>
	let { tags, activeTags, onToggle } = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each tags as tag}
		<button
			class="px-3 py-1.5 rounded-full text-xs transition-all duration-200 {activeTags.has(tag) ? 'bg-accent/20 text-accent border border-accent/30' : 'bg-base-300/30 text-base-content/40 border border-transparent hover:bg-base-300/50 active:scale-95'}"
			onclick={() => onToggle(tag)}
		>
			{tag}
		</button>
	{/each}
</div>
