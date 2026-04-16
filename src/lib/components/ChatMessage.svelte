<script>
	import MenuCard from "./MenuCard.svelte";

	let { message, dishes = [] } = $props();
</script>

<div class="flex gap-3 {message.role === 'user' ? 'justify-end' : 'justify-start'}">
	<div class="max-w-[85%] {message.role === 'user' ? 'bg-primary text-primary-content' : 'bg-base-200 text-base-content'} rounded-2xl px-4 py-3">
		<p class="text-sm whitespace-pre-wrap leading-relaxed">{message.content}</p>

		{#if message.warning}
			<p class="text-xs text-warning mt-2">⚠️ {message.warning}</p>
		{/if}
	</div>
</div>

{#if dishes.length > 0}
	<div class="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2 ml-2">
		{#each dishes as dish (dish.id)}
			<div class="scale-90 origin-top-left">
				<MenuCard item={dish} compact={true} />
			</div>
		{/each}
	</div>
{/if}
