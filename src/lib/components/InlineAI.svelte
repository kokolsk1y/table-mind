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

		<div class="p-5">
			<div class="eyebrow mb-3">№ → блюдо · о нём</div>
			<h3 class="font-display italic text-3xl font-medium text-base-content leading-tight">
				{item.name}
			</h3>

			<div class="flex items-baseline gap-3 mt-3">
				<span class="font-mono tabular text-sm text-base-content font-medium">
					{item.price} ₽
				</span>
				{#if item.weight}
					<span class="masthead">{item.weight}</span>
				{/if}
			</div>

			<!-- AI response -->
			<div class="mt-5 pt-4 border-t border-dotted border-base-content/30">
				<div class="eyebrow mb-2">AI · расскажет</div>
				{#if error}
					<p class="text-error text-sm">{error}</p>
				{:else if text}
					<p class="text-sm text-base-content/80 leading-relaxed whitespace-pre-wrap">
						{text}
					</p>
				{:else}
					<p class="text-sm text-base-content/40 italic font-display">
						AI-официант думает…
					</p>
				{/if}
			</div>

			<!-- Allergens -->
			{#if item.allergens.length > 0}
				<div class="mt-4 pt-3 border-t border-dotted border-base-content/30">
					<div class="eyebrow mb-1.5">Аллергены</div>
					<p class="text-sm text-base-content/70">
						{item.allergens.join(" · ")}
					</p>
				</div>
			{/if}

			<p class="masthead mt-4 text-[9px]">
				Данные об аллергенах уточняйте у официанта
			</p>

			<!-- Actions -->
			<div class="mt-6 flex gap-3">
				<button
					class="flex-1 {added ? 'bg-accent text-accent-content' : 'bg-primary text-primary-content'} font-body font-semibold text-sm py-3.5 px-5 flex items-center justify-center gap-2.5 transition-colors active:opacity-80"
					onclick={addToCart}
				>
					<span class="font-mono tabular text-[11px] opacity-70">№ →</span>
					<span>{added ? "Добавлено" : "Добавить в выбор"}</span>
				</button>
				<button
					class="px-4 border border-base-content text-base-content font-body font-medium text-sm"
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
