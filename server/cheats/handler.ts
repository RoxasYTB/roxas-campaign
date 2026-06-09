function spawnCheatVehicle(client: Client, vehicleId: number): Vehicle | null {
	if (!client.player) {
		return null;
	}
	var heading = Number(client.player.rotation[2]);
	var isHeli = HELICOPTERS.indexOf(vehicleId) !== -1;
	var z = client.player.position.z + (isHeli ? HELI_Z_OFFSET : 1);
	var x = client.player.position.x + Math.sin(heading) * CHEAT_SPAWN_DIST;
	var y = client.player.position.y + Math.cos(heading) * CHEAT_SPAWN_DIST;
	var vehicle = gta.createVehicle(vehicleId, new Vec3(x, y, z), heading);
	if (vehicle) {
		cheatVehicles.push({
			id: vehicle.id,
			time: platform.ticks,
			clientPlayer: client.player,
		});
	}
	return vehicle;
}

addNetworkHandler("cheatSpawnVehicle", (client: Client, vehicleId: number) => {
	spawnCheatVehicle(client, vehicleId);
});

addNetworkHandler("cheatInfernus", (client: Client) => {
	if (!client.player) {
		return;
	}
	var vehicle = spawnCheatVehicle(client, VehicleModel.INFERNUS);
	if (vehicle) {
		vehicle.colour1 = Math.floor(Math.random() * RAND_COLOR_MAX);
		vehicle.colour2 = Math.floor(Math.random() * RAND_COLOR_MAX);
	}
});

addNetworkHandler("cheatSetSkin", (client: Client, skinId: number) => {
	if (!client.player) {
		return;
	}
	client.player.skin = skinId;
	triggerNetworkEvent("skinUpdated", client, skinId);
});

addNetworkHandler("cheatBigBang", (client: Client) => {
	if (!client.player) {
		return;
	}
	var pp = client.player.position;
	var seen: Record<number, boolean> = {};
	var positions: number[] = [];
	for (var ci = 0; ci < cheatVehicles.length; ci++) {
		var v = getElementFromId(cheatVehicles[ci].id);
		if (!v) {
			continue;
		}
		if (v.id === (client.player!.vehicle ? client.player!.vehicle!.id : -1)) {
			continue;
		}
		var dist = dist3d(
			pp.x,
			pp.y,
			pp.z,
			v.position.x,
			v.position.y,
			v.position.z
		);
		if (dist <= BIG_BANG_RADIUS) {
			positions.push(v.position.x, v.position.y, v.position.z);
			destroyElement(v);
			seen[v.id] = true;
		}
	}
	var players = getPlayers();
	for (var pi = 0; pi < players.length; pi++) {
		var pv = players[pi].vehicle;
		if (!pv || seen[pv.id]) {
			continue;
		}
		dist = dist3d(
			pp.x,
			pp.y,
			pp.z,
			pv.position.x,
			pv.position.y,
			pv.position.z
		);
		if (dist <= BIG_BANG_RADIUS) {
			positions.push(pv.position.x, pv.position.y, pv.position.z);
			destroyElement(pv);
		}
	}
	if (positions.length > 0) {
		triggerNetworkEvent(
			"cheatBigBangExplode",
			null,
			positions.length / 3,
			positions.join(",")
		);
	}
});
