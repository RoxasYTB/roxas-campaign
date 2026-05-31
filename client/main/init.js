bindEventHandler("OnResourceStart", thisResource, function () {
      setTimeout(function () {
            data = Object.assign({}, DEFAULT_STATE, {
                  ammunitions: Object.assign({}, DEFAULT_STATE.ammunitions),
            });
            if (data.missions && data.missions.slice) {
                  missionCache = data.missions.slice();
            } else {
                  missionCache = [];
            }
            triggerNetworkEvent("loadSaveStates", localPlayer.name);

            for (var wi = 0; wi < Object.keys(data.ammunitions).length; wi++) {
                  var weapon = Object.keys(data.ammunitions)[wi];
                  var ammo = data.ammunitions[weapon];
                  if (ammo > 0) {
                        var weaponInt = parseInt(weapon);
                        localPlayer.giveWeapon(weaponInt, ammo, weaponInt === data.equippedWeapon);
                        localPlayer.setWeaponAmmunition(weaponInt, ammo);
                  }
            }

            rebuildMissionsPositions();

            var lastOnMission = false;
            setInterval(function () {
                  if (gta.onMission && !lastOnMission) {
                        triggerNetworkEvent("missionStart", selectedMission);
                        for (var mi = 0; mi < missions.length; mi++) {
                              if (missions[mi].sphere) {
                                    try { destroyElement(missions[mi].sphere); } catch (e) {}
                                    missions[mi].sphere = null;
                              }
                              if (missions[mi].attachedBlip) {
                                    try { destroyElement(missions[mi].attachedBlip); } catch (e) {}
                                    missions[mi].attachedBlip = null;
                              }
                        }
                        hideSavePoints();
                  } else if (!gta.onMission && lastOnMission) {
                        triggerNetworkEvent("missionEnd");
                        showSavePoints();
                        if (typeof refreshBuyPointPickups === "function") refreshBuyPointPickups();
                        if (typeof applyPropertyRevenue === "function") applyPropertyRevenue();
                  }
                  lastOnMission = gta.onMission;
            }, 100);

            var gameLoop = setInterval(function () {
                  for (var gw = 0; gw < localPlayer.weapons.length; gw++) {
                        var w = localPlayer.weapons[gw];
                        data.ammunitions[w] = localPlayer.getWeaponAmmunition(w);
                  }

                  var pp = [Math.round(localPlayer.position.x), Math.round(localPlayer.position.y), Math.round(localPlayer.position.z)];

                  for (var mi = 0; mi < missions.length; mi++) {
                        var mission = missions[mi];
                        if (!mission.sphere) continue;
                        var mpos = mission.position;
                        if (!mpos) continue;
                        var dist = dist3d(pp[0], pp[1], pp[2], mpos[0], mpos[1], mpos[2]);
                        if (mission.id >= 72 && mission.id <= 74) continue;
                        if (dist <= 2 && !gta.onMission && !localPlayer.isInVehicle) {
                              handleStartMission(mission.id);
                        }
                  }
                  if (!gta.onMission && localPlayer.vehicle && (localPlayer.vehicle.modelIndex === 216 || localPlayer.vehicle.modelIndex === 188)) {
                        var vp = localPlayer.vehicle.position;
                        for (var ki = 0; ki < missions.length; ki++) {
                              var km = missions[ki];
                              if (km.id < 72 || km.id > 74) continue;
                              if (!km.sphere || !km.position) continue;
                              if (missionCache.indexOf(km.id) !== -1) continue;
                              var dist = dist3d(vp.x, vp.y, vp.z, km.position[0], km.position[1], km.position[2]);
                              if (dist <= 4) {
                                    handleStartMission(km.id);
                                    break;
                              }
                        }
                  }

                  if (gta.onMission) {
                        moneyBeforeMission = localPlayer.money;
                        isInMission = true;
                  } else if (selectedMission === 1) {
                        missionCache.push(1);
                        isInMission = false;
                        gta.cameraInterior = 1;
                        game.cameraInterior = 1;
                        localPlayer.interior = 1;
                        savedCameraInterior = 1;
                        if (typeof refreshClothesPickups === "function") refreshClothesPickups();
                        var nextId = 2;
                        selectedMission = 0;
                        setTimeout(function () {
                              gta.startMission(nextId);
                              selectedMission = nextId;
                        }, 500);
                        rebuildMissionsPositions();
                  } else if (selectedMission === 2) {
                        missionCache.push(selectedMission);
                        isInMission = false;
                        gta.cameraInterior = 1;
                        game.cameraInterior = 1;
                        localPlayer.interior = 1;
                        savedCameraInterior = 1;
                        if (typeof refreshClothesPickups === "function") refreshClothesPickups();
                        if (typeof refreshSavePoints === "function") refreshSavePoints();
                        setTimeout(function () {
                              selectedMission = 4;
                        }, 5000);
                        rebuildMissionsPositions();
                  } else if (isInMission && !gta.onMission) {
                        if (selectedMission === 0) {
                              if (typeof checkPropertyPurchaseAfterMission === "function")
                                    checkPropertyPurchaseAfterMission(moneyBeforeMission, localPlayer.money);
                              isInMission = false;
                              moneyBeforeMission = 0;
                              rebuildMissionsPositions();
                        } else if (localPlayer.health > 0 && moneyBeforeMission < localPlayer.money && missionCache.indexOf(selectedMission) === -1) {
                              missionCache.push(selectedMission);
                              if (selectedMission === 74) kcabsRewardUnlocked = true;
                              if (typeof refreshClothesPickups === "function") refreshClothesPickups();
                              selectedMission = 0;
                              moneyBeforeMission = 0;
                              isInMission = false;
                              rebuildMissionsPositions();
                        } else if (localPlayer.health > 0 && moneyBeforeMission >= localPlayer.money) {
                              if (typeof getBuyPointIdByMission === "function" && selectedMission !== 0) {
                                    var bpId = getBuyPointIdByMission(selectedMission);
                                    if (bpId !== null) {
                                          var def = _bpById.get(bpId);
                                          if (def) completePropertyPurchase(def);
                                    }
                              }
                              selectedMission = 0;
                              moneyBeforeMission = 0;
                              isInMission = false;
                              rebuildMissionsPositions();
                        } else {
                              selectedMission = 0;
                              moneyBeforeMission = 0;
                              isInMission = false;
                              rebuildMissionsPositions();
                        }
                  }

                  if (localPlayer.health <= 0) {
                        gta.cancelMission(true);
                        isInMission = false;
                        selectedMission = 0;
                        moneyBeforeMission = 0;
                        rebuildMissionsPositions();
                  }
            }, 1000);
      }, 200);
});
