<script>
	import { base } from "$app/paths";
	import { cart } from "$lib/stores/cart.svelte.js";
	import { session } from "$lib/stores/session.svelte.js";
	import { getName } from "$lib/data/catalog.js";

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
		<!-- Title -->
		<div class="px-6 pt-6 pb-5 border-b border-base-content/20 flex items-baseline justify-between">
			<div>
				<div class="font-mono text-[11px] tracking-[0.18em] text-accent uppercase mb-2">
					Корзина
				</div>
				<h3 class="font-display italic text-[32px] font-medium text-base-content leading-[1.05]">
					Мой выбор
				</h3>
			</div>
			<div class="flex items-center gap-3 shrink-0">
				{#if cart.count > 0}
					<button
						class="font-body font-medium text-sm text-error hover:underline"
						onclick={() => cart.clear()}
					>
						Очистить
					</button>
				{/if}
				<button
					class="text-2xl text-base-content hover:text-accent transition-colors leading-none px-2"
					onclick={onClose}
					aria-label="Закрыть"
				>
					×
				</button>
			</div>
		</div>

		{#if cart.count === 0}
			<div class="py-20 px-6 text-center">
				<p class="font-display italic text-lg text-base-content/65 leading-relaxed">
					Пока пусто.<br />Добавьте блюда из меню.
				</p>
			</div>
		{:else}
			<!-- Items -->
			<div class="px-6">
				{#each cart.items as item, i (item.id)}
					<div class="flex items-baseline gap-3 py-5 border-b border-dotted border-base-content/25">
						<span class="font-mono tabular text-xs text-accent tracking-[0.14em] w-7 shrink-0 pt-0.5">{String(i + 1).padStart(2, "0")}</span>
						<div class="flex-1 min-w-0">
							<div class="font-body font-semibold text-[17px] text-base-content leading-snug">
								{getName(item, session.currentLang)}
							</div>
							<div class="font-mono tabular text-[13px] text-base-content/65 mt-1.5">
								{item.price.toLocaleString("ru-RU")} ₽ × {item.qty} = {(item.price * item.qty).toLocaleString("ru-RU")} ₽
							</div>
						</div>
						<div class="flex items-center gap-1.5 shrink-0">
							<button
								class="w-9 h-9 border border-base-content/60 text-base-content text-lg active:bg-base-200"
								onclick={() => cart.decrement(item.id)}
								aria-label="Меньше"
							>
								−
							</button>
							<span class="font-mono tabular text-base w-7 text-center">{item.qty}</span>
							<button
								class="w-9 h-9 border border-base-content/60 text-base-content text-lg active:bg-base-200"
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
			<div class="px-6 pt-5 pb-6">
				<div class="flex items-baseline justify-between pt-4 border-t border-base-content">
					<span class="font-mono text-[11px] tracking-[0.18em] text-accent uppercase">
						Итого · счёт
					</span>
					<span class="font-mono tabular text-3xl font-medium text-base-content">
						{cart.total.toLocaleString("ru-RU")}&nbsp;₽
					</span>
				</div>
			</div>

			<!-- Action: redirect to /call/ screen -->
			<div class="px-6 pb-7 safe-bottom">
				<a
					href="{base}/call/"
					class="w-full bg-primary text-primary-content font-body font-semibold text-base py-4 px-5 flex items-center justify-center"
					onclick={onClose}
				>
					Позвать официанта
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
