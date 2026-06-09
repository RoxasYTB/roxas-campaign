var _commandHandlers: Record<string, (client: Client, text: string) => void> =
	{
				tp(client: Client, text: string) {
			if (!isAdmin(client)) {
				return;
			}
			if (text.startsWith("[")) {
				var coords: number[] = JSON.parse(text);
				triggerNetworkEvent(
					"fadeTeleport",
					client,
					coords[0],
					coords[1],
					coords[2]
				);
				client.cameraInterior = Interior.NONE;
			} else {
				var targetClient = getClients().find((c: Client) =>
					c.player!.name.toLowerCase().includes(text.toLowerCase())
				);
				client.cameraInterior = targetClient
					? targetClient.cameraInterior
					: Interior.NONE;
				if (targetClient && targetClient.player) {
					var pos = targetClient.player.position;
					triggerNetworkEvent("fadeTeleport", client, pos.x, pos.y, pos.z);
				}
			}
		},
				save(client: Client) {
			triggerNetworkEvent("adminSave", client);
			showHelp(client, "Game saved");
		},
				god(client: Client) {
			var idx = godClients.indexOf(client);
			if (idx === -1) {
				godClients.push(client);
				triggerNetworkEvent("godToggle", client, true);
				showHelp(client, "God mode on");
			} else {
				godClients.splice(idx, 1);
				triggerNetworkEvent("godToggle", client, false);
				showHelp(client, "God mode off");
			}
		},
	};

Object.entries(_commandHandlers).forEach(
	([cmd, handler]: [string, (client: Client, text: string) => void]) => {
		addCommandHandler(cmd, (_command: string, text: string, client: Client) => {
			if (client.player) {
				handler(client, text);
			}
		});
	}
);

addNetworkHandler("serverTp", (client: Client, name: string) => {
	_commandHandlers.tp(client, name);
});

addCommandHandler("block", (_cmd: string, text: string, client: Client) => {
	if (!text) {
		triggerNetworkEvent("freezePlayer", client, true);
		return;
	}
	if (!isAdmin(client)) {
		return;
	}
	var target = findClientByName(text);
	if (!target) {
		showHelp(client, "Player not found");
		return;
	}
	triggerNetworkEvent("freezePlayer", target, true);
	showHelp(client, "Blocked " + target.player!.name);
});

addCommandHandler("unblock", (_cmd: string, text: string, client: Client) => {
	if (!text) {
		triggerNetworkEvent("freezePlayer", client, false);
		return;
	}
	if (!isAdmin(client)) {
		return;
	}
	var target = findClientByName(text);
	if (!target) {
		showHelp(client, "Player not found");
		return;
	}
	triggerNetworkEvent("freezePlayer", target, false);
	showHelp(client, "Unblocked " + target.player!.name);
});
