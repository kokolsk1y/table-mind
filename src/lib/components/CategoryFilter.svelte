<script>
	let { categories, selected, onSelect } = $props();
</script>

<div class="flex flex-wrap gap-2">
	<button
		class="px-4 py-2 rounded-full text-sm transition-all duration-200 {selected === null ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'bg-base-300/40 text-base-content/50 hover:bg-base-300/60 active:scale-95'}"
		onclick={() => onSelect(null)}
	>
		Все
	</button>
	{#each categories as cat}
		<button
			class="px-4 py-2 rounded-full text-sm transition-all duration-200 {selected === cat ? 'bg-primary text-primary-content shadow-lg shadow-primary/20' : 'bg-base-300/40 text-base-content/50 hover:bg-base-300/60 active:scale-95'}"
			onclick={() => onSelect(cat)}
		>
			{cat}
		</button>
	{/each}
</div>
