<script>
	let { categories, selected, onSelect } = $props();
</script>

<div class="flex flex-wrap gap-2">
	<button
		class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {selected === null ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/70 hover:bg-base-300/80'}"
		onclick={() => onSelect(null)}
	>
		Все
	</button>
	{#each categories as cat}
		<button
			class="px-3 py-1.5 rounded-full text-sm font-medium transition-colors {selected === cat ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/70 hover:bg-base-300/80'}"
			onclick={() => onSelect(cat)}
		>
			{cat}
		</button>
	{/each}
</div>
