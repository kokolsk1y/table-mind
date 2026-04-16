<script>
	let { categories, selected, onSelect } = $props();
</script>

<div class="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
	<button
		class="btn btn-sm whitespace-nowrap {selected === null ? 'btn-primary' : 'btn-ghost'}"
		onclick={() => onSelect(null)}
	>
		Все
	</button>
	{#each categories as cat}
		<button
			class="btn btn-sm whitespace-nowrap {selected === cat ? 'btn-primary' : 'btn-ghost'}"
			onclick={() => onSelect(cat)}
		>
			{cat}
		</button>
	{/each}
</div>
