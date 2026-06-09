var admin: boolean = false;
var godInterval: number | null = null;

addNetworkHandler("setAdmin", (value: boolean) => {
	admin = value;
	console.log("\x1b[36m[@AUTH]\x1b[0m Client admin: " + admin);
});

addNetworkHandler("godToggle", (enabled: boolean) => {
	if (enabled) {
		if (!godInterval) {
			godInterval = setInterval(() => {
				localPlayer.health = 100;
			}, IV_200);
		}
	} else if (godInterval) {
		clearInterval(godInterval);
		godInterval = null;
	}
});

addNetworkHandler("skinUpdated", (skinId: number) => {
	if (typeof validSkin !== "undefined") validSkin = skinId;
	if (data) data.skin = skinId;
});

var _helpKeyIndex: number = 0;
var _helpKeys: string[] = ["M_ANN", "M_AN1", "M_AN2", "M_AN3"];

function showHelp(text: string): void {
	var key = _helpKeys[_helpKeyIndex % _helpKeys.length];
	_helpKeyIndex++;
	gta.setCustomText(key, text);
	natives.PRINT_HELP(key);
}

function showBuyHelp(text: string): void {
	gta.setCustomText("M_BUY", text);
	try {
		natives.PRINT_STRING(0.05, 0.05, "M_BUY");
	} catch (_e) {
		natives.PRINT_HELP("M_BUY");
	}
}

function buildSaveData(): Record<string, unknown> {
	return {
		missions: missionCache,
		playerposition: [
			Math.round(localPlayer.position.x),
			Math.round(localPlayer.position.y),
			Math.round(localPlayer.position.z),
		],
		health: localPlayer.health,
		armour: localPlayer.armour,
		money: localPlayer.money,
		hour: gta.time.hour,
		minute: gta.time.minute,
		camerainterior:
			typeof savedCameraInterior === "undefined"
				? gta.cameraInterior
				: savedCameraInterior,
		equippedWeapon: localPlayer.weapon,
		ammunitions: (localPlayer.weapons as number[]).reduce(
			(acc: Record<number, number>, weapon: number) => {
				acc[weapon] = localPlayer.getWeaponAmmunition(weapon);
				return acc;
			},
			{}
		),
		kcabsReward:
			typeof kcabsRewardUnlocked === "undefined" ? false : kcabsRewardUnlocked,
		clothesBought: (data!.clothesBought as number[]) || [],
		bonuses: data!.bonuses || {},
		skin: validSkin,
	};
}

addCommandHandler("help", () => {
	showHelp(
		"Commands: /help /tp /block /unblock | Cheat codes: type VC cheats in chat"
	);
});

function saveGame(forced?: boolean): void {
	if (gta.onMission) return;
	localPlayer.health = 100;
	if (typeof cleanMissionCache === "function") cleanMissionCache();
	triggerNetworkEvent(
		"saveSaveStates",
		JSON.stringify(buildSaveData()),
		forced
	);
}
