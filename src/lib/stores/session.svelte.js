/**
 * Глобальное состояние сессии гостя.
 *
 * - tableNumber — номер стола (из QR-параметра ?table=N или скана QR-стикера)
 * - restaurantId — id ресторана для multi-tenant загрузки каталога
 * - currentLang — язык интерфейса гостя, авто-детект из navigator.language
 * - currentMode — менюшный режим (menu / chat / quiz / kiosk)
 */

const SUPPORTED_LANGS = ["ru", "en", "de", "pl", "lt", "fr", "it", "es", "fi", "sv", "no", "zh"];
const FALLBACK_LANG = "ru";

/** Возвращает 2-буквенный код из BCP-47 локали браузера, если он в SUPPORTED. */
function detectBrowserLang() {
	if (typeof navigator === "undefined") return FALLBACK_LANG;
	const candidates = [navigator.language, ...(navigator.languages || [])];
	for (const loc of candidates) {
		if (!loc) continue;
		const code = loc.toLowerCase().split("-")[0];
		if (SUPPORTED_LANGS.includes(code)) return code;
	}
	return FALLBACK_LANG;
}

class SessionState {
	tableNumber = $state(null);
	restaurantId = $state(null);
	currentLang = $state(FALLBACK_LANG);
	currentMode = $state("menu");

	get isDemoMode() {
		return this.tableNumber === null;
	}

	get supportedLangs() {
		return SUPPORTED_LANGS;
	}

	setTable(num) {
		this.tableNumber = String(num);
	}

	setRestaurant(id) {
		this.restaurantId = id;
	}

	/** Принимает 2-буквенный код. Если не поддерживается — fallback на RU. */
	setLang(code) {
		if (!code) return;
		const lc = String(code).toLowerCase().split("-")[0];
		this.currentLang = SUPPORTED_LANGS.includes(lc) ? lc : FALLBACK_LANG;
	}

	/** Авто-детект из браузера. Вызывается из +layout.svelte при первом mount. */
	detectLangFromBrowser() {
		this.currentLang = detectBrowserLang();
	}

	setMode(mode) {
		this.currentMode = mode;
	}

	clear() {
		this.tableNumber = null;
		this.restaurantId = null;
		this.currentMode = "menu";
		this.currentLang = FALLBACK_LANG;
	}
}

export const session = new SessionState();
