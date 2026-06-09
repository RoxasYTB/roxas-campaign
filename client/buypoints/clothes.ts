var CLOTHES_PICKUPS: [number, number, number, number, number][] = [
	[1, 226.4, -1265.6, 20.1, Mission.THE_PARTY],
	[1, -384.5, -591.9, 25.3, Mission.RUB_OUT],
	[1, -820.2, 1364.1, 66.4, Mission.HYMAN_CONDO_BUY],
	[2, 97.5, -1133.6, 10.4, Mission.THE_PARTY],
	[3, 364.2, 1086.1, 19.0, Mission.RIOT],
	[4, 106.5, 253.0, 21.7, Mission.FOUR_IRON],
	[5, -1025.2, -429.2, 10.8, Mission.TWO_BIT_HIT],
	[6, 405.7, -485.6, 12.3, Mission.COP_LAND],
	[7, 465.3, -57.4, 15.7, Mission.THE_JOB],
	[8, 414.3, 1042.0, 25.4, Mission.TREACHEROUS_SWINE],
	[9, 158.3, -1275.9, 10.6, Mission.POLE_POSITION_CLUB_BUY],
	[10, -917.4, 885.1, 11.0, Mission.SUPPLY_AND_DEMAND],
	[11, -1200.3, -322.9, 10.9, Mission.INTRO],
	[12, -382.6, -585.9, 25.3, SAVE_LOCKED],
];
var clothesPickupHandles: { handle: Pickup; id: number; position: Vec3 }[] = [];
var clothesSkinCooldown: Record<string, boolean> = {};
var validSkin: number = PedSkin.TOMMY_VERCETTI;

function onClothesPickup(): void {
	_lastSkinChange = platform.ticks;
	try {
		natives.CLEAR_WANTED_LEVEL(0);
	} catch (_e) {
		try {
			localPlayer.wantedLevel = 0;
		} catch (_e) {}
	}
	if (typeof validSkin !== "undefined") {
		localPlayer.skin = validSkin;
		if (data) {
			data.skin = validSkin;
		}
		triggerNetworkEvent("changePlayerSkin", validSkin);
	}
}

function createClothesPickups(): void {
	destroyOldClothesPickups();
	resetClothesCooldown();
	var created: number = 0;
	for (var i = 0; i < CLOTHES_PICKUPS.length; i++) {
		var p: [number, number, number, number, number] = CLOTHES_PICKUPS[i];
		var missionReq: number = p[4];
		var hasMission: boolean = false;
		if (missionReq === SAVE_LOCKED) {
			hasMission = data !== null;
		} else if (missionReq === SAVE_ALWAYS_UNLOCKED) {
			hasMission = true;
		} else {
			hasMission = missionCache && missionCache.indexOf(missionReq) !== -1;
		}
		if (!hasMission) {
			continue;
		}
		try {
			var pos: Vec3 = new Vec3(p[1], p[2], p[3]);
			var pickup: Pickup | null = gta.createPickup(
				PickupModel.BLUE_TSHIRT,
				pos,
				PickupType.ON_FOOT
			);
			if (pickup) {
				clothesPickupHandles.push({ handle: pickup, id: p[0], position: pos });
				created++;
			}
		} catch (_e) {}
	}
	startClothesDetection();
}

function refreshClothesPickups(): void {
	createClothesPickups();
}

function hideClothesPickups(): void {
	destroyOldClothesPickups();
}

function showClothesPickups(): void {
	createClothesPickups();
}

function destroyOldClothesPickups(): void {
	if (clothesDetectionInterval) {
		clearInterval(clothesDetectionInterval);
		clothesDetectionInterval = null;
	}
	for (var i = 0; i < clothesPickupHandles.length; i++) {
		try {
			destroyElement(clothesPickupHandles[i].handle);
		} catch (_e) {}
	}
	clothesPickupHandles = [];
}

var clothesDetectionInterval: number | null = null;
var _lastSkinChange: number = 0;

function clothesPosKey(pos: Vec3): string {
	return `${Math.round(pos.x)},${Math.round(pos.y)},${Math.round(pos.z)}`;
}

function startClothesDetection(): void {
	if (clothesDetectionInterval) {
		clearInterval(clothesDetectionInterval);
	}
	clothesDetectionInterval = setInterval(() => {
		if (clothesPickupHandles.length === 0 || gta.onMission) {
			return;
		}
		if (platform.ticks - _lastSkinChange < SKIN_COOLDOWN) {
			return;
		}
		var pp: Vec3 = localPlayer.position;
		for (var i = 0; i < clothesPickupHandles.length; i++) {
			var cp: { handle: Pickup; id: number; position: Vec3 } =
				clothesPickupHandles[i];
			var key: string = clothesPosKey(cp.position);
			if (clothesSkinCooldown[key]) {
				continue;
			}
			var dx: number = pp.x - cp.position.x;
			var dy: number = pp.y - cp.position.y;
			var dz: number = pp.z - cp.position.z;
			if (
				dx * dx + dy * dy + dz * dz <= CLOTHES_DIST_SQ &&
				typeof onClothesPickup === "function"
			) {
				clothesSkinCooldown[key] = true;
				onClothesPickup();
			}
		}
	}, IV_1000);
}

function resetClothesCooldown(): void {
	clothesSkinCooldown = {};
}
