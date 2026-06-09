function getAllGroupClients(group: MissionGroup): Client[] {
	return [group.host].concat(group.members);
}

function getGroupByClient(client: Client): MissionGroup | null {
	var entries = Array.from(missionGroups.entries());
	for (var ei = 0; ei < entries.length; ei++) {
		var entry = entries[ei];
		var group = entry[1];
		if (group.host === client) return group;
		for (var mi = 0; mi < group.members.length; mi++) {
			if (group.members[mi] === client) return group;
		}
	}
	return null;
}

function isInGroup(client: Client): boolean {
	return getGroupByClient(client) !== null;
}

function broadcastToGroup(group: MissionGroup, event: string, ...args: any[]): void {
	var all = getAllGroupClients(group);
	for (var i = 0; i < all.length; i++) {
		try {
			triggerNetworkEvent(event, all[i], ...args);
		} catch (_e) {}
	}
}

function broadcastToMembers(group: MissionGroup, event: string, ...args: any[]): void {
	for (var i = 0; i < group.members.length; i++) {
		try {
			triggerNetworkEvent(event, group.members[i], ...args);
		} catch (_e) {}
	}
}

function destroyGroup(group: MissionGroup): void {
	broadcastToMembers(group, "groupDisbanded");
	try {
		triggerNetworkEvent("groupDisbanded", group.host);
	} catch (_e) {}
	removeGroupHealthBars(group);

	for (var mi = 0; mi < group.members.length; mi++) {
		var member = group.members[mi];
		var save = getCachedSave(member);
		if (save) {
			triggerNetworkEvent("syncMissionMarkers", member, JSON.stringify(save.missions));
		}
	}

	missionGroups.delete(group.host);
}

function removeGroupHealthBars(group: MissionGroup): void {
	var all = getAllGroupClients(group);
	for (var i = 0; i < all.length; i++) {
		try {
			triggerNetworkEvent("groupHealth", all[i], "[]");
		} catch (_e) {}
	}
}

function sendGroupHealth(): void {
	var entries = Array.from(missionGroups.entries());
	for (var ei = 0; ei < entries.length; ei++) {
		var group = entries[ei][1];
		var all = getAllGroupClients(group);
		for (var i = 0; i < all.length; i++) {
			var client = all[i];
			if (!client.player) continue;
			var others: { name: string; health: number; armour: number }[] = [];
			for (var j = 0; j < all.length; j++) {
				if (i === j) continue;
				var otherPlayer = all[j].player;
				if (!otherPlayer) continue;
				others.push({
					name: otherPlayer.name,
					health: Math.max(0, Math.min(DEFAULT_SAVE_HEALTH, otherPlayer.health)),
					armour: Math.max(0, Math.min(DEFAULT_SAVE_HEALTH, otherPlayer.armour)),
				});
			}
			if (others.length > 0) {
				triggerNetworkEvent("groupHealth", client, JSON.stringify(others));
			} else {
				triggerNetworkEvent("groupHealth", client, "[]");
			}
		}
	}
}

addCommandHandler("host", (cmd: string, text: string, client: Client) => {
	if (!client.player) return;
	if (isInGroup(client)) {
		showHelp(client, "You are already in a group. Use /leave first.");
		return;
	}
	var targetName = text.trim();
	if (!targetName || targetName === "") {
		showHelp(client, "Usage: /host <player>");
		return;
	}
	var target = findClientByName(targetName);
	if (!target || !target.player) {
		showHelp(client, "Player not found.");
		return;
	}
	if (target === client) {
		showHelp(client, "Cannot host yourself.");
		return;
	}
	if (isInGroup(target)) {
		showHelp(client, "That player is already in a group.");
		return;
	}
	var group: MissionGroup = {
		host: client,
		members: [target],
		missionId: null,
		missionName: null,
	};
	missionGroups.set(client, group);
	triggerNetworkEvent("groupFormed", client, true, target.player.name);
	triggerNetworkEvent("groupFormed", target, false, client.player.name);
	showHelp(client, "You formed a group with " + target.player.name);
	showHelp(target, client.player.name + " added you to a group.");
});

addCommandHandler("join", (cmd: string, text: string, client: Client) => {
	if (!client.player) return;
	if (isInGroup(client)) {
		showHelp(client, "You are already in a group. Use /leave first.");
		return;
	}
	var hostName = text.trim();
	if (!hostName || hostName === "") {
		showHelp(client, "Usage: /join <host>");
		return;
	}
	var host = findClientByName(hostName);
	if (!host || !host.player) {
		showHelp(client, "Host not found.");
		return;
	}
	var group = missionGroups.get(host);
	if (!group) {
		showHelp(client, "That player is not hosting a group.");
		return;
	}
	if (group.members.indexOf(client) !== -1) {
		showHelp(client, "You are already in this group.");
		return;
	}
	if (group.missionId !== null) {
		showHelp(client, "This group is already in a mission. Wait for it to end.");
		return;
	}
	group.members.push(client);
	triggerNetworkEvent("groupFormed", client, false, host.player.name);
	triggerNetworkEvent("groupMemberJoined", host, client.player.name);
	showHelp(client, "You joined " + host.player.name + "'s group.");
	showHelp(host, client.player.name + " joined your group.");
});

addCommandHandler("leave", (cmd: string, text: string, client: Client) => {
	if (!client.player) return;
	var group = getGroupByClient(client);
	if (!group) {
		showHelp(client, "You are not in a group.");
		return;
	}
	if (group.host === client) {
		destroyGroup(group);
		showHelp(client, "You disbanded the group.");
		return;
	}
	var idx = group.members.indexOf(client);
	if (idx !== -1) {
		group.members.splice(idx, 1);
		triggerNetworkEvent("groupDisbanded", client);
		triggerNetworkEvent("groupMemberLeft", group.host, client.player.name);
		try {
			triggerNetworkEvent("groupHealth", client, "[]");
		} catch (_e) {}
		showHelp(client, "You left the group.");
		showHelp(group.host, client.player.name + " left your group.");
	}
});

addCommandHandler("disband", (cmd: string, text: string, client: Client) => {
	if (!client.player) return;
	var group = missionGroups.get(client);
	if (!group) {
		showHelp(client, "You are not the host of a group.");
		return;
	}
	destroyGroup(group);
	showHelp(client, "You disbanded the group.");
});

addCommandHandler("kick", (cmd: string, text: string, client: Client) => {
	if (!client.player) return;
	var group = missionGroups.get(client);
	if (!group) {
		showHelp(client, "You are not the host of a group.");
		return;
	}
	var targetName = text.trim();
	if (!targetName) {
		showHelp(client, "Usage: /kick <player>");
		return;
	}
	var target = findClientByName(targetName);
	if (!target || !target.player) {
		showHelp(client, "Player not found.");
		return;
	}
	var idx = group.members.indexOf(target);
	if (idx === -1) {
		showHelp(client, "That player is not in your group.");
		return;
	}
	group.members.splice(idx, 1);
	triggerNetworkEvent("groupDisbanded", target);
	try {
		triggerNetworkEvent("groupHealth", target, "[]");
	} catch (_e) {}
	showHelp(client, target.player.name + " was kicked from your group.");
	showHelp(target, "You were kicked from the group.");
});

setInterval(sendGroupHealth, IV_500);
