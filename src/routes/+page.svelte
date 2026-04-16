<script>
	import { session } from "$lib/stores/session.svelte.js";
</script>

<div class="flex flex-col items-center justify-center min-h-screen px-4">
	<div class="text-center max-w-md">
		<h1 class="text-4xl font-bold text-primary mb-4">TableMind</h1>
		<p class="text-lg text-base-content/70 mb-8">AI-официант для вашего ресторана</p>

		{#if session.isDemoMode}
			<div class="badge badge-warning badge-lg mb-6">Демо-режим</div>
			<p class="text-sm text-base-content/50">Отсканируйте QR-код на столе для полного доступа</p>
		{:else}
			<div class="badge badge-success badge-lg mb-6">Стол №{session.tableNumber}</div>
			<p class="text-sm text-base-content/50">Меню загружается...</p>
		{/if}
	</div>
</div>
