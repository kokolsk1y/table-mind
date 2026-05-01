<script>
	import { onMount } from "svelte";
	import { base } from "$app/paths";
	import { session } from "$lib/stores/session.svelte.js";
	import { loadCatalog } from "$lib/data/catalog.js";
	import { createSearchEngine } from "$lib/search/engine.js";
	import { streamChat, verifyResponse } from "$lib/ai/client.js";
	import { formatCatalogForAI, selectItemsForAI } from "$lib/ai/prompt.js";
	import { extractDishes } from "$lib/ai/parse.js";
	import { STYLES } from "$lib/ai/agents.js";
	import ChatMessage from "$lib/components/ChatMessage.svelte";
	import VoiceInput from "$lib/components/VoiceInput.svelte";

	/** @type {any} */
	let catalog = $state(null);
	/** @type {any[]} */
	let allItems = $derived(catalog?.items || []);
	/** @type {string} */
	let restaurantName = $derived(catalog?.restaurant?.name?.ru || "");
	/** @type {any} */
	let searchEngine = $state(null);
	/** @type {any[]} */
	let messages = $state([]);
	let inputText = $state("");
	let loading = $state(false);
	/** @type {string | null} */
	let selectedStyle = $state(null);
	/** @type {HTMLElement | null} */
	let chatContainer = $state(null);
	let verifierStatus = $state("✓ проверено верификатором");

	function scrollToBottom() {
		if (chatContainer) {
			setTimeout(() => {
				if (chatContainer) chatContainer.scrollTop = chatContainer.scrollHeight;
			}, 50);
		}
	}

	function saveHistory() {
		const toSave = messages.map((m) => ({ role: m.role, content: m.content }));
		sessionStorage.setItem("chat-history", JSON.stringify(toSave));
	}

	function loadHistory() {
		try {
			const saved = sessionStorage.getItem("chat-history");
			if (saved) return JSON.parse(saved);
		} catch {}
		return [];
	}

	/** @param {string} style */
	function selectStyle(style) {
		selectedStyle = style;
		sessionStorage.setItem("chat-style", style);
		messages = [
			{
				role: "assistant",
				content:
					style === "guide"
						? "Меня зовут Тим. Расскажите, что вы сегодня хотите — лёгкое, сытное, что-то новое? Подберу под настроение."
						: "Меня зовут Тим, я AI-официант TableMind. Знаю меню наизусть — спрашивайте."
			}
		];
	}

	async function sendMessage() {
		const text = inputText.trim();
		if (!text || loading) return;

		inputText = "";
		messages = [...messages, { role: "user", content: text }];
		loading = true;
		verifierStatus = "проверяю…";
		scrollToBottom();

		const history = messages.map((m) => ({ role: m.role, content: m.content }));
		const relevant = selectItemsForAI(text, history, searchEngine, allItems);
		const lang = session.currentLang;
		const catalogText = formatCatalogForAI(relevant, lang);

		const aiIdx = messages.length;
		messages = [...messages, { role: "assistant", content: "", dishes: [] }];

		streamChat({
			agent: "waiter",
			style: selectedStyle,
			message: text,
			history: history.slice(-20),
			catalog: catalogText,
			lang,
			restaurantName,
			onChunk(fullText) {
				messages[aiIdx] = { ...messages[aiIdx], content: fullText };
				messages = [...messages];
				scrollToBottom();
			},
			onDone(fullText) {
				const dishes = extractDishes(fullText, allItems);
				messages[aiIdx] = { ...messages[aiIdx], content: fullText, dishes };
				messages = [...messages];
				loading = false;
				saveHistory();
				scrollToBottom();

				verifyResponse({ response: fullText, catalog: catalogText }).then((result) => {
					if (result.verdict === "warning") {
						messages[aiIdx] = { ...messages[aiIdx], warning: result.note };
						messages = [...messages];
						verifierStatus = "⚠ сверяюсь с шефом";
					} else {
						verifierStatus = "✓ проверено верификатором";
					}
				});
			},
			onError(err) {
				messages[aiIdx] = { ...messages[aiIdx], content: `Ошибка: ${err}` };
				messages = [...messages];
				loading = false;
				verifierStatus = "⚠ сверяюсь с шефом";
			}
		});
	}

	/** @param {KeyboardEvent} e */
	function handleKeydown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	const today = new Date();
	const monthsRoman = ["I", "II", "III", "IV", "V", "VI", "VII", "VIII", "IX", "X", "XI", "XII"];
	const dateStr = `${String(today.getDate()).padStart(2, "0")} · ${monthsRoman[today.getMonth()]} · ${String(today.getFullYear()).slice(-2)}`;

	onMount(async () => {
		catalog = await loadCatalog();
		if (catalog?.restaurant?.id) {
			session.setRestaurant(catalog.restaurant.id);
		}
		searchEngine = createSearchEngine(catalog?.items || []);

		const savedStyle = sessionStorage.getItem("chat-style");
		if (savedStyle && STYLES[savedStyle]) {
			selectedStyle = savedStyle;
			const savedMessages = loadHistory();
			if (savedMessages.length > 0) {
				messages = savedMessages;
			} else {
				selectStyle(savedStyle);
			}
		}
	});
</script>

<div class="flex flex-col h-screen">
	<!-- Masthead -->
	<div class="px-5 pt-3 pb-2 border-b border-base-content/20 flex items-center justify-between masthead shrink-0">
		<span>Карта — №003</span>
		<span>{dateStr}</span>
		<span>Стол · {session.tableNumber ?? "07"}</span>
	</div>

	<!-- Chat header -->
	<div class="flex items-center justify-between px-5 py-3 border-b border-base-content/20 shrink-0">
		<a href="{base}/" class="masthead text-base-content flex items-center gap-2">
			<span class="text-base text-base-content leading-none">×</span>
			<span>К меню</span>
		</a>
		<div class="text-center">
			<div class="font-display italic text-xl text-base-content leading-none">Тим</div>
			<div class="font-mono text-[10px] tracking-[0.18em] text-base-content/55 uppercase mt-1.5">AI-официант</div>
		</div>
		<div class="w-7 h-7 border border-base-content flex items-center justify-center" aria-label="Голос">
			<svg width="11" height="11" viewBox="0 0 14 14"><rect x="5" y="1" width="4" height="8" rx="2" fill="currentColor"/><path d="M2 7v1a5 5 0 0 0 10 0V7" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/></svg>
		</div>
	</div>

	{#if !selectedStyle}
		<!-- Style selection -->
		<div class="flex-1 flex items-center justify-center p-6">
			<div class="text-center max-w-sm w-full">
				<div class="eyebrow mb-3">№ → стиль</div>
				<h2 class="font-display italic text-3xl font-medium mb-2">Как вам удобнее?</h2>
				<p class="text-sm text-base-content/60 mb-8 font-display italic">
					выберите стиль общения
				</p>
				<div class="flex flex-col">
					{#each Object.entries(STYLES) as [key, style], si (key)}
						<button
							class="flex items-baseline gap-3 py-4 px-2 border-b border-dotted border-base-content/30 active:bg-base-200 transition-colors text-left"
							onclick={() => selectStyle(key)}
						>
							<span class="eyebrow tabular">
								{String(si + 1).padStart(2, "0")}
							</span>
							<span class="flex-1 font-body font-semibold text-base text-base-content">
								{style.label}
							</span>
							<span class="font-mono tabular text-xs text-base-content">→</span>
						</button>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<!-- Messages -->
		<div class="flex-1 overflow-y-auto px-5 pt-4 pb-4" bind:this={chatContainer}>
			{#each messages as msg, i (i)}
				<ChatMessage message={msg} dishes={msg.dishes || []} index={i} />
			{/each}

			{#if loading}
				<div class="mb-5">
					<div class="eyebrow text-primary mb-1.5">Тим</div>
					<span class="loading loading-dots loading-sm text-primary"></span>
				</div>
			{/if}
		</div>

		<!-- Bottom bar -->
		<div class="border-t border-base-content/25 bg-base-200 shrink-0 safe-bottom">
			<!-- Verifier status -->
			<div class="px-5 py-2 border-b border-dotted border-base-content/20 flex items-center gap-2 masthead">
				<span class="inline-block w-2 h-2 rounded-full bg-primary"></span>
				<span>{verifierStatus}</span>
			</div>
			<!-- Input row -->
			<div class="flex items-center gap-2 px-4 py-2.5">
				<VoiceInput onResult={(text) => { inputText = text; sendMessage(); }} />
				<input
					type="text"
					placeholder="спросите или выберите…"
					class="flex-1 bg-transparent border-b border-base-content/30 py-2 px-1 text-base font-body text-base-content placeholder:text-base-content/50 placeholder:font-display placeholder:italic focus:outline-none focus:border-base-content"
					bind:value={inputText}
					onkeydown={handleKeydown}
					disabled={loading}
				/>
				<a
					href="{base}/call/"
					class="px-3 py-2.5 bg-primary text-primary-content masthead"
				>
					→ Официант
				</a>
			</div>
		</div>
	{/if}
</div>
