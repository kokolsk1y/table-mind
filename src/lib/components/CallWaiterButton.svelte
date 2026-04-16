<script>
	import { session } from "$lib/stores/session.svelte.js";
	import { cart } from "$lib/stores/cart.svelte.js";

	const API_BASE = "https://table-mind-seven.vercel.app";

	let sending = $state(false);
	let sent = $state(false);
	let error = $state(null);

	function formatOrder() {
		return cart.items.map(i =>
			`${i.name}${i.qty > 1 ? " ×" + i.qty : ""} — ${(i.price * i.qty).toLocaleString("ru-RU")}₽`
		).join("\n");
	}

	async function callWaiter() {
		if (session.isDemoMode || cart.count === 0 || sending) return;

		sending = true;
		error = null;

		try {
			const res = await fetch(`${API_BASE}/api/notify`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					table: session.tableNumber,
					items: formatOrder(),
					total: cart.total
				})
			});

			if (!res.ok) throw new Error("Ошибка отправки");

			sent = true;
			setTimeout(() => { sent = false; }, 10000);
		} catch (e) {
			error = e.message;
		} finally {
			sending = false;
		}
	}

	async function retry() {
		error = null;
		sent = false;
		await callWaiter();
	}
</script>

{#if session.isDemoMode}
	<button class="btn btn-disabled w-full" disabled>
		Отсканируйте QR-код на столе для вызова официанта
	</button>
{:else if sent}
	<div class="alert alert-success">
		<span>Официант уже идёт к столу №{session.tableNumber}</span>
		<button class="btn btn-ghost btn-xs" onclick={retry}>Позвать ещё раз</button>
	</div>
{:else if error}
	<div class="alert alert-error">
		<span>{error}</span>
		<button class="btn btn-ghost btn-xs" onclick={retry}>Повторить</button>
	</div>
{:else}
	<button
		class="btn btn-primary w-full"
		onclick={callWaiter}
		disabled={cart.count === 0 || sending}
	>
		{#if sending}
			<span class="loading loading-spinner loading-sm"></span>
		{:else}
			Позвать официанта ({cart.count})
		{/if}
	</button>
{/if}
