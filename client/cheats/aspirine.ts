cheats.hits.aspirine = () => {
	localPlayer.health = 100.0;
	if (localPlayer.vehicle) {
		(localPlayer.vehicle as any).health = 1000;
	}
};
