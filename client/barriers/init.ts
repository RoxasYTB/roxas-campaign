var _barrierData: {
	model: number;
	x: number;
	y: number;
	z: number;
	unlockMission: number;
	rot?: Vec3;
}[] = [
	{
		model: 590,
		x: -97.3,
		y: 1061.8,
		z: 11.6,
		unlockMission: Mission.INTERGLOBAL_FILMS_BUY,
	},
	{
		model: 2141,
		x: -81.46,
		y: 81.358,
		z: 21.04,
		unlockMission: Mission.PHNOM_PENH_86,
	},
	{
		model: 3518,
		x: -242.671,
		y: -935.667,
		z: 16.198,
		unlockMission: Mission.PHNOM_PENH_86,
	},
	{
		model: 2446,
		x: -715.082,
		y: -489.689,
		z: 12.549,
		unlockMission: Mission.PHNOM_PENH_86,
		rot: new Vec3(0, 0, 0),
	},
	{
		model: 2447,
		x: -181.451,
		y: -472.61,
		z: 11.353,
		unlockMission: Mission.PHNOM_PENH_86,
		rot: new Vec3(0, 0, 103),
	},
];
var _barriers: { handle: unknown; data: (typeof _barrierData)[0] }[] = [];

function spawnBarriers(): void {
	for (var i = 0; i < _barrierData.length; i++) {
		var b = _barrierData[i];
		try {
			natives.REQUEST_MODEL(b.model);
			natives.LOAD_ALL_MODELS_NOW();
			var h = natives.CREATE_OBJECT_NO_OFFSET(b.model, new Vec3(b.x, b.y, b.z));
			if (h !== null && h !== 0) {
				if (b.rot) {
					natives.SET_OBJECT_ROTATION(h, b.rot);
				}
				natives.DONT_REMOVE_OBJECT(h);
				_barriers.push({ handle: h, data: b });
			}
		} catch (_e) {}
	}
}

function checkBarriers(): void {
	for (var i = _barriers.length - 1; i >= 0; i--) {
		var entry = _barriers[i];
		if (missionCache.indexOf(entry.data.unlockMission) !== -1) {
			try {
				natives.DELETE_OBJECT(entry.handle);
			} catch (_e) {}
			_barriers.splice(i, 1);
		}
	}
}

bindEventHandler("OnResourceStart", thisResource, () => {
	spawnBarriers();
	setInterval(checkBarriers, IV_3000);
});
