var savePoints: {
	pickup: Pickup | null;
	blip: Blip | null;
	flag: string | null;
	position: [number, number, number];
	toFinish: number;
}[] = [];

function createSavePoint(
	toFinish: number,
	position: [number, number, number],
	flag?: string
): void {
	var owned =
		typeof buyPointState !== "undefined" &&
		buyPointState.indexOf(toFinish) !== -1;
	var unlocked =
		toFinish === SAVE_ALWAYS_UNLOCKED || missionCache.indexOf(toFinish) !== -1 || owned;
	if (unlocked) {
		savePoints.push({
			pickup: null,
			blip: null,
			flag: flag || null,
			position: position,
			toFinish: toFinish,
		});
		saveFromSavePoint(position);
	}
}

function refreshSavePoints(): void {
	for (var i = 0; i < SAVE_POINTS.length; i++) {
		var spDef = SAVE_POINTS[i];
		var toFinish = spDef[0];
		var position = spDef[1];
		var flag = spDef[2];
		var exists = savePoints.find((s) => (
				s.toFinish === toFinish ||
				(s.position[0] === position[0] &&
					s.position[1] === position[1] &&
					s.position[2] === position[2])
			));
		if (!exists) {
			createSavePoint(toFinish, position, flag);
		}
	}
}

function rebuildSavePoints(): void {
	hideSavePoints();
	savePoints = [];
	refreshSavePoints();
}
