var blipSprite: number = Icon.CENTRE;
var gamePaused: boolean = false;
var lastPaused: boolean = false;
var pauseConfirm: number = 0;

function recreatePlayerBlips(): void {
	try {
		var players: Player[] = getPlayers();
		var blips: Blip[] = getBlips();

		var pids: Record<number, boolean> = {};
		for (var i = 0; i < players.length; i++) {
			if (players[i].id !== localPlayer.id) {
				pids[players[i].id] = true;
			}
		}

		for (var j = 0; j < blips.length; j++) {
			var b: Blip = blips[j];
			try {
				if (b.parent && pids[b.parent.id]) {
					try {
						destroyElement(b);
					} catch (_e) {}
				}
			} catch (_e) {}
		}

		for (i = 0; i < players.length; i++) {
			if (players[i].id === localPlayer.id) {
				continue;
			}
			try {
				var blip: Blip | null = gta.createBlipAttachedTo(
					players[i],
					blipSprite
				);
				if (blip) {
					setInfiniteStream(blip);
				}
			} catch (_e) {}
		}
	} catch (_e) {}
}

function cleanOrphanBlips(): void {
	try {
		var players: Player[] = getPlayers();
		var peds: Ped[] = getPeds();
		var blips: Blip[] = getBlips();
		var pids: Record<number, boolean> = {};
		for (var i = 0; i < players.length; i++) {
			if (players[i].id !== localPlayer.id) {
				pids[players[i].id] = true;
			}
		}
		for (i = 0; i < peds.length; i++) {
			if (peds[i].id !== localPlayer.id && peds[i].type !== ELEMENT_PLAYER) {
				pids[peds[i].id] = true;
			}
		}
		for (var j = 0; j < blips.length; j++) {
			var b: Blip = blips[j];
			try {
				if (!b.parent) {
					destroyElement(b);
					continue;
				}
				if (
					typeof b.parent.id === "number" &&
					b.parent.id > 0 &&
					b.parent.id !== localPlayer.id &&
					!pids[b.parent.id]
				) {
					destroyElement(b);
				}
			} catch (_e) {}
		}
	} catch (_e) {}
}

addEventHandler("OnProcess", () => {
	var paused: boolean = typeof gta.paused !== "undefined" && gta.paused;

	if (paused === lastPaused) {
		pauseConfirm = PAUSE_CONFIRM_CYCLES;
	} else {
		pauseConfirm--;
		if (pauseConfirm > 0) {
			return;
		}
		pauseConfirm = PAUSE_CONFIRM_CYCLES;
		lastPaused = paused;
		gamePaused = paused;
		blipSprite = paused ? Icon.TSHIRT : Icon.CENTRE;
		recreatePlayerBlips();
	}

	cleanOrphanBlips();

	if (typeof updateSavePointVisibility === "function") {
		updateSavePointVisibility();
	}
	if (typeof updateBuyPointVisibility === "function") {
		updateBuyPointVisibility();
	}
});

setInterval(recreatePlayerBlips, BLIP_RECREATE_IV);
