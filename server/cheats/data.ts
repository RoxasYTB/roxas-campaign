interface CheatVehicle {
		id: number;
		time: number;
		clientPlayer: Player;
}

var cheatVehicles: CheatVehicle[] = [];

var HELICOPTERS: number[] = [
	VehicleModel.HUNTER,
	VehicleModel.HELICOPTER,
	VehicleModel.SEA_SPARROW,
	VehicleModel.SPARROW,
	VehicleModel.MAVERICK,
	VehicleModel.VCN_MAVERICK,
	VehicleModel.POLICE_MAVERICK,
];

setInterval(() => {
	var i = 0;
	while (i < cheatVehicles.length) {
		var entry = cheatVehicles[i];
		try {
			var v = getElementFromId(entry.id);
			if (!v) {
				cheatVehicles.splice(i, 1);
				continue;
			}
			var players = getPlayers();
			var occupied = false;
			for (var p = 0; p < players.length; p++) {
				if (players[p].vehicle && players[p].vehicle!.id === entry.id) {
					occupied = true;
					break;
				}
			}
			if (occupied) {
				i++;
				continue;
			}
			var client = getClientFromPlayerElement(entry.clientPlayer);
			if (!client.player) {
				destroyElement(v);
				cheatVehicles.splice(i, 1);
				continue;
			}
			var dist = dist3d(
				client.player.position.x,
				client.player.position.y,
				client.player.position.z,
				v.position.x,
				v.position.y,
				v.position.z
			);
			if (dist > MAX_SPAWN_DIST) {
				destroyElement(v);
				cheatVehicles.splice(i, 1);
				continue;
			}
		} catch (_e) {
			cheatVehicles.splice(i, 1);
			continue;
		}
		i++;
	}
}, IV_2000);
