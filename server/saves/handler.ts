var _saveCache: Map<string, Record<string, unknown>> = new Map();

function getCachedSave(client: Client): Record<string, unknown> | null {
	if (!client.player) return null;
	var cached = _saveCache.get(client.player.name);
	if (cached) return cached;
	var data = loadPlayerSave(client);
	if (data) {
		_saveCache.set(client.player.name, data);
	}
	return data;
}

addNetworkHandler(
	"saveSaveStates",
	(client: Client, saveState: string, forced: boolean) => {
		if (!(client && client.player)) return;
		if (!forced && inMission.get(client.player.name)) {
			return;
		}
		try {
			var parsed = JSON.parse(saveState);
			_saveCache.set(client.player.name, parsed);
			saveTextFile(getSavePath(client.player.name), formatJSON(parsed));
		} catch (e) {}
		return true;
	}
);

addNetworkHandler("loadSaveStates", (client: Client) => {
	if (!(client && client.player)) return;
	var data: Record<string, unknown> | null = loadPlayerSave(client);
	if (!data) {
		data = emptySaveState(client);
	}
	if (data) {
		_saveCache.set(client.player.name, data);
		if (isTommySkin(data.skin as number)) {
			client.player!.skin = data.skin as number;
		}
		triggerNetworkEvent("loadSaveState", client, JSON.stringify(data));
	}
});

addNetworkHandler(
	"changePlayerSkin",
	(client: Client, skinId: number | string) => {
		if (!(client && client.player)) return;
		skinId = Number(skinId);
		if (isTommySkin(skinId)) {
			client.player!.skin = skinId;
			triggerNetworkEvent("skinUpdated", client, skinId);
		}
	}
);
