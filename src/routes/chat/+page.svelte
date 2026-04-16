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

	let allItems = $state([]);
	let searchEngine = $state(null);
	let messages = $state([]);
	let inputText = $state("");
	let loading = $state(false);
	let selectedStyle = $state(null);
	let chatContainer = $state(null);

	function scrollToBottom() {
		if (chatContainer) {
			setTimeout(() => chatContainer.scrollTop = chatContainer.scrollHeight, 50);
		}
	}

	function saveHistory() {
		const toSave = messages.map(m => ({ role: m.role, content: m.content }));
		sessionStorage.setItem("chat-history", JSON.stringify(toSave));
	}

	function loadHistory() {
		try {
			const saved = sessionStorage.getItem("chat-history");
			if (saved) return JSON.parse(saved);
		} catch {}
		return [];
	}

	function selectStyle(style) {
		selectedStyle = style;
		sessionStorage.setItem("chat-style", style);
		messages = [{
			role: "assistant",
			content: style === "guide"
				? "Привет! Я помогу вам выбрать. Расскажите, на что вы сегодня настроены?"
				: "Здравствуйте! Я AI-официант «Янтарного берега». Чем могу помочь?"
		}];
	}

	async function sendMessage() {
		const text = inputText.trim();
		if (!text || loading) return;

		inputText = "";
		messages = [...messages, { role: "user", content: text }];
		loading = true;
		scrollToBottom();

		const history = messages.map(m => ({ role: m.role, content: m.content }));
		const relevant = selectItemsForAI(text, history, searchEngine, allItems);
		const catalog = formatCatalogForAI(relevant);

		const aiIdx = messages.length;
		messages = [...messages, { role: "assistant", content: "", dishes: [] }];

		streamChat({
			agent: "waiter",
			style: selectedStyle,
			message: text,
			history: history.slice(-20),
			catalog,
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

				// Fire-and-forget verification
				verifyResponse({ response: fullText, catalog }).then(result => {
					if (result.verdict === "warning") {
						messages[aiIdx] = { ...messages[aiIdx], warning: result.note };
						messages = [...messages];
					}
				});
			},
			onError(err) {
				messages[aiIdx] = { ...messages[aiIdx], content: `Ошибка: ${err}` };
				messages = [...messages];
				loading = false;
			}
		});
	}

	function handleKeydown(e) {
		if (e.key === "Enter" && !e.shiftKey) {
			e.preventDefault();
			sendMessage();
		}
	}

	onMount(async () => {
		allItems = await loadCatalog();
		searchEngine = createSearchEngine(allItems);

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

<div class="flex flex-col h-screen max-w-2xl mx-auto">
	<!-- Header -->
	<div class="flex items-center gap-3 p-4 border-b border-base-300">
		<a href="{base}/" class="btn btn-ghost btn-sm">← Меню</a>
		<h1 class="font-semibold flex-1">AI-официант</h1>
		{#if !session.isDemoMode}
			<span class="badge badge-outline badge-sm">Стол №{session.tableNumber}</span>
		{/if}
	</div>

	{#if !selectedStyle}
		<!-- Style selection -->
		<div class="flex-1 flex items-center justify-center p-6">
			<div class="text-center max-w-sm">
				<h2 class="text-xl font-bold mb-2">Как вам удобнее?</h2>
				<p class="text-sm text-base-content/50 mb-6">Выберите стиль общения с AI-официантом</p>
				<div class="flex flex-col gap-3">
					{#each Object.entries(STYLES) as [key, style]}
						<button
							class="btn btn-outline btn-primary"
							onclick={() => selectStyle(key)}
						>
							{style.label}
						</button>
					{/each}
				</div>
			</div>
		</div>
	{:else}
		<!-- Chat messages -->
		<div class="flex-1 overflow-y-auto p-4 space-y-4" bind:this={chatContainer}>
			{#each messages as msg, i}
				<ChatMessage message={msg} dishes={msg.dishes || []} />
			{/each}

			{#if loading}
				<div class="flex gap-3">
					<div class="bg-base-200 rounded-2xl px-4 py-3">
						<span class="loading loading-dots loading-sm text-primary"></span>
					</div>
				</div>
			{/if}
		</div>

		<!-- Allergen disclaimer -->
		<div class="px-4 py-1">
			<p class="text-xs text-base-content/30 text-center">
				Информация об аллергенах может быть неполной. Уточняйте у официанта.
			</p>
		</div>

		<!-- Input -->
		<div class="p-4 border-t border-base-300">
			<div class="flex gap-2">
				<VoiceInput onResult={(text) => { inputText = text; sendMessage(); }} />
				<input
					type="text"
					placeholder="Спросите о меню..."
					class="input input-bordered flex-1 bg-base-200"
					bind:value={inputText}
					onkeydown={handleKeydown}
					disabled={loading}
				/>
				<button
					class="btn btn-primary"
					onclick={sendMessage}
					disabled={loading || !inputText.trim()}
				>
					→
				</button>
			</div>
		</div>
	{/if}
</div>
