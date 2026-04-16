<script>
	let { tags, activeTags, onToggle } = $props();
</script>

<div class="flex flex-wrap gap-2">
	{#each tags as tag}
		<button
			class="px-3 py-1 rounded-full text-xs font-medium transition-colors border {activeTags.has(tag) ? 'bg-accent text-accent-content border-accent' : 'bg-transparent text-base-content/60 border-base-300 hover:border-base-content/30'}"
			onclick={() => onToggle(tag)}
		>
			{tag}
		</button>
	{/each}
</div>
