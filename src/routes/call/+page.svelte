<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { session } from "$lib/stores/session.svelte.js";
	import { cart } from "$lib/stores/cart.svelte.js";

	const API_BASE = "https://table-mind-seven.vercel.app";

	/** @type {"sent" | "accepted" | "enroute"} */
	let stage = $state("sent");
	let cancelled = $state(false);
	let error = $state("");

	const today = new Date();
	const monthsRoman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
	const dateStr = `${String(today.getDate()).padStart(2, "0")} · ${monthsRoman[today.getMonth()]} · ${String(today.getFullYear()).slice(-2)}`;
	const timeStr = `${String(today.getHours()).padStart(2, "0")}:${String(today.getMinutes()).padStart(2, "0")}`;

	const itemsSummary = $derived(
		cart.items.length > 0
			? cart.items.map((i) => `${i.name}${i.qty > 1 ? " × " + i.qty : ""}`)
			: ["— (без заказа, просто зовём)"]
	);

	const totalStr = $derived(cart.total > 0 ? `${cart.total} ₽` : "—");

	function formatOrder() {
		return cart.items
			.map(
				(i) =>
					`${i.name}${i.qty > 1 ? " ×" + i.qty : ""} — ${(i.price * i.qty).toLocaleString("ru-RU")}₽`
			)
			.join("\n");
	}

	async function callWaiter() {
		if (session.isDemoMode) {
			stage = "accepted";
			setTimeout(() => (stage = "enroute"), 2500);
			return;
		}
		error = "";
		try {
			const res = await fetch(`${API_BASE}/api/notify`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					table: session.tableNumber,
					items: cart.items.length > 0 ? formatOrder() : "— (без заказа)",
					total: cart.total
				})
			});
			if (!res.ok) throw new Error("network");
			stage = "accepted";
			setTimeout(() => {
				stage = "enroute";
			}, 2500);
		} catch (e) {
			error = "не получилось отправить — попробуйте ещё раз";
		}
	}

	function cancel() {
		cancelled = true;
	}

	onMount(() => {
		if (!cancelled) {
			callWaiter();
		}
	});
</script>

<div class="min-h-screen flex flex-col">
	<!-- Masthead -->
	<div class="px-5 pt-3 pb-2 border-b border-base-content/20 flex items-center justify-between masthead shrink-0">
		<span>Карта — №003</span>
		<span>{dateStr}</span>
		<span>Стол · {session.tableNumber ?? "07"}</span>
	</div>

	<!-- Hero -->
	<div class="px-6 pt-10 pb-6 border-b border-base-content/20 text-center">
		<div class="eyebrow mb-3">→ зовём официанта</div>
		{#if cancelled}
			<h1 class="font-display italic text-4xl font-medium text-base-content leading-none">
				Вызов<br />отменён
			</h1>
			<p class="font-display italic text-sm text-base-content/60 mt-3">— сообщение отозвано</p>
		{:else if error}
			<h1 class="font-display italic text-3xl font-medium text-error leading-none">
				{error}
			</h1>
			<button class="mt-4 masthead text-accent" onclick={callWaiter}>
				№ → попробовать снова
			</button>
		{:else}
			<h1 class="font-display italic text-4xl font-medium text-base-content leading-none">
				Сообщение<br />отправлено
			</h1>
			<p class="font-display italic text-sm text-base-content/60 mt-3">— через Telegram</p>
		{/if}
	</div>

	<!-- Receipt -->
	<div class="px-6 py-5 border-b border-base-content/20">
		<div class="flex items-center justify-between masthead pb-2">
			<span>№</span>
			<span>резюме заказа</span>
			<span>₽</span>
		</div>

		<div class="flex items-baseline py-2 border-b border-dotted border-base-content/30">
			<span class="eyebrow tabular shrink-0 w-16">Стол</span>
			<span class="flex-1 border-b border-dotted border-base-content/20 mx-2 mb-1.5"></span>
			<span class="font-body text-sm text-base-content font-medium">
				{session.tableNumber ?? "07"}
			</span>
		</div>

		{#each itemsSummary as line, li}
			<div class="flex items-baseline py-2 border-b border-dotted border-base-content/30">
				<span class="eyebrow tabular shrink-0 w-16">
					{li === 0 ? "Выбор" : ""}
				</span>
				<span class="flex-1 border-b border-dotted border-base-content/20 mx-2 mb-1.5"></span>
				<span class="font-body text-sm text-base-content text-right">
					{line}
				</span>
			</div>
		{/each}

		<div class="flex items-baseline py-2 border-b border-dotted border-base-content/30">
			<span class="eyebrow tabular shrink-0 w-16">Счёт</span>
			<span class="flex-1 border-b border-dotted border-base-content/20 mx-2 mb-1.5"></span>
			<span class="font-mono tabular text-sm text-base-content font-medium">
				{totalStr}
			</span>
		</div>

		<div class="flex items-baseline py-2">
			<span class="eyebrow tabular shrink-0 w-16">Время</span>
			<span class="flex-1 border-b border-dotted border-base-content/20 mx-2 mb-1.5"></span>
			<span class="font-mono tabular text-sm text-base-content font-medium">
				{timeStr}
			</span>
		</div>
	</div>

	<!-- Progress -->
	{#if !cancelled && !error}
		<div class="px-6 py-6 border-b border-base-content/20">
			<div class="eyebrow mb-4">статус</div>
			<div class="flex items-center justify-between relative mb-2.5">
				{#each ["sent", "accepted", "enroute"] as _key, i}
					{@const active = ["sent", "accepted", "enroute"].indexOf(stage) >= i}
					<div
						class="w-4 h-4 rounded-full border-[1.5px] shrink-0 z-10 {active ? 'bg-primary border-primary' : 'bg-transparent border-base-content/40'}"
					></div>
					{#if i < 2}
						<div class="flex-1 border-t border-dotted border-base-content/30 mx-1"></div>
					{/if}
				{/each}
			</div>
			<div class="flex justify-between masthead">
				<span class="text-primary">Получено</span>
				<span class={stage !== "sent" ? "text-primary" : ""}>Принято</span>
				<span class={stage === "enroute" ? "text-primary" : ""}>В пути</span>
			</div>
			<p class="font-display italic text-center text-base-content/60 mt-5 text-sm">
				подойдёт через 1–2 минуты
			</p>
		</div>
	{/if}

	<!-- Actions -->
	<div class="px-6 py-5 mt-auto safe-bottom">
		{#if !cancelled && !error}
			<button
				class="w-full border border-base-content py-3.5 font-body font-medium text-sm text-base-content active:bg-base-200"
				onclick={cancel}
			>
				Отменить вызов
			</button>
			<div class="text-center mt-3">
				<a href="{base}/" class="inline-block font-body font-medium text-sm text-base-content border-b border-base-content pb-0.5">
					Изменить заказ →
				</a>
			</div>
		{:else}
			<a
				href="{base}/"
				class="block w-full text-center bg-primary text-primary-content py-3.5 font-body font-semibold text-sm"
			>
				← Вернуться к меню
			</a>
		{/if}
	</div>
</div>
