addNetworkHandler("loadSaveState", (saveStateReceived: string) => {
	data = JSON.parse(saveStateReceived);
	if (
		typeof buyPointState !== "undefined" &&
		typeof rebuildBuyPointState === "function"
	) {
		rebuildBuyPointState();
	}
	fileMissions = data.missions ? data.missions.slice() : [];
	sessionMissions = [];
	rebuildEffectiveMissions();
	kcabsRewardUnlocked =
		data.kcabsReward === true ||
		missionCache.indexOf(Mission.CABMAGGEDON) !== -1;
	savedCameraInterior = data.camerainterior;
	gta.cameraInterior = data.camerainterior;
	gta.time.hour = data.hour;
	gta.time.minute = data.minute;
	SAVE_POINTS.forEach((sp: [number, [number, number, number], string?]) => {
		createSavePoint(sp[0], sp[1], sp[2]);
	});
	localPlayer.position = new Vec3(
		data.playerposition[0],
		data.playerposition[1],
		data.playerposition[2]
	);
	localPlayer.health = data.health;
	localPlayer.armour = data.armour;
	localPlayer.money = data.money;
	localPlayer.weapon = data.equippedWeapon;
	localPlayer.streamInDistance = STREAM_INFINITE;
	localPlayer.streamOutDistance = STREAM_INFINITE;
	if (typeof initBuyPoints === "function") {
		initBuyPoints();
	}
	if (typeof applyMaxBonuses === "function") {
		applyMaxBonuses();
	}
	if (typeof startSideMissionDetection === "function") {
		startSideMissionDetection();
	}
	if (isTommySkin(data.skin)) {
		validSkin = data.skin;
		triggerNetworkEvent("changePlayerSkin", data.skin);
	}
	rebuildMissionsPositions();
	var restoreCam: number = data.camerainterior;
	var camGuard: number = setInterval(() => {
		if (gta.cameraInterior !== restoreCam) {
			gta.cameraInterior = restoreCam;
		}
	}, IV_100);
	if (missionCache.length > 0) {
		setTimeout(() => {
			game.fadeCamera(true, 1);
		}, IV_500);
	}
	setTimeout(() => {
		clearInterval(camGuard);
		gta.cameraInterior = restoreCam;
	}, IV_3000);

	if (missionCache.length === 0 && typeof gta.startMission === "function") {
		setTimeout(() => {
			gta.startMission(Mission.AN_OLD_FRIEND);
			selectedMission = Mission.AN_OLD_FRIEND;
		}, 3500);
	}
});

addNetworkHandler("showHelp", (text: string) => {
	showHelp(text);
});

addNetworkHandler("playMission", (missionId: number) => {
	for (var mi = 0; mi < missions.length; mi++) {
		var m: {
			id: number;
			position: [number, number, number];
			key: string;
			blip: number;
			attachedBlip: Blip | null;
			sphere: Sphere | null;
		} = missions[mi];
		if (m.sphere) {
			try {
				destroyElement(m.sphere);
			} catch (_e) {
				m.sphere = null;
			}
		}
		if (m.attachedBlip) {
			try {
				destroyElement(m.attachedBlip);
			} catch (_e) {
				m.attachedBlip = null;
			}
		}
	}
	missions = [];
	gta.startMission(missionId);
	selectedMission = missionId;
});

addNetworkHandler("syncMissionMarkers", (missionsJson: string) => {
	if (gta.onMission) return;
	fileMissions = JSON.parse(missionsJson);
	rebuildEffectiveMissions();
	kcabsRewardUnlocked = missionCache.indexOf(Mission.CABMAGGEDON) !== -1;
	rebuildMissionsPositions();
	if (typeof rebuildSavePoints === "function") rebuildSavePoints();
	if (typeof rebuildBuyPointPickups === "function") rebuildBuyPointPickups();
	if (typeof applyPropertyGarages === "function") applyPropertyGarages();
	if (typeof rebuildPropertyRevenue === "function") rebuildPropertyRevenue();
	if (typeof applyPropertyChanges === "function") applyPropertyChanges();
	if (typeof checkCompleteBonus === "function") checkCompleteBonus();
});

addNetworkHandler("setCheatConfig", (enabled: boolean, adminOnly: boolean) => {
	CHEATS_ENABLED = enabled;
	CHEATS_ADMIN_ONLY = adminOnly;
});

addNetworkHandler("applyMissions", (missionsJson: string) => {
	fileMissions = JSON.parse(missionsJson);
	rebuildEffectiveMissions();
	kcabsRewardUnlocked = missionCache.indexOf(Mission.CABMAGGEDON) !== -1;
	rebuildMissionsPositions();
	if (typeof rebuildSavePoints === "function") rebuildSavePoints();
	if (typeof refreshClothesPickups === "function") refreshClothesPickups();
	if (typeof rebuildBuyPointState === "function") rebuildBuyPointState();
	if (typeof rebuildBuyPointPickups === "function") rebuildBuyPointPickups();
	if (typeof applyPropertyGarages === "function") applyPropertyGarages();
	if (typeof rebuildPropertyRevenue === "function") rebuildPropertyRevenue();
	if (typeof applyPropertyChanges === "function") applyPropertyChanges();
	if (typeof checkCompleteBonus === "function") checkCompleteBonus();
	showHelp("Missions synced from server save file");
});
