function hideSavePoints(): void {
	for (var i = 0; i < savePoints.length; i++) {
		var sp = savePoints[i];
		if (sp.pickup) {
			try {
				destroyElement(sp.pickup);
			} catch (e) {}
			sp.pickup = null;
		}
		if (sp.blip) {
			try {
				destroyElement(sp.blip);
			} catch (e) {}
			sp.blip = null;
		}
	}
}

function showSavePoints(): void {
	updateSavePointVisibility();
}

function updateSavePointVisibility(): void {
	var isPaused: boolean =
		typeof gamePaused === "undefined"
			? typeof gta.paused !== "undefined" && gta.paused
			: gamePaused;
	var px = localPlayer.position.x;
	var py = localPlayer.position.y;
	var pz = localPlayer.position.z;

	for (var i = 0; i < savePoints.length; i++) {
		var sp = savePoints[i];
		var dist = dist3d(
			px,
			py,
			pz,
			sp.position[0],
			sp.position[1],
			sp.position[2]
		);

		var shouldShow =
			!gta.onMission && !groupMissionActive && (isPaused || sp.toFinish === MISSION_TRIGGER_DIST || dist <= BLIP_VISIBILITY_DIST);

		if (shouldShow && !sp.pickup) {
			var pos = new Vec3(sp.position[0], sp.position[1], sp.position[2]);
			sp.pickup = gta.createPickup(PickupModel.SAVE, pos, PickupType.AVAILABLE);
			if (sp.flag !== "noblip") {
				var showSpBlip = true;
				if (sp.flag === "TOMMY")
					showSpBlip =
						missionCache.indexOf(Mission.KEEP_YOUR_FRIENDS_CLOSE) !== -1;
				if (sp.flag === "KCABS")
					showSpBlip = missionCache.indexOf(Mission.CABMAGGEDON) !== -1;
				if (showSpBlip) {
					var icon = Icon[sp.flag! as keyof typeof Icon] || Icon.SAVEHOUSE;
					sp.blip = gta.createBlipAttachedTo(sp.pickup, icon, 100, 0);
				}
			}
		} else if (!shouldShow && sp.pickup) {
			if (sp.blip) {
				try {
					destroyElement(sp.blip);
				} catch (e) {}
				sp.blip = null;
			}
			try {
				destroyElement(sp.pickup);
			} catch (e) {}
			sp.pickup = null;
		}
	}
}
