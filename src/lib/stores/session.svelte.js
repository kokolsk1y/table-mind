class SessionState {
	tableNumber = $state(null);
	currentMode = $state("menu");

	get isDemoMode() {
		return this.tableNumber === null;
	}

	setTable(num) {
		this.tableNumber = String(num);
	}

	setMode(mode) {
		this.currentMode = mode;
	}

	clear() {
		this.tableNumber = null;
		this.currentMode = "menu";
	}
}

export const session = new SessionState();
