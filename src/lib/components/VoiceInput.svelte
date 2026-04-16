<script>
	let { onResult } = $props();

	let supported = $state(false);
	let listening = $state(false);

	$effect(() => {
		if (typeof window !== "undefined") {
			supported = "webkitSpeechRecognition" in window || "SpeechRecognition" in window;
		}
	});

	function startListening() {
		if (!supported || listening) return;

		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		const recognition = new SpeechRecognition();
		recognition.lang = navigator.language || "ru-RU";
		recognition.interimResults = false;
		recognition.maxAlternatives = 1;

		recognition.onstart = () => { listening = true; };

		recognition.onresult = (event) => {
			const text = event.results[0][0].transcript;
			if (text) onResult?.(text);
			listening = false;
		};

		recognition.onerror = () => { listening = false; };
		recognition.onend = () => { listening = false; };

		recognition.start();
	}
</script>

{#if supported}
	<button
		class="btn btn-ghost btn-sm {listening ? 'text-error animate-pulse' : 'text-base-content/50'}"
		onclick={startListening}
		title={listening ? "Слушаю..." : "Голосовой ввод"}
	>
		{listening ? "●" : "🎤"}
	</button>
{/if}
