var SAVES_DIR = "./saves/";

function getSavePath(playerName: string): string {
	return SAVES_DIR + playerName + ".json";
}

function emptySaveState(_client: Client): Record<string, unknown> {
	return {
		missions: [],
		playerposition: [SPAWN_POSITION[0], SPAWN_POSITION[1], SPAWN_POSITION[2]],
		money: DEFAULT_SAVE_MONEY,
		health: DEFAULT_SAVE_HEALTH,
		armour: DEFAULT_SAVE_ARMOUR,
		hour: DEFAULT_SAVE_HOUR,
		camerainterior: Interior.NONE,
		minute: DEFAULT_SAVE_MINUTE,
		equippedWeapon: Weapon.UNARMED,
		ammunitions: {},
		clothesBought: [],
		bonuses: {},
		skin: PedSkin.TOMMY_VERCETTI,
	};
}

function loadPlayerSave(client: Client): Record<string, unknown> | null {
	var path = getSavePath(client.player!.name);
	if (!fileExists(path)) return null;
	try {
		var raw = loadTextFile(path);
		return JSON.parse((raw as string).substring((raw as string).indexOf("{")));
	} catch (e) {
		return null;
	}
}
