addEventHandler("OnProcess", function (deltaTime) {
      if (game.game != GAME_GTA_VC) return false;
      if (localPlayer == null) return false;

      if (entryCooldown > 0) entryCooldown -= deltaTime;

      if (currentEntryPoint >= 0) {
            var ep = entryPoints[game.game][currentEntryPoint];
            var triggerPos = (ep.length > 7 && ep[7] !== false) ? ep[7] : ep[1];
            if (localPlayer.position.distance(triggerPos) >= ep[2] + 2) {
                  if (ep[5] !== false) {
                        if (localPlayer.position.distance(ep[5]) >= ep[2] + 2) {
                              currentEntryPoint = -1;
                        }
                  } else {
                        currentEntryPoint = -1;
                  }
            }
      }

      if (entryCooldown > 0) return;

      for (var i in entryPoints[game.game]) {
            if (currentEntryPoint !== -1) continue;
            var ep = entryPoints[game.game][i];

            if (ep.length > 8 && typeof ep[8] === 'number' && typeof missionCache !== 'undefined' && missionCache.indexOf(ep[8]) === -1) continue;

            if (localPlayer.isInVehicle) continue;

            var triggerIn = (ep.length > 7 && ep[7] !== false) ? ep[7] : ep[1];
            if (localPlayer.position.distance(triggerIn) <= ep[2]) {
                  currentEntryPoint = i;
                  game.setPlayerControl(false);
                  localPlayer.invincible = true;
                  game.fadeCamera(false, 0.3, toColour(0, 0, 0, 255));
                  setTimeout(function () {
                        if (ep[5] === false) {
                              if (game.cameraInterior === ep[3]) {
                                    switchInteriorAndFadeIn(-1);
                              } else {
                                    switchInteriorAndFadeIn(ep[3]);
                              }
                        } else {
                              switchInteriorAndFadeIn(ep[3], ep[5], ep[4]);
                        }
                  }, 300);
                  entryCooldown = 1000;
                  return;
            }

            if (ep[5] !== false) {
                  if (localPlayer.position.distance(ep[5]) <= ep[2]) {
                        currentEntryPoint = i;
                        game.setPlayerControl(false);
                        localPlayer.invincible = true;
                        game.fadeCamera(false, 0.3, toColour(0, 0, 0, 255));
                        setTimeout(function () {
                              switchInteriorAndFadeIn(-1, ep[1], ep[6]);
                        }, 300);
                        entryCooldown = 1000;
                        return;
                  }
            }
      }
});
