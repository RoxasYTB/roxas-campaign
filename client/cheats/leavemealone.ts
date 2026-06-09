cheats.hits.leavemealone = () => {
	try {
		natives.CLEAR_WANTED_LEVEL(0);
	} catch (_e) {
		try {
			(localPlayer as any).wantedLevel = 0;
		} catch (_e) {}
	}
};
