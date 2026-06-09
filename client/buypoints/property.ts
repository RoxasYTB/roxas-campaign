var PROPERTY_DOORS: Record<
	string,
	{
		modelOpen: number | null;
		modelClosed: number | null;
		pos: [number, number, number];
	}
> = {
	10: {
		modelOpen: PROPERTY_DOOR_3061,
		modelClosed: PROPERTY_DOOR_3062,
		pos: [97.203, -1469.731, 10.578],
	},
	38: {
		modelOpen: PROPERTY_DOOR_1444,
		modelClosed: null,
		pos: [-981.754, -841.278, 8.586],
	},
	43: {
		modelOpen: null,
		modelClosed: PROPERTY_DOOR_857,
		pos: [-640.012, -1485.941, 15.457],
	},
};

var doorHandles: number[] = [];

function destroyObjectsByModel(modelId: number, pos: Vec3): void {
	var handle = natives.SET_VISIBILITY_OF_CLOSEST_OBJECT_OF_TYPE(
		pos,
		NATIVE_SEARCH_RADIUS,
		modelId,
		0
	);
	if (handle !== null && handle !== 0 && handle !== true) {
		natives.DELETE_OBJECT(handle);
		return;
	}
	for (var h = 1; h < 2000; h++) {
		try {
			var coords: Vec3 = natives.GET_OBJECT_COORDINATES(h) as Vec3;
			if (!coords) {
				continue;
			}
			var dx: number = coords.x - pos.x;
			var dy: number = coords.y - pos.y;
			var dz: number = coords.z - pos.z;
			if (dx * dx + dy * dy + dz * dz <= PROPERTY_DIST_SQ) {
				natives.DELETE_OBJECT(h);
			}
		} catch (_e) {}
	}
}

function applyPropertyChanges(): void {
	var pdKeys: string[] = Object.keys(PROPERTY_DOORS);
	for (var pdi = 0; pdi < pdKeys.length; pdi++) {
		var bpId: string = pdKeys[pdi];
		if (buyPointState.indexOf(Number.parseInt(bpId, 10)) === -1) {
			continue;
		}
		var d: {
			modelOpen: number | null;
			modelClosed: number | null;
			pos: [number, number, number];
		} = PROPERTY_DOORS[bpId];
		try {
			var pos: Vec3 = new Vec3(d.pos[0], d.pos[1], d.pos[2]);
			if (d.modelClosed !== null) {
				natives.REQUEST_MODEL(d.modelClosed);
				natives.LOAD_ALL_MODELS_NOW();
				destroyObjectsByModel(d.modelClosed, pos);
			}
			if (d.modelOpen !== null) {
				natives.REQUEST_MODEL(d.modelOpen);
				natives.LOAD_ALL_MODELS_NOW();
				var h = natives.CREATE_OBJECT_NO_OFFSET(d.modelOpen, pos);
				if (typeof h !== "undefined" && h !== null) {
					natives.SET_OBJECT_COLLISION(h, 0);
					natives.DONT_REMOVE_OBJECT(h);
					doorHandles.push(h);
				}
			}
		} catch (_e) {}
	}
}

var ASSET_REVENUE: Record<string, [number, number, number, number, number][]> =
	{
		9: [[487.2, -81.5, 11.4, 10000, 10000]],
		10: [[93.3, -1472.14, 9.9, 4000, 4000]],
		12: [[-1059.6, -274.5, 11.4, 8000, 8000]],
		38: [[-1007.3, -869.9, 12.8, 1500, 1500]],
		39: [[-864.3, -576.6, 11.0, 3000, 3000]],
		40: [[-997.1, 189.8, 11.4, 5000, 5000]],
		43: [[-640.8, -1491.8, 13.7, 2000, 2000]],
	};
var revenuePickups: Record<string, any> = {};

function rebuildPropertyRevenue(): void {
	var keys = Object.keys(revenuePickups);
	for (var ki = 0; ki < keys.length; ki++) {
		var pickups = revenuePickups[keys[ki]];
		if (pickups && pickups.length) {
			for (var pi = 0; pi < pickups.length; pi++) {
				try { natives.DELETE_OBJECT(pickups[pi]); } catch (_e) {}
			}
		}
	}
	revenuePickups = {};
	applyPropertyRevenue();
}

function applyPropertyRevenue(): void {
	var arKeys: string[] = Object.keys(ASSET_REVENUE);
	for (var ari = 0; ari < arKeys.length; ari++) {
		var bpId: string = arKeys[ari];
		if (buyPointState.indexOf(Number.parseInt(bpId, 10)) === -1) {
			continue;
		}
		if (revenuePickups[bpId]) {
			continue;
		}
		if (
			Number.parseInt(bpId, 10) === MALIBU_ID &&
			missionCache.indexOf(Mission.THE_JOB) === -1
		) {
			continue;
		}
		var pickups: [number, number, number, number, number][] =
			ASSET_REVENUE[bpId];
		for (var pi = 0; pi < pickups.length; pi++) {
			var p: [number, number, number, number, number] = pickups[pi];
			try {
				var h = natives.CREATE_PROTECTION_PICKUP(
					new Vec3(p[0], p[1], p[2]),
					p[3],
					p[4]
				);
				if (!revenuePickups[bpId]) {
					revenuePickups[bpId] = [];
				}
				revenuePickups[bpId].push(h);
			} catch (_e) {}
		}
	}
	if (
		missionCache.indexOf(Mission.COP_LAND) !== -1 &&
		!revenuePickups.vercetti
	) {
		try {
			var h = natives.CREATE_PROTECTION_PICKUP(
				new Vec3(REVENUE_VERCETTI_POS[0], REVENUE_VERCETTI_POS[1], REVENUE_VERCETTI_POS[2]),
				5000,
				5000
			);
			revenuePickups.vercetti = [h];
		} catch (_e) {}
	}
	if (
		missionCache.indexOf(Mission.G_SPOTLIGHT) !== -1 &&
		!revenuePickups.film
	) {
		try {
			var h = natives.CREATE_PROTECTION_PICKUP(
				new Vec3(REVENUE_FILM_POS[0], REVENUE_FILM_POS[1], REVENUE_FILM_POS[2]),
				7000,
				7000
			);
			revenuePickups.film = [h];
		} catch (_e) {}
	}
	if (
		buyPointState.indexOf(MALIBU_ID) !== -1 &&
		missionCache.indexOf(Mission.THE_JOB) !== -1 &&
		!revenuePickups[MALIBU_ID]
	) {
		var p: [number, number, number, number, number] = ASSET_REVENUE[MALIBU_ID][0];
		try {
			var h = natives.CREATE_PROTECTION_PICKUP(
				new Vec3(p[0], p[1], p[2]),
				p[3],
				p[4]
			);
			revenuePickups[MALIBU_ID] = [h];
		} catch (_e) {}
	}
}

var PROPERTY_GARAGES: Record<string, [number, number][]> = {
	2: [[10, 26]],
	3: [[15, 16]],
	5: [[14, 25]],
	7: [
		[11, 17],
		[12, 18],
		[13, 24],
	],
	38: [
		[7, 8],
		[16, 27],
		[17, 28],
		[18, 29],
		[19, 30],
	],
};

function applyPropertyGarages(): void {
	var pgKeys: string[] = Object.keys(PROPERTY_GARAGES);
	for (var pgi = 0; pgi < pgKeys.length; pgi++) {
		var bpId: string = pgKeys[pgi];
		if (buyPointState.indexOf(Number.parseInt(bpId, 10)) === -1) {
			continue;
		}
		var garages: [number, number][] = PROPERTY_GARAGES[bpId];
		for (var gi = 0; gi < garages.length; gi++) {
			try {
				natives.CHANGE_GARAGE_TYPE(garages[gi][0], garages[gi][1]);
			} catch (_e) {}
		}
	}
	if (missionCache.indexOf(Mission.RUB_OUT) !== -1) {
		try {
			natives.CHANGE_GARAGE_TYPE(GARAGE_TYPE_VERCETTI_1, GARAGE_TYPE_VERCETTI_2);
		} catch (_e) {}
	}
}
