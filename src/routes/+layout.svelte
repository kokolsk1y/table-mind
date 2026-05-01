<script>
	import "../app.css";
	import { onMount } from "svelte";
	import { session } from "$lib/stores/session.svelte.js";
	import { guest } from "$lib/stores/guest.svelte.js";
	import IosInstallPrompt from "$lib/components/IosInstallPrompt.svelte";

	let { children } = $props();

	onMount(() => {
		const stored = sessionStorage.getItem("tableNumber");
		if (stored) {
			session.setTable(stored);
		}

		const url = new URL(window.location.href);
		const tableParam = url.searchParams.get("table");
		if (tableParam) {
			const cleaned = tableParam.trim();
			if (cleaned && /^\d+$/.test(cleaned)) {
				session.setTable(cleaned);
				sessionStorage.setItem("tableNumber", cleaned);
			}
		}

		// Язык: ручной выбор гостя > сохранённый ранее > авто-детект из браузера.
		const langParam = url.searchParams.get("lang");
		const storedLang = sessionStorage.getItem("currentLang");
		if (langParam) {
			session.setLang(langParam);
			sessionStorage.setItem("currentLang", session.currentLang);
		} else if (storedLang) {
			session.setLang(storedLang);
		} else {
			session.detectLangFromBrowser();
		}

		const standalone = window.matchMedia("(display-mode: standalone)").matches;
		if (standalone) {
			document.documentElement.classList.add("pwa-standalone");
		}

		guest.restore();
	});
</script>

<svelte:head>
	<title>TableMind — AI-официант</title>
	<meta name="description" content="AI-помощник в ресторане. Меню на вашем языке, рекомендации, вызов официанта." />
	<meta name="theme-color" content="#0e0e0e" />
</svelte:head>

<main class="min-h-screen bg-base-100 text-base-content font-body">
	{@render children()}
</main>

<IosInstallPrompt />
