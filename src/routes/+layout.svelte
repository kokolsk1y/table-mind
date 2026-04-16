<script>
	import "../app.css";
	import { onMount } from "svelte";
	import { session } from "$lib/stores/session.svelte.js";

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

		const standalone = window.matchMedia("(display-mode: standalone)").matches
			|| window.navigator.standalone === true;
		if (standalone) {
			document.documentElement.classList.add("pwa-standalone");
		}
	});
</script>

<svelte:head>
	<title>TableMind — AI-официант</title>
	<meta name="description" content="AI-помощник в ресторане. Меню, рекомендации, вызов официанта." />
	<meta name="theme-color" content="#0e0e0e" />
</svelte:head>

<main class="min-h-screen bg-base-100 text-base-content">
	{@render children()}
</main>
