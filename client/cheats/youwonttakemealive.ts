cheats.hits.youwonttakemealive = () => {
	try {
		var wanted = (localPlayer as any).wantedLevel || 0;
		(localPlayer as any).wantedLevel = Math.min(wanted + 2, 6);
	} catch (_e) {}
};
