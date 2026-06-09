function saveFromSavePoint(position: [number, number, number]): void {
	const pos = new Vec3(...position);
	setInterval(() => {
		if (gta.onMission) return;
		if (localPlayer.position.distance(pos) <= MISSION_TRIGGER_DIST) {
			saveGame();
		}
	}, IV_1000);
}

addNetworkHandler("adminSave", () => {
	saveGame(true);
});
