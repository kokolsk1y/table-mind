<script>
	import { base } from "$app/paths";
	import { cart } from "$lib/stores/cart.svelte.js";

	let { onClose } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 z-50 flex items-end justify-center" onclick={onClose}>
	<div class="absolute inset-0 bg-base-content/60"></div>

	<div
		class="relative w-full max-w-2xl bg-base-100 border-t border-base-content max-h-[85vh] overflow-y-auto"
		style="animation: slide-up 0.3s ease-out"
		onclick={(e) => e.stopPropagation()}
	>
		<!-- Masthead -->
		<div class="flex items-center justify-between px-5 py-3 border-b border-base-content/20 masthead">
			<span>№ 05 · резюме</span>
			<span>ваш выбор</span>
			<button
				class="text-base text-base-content hover:text-accent transition-colors leading-none"
				onclick={onClose}
				aria-label="Закрыть"
			>
				×
			</button>
		</div>

		<!-- Title -->
		<div class="px-5 pt-5 pb-3 border-b border-base-content/20">
			<div class="eyebrow mb-2">№ → выбор</div>
			<div class="flex items-baseline justify-between">
				<h3 class="font-display italic text-3xl font-medium text-base-content">
					Мой выбор
				</h3>
				{#if cart.count > 0}
					<button
						class="masthead text-error"
						onclick={() => cart.clear()}
					>
						Очистить
					</button>
				{/if}
			</div>
		</div>

		{#if cart.count === 0}
			<div class="py-16 px-5 text-center">
				<p class="font-display italic text-base text-base-content/60">
					Пока пусто.<br />Добавьте блюда из меню.
				</p>
			</div>
		{:else}
			<!-- Items -->
			<div class="px-5">
				{#each cart.items as item, i (item.id)}
					<div class="flex items-baseline gap-2.5 py-3.5 border-b border-dotted border-base-content/25">
						<span class="eyebrow tabular w-7 shrink-0">{String(i + 1).padStart(2, "0")}</span>
						<div class="flex-1 min-w-0">
							<div class="font-body font-semibold text-[15px] text-base-content leading-snug">
								{item.name}
							</div>
							<div class="font-mono tabular text-[11px] text-base-content/60 mt-1">
								{item.price.toLocaleString("ru-RU")} ₽ × {item.qty} = {(item.price * item.qty).toLocaleString("ru-RU")} ₽
							</div>
						</div>
						<div class="flex items-center gap-1 shrink-0">
							<button
								class="w-7 h-7 border border-base-content/60 text-base-content text-sm active:bg-base-200"
								onclick={() => cart.decrement(item.id)}
								aria-label="Меньше"
							>
								−
							</button>
							<span class="font-mono tabular text-sm w-6 text-center">{item.qty}</span>
							<button
								class="w-7 h-7 border border-base-content/60 text-base-content text-sm active:bg-base-200"
								onclick={() => cart.add(item)}
								aria-label="Больше"
							>
								+
							</button>
						</div>
					</div>
				{/each}
			</div>

			<!-- Total -->
			<div class="px-5 pt-4 pb-5">
				<div class="flex items-baseline justify-between pt-3 border-t border-base-content">
					<span class="eyebrow">Итого · счёт</span>
					<span class="font-mono tabular text-2xl font-medium text-base-content">
						{cart.total.toLocaleString("ru-RU")} ₽
					</span>
				</div>
			</div>

			<!-- Action: redirect to /call/ screen -->
			<div class="px-5 pb-6 safe-bottom">
				<a
					href="{base}/call/"
					class="w-full bg-primary text-primary-content font-body font-semibold text-sm py-3.5 px-5 flex items-center justify-center gap-2.5"
					onclick={onClose}
				>
					<span class="font-mono tabular text-[11px] opacity-70">№ →</span>
					<span>Позвать официанта</span>
				</a>
			</div>
		{/if}
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
