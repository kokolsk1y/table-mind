<script>
	import { onMount, onDestroy } from "svelte";

	let mounted = $state(false);
	/** @type {any[]} */
	let triggers = [];
	/** @type {any} */
	let gsapLib = null;

	onMount(async () => {
		// Загружаем GSAP + ScrollTrigger через CDN UMD-сборки
		await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js");
		await loadScript("https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js");

		// @ts-ignore
		gsapLib = window.gsap;
		// @ts-ignore
		gsapLib.registerPlugin(window.ScrollTrigger);

		mounted = true;

		// Небольшая задержка чтобы DOM устаканился
		await new Promise((r) => requestAnimationFrame(r));

		setupEffect1MaskReveal();
		setupEffect2BlurFocus();
		setupEffect3StickyHighlight();
		setupEffect4LayeredParallax();
		setupEffect5HorizontalPin();

		// @ts-ignore
		window.ScrollTrigger.refresh();
	});

	onDestroy(() => {
		triggers.forEach((t) => t?.kill?.());
		triggers = [];
	});

	/**
	 * @param {string} src
	 */
	function loadScript(src) {
		return new Promise((resolve, reject) => {
			// @ts-ignore
			if ([...document.scripts].some((s) => s.src === src)) return resolve(true);
			const s = document.createElement("script");
			s.src = src;
			s.onload = () => resolve(true);
			s.onerror = reject;
			document.head.appendChild(s);
		});
	}

	// ==================== ЭФФЕКТ 1: Mask Reveal по строкам ====================
	function setupEffect1MaskReveal() {
		// Сплитим заголовки на слова, потом группируем по строкам по offsetTop
		const headlines = document.querySelectorAll("[data-mask-reveal]");
		headlines.forEach((el) => {
			const text = el.textContent?.trim() || "";
			el.innerHTML = "";
			const words = text.split(/\s+/);
			/** @type {HTMLElement[]} */
			const wordSpans = [];
			words.forEach((w, i) => {
				const span = document.createElement("span");
				span.className = "mask-word";
				span.textContent = w;
				el.appendChild(span);
				wordSpans.push(span);
				if (i < words.length - 1) {
					el.appendChild(document.createTextNode(" "));
				}
			});

			// Группировка по строкам — слова с одинаковым offsetTop в одной строке
			/** @type {Map<number, HTMLElement[]>} */
			const lineMap = new Map();
			wordSpans.forEach((s) => {
				const top = s.offsetTop;
				if (!lineMap.has(top)) lineMap.set(top, []);
				lineMap.get(top)?.push(s);
			});

			// Оборачиваем каждую строку в .mask-line
			const lines = [...lineMap.values()];
			el.innerHTML = "";
			lines.forEach((lineWords) => {
				const line = document.createElement("span");
				line.className = "mask-line";
				const inner = document.createElement("span");
				inner.className = "mask-line-inner";
				inner.textContent = lineWords.map((w) => w.textContent).join(" ");
				line.appendChild(inner);
				el.appendChild(line);
				el.appendChild(document.createTextNode(" "));
			});

			const innerLines = el.querySelectorAll(".mask-line-inner");
			const tween = gsapLib.fromTo(
				innerLines,
				{ yPercent: 110 },
				{
					yPercent: 0,
					duration: 0.9,
					ease: "expo.out",
					stagger: 0.08,
					paused: true
				}
			);

			// @ts-ignore
			const trigger = window.ScrollTrigger.create({
				trigger: el,
				start: "top 85%",
				end: "bottom 20%",
				onEnter: () => tween.play(),
				onLeaveBack: () => tween.reverse()
			});
			triggers.push(trigger);
		});
	}

	// ==================== ЭФФЕКТ 2: Blur-to-Focus на цифрах ====================
	function setupEffect2BlurFocus() {
		const items = document.querySelectorAll("[data-blur-item]");
		items.forEach((el, i) => {
			const tween = gsapLib.fromTo(
				el,
				{ opacity: 0, filter: "blur(20px)", y: 24 },
				{
					opacity: 1,
					filter: "blur(0px)",
					y: 0,
					duration: 1.1,
					ease: "power3.out",
					delay: i * 0.08,
					paused: true
				}
			);

			// @ts-ignore
			const trigger = window.ScrollTrigger.create({
				trigger: el,
				start: "top 88%",
				end: "bottom 15%",
				onEnter: () => tween.play(),
				onLeaveBack: () => tween.reverse()
			});
			triggers.push(trigger);
		});
	}

	// ==================== ЭФФЕКТ 3: Sticky Pin + Word Highlight (scrub) ====================
	function setupEffect3StickyHighlight() {
		const para = document.querySelector("[data-highlight-para]");
		if (!para) return;

		const text = para.textContent?.trim() || "";
		const words = text.split(/\s+/);
		para.innerHTML = "";
		/** @type {HTMLElement[]} */
		const spans = [];
		words.forEach((w, i) => {
			const span = document.createElement("span");
			span.className = "hl-word";
			span.textContent = w;
			para.appendChild(span);
			spans.push(span);
			if (i < words.length - 1) para.appendChild(document.createTextNode(" "));
		});

		// @ts-ignore
		const trigger = window.ScrollTrigger.create({
			trigger: ".section-highlight",
			start: "top top",
			end: "+=1500",
			pin: ".highlight-stage",
			scrub: 0.8,
			onUpdate: (/** @type {any} */ self) => {
				const progress = self.progress;
				const activeIndex = Math.floor(progress * spans.length);
				spans.forEach((s, i) => {
					s.classList.toggle("hl-active", i < activeIndex);
				});
			}
		});
		triggers.push(trigger);
	}

	// ==================== ЭФФЕКТ 4: Layered Parallax Hero ====================
	function setupEffect4LayeredParallax() {
		const card = document.querySelector(".hero-card");

		const startParallax = () => {
			// @ts-ignore
			const t1 = window.ScrollTrigger.create({
				trigger: ".section-hero",
				start: "top top",
				end: "bottom top",
				scrub: 1,
				onUpdate: (/** @type {any} */ self) => {
					const p = self.progress;
					const bg = document.querySelector(".hero-bg");
					const cardEl = document.querySelector(".hero-card");
					const title = document.querySelector(".hero-title");
					const eyebrow = document.querySelector(".hero-eyebrow");
					if (bg) gsapLib.set(bg, { yPercent: p * 50 });
					if (cardEl) gsapLib.set(cardEl, { yPercent: p * -18, scale: 1 + p * 0.04 });
					if (title) gsapLib.set(title, { yPercent: p * -35, opacity: 1 - p });
					if (eyebrow) gsapLib.set(eyebrow, { yPercent: p * -28, opacity: 1 - p * 1.2 });
				}
			});
			triggers.push(t1);
		};

		if (card) {
			// Вход карточки. Параллакс регистрируется только ПОСЛЕ окончания —
			// не будет конфликта transform-stack между from() и set() от scroll.
			gsapLib.from(card, {
				scale: 0.92,
				y: 30,
				opacity: 0,
				duration: 1.0,
				ease: "expo.out",
				delay: 0.2,
				onComplete: () => {
					gsapLib.set(card, { clearProps: "scale,y,opacity" });
					startParallax();
				}
			});
		} else {
			startParallax();
		}
	}

	// ==================== ЭФФЕКТ 5: Horizontal Pin Scroll ====================
	function setupEffect5HorizontalPin() {
		const track = document.querySelector(".hpin-track");
		const wrap = document.querySelector(".hpin-wrap");
		if (!track || !wrap) return;

		const distance = () => track.scrollWidth - window.innerWidth;

		const horizontalTween = gsapLib.to(track, {
			x: () => -distance(),
			ease: "none",
			scrollTrigger: {
				trigger: wrap,
				start: "top top",
				end: () => `+=${distance()}`,
				pin: true,
				scrub: 1,
				invalidateOnRefresh: true
			}
		});
		triggers.push(horizontalTween.scrollTrigger);

		// Слова внутри карточек — мелкий blur-fade при попадании в центр (через containerAnimation)
		const cards = document.querySelectorAll(".hpin-card");
		cards.forEach((card) => {
			gsapLib.fromTo(
				card.querySelectorAll("[data-card-fade]"),
				{ opacity: 0.25, filter: "blur(10px)", y: 12 },
				{
					opacity: 1,
					filter: "blur(0px)",
					y: 0,
					duration: 0.6,
					ease: "power2.out",
					stagger: 0.06,
					scrollTrigger: {
						trigger: card,
						start: "left 70%",
						end: "right 30%",
						containerAnimation: horizontalTween,
						toggleActions: "play none none reverse"
					}
				}
			);
		});
	}
</script>

<svelte:head>
	<title>Scroll Demo · TableMind</title>
</svelte:head>

<div class="scroll-demo" class:is-ready={mounted}>
	<!-- Навигация по эффектам -->
	<nav class="demo-nav">
		<span class="masthead">Прокрутите вниз — каждый эффект реверсится при скролле вверх</span>
	</nav>

	<!-- ==================== СЕКЦИЯ 1: HERO — Layered Parallax ==================== -->
	<section class="section-hero">
		<div class="hero-bg"></div>
		<div class="hero-content">
			<div class="hero-eyebrow eyebrow">Эффект 4 · Layered Parallax</div>
			<h1 class="hero-title font-display italic">
				Меню,<br />которое<br />слышит гостя
			</h1>
		</div>
		<div class="hero-card-wrap">
			<div class="hero-card">
				<div class="card-screen">
					<div class="card-header">
						<span class="masthead">TableMind</span>
						<span class="font-mono text-[11px] opacity-60">Стол 7</span>
					</div>
					<div class="card-dish">
						<span class="font-display italic text-[22px]">Утка с вишней</span>
						<span class="dotted-leader"></span>
						<span class="font-mono tabular text-[14px]">890 ₽</span>
					</div>
					<div class="card-dish">
						<span class="font-display italic text-[22px]">Севиче из дорадо</span>
						<span class="dotted-leader"></span>
						<span class="font-mono tabular text-[14px]">650 ₽</span>
					</div>
					<div class="card-dish">
						<span class="font-display italic text-[22px]">Тартар из тунца</span>
						<span class="dotted-leader"></span>
						<span class="font-mono tabular text-[14px]">720 ₽</span>
					</div>
					<div class="card-chat">
						<span class="font-display italic text-[15px]">— Что-нибудь не острое и сытное?</span>
					</div>
				</div>
			</div>
		</div>
		<div class="hero-scroll-hint">
			<span class="masthead">↓ скроллите</span>
		</div>
	</section>

	<!-- ==================== СЕКЦИЯ 2: ЦИФРЫ — Blur-to-Focus ==================== -->
	<section class="section-numbers">
		<div class="container">
			<div class="eyebrow mb-6">Эффект 2 · Blur-to-Focus</div>
			<h2 class="font-display italic section-title" data-mask-reveal>
				Цифры, которые проявляются на странице
			</h2>

			<div class="numbers-grid">
				<div class="number-cell" data-blur-item>
					<div class="number-value font-display italic">×3</div>
					<div class="number-label">средний чек растёт после рекомендаций AI</div>
				</div>
				<div class="number-cell" data-blur-item>
					<div class="number-value font-display italic">42с</div>
					<div class="number-label">типичная скорость ответа на вопрос гостя</div>
				</div>
				<div class="number-cell" data-blur-item>
					<div class="number-value font-display italic">100%</div>
					<div class="number-label">меню всегда актуальное — без перепечатки</div>
				</div>
				<div class="number-cell" data-blur-item>
					<div class="number-value font-display italic">24/7</div>
					<div class="number-label">работа без перерывов и выходных</div>
				</div>
				<div class="number-cell" data-blur-item>
					<div class="number-value font-display italic">14</div>
					<div class="number-label">аллергенов проверяет автоматически</div>
				</div>
				<div class="number-cell" data-blur-item>
					<div class="number-value font-display italic">9 900 ₽</div>
					<div class="number-label">ежемесячная подписка ресторана</div>
				</div>
			</div>
		</div>
	</section>

	<!-- ==================== СЕКЦИЯ 3: МАНИФЕСТ — Sticky + Word Highlight ==================== -->
	<section class="section-highlight">
		<div class="highlight-stage">
			<div class="container">
				<div class="eyebrow mb-6">Эффект 3 · Sticky Pin + Word Highlight</div>
				<p class="font-display italic highlight-para" data-highlight-para>
					AI-официант знает меню до последнего ингредиента, понимает гостя по полунамёку, оформляет заказ без задержек, отправляет на кухню и помнит каждое предпочтение для следующего визита.
				</p>
			</div>
		</div>
	</section>

	<!-- ==================== СЕКЦИЯ 4: ЗАГОЛОВОК — Mask Reveal ==================== -->
	<section class="section-headline">
		<div class="container">
			<div class="eyebrow mb-6">Эффект 1 · Mask Reveal по строкам</div>
			<h2 class="font-display italic mega-title" data-mask-reveal>
				Каждая строка появляется как открывается страница меню
			</h2>
			<p class="mega-sub" data-blur-item>
				Заголовки секций «вырастают» снизу из-под маски — стаггер по строкам, естественная пауза между ними. На обратном скролле строки складываются обратно.
			</p>
		</div>
	</section>

	<!-- ==================== СЕКЦИЯ 5: МЕТОД — Horizontal Pin ==================== -->
	<section class="hpin-wrap">
		<div class="hpin-stage">
			<div class="hpin-header container">
				<div class="eyebrow mb-3">Эффект 5 · Horizontal Pin</div>
				<h2 class="font-display italic hpin-title" data-mask-reveal>
					Как работает AI-официант
				</h2>
			</div>
			<div class="hpin-track">
				<div class="hpin-card">
					<span class="hpin-num font-mono" data-card-fade>01</span>
					<h3 class="font-display italic hpin-card-title" data-card-fade>Чтение меню</h3>
					<p class="hpin-card-text" data-card-fade>
						Загружаете excel или фотографируете печатное меню — AI извлекает блюда, ингредиенты, цены и автоматически обогащает описаниями и тегами.
					</p>
				</div>
				<div class="hpin-card">
					<span class="hpin-num font-mono" data-card-fade>02</span>
					<h3 class="font-display italic hpin-card-title" data-card-fade>Понимание гостя</h3>
					<p class="hpin-card-text" data-card-fade>
						Гость пишет «что-нибудь не острое и сытное» — AI находит подходящее блюдо в вашем меню, проверяет аллергены, предлагает дополнения.
					</p>
				</div>
				<div class="hpin-card">
					<span class="hpin-num font-mono" data-card-fade>03</span>
					<h3 class="font-display italic hpin-card-title" data-card-fade>Оформление заказа</h3>
					<p class="hpin-card-text" data-card-fade>
						Заказ собирается прямо в чате, гость подтверждает, заявка моментально летит на кухню и официанту через Telegram-бот.
					</p>
				</div>
				<div class="hpin-card">
					<span class="hpin-num font-mono" data-card-fade>04</span>
					<h3 class="font-display italic hpin-card-title" data-card-fade>Память и аналитика</h3>
					<p class="hpin-card-text" data-card-fade>
						Каждый диалог логируется — менеджер видит топ-вопросов, недозаказы, апсейл-конверсию. Ресторан улучшается на реальных данных.
					</p>
				</div>
			</div>
		</div>
	</section>

	<!-- ==================== ФИНАЛ ==================== -->
	<section class="section-final">
		<div class="container">
			<h2 class="font-display italic mega-title" data-mask-reveal>
				Это пять эффектов. Скажите какие оставить и куда применить.
			</h2>
			<p class="mega-sub" data-blur-item>
				Прокрутите страницу вверх — все анимации отыграют в обратную сторону.
			</p>
		</div>
	</section>
</div>

<style>
	.scroll-demo {
		background: var(--color-base-100);
		color: var(--color-base-content);
		min-height: 100vh;
	}

	/* FOUC-щит: пока GSAP не загружен, скрываем элементы которые потом будут анимироваться */
	.scroll-demo:not(.is-ready) :global([data-blur-item]) {
		opacity: 0;
	}
	.scroll-demo:not(.is-ready) :global([data-mask-reveal]) {
		color: transparent;
	}
	.scroll-demo:not(.is-ready) :global([data-card-fade]) {
		opacity: 0.25;
	}

	.demo-nav {
		position: fixed;
		top: 0;
		left: 0;
		right: 0;
		padding: 14px 24px;
		background: color-mix(in srgb, var(--color-base-100) 75%, transparent);
		backdrop-filter: blur(8px);
		border-bottom: 1px solid var(--color-base-300);
		z-index: 100;
		text-align: center;
	}

	.container {
		max-width: 1200px;
		margin: 0 auto;
		padding: 0 32px;
	}

	/* ============ HERO ============ */
	.section-hero {
		position: relative;
		height: 100vh;
		min-height: 700px;
		overflow: hidden;
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0 8vw;
	}

	.hero-bg {
		position: absolute;
		inset: -10% 0 -20% 0;
		background:
			radial-gradient(ellipse at 30% 20%, color-mix(in srgb, var(--color-accent) 18%, transparent), transparent 60%),
			radial-gradient(ellipse at 80% 80%, color-mix(in srgb, var(--color-primary) 15%, transparent), transparent 55%),
			var(--color-base-200);
		z-index: 0;
	}

	.hero-content {
		position: relative;
		z-index: 2;
		max-width: 50%;
	}

	.hero-eyebrow {
		margin-bottom: 24px;
	}

	.hero-title {
		font-size: clamp(56px, 8vw, 120px);
		line-height: 0.92;
		letter-spacing: -0.025em;
		font-weight: 500;
	}

	.hero-card-wrap {
		position: relative;
		z-index: 1;
		width: 360px;
		max-width: 35vw;
	}

	.hero-card {
		background: var(--color-base-100);
		border: 1.5px solid var(--color-base-300);
		padding: 28px 24px;
		box-shadow: 0 30px 80px -20px color-mix(in srgb, var(--color-base-content) 25%, transparent);
		transform-origin: center center;
	}

	.card-header {
		display: flex;
		justify-content: space-between;
		align-items: center;
		padding-bottom: 16px;
		margin-bottom: 16px;
		border-bottom: 1px solid var(--color-base-300);
	}

	.card-dish {
		display: flex;
		align-items: flex-end;
		padding: 12px 0;
		border-bottom: 1px dotted color-mix(in srgb, var(--color-base-content) 25%, transparent);
	}

	.card-dish:last-of-type {
		border-bottom: none;
	}

	.card-chat {
		margin-top: 20px;
		padding: 14px 16px;
		background: color-mix(in srgb, var(--color-accent) 12%, transparent);
		border-left: 2px solid var(--color-accent);
	}

	.hero-scroll-hint {
		position: absolute;
		bottom: 32px;
		left: 50%;
		transform: translateX(-50%);
		z-index: 3;
	}

	/* ============ NUMBERS ============ */
	.section-numbers {
		padding: 160px 0;
	}

	.section-title {
		font-size: clamp(40px, 5vw, 72px);
		line-height: 1;
		letter-spacing: -0.02em;
		margin-bottom: 80px;
		max-width: 14ch;
		font-weight: 500;
	}

	.numbers-grid {
		display: grid;
		grid-template-columns: repeat(3, 1fr);
		gap: 60px 80px;
	}

	@media (max-width: 768px) {
		.numbers-grid {
			grid-template-columns: 1fr;
			gap: 40px;
		}
	}

	.number-cell {
		border-top: 1.5px solid var(--color-base-content);
		padding-top: 24px;
	}

	.number-value {
		font-size: clamp(60px, 7vw, 96px);
		line-height: 1;
		letter-spacing: -0.03em;
		font-weight: 500;
		margin-bottom: 12px;
	}

	.number-label {
		font-size: 15px;
		line-height: 1.45;
		opacity: 0.7;
		max-width: 28ch;
	}

	/* ============ HIGHLIGHT (Sticky) ============ */
	.section-highlight {
		position: relative;
	}

	.highlight-stage {
		height: 100vh;
		display: flex;
		align-items: center;
		background: var(--color-base-200);
		border-top: 1px solid var(--color-base-300);
		border-bottom: 1px solid var(--color-base-300);
	}

	.highlight-para {
		font-size: clamp(28px, 3.6vw, 56px);
		line-height: 1.15;
		letter-spacing: -0.015em;
		max-width: 22ch;
		font-weight: 400;
	}

	:global(.hl-word) {
		color: color-mix(in srgb, var(--color-base-content) 45%, transparent);
		font-weight: 400;
		font-variation-settings: "wght" 400;
		transition:
			color 0.45s cubic-bezier(0.2, 0.6, 0.2, 1),
			font-weight 0.45s cubic-bezier(0.2, 0.6, 0.2, 1),
			font-variation-settings 0.45s cubic-bezier(0.2, 0.6, 0.2, 1);
	}

	:global(.hl-word.hl-active) {
		color: var(--color-base-content);
		font-weight: 600;
		font-variation-settings: "wght" 600;
	}

	/* Каждое 4-е активное слово — акцентом охра */
	:global(.hl-word.hl-active:nth-child(4n+1)) {
		color: var(--color-accent);
	}

	/* ============ MASK REVEAL ============ */
	:global(.mask-line) {
		display: inline-block;
		overflow: hidden;
		vertical-align: top;
		line-height: inherit;
	}

	:global(.mask-line-inner) {
		display: inline-block;
		will-change: transform;
	}

	/* ============ HEADLINE SECTION ============ */
	.section-headline {
		padding: 200px 0;
		background: var(--color-base-100);
	}

	.mega-title {
		font-size: clamp(48px, 7vw, 112px);
		line-height: 0.95;
		letter-spacing: -0.025em;
		max-width: 18ch;
		font-weight: 500;
		margin-bottom: 48px;
	}

	.mega-sub {
		font-size: clamp(16px, 1.4vw, 20px);
		line-height: 1.5;
		max-width: 50ch;
		opacity: 0.7;
	}

	/* ============ HORIZONTAL PIN ============ */
	.hpin-wrap {
		height: 100vh;
		overflow: hidden;
		background: var(--color-base-200);
	}

	.hpin-stage {
		height: 100%;
		display: flex;
		flex-direction: column;
	}

	.hpin-header {
		padding: 80px 32px 40px;
	}

	.hpin-title {
		font-size: clamp(40px, 5vw, 72px);
		line-height: 1;
		letter-spacing: -0.02em;
		font-weight: 500;
	}

	.hpin-track {
		flex: 1;
		display: flex;
		gap: 48px;
		padding: 0 8vw;
		align-items: center;
	}

	.hpin-card {
		flex: 0 0 460px;
		min-height: 60%;
		padding: 48px 40px;
		background: var(--color-base-100);
		border: 1.5px solid var(--color-base-300);
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	.hpin-num {
		font-size: 14px;
		letter-spacing: 0.16em;
		color: var(--color-accent);
	}

	.hpin-card-title {
		font-size: 40px;
		line-height: 1.05;
		letter-spacing: -0.02em;
		font-weight: 500;
	}

	.hpin-card-text {
		font-size: 16px;
		line-height: 1.55;
		opacity: 0.75;
	}

	/* ============ FINAL ============ */
	.section-final {
		padding: 200px 0;
		text-align: left;
	}

	@media (max-width: 768px) {
		.section-hero {
			flex-direction: column;
			justify-content: center;
			padding: 100px 24px 60px;
			gap: 40px;
		}
		.hero-content {
			max-width: 100%;
		}
		.hero-card-wrap {
			max-width: 90vw;
			width: 100%;
		}
		.hpin-card {
			flex: 0 0 320px;
			padding: 32px 24px;
		}
		.hpin-card-title {
			font-size: 28px;
		}
	}

	@media (prefers-reduced-motion: reduce) {
		:global(.mask-line-inner),
		:global([data-blur-item]) {
			transform: none !important;
			opacity: 1 !important;
			filter: none !important;
		}
	}
</style>
