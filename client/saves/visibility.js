function hideSavePoints() {
      for (var i = 0; i < savePoints.length; i++) {
            var sp = savePoints[i];
            if (sp.pickup) {
                  try { destroyElement(sp.pickup); } catch (e) {}
                  sp.pickup = null;
            }
            if (sp.blip) {
                  try { destroyElement(sp.blip); } catch (e) {}
                  sp.blip = null;
            }
      }
}

function showSavePoints() {
      updateSavePointVisibility();
}

function updateSavePointVisibility() {
      var isPaused = typeof gamePaused !== 'undefined' ? gamePaused : (typeof gta.paused !== 'undefined' && gta.paused);
      var px = localPlayer.position.x;
      var py = localPlayer.position.y;
      var pz = localPlayer.position.z;

      for (var i = 0; i < savePoints.length; i++) {
            var sp = savePoints[i];
            var dist = dist3d(px, py, pz, sp.position[0], sp.position[1], sp.position[2]);

            var shouldShow = !gta.onMission && (isPaused || sp.toFinish === 2 || dist <= 300);

            if (shouldShow && !sp.pickup) {
                  var pos = new Vec3(sp.position[0], sp.position[1], sp.position[2]);
                  sp.pickup = gta.createPickup(411, pos, 2);
                  if (sp.flag !== "noblip") {
                        var showSpBlip = true;
                        if (sp.flag === "TOMMY") showSpBlip = missionCache.indexOf(52) !== -1;
                        if (sp.flag === "KCABS") showSpBlip = missionCache.indexOf(74) !== -1;
                        if (sp.flag === "FILM") showSpBlip = missionCache.indexOf(30) !== -1;
                        if (showSpBlip) {
                              var icon = ICONS[sp.flag] || ICONS.SAVEHOUSE;
                              sp.blip = gta.createBlipAttachedTo(sp.pickup, icon, 100, 0);
                        }
                  }
            } else if (!shouldShow && sp.pickup) {
                  if (sp.blip) { try { destroyElement(sp.blip); } catch (e) {} sp.blip = null; }
                  try { destroyElement(sp.pickup); } catch (e) {}
                  sp.pickup = null;
            }
      }
}
