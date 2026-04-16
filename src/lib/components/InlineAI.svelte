<script>
	import { streamChat } from "$lib/ai/client.js";
	import { formatCatalogForAI } from "$lib/ai/prompt.js";

	let { item, onClose } = $props();
	let text = $state("");
	let loading = $state(true);
	let error = $state(null);

	$effect(() => {
		text = "";
		loading = true;
		error = null;

		const catalog = formatCatalogForAI([item]);

		streamChat({
			agent: "waiter",
			style: "detailed",
			message: `Расскажи о блюде: ${item.name}`,
			history: [],
			catalog,
			onChunk(fullText) {
				text = fullText;
			},
			onDone(fullText) {
				text = fullText;
				loading = false;
			},
			onError(err) {
				error = err;
				loading = false;
			}
		});
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 z-50 flex items-end justify-center" onclick={onClose}>
	<div class="absolute inset-0 bg-black/70"></div>

	<div
		class="relative w-full max-w-lg glass-panel rounded-t-3xl p-6 pb-8 max-h-[70vh] overflow-y-auto"
		style="animation: slide-up 0.3s ease-out"
		onclick={(e) => e.stopPropagation()}
	>
		<!-- Handle -->
		<div class="w-10 h-1 bg-base-content/10 rounded-full mx-auto mb-5"></div>

		<!-- Dish info -->
		<h3 class="font-display text-xl font-semibold text-primary mb-1">{item.name}</h3>
		<p class="text-sm text-base-content/40 mb-5">
			{item.price} ₽ · {item.weight}
		</p>

		<!-- AI response -->
		<div class="text-base-content/70 text-sm leading-relaxed min-h-[40px]">
			{#if error}
				<p class="text-error">{error}</p>
			{:else if text}
				<p>{text}</p>
			{:else}
				<div class="flex items-center gap-2">
					<span class="loading loading-dots loading-xs text-primary"></span>
					<span class="text-base-content/30 text-xs">AI-официант думает...</span>
				</div>
			{/if}
		</div>

		<!-- Allergens -->
		{#if item.allergens.length > 0}
			<div class="mt-5 pt-3 border-t border-base-300/30">
				<p class="text-xs text-warning/50">
					⚠ Аллергены: {item.allergens.join(" · ")}
				</p>
			</div>
		{/if}

		<p class="text-[10px] text-base-content/15 mt-4">
			Аллергены уточняйте у официанта
		</p>
	</div>
</div>

<style>
	@keyframes slide-up {
		from { transform: translateY(100%); opacity: 0.8; }
		to { transform: translateY(0); opacity: 1; }
	}
</style>
