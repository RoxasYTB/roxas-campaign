function resetMissionState(): void {
	selectedMission = Mission.INITIAL;
	moneyBeforeMission = 0;
	isInMission = false;
	rebuildMissionsPositions();
}

bindEventHandler("OnResourceStart", thisResource, () => {
	setTimeout(() => {
		data = Object.assign({}, DEFAULT_STATE, {
			ammunitions: Object.assign({}, DEFAULT_STATE.ammunitions),
		});
		if (data.missions.slice) {
			fileMissions = data.missions.slice();
		} else {
			fileMissions = [];
		}
		sessionMissions = [];
		rebuildEffectiveMissions();
		triggerNetworkEvent("loadSaveStates", localPlayer.name);

		for (var wi = 0; wi < Object.keys(data.ammunitions).length; wi++) {
			var weapon: string = Object.keys(data.ammunitions)[wi];
			var ammo: number = data.ammunitions[weapon];
			if (ammo > 0) {
				var weaponInt: number = Number.parseInt(weapon, 10);
				localPlayer.giveWeapon(
					weaponInt,
					ammo,
					weaponInt === data.equippedWeapon
				);
				localPlayer.setWeaponAmmunition(weaponInt, ammo);
			}
		}

		rebuildMissionsPositions();

		var lastOnMission: boolean = false;
		setInterval(() => {
			if (gta.onMission && !lastOnMission) {
				if (!isGroupHost) triggerNetworkEvent("missionStart", selectedMission);
				for (var mi = 0; mi < missions.length; mi++) {
					if (missions[mi].sphere) {
						try {
							destroyElement(missions[mi].sphere);
						} catch (_e) {}
						missions[mi].sphere = null;
					}
					if (missions[mi].attachedBlip) {
						try {
							destroyElement(missions[mi].attachedBlip);
						} catch (_e) {}
						missions[mi].attachedBlip = null;
					}
				}
				hideSavePoints();
			if (typeof hideClothesPickups === "function") {
				hideClothesPickups();
			}
			} else if (!gta.onMission && lastOnMission) {
				if (!isGroupHost) {
					triggerNetworkEvent("missionEnd");
				}
				showSavePoints();
				if (typeof showClothesPickups === "function") {
					showClothesPickups();
				}
				if (typeof refreshBuyPointPickups === "function") {
					refreshBuyPointPickups();
				}
				if (typeof applyPropertyRevenue === "function") {
					applyPropertyRevenue();
				}
			}
			lastOnMission = gta.onMission;
		}, IV_100);

		var gameLoop: number = setInterval(() => {
			for (var gw = 0; gw < localPlayer.weapons.length; gw++) {
				var w: number = localPlayer.weapons[gw];
				data.ammunitions[w] = localPlayer.getWeaponAmmunition(w);
			}

			var pp: [number, number, number] = [
				Math.round(localPlayer.position.x),
				Math.round(localPlayer.position.y),
				Math.round(localPlayer.position.z),
			];

			for (var mi = 0; mi < missions.length; mi++) {
				var mission: {
					id: number;
					position: [number, number, number];
					key: string;
					blip: number;
					attachedBlip: Blip | null;
					sphere: Sphere | null;
				} = missions[mi];
				if (!mission.sphere) {
					continue;
				}
				var mpos: [number, number, number] | undefined = mission.position;
				if (!mpos) {
					continue;
				}
				var dist: number = dist3d(
					pp[0],
					pp[1],
					pp[2],
					mpos[0],
					mpos[1],
					mpos[2]
				);
				if (mission.id >= Mission.V_I_P && mission.id <= Mission.CABMAGGEDON) {
					continue;
				}
				if (dist <= MISSION_TRIGGER_DIST && !gta.onMission && !localPlayer.isInVehicle) {
					handleStartMission(mission.id);
				}
			}
			if (
				!gta.onMission &&
				localPlayer.vehicle &&
				(localPlayer.vehicle.modelIndex === VehicleModel.KAUFMAN_CAB ||
					localPlayer.vehicle.modelIndex === VehicleModel.ZEBRA_CAB)
			) {
				var vp: Vec3 = localPlayer.vehicle.position;
				for (var ki = 0; ki < missions.length; ki++) {
					var km: {
						id: number;
						position: [number, number, number];
						key: string;
						blip: number;
						attachedBlip: Blip | null;
						sphere: Sphere | null;
					} = missions[ki];
					if (km.id < Mission.V_I_P || km.id > Mission.CABMAGGEDON) {
						continue;
					}
					if (!(km.sphere && km.position)) {
						continue;
					}
					if (missionCache.indexOf(km.id) !== -1) {
						continue;
					}
					dist = dist3d(
						vp.x,
						vp.y,
						vp.z,
						km.position[0],
						km.position[1],
						km.position[2]
					);
					if (dist <= CAB_TRIGGER_DIST) {
						handleStartMission(km.id);
						break;
					}
				}
			}

			if (gta.onMission) {
				moneyBeforeMission = localPlayer.money;
				isInMission = true;
			} else if (selectedMission === Mission.INTRO) {
				sessionMissions.push(Mission.INTRO);
				rebuildEffectiveMissions();
				isInMission = false;
				gta.cameraInterior = Interior.OCEAN_VIEW_HOTEL;
				game.cameraInterior = Interior.OCEAN_VIEW_HOTEL;
				localPlayer.interior = Interior.OCEAN_VIEW_HOTEL;
				savedCameraInterior = Interior.OCEAN_VIEW_HOTEL;
				if (typeof refreshClothesPickups === "function") {
					refreshClothesPickups();
				}
				var nextId: number = Mission.AN_OLD_FRIEND;
				selectedMission = Mission.INITIAL;
				setTimeout(() => {
					gta.startMission(nextId);
					selectedMission = nextId;
				}, IV_500);
				rebuildMissionsPositions();
		} else if (selectedMission === Mission.AN_OLD_FRIEND) {
			sessionMissions.push(selectedMission);
			rebuildEffectiveMissions();
			isInMission = false;
			localPlayer.position = new Vec3(Position.HOTEL[0], Position.HOTEL[1], Position.HOTEL[2]);
			gta.cameraInterior = Interior.OCEAN_VIEW_HOTEL;
			game.cameraInterior = Interior.OCEAN_VIEW_HOTEL;
			localPlayer.interior = Interior.OCEAN_VIEW_HOTEL;
			savedCameraInterior = Interior.OCEAN_VIEW_HOTEL;
				if (typeof refreshClothesPickups === "function") {
					refreshClothesPickups();
				}
				if (typeof refreshSavePoints === "function") {
					refreshSavePoints();
				}
				setTimeout(() => {
					selectedMission = Mission.BACK_ALLEY_BRAWL;
				}, IV_5000);
				rebuildMissionsPositions();
			} else if (isInMission && !gta.onMission) {
				if (groupMissionActive) {
					return;
				}

				if (isGroupHost) {
					if (typeof getBuyPointIdByMission === "function" && getBuyPointIdByMission(selectedMission) !== null) {
						// Property purchase mission, fall through to solo handling
					} else {
						var passed = localPlayer.health > 0 && moneyBeforeMission < localPlayer.money && missionCache.indexOf(selectedMission) === -1;
						triggerNetworkEvent("groupMissionResult", selectedMission, passed);
						isInMission = false;
						moneyBeforeMission = 0;
						return;
					}
				}

				if (selectedMission === Mission.INITIAL) {
					if (typeof checkPropertyPurchaseAfterMission === "function") {
						checkPropertyPurchaseAfterMission(
							moneyBeforeMission,
							localPlayer.money
						);
					}
					resetMissionState();
				} else if (
					localPlayer.health > 0 &&
					moneyBeforeMission < localPlayer.money &&
					missionCache.indexOf(selectedMission) === -1
				) {
					sessionMissions.push(selectedMission);
					rebuildEffectiveMissions();
					if (selectedMission === Mission.CABMAGGEDON) {
						kcabsRewardUnlocked = true;
					}
					if (typeof refreshClothesPickups === "function") {
						refreshClothesPickups();
					}
					resetMissionState();
				} else if (
					localPlayer.health > 0 &&
					moneyBeforeMission >= localPlayer.money
				) {
					if (
						typeof getBuyPointIdByMission === "function" &&
						selectedMission !== Mission.INITIAL
					) {
						var bpId: number | null = getBuyPointIdByMission(selectedMission);
						if (bpId !== null) {
							var def: BuyPointDef | undefined = _bpById.get(bpId);
							if (def) {
								completePropertyPurchase(def);
							}
						}
					}
					resetMissionState();
				} else {
					resetMissionState();
				}
			}

			if (localPlayer.health <= 0) {
				if (isGroupMember && groupMissionActive) {
					return;
				}
				gta.cancelMission(true);
				resetMissionState();
			}
		}, IV_1000);
	}, IV_200);
});
