class CartState {
	items = $state([]);

	get count() {
		return this.items.length;
	}

	get total() {
		return this.items.reduce((sum, i) => sum + i.price * i.qty, 0);
	}

	add(item) {
		const existing = this.items.find(i => i.id === item.id);
		if (existing) {
			existing.qty++;
			this.items = [...this.items];
		} else {
			this.items = [...this.items, { ...item, qty: 1 }];
		}
		this.#save();
	}

	remove(id) {
		this.items = this.items.filter(i => i.id !== id);
		this.#save();
	}

	decrement(id) {
		const item = this.items.find(i => i.id === id);
		if (!item) return;
		if (item.qty <= 1) {
			this.remove(id);
		} else {
			item.qty--;
			this.items = [...this.items];
			this.#save();
		}
	}

	clear() {
		this.items = [];
		this.#save();
	}

	#save() {
		if (typeof window !== "undefined") {
			sessionStorage.setItem("cart", JSON.stringify(this.items));
		}
	}

	restore() {
		if (typeof window === "undefined") return;
		try {
			const saved = sessionStorage.getItem("cart");
			if (saved) this.items = JSON.parse(saved);
		} catch {}
	}
}

export const cart = new CartState();
