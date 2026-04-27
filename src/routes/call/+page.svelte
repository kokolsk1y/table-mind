<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { session } from "$lib/stores/session.svelte.js";
	import { cart } from "$lib/stores/cart.svelte.js";

	const API_URL_NOTIFY =
		import.meta.env.PUBLIC_API_URL_NOTIFY ||
		"https://table-mind-seven.vercel.app/api/notify";

	/** @type {"sent" | "accepted" | "enroute"} */
	let stage = $state("sent");
	let cancelled = $state(false);
	let error = $state("");

	const today = new Date();
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
			const res = await fetch(API_URL_NOTIFY, {
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
	<!-- Простая шапка -->
	<header class="flex items-center justify-between px-5 pt-5 pb-4 border-b border-base-content/20 shrink-0">
		<div class="flex items-center gap-3">
			<img src="{base}/logo.png" alt="TableMind" class="w-10 h-10 object-contain" style="mix-blend-mode: multiply;" width="40" height="40" />
			<span class="font-display italic text-xl font-semibold text-base-content tracking-wide">TableMind</span>
		</div>
		<span class="font-mono tabular text-sm text-base-content/70">
			{session.tableNumber ? `Стол ${session.tableNumber}` : "Демо"}
		</span>
	</header>

	<!-- Hero -->
	<div class="px-6 pt-12 pb-8 border-b border-base-content/20 text-center">
		<div class="font-mono text-[11px] tracking-[0.18em] text-accent uppercase mb-4">→ зовём официанта</div>
		{#if cancelled}
			<h1 class="font-display italic text-[44px] md:text-5xl font-medium text-base-content leading-[1.05]">
				Вызов<br />отменён
			</h1>
			<p class="font-display italic text-base text-base-content/65 mt-4">сообщение отозвано</p>
		{:else if error}
			<h1 class="font-display italic text-[36px] font-medium text-error leading-[1.05]">
				{error}
			</h1>
			<button class="mt-5 font-body font-medium text-base text-accent border-b-[1.5px] border-accent pb-0.5" onclick={callWaiter}>
				Попробовать снова
			</button>
		{:else}
			<h1 class="font-display italic text-[44px] md:text-5xl font-medium text-base-content leading-[1.05]">
				Сообщение<br />отправлено
			</h1>
			<p class="font-display italic text-base text-base-content/65 mt-4">через Telegram</p>
		{/if}
	</div>

	<!-- Receipt -->
	<div class="px-6 py-6 border-b border-base-content/20">
		<div class="flex items-center justify-between font-mono text-[11px] tracking-[0.18em] text-base-content/55 uppercase pb-3 border-b border-base-content/25">
			<span>№</span>
			<span>резюме заказа</span>
			<span>₽</span>
		</div>

		<div class="flex items-baseline py-3 border-b border-dotted border-base-content/30">
			<span class="font-mono text-xs text-accent tracking-[0.14em] uppercase shrink-0 w-20">Стол</span>
			<span class="flex-1 border-b border-dotted border-base-content/25 mx-2 mb-1.5"></span>
			<span class="font-body text-base text-base-content font-medium">
				{session.tableNumber ?? "07"}
			</span>
		</div>

		{#each itemsSummary as line, li}
			<div class="flex items-baseline py-3 border-b border-dotted border-base-content/30">
				<span class="font-mono text-xs text-accent tracking-[0.14em] uppercase shrink-0 w-20">
					{li === 0 ? "Выбор" : ""}
				</span>
				<span class="flex-1 border-b border-dotted border-base-content/25 mx-2 mb-1.5"></span>
				<span class="font-body text-base text-base-content text-right">
					{line}
				</span>
			</div>
		{/each}

		<div class="flex items-baseline py-3 border-b border-dotted border-base-content/30">
			<span class="font-mono text-xs text-accent tracking-[0.14em] uppercase shrink-0 w-20">Счёт</span>
			<span class="flex-1 border-b border-dotted border-base-content/25 mx-2 mb-1.5"></span>
			<span class="font-mono tabular text-base text-base-content font-medium">
				{totalStr}
			</span>
		</div>

		<div class="flex items-baseline py-3">
			<span class="font-mono text-xs text-accent tracking-[0.14em] uppercase shrink-0 w-20">Время</span>
			<span class="flex-1 border-b border-dotted border-base-content/25 mx-2 mb-1.5"></span>
			<span class="font-mono tabular text-base text-base-content font-medium">
				{timeStr}
			</span>
		</div>
	</div>

	<!-- Progress -->
	{#if !cancelled && !error}
		<div class="px-6 py-7 border-b border-base-content/20">
			<div class="font-mono text-[11px] tracking-[0.18em] text-accent uppercase mb-5">статус</div>
			<div class="flex items-center justify-between relative mb-3">
				{#each ["sent", "accepted", "enroute"] as _key, i}
					{@const active = ["sent", "accepted", "enroute"].indexOf(stage) >= i}
					<div
						class="w-5 h-5 rounded-full border-[1.5px] shrink-0 z-10 {active ? 'bg-primary border-primary' : 'bg-transparent border-base-content/40'}"
					></div>
					{#if i < 2}
						<div class="flex-1 border-t border-dotted border-base-content/30 mx-1"></div>
					{/if}
				{/each}
			</div>
			<div class="flex justify-between font-mono text-[11px] tracking-[0.16em] uppercase">
				<span class="text-primary">Получено</span>
				<span class={stage !== "sent" ? "text-primary" : "text-base-content/55"}>Принято</span>
				<span class={stage === "enroute" ? "text-primary" : "text-base-content/55"}>В пути</span>
			</div>
			<p class="font-display italic text-center text-base text-base-content/65 mt-6">
				подойдёт через 1–2 минуты
			</p>
		</div>
	{/if}

	<!-- Actions -->
	<div class="px-6 py-7 mt-auto safe-bottom">
		{#if !cancelled && !error}
			<button
				class="w-full border-[1.5px] border-base-content py-4 font-body font-medium text-base text-base-content active:bg-base-200"
				onclick={cancel}
			>
				Отменить вызов
			</button>
			<div class="text-center mt-4">
				<a href="{base}/" class="inline-block font-body font-medium text-base text-base-content border-b border-base-content pb-0.5">
					Изменить заказ
				</a>
			</div>
		{:else}
			<a
				href="{base}/"
				class="block w-full text-center bg-primary text-primary-content py-4 font-body font-semibold text-base"
			>
				Вернуться к меню
			</a>
		{/if}
	</div>
</div>
