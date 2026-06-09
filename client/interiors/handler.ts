addEventHandler("OnProcess", (deltaTime: number) => {
	if (game.game !== GAME_GTA_VC) {
		return false;
	}
	if (localPlayer === null) {
		return false;
	}

	if (entryCooldown > 0) {
		entryCooldown -= deltaTime;
	}

	if (currentEntryPoint >= 0) {
		var ep: EntryPointEntry = entryPoints[game.game][currentEntryPoint];
		var triggerPos: any = ep.length > 7 && ep[7] !== false ? ep[7]! : ep[1];
		if (localPlayer.position.distance(triggerPos) >= ep[2] + 2) {
			if (ep[5] === false) {
				currentEntryPoint = -1;
			} else if (localPlayer.position.distance(ep[5]) >= ep[2] + 2) {
				currentEntryPoint = -1;
			}
		}
	}

	if (entryCooldown > 0) {
		return;
	}

	var entryKeys: string[] = Object.keys(entryPoints[game.game]);
	for (var ei = 0; ei < entryKeys.length; ei++) {
		if (currentEntryPoint !== -1) {
			continue;
		}
		var i: string = entryKeys[ei];
		var ep: EntryPointEntry = entryPoints[game.game][i];

		if (
			ep.length > 8 &&
			typeof ep[8] === "number" &&
			typeof missionCache !== "undefined" &&
			missionCache.indexOf(ep[8] as number) === -1
		) {
			continue;
		}

		if (localPlayer.isInVehicle) {
			continue;
		}

		var triggerIn: any = ep.length > 7 && ep[7] !== false ? ep[7] : ep[1];
		if (localPlayer.position.distance(triggerIn) <= ep[2]) {
			currentEntryPoint = Number.parseInt(i, 10);
			game.setPlayerControl(false);
			localPlayer.invincible = true;
			game.fadeCamera(false, FADE_SHORT_SEC, toColour(0, 0, 0, ALPHA_OPAQUE));
			setTimeout(() => {
				if (ep[5] === false) {
					if (game.cameraInterior === ep[3]) {
						switchInteriorAndFadeIn(-1);
					} else {
						switchInteriorAndFadeIn(ep[3]);
					}
				} else {
					switchInteriorAndFadeIn(ep[3], ep[5], ep[4]);
				}
			}, FADE_MS);
			entryCooldown = INTERIOR_COOLDOWN;
			return;
		}

		if (ep[5] !== false && localPlayer.position.distance(ep[5]) <= ep[2]) {
			currentEntryPoint = Number.parseInt(i, 10);
			game.setPlayerControl(false);
			localPlayer.invincible = true;
			game.fadeCamera(false, FADE_SHORT_SEC, toColour(0, 0, 0, ALPHA_OPAQUE));
			setTimeout(() => {
				switchInteriorAndFadeIn(-1, ep[1], ep[6]);
			}, FADE_MS);
			entryCooldown = INTERIOR_COOLDOWN;
			return;
		}
	}
});
