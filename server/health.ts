function startHealthMonitor(client: Client): void {
	var interval = setInterval(() => {
		if (!client.player) {
			clearInterval(interval);
			return;
		}

		if (client.player.health < 1 && !isDead.get(client)) {
			isDead.set(client, true);

			var group = missionGroups.get(client);
			if (group && group.missionId !== null && group.host === client) {
				var missionId: number = group.missionId as number;
				group.missionId = null;
				group.missionName = null;
				broadcastToGroup(group, "groupMissionFailed", missionId);
				var all = [group.host].concat(group.members);
				for (var i = 0; i < all.length; i++) {
					var p = all[i].player;
					if (p) inMission.set(p.name, false);
				}
			}

			setTimeout(() => {
				triggerNetworkEvent("deathFade", client);
				setTimeout(() => {
					inGame.set(client.player!.name, false);
					respawnPlayer(client);
					setTimeout(() => {
						isDead.set(client, false);
					}, DEATH_RESET_DELAY);
				}, RESPAWN_DELAY);
			}, DEATH_SEQUENCE_DELAY);
		}
	}, IV_200);
}
