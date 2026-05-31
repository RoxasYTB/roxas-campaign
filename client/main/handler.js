addNetworkHandler("loadSaveState", function (saveStateReceived) {
      data = JSON.parse(saveStateReceived);
      if (typeof buyPointState !== "undefined" && typeof rebuildBuyPointState === "function") {
            rebuildBuyPointState();
      }
      missionCache = data.missions;
      kcabsRewardUnlocked = data.kcabsReward === true || missionCache.indexOf(74) !== -1;
      savedCameraInterior = data.camerainterior;
      gta.cameraInterior = data.camerainterior;
      gta.time.hour = data.hour;
      gta.time.minute = data.minute;
      SAVE_POINTS.forEach(function (sp) {
            createSavePoint(sp[0], sp[1], sp[2]);
      });
      localPlayer.position = new Vec3(data.playerposition[0], data.playerposition[1], data.playerposition[2]);
      localPlayer.health = data.health;
      localPlayer.armour = data.armour;
      localPlayer.money = data.money;
      localPlayer.weapon = data.equippedWeapon;
      localPlayer.streamInDistance = 999999;
      localPlayer.streamOutDistance = 999999;
      if (typeof initBuyPoints === "function") initBuyPoints();
      if (typeof applyMaxBonuses === "function") applyMaxBonuses();
      if (typeof startSideMissionDetection === "function") startSideMissionDetection();
      if (data.skin >= 161 && data.skin <= 171) {
            validSkin = data.skin;
            triggerNetworkEvent("changePlayerSkin", data.skin);
      }
      rebuildMissionsPositions();
      var restoreCam = data.camerainterior;
      var camGuard = setInterval(function () {
            if (gta.cameraInterior !== restoreCam) {
                  gta.cameraInterior = restoreCam;
            }
      }, 100);
      if (missionCache.length > 0) {
            setTimeout(function () {
                  game.fadeCamera(true, 1);
            }, 500);
      }
      setTimeout(function () {
            clearInterval(camGuard);
            gta.cameraInterior = restoreCam;
      }, 3000);

      if (missionCache.length === 0 && typeof gta.startMission === "function") {
            setTimeout(function () {
                  gta.startMission(2);
                  selectedMission = 2;
            }, 3500);
      }
});

addNetworkHandler("showHelp", function (text) {
      showHelp(text);
});

addNetworkHandler("playMission", function (missionId) {
      for (var mi = 0; mi < missions.length; mi++) {
            var m = missions[mi];
            if (m.sphere)
                  try {
                        destroyElement(m.sphere);
                  } catch (e) {
                        m.sphere = null;
                  }
            if (m.attachedBlip)
                  try {
                        destroyElement(m.attachedBlip);
                  } catch (e) {
                        m.attachedBlip = null;
                  }
      }
      missions = [];
      gta.startMission(missionId);
      selectedMission = missionId;
});
