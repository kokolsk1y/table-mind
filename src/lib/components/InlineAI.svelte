<script>
	import { base } from "$app/paths";
	import { streamChat } from "$lib/ai/client.js";
	import { formatCatalogForAI } from "$lib/ai/prompt.js";
	import { cart } from "$lib/stores/cart.svelte.js";

	let { item, onClose } = $props();
	let text = $state("");
	let error = $state(null);
	let imgFailed = $state(false);
	let added = $state(false);

	function addToCart() {
		cart.add(item);
		added = true;
		setTimeout(() => {
			added = false;
		}, 1500);
	}

	$effect(() => {
		text = "";
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
			},
			onError(err) {
				error = err;
			}
		});
	});
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 z-50 flex items-end justify-center" onclick={onClose}>
	<div class="absolute inset-0 bg-base-content/60"></div>

	<div
		class="relative w-full max-w-lg bg-base-100 border-t border-base-content max-h-[85vh] overflow-y-auto"
		style="animation: slide-up 0.3s ease-out"
		onclick={(e) => e.stopPropagation()}
	>
		<!-- Top masthead strip -->
		<div class="flex items-center justify-between px-5 py-3 border-b border-base-content/20 masthead">
			<span>AI · TM · собеседник</span>
			<button
				class="text-base text-base-content hover:text-accent transition-colors leading-none"
				onclick={onClose}
				aria-label="Закрыть"
			>
				×
			</button>
		</div>

		<!-- Photo + editorial header -->
		{#if !imgFailed && item.photo}
			<div class="relative w-full h-48 border-b border-base-content/20 overflow-hidden bg-base-200">
				<img
					src="{base}/{item.photo}"
					alt={item.name}
					class="w-full h-full object-cover"
					onerror={() => (imgFailed = true)}
				/>
			</div>
		{/if}

		<div class="p-6">
			<div class="font-mono text-[11px] tracking-[0.18em] text-accent uppercase mb-3">блюдо · о нём</div>
			<h3 class="font-display italic text-[32px] font-medium text-base-content leading-[1.1]">
				{item.name}
			</h3>

			<div class="flex items-baseline gap-4 mt-4">
				<span class="font-mono tabular text-lg text-base-content font-medium">
					{item.price}&nbsp;₽
				</span>
				{#if item.weight}
					<span class="font-mono text-xs text-base-content/55 tracking-wider">{item.weight}</span>
				{/if}
			</div>

			<!-- AI response -->
			<div class="mt-6 pt-5 border-t border-dotted border-base-content/30">
				<div class="font-mono text-[11px] tracking-[0.18em] text-accent uppercase mb-3">Тим · расскажет</div>
				{#if error}
					<p class="text-base text-error">{error}</p>
				{:else if text}
					<p class="text-[16px] text-base-content/90 leading-relaxed whitespace-pre-wrap font-body">
						{text}
					</p>
				{:else}
					<p class="text-[16px] text-base-content/50 italic font-display">
						Тим думает…
					</p>
				{/if}
			</div>

			<!-- Allergens -->
			{#if item.allergens.length > 0}
				<div class="mt-5 pt-4 border-t border-dotted border-base-content/30">
					<div class="font-mono text-[11px] tracking-[0.18em] text-accent uppercase mb-2">Аллергены</div>
					<p class="text-base text-base-content/75 font-body">
						{item.allergens.join(" · ")}
					</p>
				</div>
			{/if}

			<p class="font-display italic text-xs text-base-content/50 mt-5">
				Данные об аллергенах уточняйте у официанта
			</p>

			<!-- Actions -->
			<div class="mt-6 flex gap-3">
				<button
					class="flex-1 {added ? 'bg-accent text-accent-content' : 'bg-primary text-primary-content'} font-body font-semibold text-base py-4 px-5 transition-colors active:opacity-80"
					onclick={addToCart}
				>
					{added ? "Добавлено" : "Добавить в выбор"}
				</button>
				<button
					class="px-5 border-[1.5px] border-base-content text-base-content font-body font-medium text-base"
					onclick={onClose}
				>
					Закрыть
				</button>
			</div>
		</div>
	</div>
</div>

<style>
	@keyframes slide-up {
		from {
			transform: translateY(100%);
			opacity: 0.8;
		}
		to {
			transform: translateY(0);
			opacity: 1;
		}
	}
</style>
