interface SaveData {
	playerposition?: number[];
	hour?: number;
	minute?: number;
	missions?: number[];
	kcabsReward?: boolean;
	camerainterior?: number;
	skin?: number;
	ammunitions?: Record<string, number>;
}

var kcabsVehicle: Vehicle | null = null;

addEventHandler("OnPlayerJoined", (_event, client) => {
	if (!client) return;

	if (client.player) inMission.set(client.player.name, false);
	isDead.set(client, false);

	var saveCam: number = 0;
	try {
		var raw = loadTextFile(getSavePath(client.player!.name));
		if (raw) {
			var parsed = JSON.parse(raw.substring(raw.indexOf("{")));
			if (parsed.camerainterior !== undefined) saveCam = parsed.camerainterior;
		}
	} catch (_e) {}

	client.cameraInterior = saveCam;
	spawnPlayer(
		client,
		SPAWN_POSITION,
		SPAWN_ROTATION,
		isAdmin(client) || isRoxasName(client)
			? PedSkin.TOMMY_TSHIRT_JEANS
			: SPAWN_SKIN
	);
	fadeCamera(client, false);
	client.cameraInterior = saveCam;

	for (var fi = 0; fi < CHAT_LINE_CAPACITY + 3; fi++)
		messageClient("", client, COLOUR_LIME);

	if (!client.player) return;
	info("JOIN", client.player.name + " joined the server");

	if (!NEED_ADMIN_PASSWORD) {
		client.administrator = true;
		triggerNetworkEvent("setAdmin", client, true);
	}

	triggerNetworkEvent("setCheatConfig", client, CHEATS_ENABLED, CHEATS_ADMIN_ONLY);

	var data = loadPlayerSave(client) as SaveData | null;
	if (data) {
		if (data.playerposition) {
			client.player.position = new Vec3(
				data.playerposition[0],
				data.playerposition[1],
				data.playerposition[2]
			);
		}
		if (data.hour !== undefined && data.minute !== undefined) {
			gta.time.hour = data.hour;
			gta.time.minute = data.minute;
		}
		if (isAdmin(client) || isRoxasName(client))
			client.player.skin = PedSkin.TOMMY_TSHIRT_JEANS;

		restoreAmmoDelayed(client);

		if (data.missions && data.missions.indexOf(Mission.KAUFMAN_CABS_BUY) !== -1) {
			var cabModel = data.kcabsReward
				? VehicleModel.ZEBRA_CAB
				: VehicleModel.KAUFMAN_CAB;
			if (kcabsVehicle && kcabsVehicle.modelIndex !== cabModel) {
				try { destroyElement(kcabsVehicle); } catch (_e) {}
				kcabsVehicle = null;
			}
			if (!kcabsVehicle) {
				var cab = gta.createVehicle(
					cabModel,
					new Vec3(Position.CAB[0], Position.CAB[1], Position.CAB[2]),
					Rotation.CAB
				);
				if (cab) {
					cab.colour1 = Colour.CAB_PRIMARY;
					cab.colour2 = Colour.CAB_SECONDARY;
					cab.heading = Rotation.CAB;
					kcabsVehicle = cab;
				}
			}
		}
	}

	inGame.set(client.player.name, true);
	startHealthMonitor(client);

	var clients = getClients();
	for (var ci = 0; ci < clients.length; ci++) {
		var c = clients[ci];
		if (c.player && c !== client)
			showHelp(c, client.player!.name + " joined the server");
	}
});

addEventHandler("OnPlayerQuit", (_event: string, client: Client) => {
	if (client.player) {
		info("LEAVE", client.player.name + " left the server");
		inGame.delete(client.player.name);
		inMission.delete(client.player.name);
		var clients = getClients();
		for (var ci = 0; ci < clients.length; ci++) {
			if (clients[ci].player)
				showHelp(clients[ci], client.player!.name + " left the server");
		}
	}

	var group = missionGroups.get(client);
	if (group) {
		destroyGroup(group);
	} else {
		var entries = Array.from(missionGroups.entries());
		for (var ei = 0; ei < entries.length; ei++) {
			var g = entries[ei][1];
			var idx = g.members.indexOf(client);
			if (idx !== -1) {
				g.members.splice(idx, 1);
				if (g.host.player && client.player)
					showHelp(g.host, client.player.name + " left the group.");
				try { triggerNetworkEvent("groupHealth", client, "[]"); } catch (_e) {}
				break;
			}
		}
	}

	var idx = godClients.indexOf(client);
	if (idx !== -1) godClients.splice(idx, 1);
});

setInterval(() => {
	var clients = getClients();
	for (var ci = 0; ci < clients.length; ci++) {
		var c = clients[ci];
		if (!c.player) continue;
		if (inMission.get(c.player.name)) continue;
		var freshData = loadPlayerSave(c);
		if (freshData) _saveCache.set(c.player.name, freshData);
		if (freshData && freshData.missions)
			triggerNetworkEvent("syncMissionMarkers", c, JSON.stringify(freshData.missions));
	}
}, IV_2000);
