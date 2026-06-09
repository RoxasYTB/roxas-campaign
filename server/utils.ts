function showHelp(client: Client, text: string): void {
	triggerNetworkEvent("showHelp", client, text);
}

function findClientByName(name: string): Client | null {
	var lname = name.toLowerCase();
	var clients = getClients();
	for (var i = 0; i < clients.length; i++) {
		if (
			clients[i]!.player &&
			clients[i]!.player!.name.toLowerCase().indexOf(lname) !== -1
		) {
			return clients[i];
		}
	}
	return null;
}

function logErr(msg: string): void {
	error("ERROR", msg);
}

function restoreAmmoDelayed(client: Client): void {
	setTimeout(() => {
		if (!client.player) return;
		var path = "./saves/" + client.player.name + ".json";
		if (!fileExists(path)) return;
		try {
			var raw = loadTextFile(path);
			var data: Record<string, unknown> = JSON.parse(
				(raw as string).substring((raw as string).indexOf("{"))
			);
			if (!data.ammunitions) return;
			var ids = Object.keys(data.ammunitions as Record<string, unknown>);
			for (var i = 0; i < ids.length; i++) {
				client.player.giveWeapon(
					Number.parseInt(ids[i], 10),
					(data.ammunitions as Record<string, number>)[ids[i]],
					false
				);
			}
		} catch (_e) {}
	}, RESPAWN_DELAY);
}
