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
			message: `Расскажи подробно о блюде: ${item.name}`,
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
	<div class="absolute inset-0 bg-black/60"></div>

	<div
		class="relative w-full max-w-2xl bg-base-200 rounded-t-2xl p-6 pb-8 max-h-[70vh] overflow-y-auto animate-slide-up"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="w-12 h-1 bg-base-300 rounded-full mx-auto mb-4"></div>

		<h3 class="text-lg font-bold text-primary mb-1">{item.name}</h3>
		<p class="text-sm text-base-content/50 mb-4">{item.price.toLocaleString("ru-RU")} ₽ · {item.weight}</p>

		<div class="text-base-content/80 text-sm leading-relaxed min-h-[60px]">
			{#if error}
				<p class="text-error">Ошибка: {error}</p>
			{:else if text}
				<p class="whitespace-pre-wrap">{text}</p>
			{:else}
				<div class="flex gap-1">
					<span class="loading loading-dots loading-sm text-primary"></span>
					<span class="text-base-content/40">AI-официант думает...</span>
				</div>
			{/if}
		</div>

		{#if item.allergens.length > 0}
			<div class="mt-4 p-2 bg-base-300 rounded-lg">
				<p class="text-xs text-warning">Аллергены: {item.allergens.join(", ")}</p>
			</div>
		{/if}

		<p class="text-xs text-base-content/30 mt-4">
			Информация об аллергенах может быть неполной. Уточняйте у официанта.
		</p>
	</div>
</div>

<style>
	@keyframes slide-up {
		from { transform: translateY(100%); }
		to { transform: translateY(0); }
	}
	.animate-slide-up {
		animation: slide-up 0.3s ease-out;
	}
</style>
