// [cheats] init loaded
var cheats: Record<string, any> = {};
cheats.maxBufferLength = CHEAT_BUFFER_MAX;
cheats.buffer = "";
cheats.hits = {};

addEventHandler("onCharacter", (_event: unknown, text: string) => {
	try {
		cheats.addToBuffer(text);
		cheats.checkToTriggerCheat();
	} catch (_e) {}
});

cheats.addToBuffer = (text: string): void => {
	if (cheats.buffer.length === cheats.maxBufferLength)
		cheats.buffer = cheats.buffer.substring(CHEAT_SUBSTR_OFFSET);
	cheats.buffer += text.toLowerCase();
};

addNetworkHandler("cheatBigBangExplode", (count: number, posStr: string) => {
	var nums: string[] = posStr.split(",");
	for (var i = 0; i < count; i++) {
		natives.ADD_EXPLOSION(
			new Vec3(
				Number.parseFloat(nums[i * 3]),
				Number.parseFloat(nums[i * 3 + 1]),
				Number.parseFloat(nums[i * 3 + 2])
			),
			EXPLOSION_TYPE_CHEAT
		);
	}
	var pp: Vec3 = localPlayer.position;
	for (var vi = 0; vi < MAX_VEHICLE_ID; vi++) {
		try {
			var pos: Vec3 = natives.GET_CAR_COORDINATES(vi) as Vec3;
			if (!pos) continue;
			if (dist3d(pp.x, pp.y, pp.z, pos.x, pos.y, pos.z) <= BIG_BANG_RADIUS) {
				natives.EXPLODE_CAR(vi);
				natives.ADD_EXPLOSION(pos, EXPLOSION_TYPE_CHEAT);
			}
		} catch (_e) {}
	}
});

cheats.checkToTriggerCheat = (): void => {
	if (!CHEATS_ENABLED) return;
	if (CHEATS_ADMIN_ONLY && !admin) return;
	for (var i = 0; i < cheats.buffer.length; i++) {
		var sub: string = cheats.buffer.substring(i);
		if (cheats.hits[sub]) {
			try {
				cheats.hits[sub]();
				showHelp("Cheat activated");
			} catch (_e) {}
			cheats.buffer = "";
			break;
		}
	}
};
