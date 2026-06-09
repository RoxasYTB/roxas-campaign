addNetworkHandler("pedHealthReport", (client: Client, pedId: number, modelIndex: number, health: number) => {
	if (!client.player) return;
	var group = missionGroups.get(client);
	if (!group || group.host !== client) return;

	for (var mi = 0; mi < group.members.length; mi++) {
		var member = group.members[mi];
		if (member.player) {
			triggerNetworkEvent("pedHealth", member, pedId, modelIndex, health);
		}
	}
});

addNetworkHandler("hostMoved", (client: Client, x: number, y: number, z: number) => {
	if (!client.player) return;
	var group = missionGroups.get(client);
	if (!group || group.host !== client || group.missionId === null) return;

	for (var mi = 0; mi < group.members.length; mi++) {
		var member = group.members[mi];
		if (member.player) {
			triggerNetworkEvent("fadeTeleport", member, x, y, z);
		}
	}
});
