class GuestState {
	preferences = $state({});
	visitCount = $state(0);

	get isReturning() {
		return this.visitCount > 1;
	}

	get greeting() {
		if (!this.isReturning) return null;

		const prefs = this.preferences;
		if (prefs.lastLiked) {
			return `С возвращением! В прошлый раз вам понравилось: ${prefs.lastLiked}. Попробуем что-то новое?`;
		}
		return "С возвращением! Рады видеть вас снова.";
	}

	saveLiked(dishName) {
		this.preferences = { ...this.preferences, lastLiked: dishName };
		this.#save();
	}

	restore() {
		if (typeof window === "undefined") return;
		try {
			const saved = localStorage.getItem("guest-prefs");
			if (saved) {
				const data = JSON.parse(saved);
				this.preferences = data.preferences || {};
				this.visitCount = (data.visitCount || 0) + 1;
			} else {
				this.visitCount = 1;
			}
			this.#save();
			this.#requestPersist();
		} catch {}
	}

	#save() {
		if (typeof window === "undefined") return;
		localStorage.setItem("guest-prefs", JSON.stringify({
			preferences: this.preferences,
			visitCount: this.visitCount
		}));
	}

	#requestPersist() {
		if (navigator.storage?.persist) {
			navigator.storage.persist().catch(() => {});
		}
	}
}

export const guest = new GuestState();
