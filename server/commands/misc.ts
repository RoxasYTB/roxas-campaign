function getCommandInt(client: Client, text: string, cmdName: string, usageSuffix: string): number {
	if (!client.player) return Number.NaN;
	var val = Number.parseInt(text, 10);
	if (Number.isNaN(val)) {
		showHelp(client, "Usage: /" + cmdName + " " + usageSuffix);
	}
	return val;
}

function getCommandFloat(client: Client, text: string, cmdName: string, usageSuffix: string): number {
	if (!client.player) return Number.NaN;
	var val = Number.parseFloat(text);
	if (Number.isNaN(val)) {
		showHelp(client, "Usage: /" + cmdName + " " + usageSuffix);
	}
	return val;
}

addCommandHandler("progress", (_cmd, text, client) => {
	if (!client.player) {
		return;
	}
	if (!text) {
		showHelp(client, "Usage: /progress <id> [title] [percent]");
		return;
	}
	var spaceIdx = text.indexOf(" ");
	if (spaceIdx === -1) {
		var barId = Number.parseInt(text, 10);
		if (Number.isNaN(barId)) {
			showHelp(client, "Usage: /progress <id> [title] [percent]");
			return;
		}
		triggerNetworkEvent("setProgressBar", client, barId);
		showHelp(client, "Progress bar " + barId + " removed");
		return;
	}
	barId = Number.parseInt(text.substring(0, spaceIdx), 10);
	if (Number.isNaN(barId)) {
		showHelp(client, "Usage: /progress <id> [title] [percent]");
		return;
	}
	var rest = text.substring(spaceIdx + 1).trim();
	if (!rest) {
		triggerNetworkEvent("setProgressBar", client, barId);
		showHelp(client, "Progress bar " + barId + " removed");
		return;
	}
	var title;
	var percent;
	if (rest.charAt(0) === '"') {
		var closeIdx = rest.indexOf('"', 1);
		if (closeIdx === -1) {
			showHelp(client, "Usage: /progress <id> [title] [percent]");
			return;
		}
		title = rest.substring(1, closeIdx);
		var after = rest.substring(closeIdx + 1).trim();
		percent = Number.parseInt(after, 10);
	} else {
		var parts = rest.split(" ");
		percent = Number.parseInt(parts[parts.length - 1], 10);
		title = parts.slice(0, parts.length - 1).join(" ");
	}
	if (Number.isNaN(percent) || !title) {
		showHelp(client, "Usage: /progress <id> [title] [percent]");
		return;
	}
	triggerNetworkEvent("setProgressBar", client, barId, title, percent);
	showHelp(client, "Progress bar " + barId + ": " + title + " " + percent + "%");
});

addCommandHandler("text", (_cmd, text, client) => {
	if (!client.player) {
		return;
	}
	if (!text) {
		showHelp(client, "Usage: /text <id> <title>");
		return;
	}
	var spaceIdx = text.indexOf(" ");
	var barId = Number.parseInt(
		spaceIdx === -1 ? text : text.substring(0, spaceIdx),
		10
	);
	if (Number.isNaN(barId)) {
		showHelp(client, "Usage: /text <id> <title>");
		return;
	}
	if (spaceIdx === -1) {
		showHelp(client, "Usage: /text <id> <title>");
		return;
	}
	var rest = text.substring(spaceIdx + 1).trim();
	var title;
	if (rest.charAt(0) === '"') {
		var closeIdx = rest.indexOf('"', 1);
		if (closeIdx === -1) {
			showHelp(client, "Usage: /text <id> <title>");
			return;
		}
		title = rest.substring(1, closeIdx);
	} else {
		title = rest;
	}
	if (!title) {
		showHelp(client, "Usage: /text <id> <title>");
		return;
	}
	triggerNetworkEvent("setProgressText", client, barId, title);
	showHelp(client, "Progress bar " + barId + " title set to \"" + title + "\"");
});

addCommandHandler("margin", (_cmd, text, client) => {
	var val = getCommandInt(client, text, "margin", "<pixels>");
	if (Number.isNaN(val)) return;
	triggerNetworkEvent("progressSetMargin", client, val);
	showHelp(client, "Progress text margin set to " + val + "px");
});

addCommandHandler("toptext", (_cmd, text, client) => {
	var val = getCommandInt(client, text, "toptext", "<px>");
	if (Number.isNaN(val)) return;
	triggerNetworkEvent("progressSetTextY", client, val);
	showHelp(client, "Progress text Y offset set to " + val + "px");
});

addCommandHandler("heighttext", (_cmd, text, client) => {
	var val = getCommandFloat(client, text, "heighttext", "<size>");
	if (Number.isNaN(val)) return;
	triggerNetworkEvent("progressSetFontSize", client, val);
	showHelp(client, "Progress text height set to " + val);
});

addCommandHandler("size", (_cmd, text, client) => {
	var val = getCommandFloat(client, text, "size", "<fontSize>");
	if (Number.isNaN(val)) return;
	triggerNetworkEvent("progressSetFontSize", client, val);
	showHelp(client, "Progress font size set to " + val);
});

addCommandHandler("bary", (_cmd, text, client) => {
	if (!client.player) {
		return;
	}
	var parts = text.split(" ");
	if (parts.length < 2) {
		showHelp(client, "Usage: /bary <barId> <y>");
		return;
	}
	var barId = Number.parseInt(parts[0], 10);
	var val = Number.parseInt(parts[1], 10);
	if (Number.isNaN(barId) || Number.isNaN(val)) {
		showHelp(client, "Usage: /bary <barId> <y>");
		return;
	}
	triggerNetworkEvent("progressSetBarY", client, barId, val);
	showHelp(client, "Bar " + barId + " Y set to " + val);
});

addCommandHandler("left", (_cmd, text, client) => {
	var val = getCommandInt(client, text, "left", "<pixels>");
	if (Number.isNaN(val)) return;
	triggerNetworkEvent("progressSetPos", client, val, undefined);
	showHelp(client, "Progress right margin set to " + val + "px");
});

addCommandHandler("top", (_cmd, text, client) => {
	var val = getCommandInt(client, text, "top", "<pixels>");
	if (Number.isNaN(val)) return;
	triggerNetworkEvent("progressSetPos", client, undefined, val);
	showHelp(client, "Progress top set to " + val + "px");
});

addCommandHandler("width", (_cmd, text, client) => {
	var val = getCommandInt(client, text, "width", "<pixels>");
	if (Number.isNaN(val)) return;
	triggerNetworkEvent("progressSetSize", client, val, undefined);
	showHelp(client, "Progress width set to " + val + "px");
});

addCommandHandler("height", (_cmd, text, client) => {
	var val = getCommandInt(client, text, "height", "<pixels>");
	if (Number.isNaN(val)) return;
	triggerNetworkEvent("progressSetSize", client, undefined, val);
	showHelp(client, "Progress height set to " + val + "px");
});

addCommandHandler("blipcolor", (_cmd, text, client) => {
	if (!client.player) {
		return;
	}
	var colour;
	if (/^#?[0-9a-fA-F]{6}$/.test(text)) {
		colour = Number.parseInt(text.replace("#", ""), 16);
	} else {
		colour = Number.parseInt(text, 10);
	}
	if (Number.isNaN(colour)) {
		showHelp(client, "Usage: /blipcolor <hex|int>  e.g. /blipcolor ffd700");
		return;
	}
	triggerNetworkEvent("setBlipColour", client, colour);
	showHelp(client, "Blip colour set to " + colour);
});

addCommandHandler("msg", (_cmd, text, _client) => {
	message(text, COLOUR_LIME);
	logChatMessage(text);
});

addCommandHandler("summon", (_cmd: string, text: string, client: Client) => {
	if (!isAdmin(client)) {
		return;
	}
	var targetClient = getClients().find((c: Client) =>
		c.player!.name.toLowerCase().includes(text.toLowerCase())
	);
	if (targetClient && targetClient.player) {
		var pos = client.player!.position;
		triggerNetworkEvent("fadeTeleport", targetClient, pos.x, pos.y, pos.z);
		targetClient.cameraInterior = client.cameraInterior;
	}
});

addCommandHandler(
	"createasset",
	(_cmd: string, text: string, client: Client) => {
		var pos = client.player!.position;
		var qty = Number.parseInt(text, 10) || 100;
		triggerNetworkEvent("createAssetPickup", client, pos.x, pos.y, pos.z, qty);
		messageClient("Asset pickup created (qty: " + qty + ")", client, COLOUR_LIME);
		logChatMessage("Asset pickup created (qty: " + qty + ")");
	}
);

addCommandHandler("play", (_cmd, text, client) => {
	var missionId = Number.parseInt(text, 10);
	if (Number.isNaN(missionId)) {
		showHelp(client, "Usage: /play <mission_id>");
		return;
	}
	triggerNetworkEvent("playMission", client, missionId);
	showHelp(client, "Mission " + missionId + " started");
});

addCommandHandler("destroymi", (_cmd, text, client) => {
	if (!client.player) {
		return;
	}
	var modelIndex = Number.parseInt(text, 10);
	if (Number.isNaN(modelIndex)) {
		showHelp(client, "Usage: /destroymi <modelIndex>");
		return;
	}
	var clients = getClients();
	for (var i = 0; i < clients.length; i++) {
		triggerNetworkEvent("destroyPedsByModel", clients[i], modelIndex);
	}
	showHelp(client, "Destroying all peds with modelIndex " + modelIndex);
});

addCommandHandler("destroyid", (_cmd, text, client) => {
	if (!client.player) {
		return;
	}
	var pedId = Number.parseInt(text, 10);
	if (Number.isNaN(pedId)) {
		showHelp(client, "Usage: /destroyid <ped.id>");
		return;
	}
	var clients = getClients();
	for (var i = 0; i < clients.length; i++) {
		triggerNetworkEvent("destroyPedById", clients[i], pedId);
	}
	showHelp(client, "Destroying ped " + pedId);
});

addCommandHandler("policemodel", (_cmd, text, client) => {
	if (!client.player) {
		return;
	}
	var modelIndex = Number.parseInt(text, 10);
	if (Number.isNaN(modelIndex)) {
		showHelp(client, "Usage: /policemodel <modelIndex>");
		return;
	}
	triggerNetworkEvent("setPoliceModel", client, modelIndex);
	showHelp(client, "Police model filter set to " + modelIndex);
});

addCommandHandler("skin", (_cmd, text, client) => {
	if (!client.player) {
		return;
	}
	var skinId = Number.parseInt(text, 10);
	if (Number.isNaN(skinId)) {
		showHelp(client, "Usage: /skin <skin_id>");
		return;
	}
	client.player.skin = skinId;
	triggerNetworkEvent("skinUpdated", client, skinId);
	showHelp(client, "Skin changed to " + skinId);
});

addCommandHandler("position", (_cmd: string, text: string, client: Client) => {
	var target: Client = client;
	if (text) {
		var found = getClients().find((c: Client) =>
			c.player!.name.toLowerCase().includes(text.toLowerCase())
		);
		if (found) {
			target = found;
		}
	}
	if (!target.player) {
		showHelp(client, "Player not found");
		return;
	}
	var pos = target.player.position;
	var msg = target.player.name + " (" + Math.round(pos.x) + ", " + Math.round(pos.y) + ", " + Math.round(pos.z) + ")";
	info("POSITION", msg);
	showHelp(client, msg);
});

addCommandHandler("syncmissions", (_cmd: string, text: string, client: Client) => {
	if (!client.player) return;
	info("SYNC", client.player.name + " ran /syncmissions (text=\"" + text + "\", admin=" + isAdmin(client) + ")");
	if (text && isAdmin(client)) {
		var target = findClientByName(text);
		if (!target || !target.player) {
			showHelp(client, "Player not found");
			return;
		}
		_saveCache.delete(target.player!.name);
		var targetData = loadPlayerSave(target);
		if (targetData) _saveCache.set(target.player!.name, targetData);
		if (targetData && targetData.missions) {
			triggerNetworkEvent("applyMissions", target, JSON.stringify(targetData.missions));
			info("SYNC", "Synced " + target.player.name + " from file (" + (targetData.missions as number[]).length + " missions)");
			showHelp(client, "Missions synced for " + target.player.name);
		}
		return;
	}
	if (isAdmin(client) && !text) {
		var allClients = getClients();
		var synced = 0;
		for (var ci = 0; ci < allClients.length; ci++) {
			var c = allClients[ci];
			if (!c.player) continue;
			_saveCache.delete(c.player.name);
			var cData = loadPlayerSave(c);
			if (cData) _saveCache.set(c.player.name, cData);
			if (cData && cData.missions) {
				triggerNetworkEvent("applyMissions", c, JSON.stringify(cData.missions));
				info("SYNC", c.player.name + " synced from file (" + (cData.missions as number[]).length + " missions)");
				synced++;
			}
		}
		showHelp(client, "Missions synced for " + synced + " player(s)");
		return;
	}
	// Self-sync: always read fresh from file
	_saveCache.delete(client.player.name);
	var selfData = loadPlayerSave(client);
	if (selfData) _saveCache.set(client.player.name, selfData);
	if (!selfData || !selfData.missions) {
		showHelp(client, "No save data found");
		return;
	}
	triggerNetworkEvent("syncMissionMarkers", client, JSON.stringify(selfData.missions));
	info("SYNC", client.player.name + " self-synced from file (" + (selfData.missions as number[]).length + " missions)");
	showHelp(client, "Missions synced from server save file");
});
