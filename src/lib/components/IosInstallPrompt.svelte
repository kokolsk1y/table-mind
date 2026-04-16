<script>
	import { onMount } from "svelte";

	let show = $state(false);

	onMount(() => {
		const isIos = /iPad|iPhone|iPod/.test(navigator.userAgent);
		const isStandalone = window.navigator.standalone === true;
		const dismissed = localStorage.getItem("ios-install-dismissed");

		if (isIos && !isStandalone && !dismissed) {
			show = true;
		}
	});

	function dismiss() {
		show = false;
		localStorage.setItem("ios-install-dismissed", "1");
	}
</script>

{#if show}
	<div class="fixed inset-0 z-[60] flex items-end justify-center p-4">
		<div class="absolute inset-0 bg-black/50" onclick={dismiss}></div>
		<div class="relative bg-base-200 rounded-2xl p-6 max-w-sm w-full shadow-xl mb-4">
			<h3 class="font-bold text-lg mb-2">Установите TableMind</h3>
			<p class="text-sm text-base-content/70 mb-4">
				Для лучшего опыта добавьте приложение на главный экран:
			</p>
			<ol class="text-sm text-base-content/60 space-y-2 mb-4">
				<li>1. Нажмите <span class="text-primary font-semibold">⬆ Поделиться</span> внизу экрана</li>
				<li>2. Выберите <span class="text-primary font-semibold">«На экран Домой»</span></li>
				<li>3. Нажмите <span class="text-primary font-semibold">«Добавить»</span></li>
			</ol>
			<button class="btn btn-primary btn-sm w-full" onclick={dismiss}>Понятно</button>
		</div>
	</div>
{/if}
