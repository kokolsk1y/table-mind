<script>
	import { cart } from "$lib/stores/cart.svelte.js";
	import CallWaiterButton from "./CallWaiterButton.svelte";

	let { onClose } = $props();
</script>

<!-- svelte-ignore a11y_click_events_have_key_events -->
<!-- svelte-ignore a11y_no_static_element_interactions -->
<div class="fixed inset-0 z-50 flex items-end justify-center" onclick={onClose}>
	<div class="absolute inset-0 bg-black/60"></div>

	<div
		class="relative w-full max-w-2xl bg-base-200 rounded-t-2xl p-6 pb-8 max-h-[80vh] overflow-y-auto animate-slide-up"
		onclick={(e) => e.stopPropagation()}
	>
		<div class="w-12 h-1 bg-base-300 rounded-full mx-auto mb-4"></div>

		<div class="flex items-center justify-between mb-4">
			<h3 class="text-lg font-bold">Мой выбор</h3>
			{#if cart.count > 0}
				<button class="btn btn-ghost btn-xs text-error" onclick={() => cart.clear()}>Очистить</button>
			{/if}
		</div>

		{#if cart.count === 0}
			<p class="text-base-content/50 text-center py-8">Пока пусто. Добавьте блюда из меню.</p>
		{:else}
			<div class="space-y-3 mb-4">
				{#each cart.items as item (item.id)}
					<div class="flex items-center gap-3 bg-base-300 rounded-xl p-3">
						<div class="flex-1 min-w-0">
							<p class="font-medium text-sm truncate">{item.name}</p>
							<p class="text-xs text-base-content/50">{item.price.toLocaleString("ru-RU")} ₽</p>
						</div>
						<div class="flex items-center gap-2">
							<button class="btn btn-ghost btn-xs" onclick={() => cart.decrement(item.id)}>−</button>
							<span class="text-sm font-medium w-6 text-center">{item.qty}</span>
							<button class="btn btn-ghost btn-xs" onclick={() => cart.add(item)}>+</button>
						</div>
					</div>
				{/each}
			</div>

			<div class="flex justify-between items-center mb-4 px-1">
				<span class="text-base-content/60">Итого:</span>
				<span class="text-xl font-bold text-primary">{cart.total.toLocaleString("ru-RU")} ₽</span>
			</div>

			<CallWaiterButton />
		{/if}
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
