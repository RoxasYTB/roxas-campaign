var buyPointHelpCooldown = {};

function startBuyPointTouchDetection() {
      setInterval(function () {
            var px = Math.round(localPlayer.position.x);
            var py = Math.round(localPlayer.position.y);
            var pz = Math.round(localPlayer.position.z);
            for (var i = 0; i < BUY_POINTS.length; i++) {
                  var def = BUY_POINTS[i];
                  var id = def[0];
                  var name = def[1];
                  var price = def[2];
                  var pos = def[3];
                  if (buyPointState.indexOf(id) !== -1) continue;
                  var el = buyPointElements.find(function (b) {
                        return b.id === id;
                  });
                  var locked = isBuyPointLocked(def);
                  var wantedModel = locked ? 406 : 407;
                  var wantedType = locked ? 17 : (localPlayer.money >= price ? 18 : 17);
                  if (el && el.pickup && (el.type !== wantedType || el.model !== wantedModel)) {
                        destroyElement(el.pickup);
                        var newPos = new Vec3(pos[0], pos[1], pos[2]);
                        el.pickup = gta.createPickup(wantedModel, newPos, wantedType);
                        el.type = wantedType;
                        el.model = wantedModel;
                  }
                  var dist = dist3d(px, py, pz, pos[0], pos[1], pos[2]);
                  if (dist <= 2 && !localPlayer.isInVehicle) {
                        if (buyPointHelpCooldown[id] === undefined || buyPointHelpCooldown[id] <= 0) {
                              if (locked) {
                                    showHelp("You cannot buy " + name + " at this time, come back later.");
                              } else {
                                    showHelp("Press TAB to purchase " + name + " for $" + price);
                              }
                              buyPointHelpCooldown[id] = 12;
                        }
                  } else {
                        buyPointHelpCooldown[id] = 0;
                  }
            }
            for (var key in buyPointHelpCooldown) {
                  if (buyPointHelpCooldown[key] > 0) {
                        buyPointHelpCooldown[key]--;
                  }
            }
      }, 500);
}

function setupTabKeyHandler() {
      try {
            addEventHandler("onKeyDown", function (event, virtualKey, physicalKey, keyModifiers) {
                  if (virtualKey !== 9) return;
                  if (localPlayer.isInVehicle) return;
                  var px = Math.round(localPlayer.position.x);
                  var py = Math.round(localPlayer.position.y);
                  var pz = Math.round(localPlayer.position.z);
                  for (var i = 0; i < BUY_POINTS.length; i++) {
                        var def = BUY_POINTS[i];
                        var id = def[0];
                        if (buyPointState.indexOf(id) !== -1) continue;
                        var pos = def[3];
                        var dist = dist3d(px, py, pz, pos[0], pos[1], pos[2]);
                        if (dist <= 2) {
                              if (gta.onMission) {
                                    showHelp("You cannot buy property whilst on a mission");
                                    return;
                              }
                              if (isBuyPointLocked(def)) return;
                              if (localPlayer.money < def[2]) {
                                    showHelp("You don't have enough cash for this property");
                                    return;
                              }
                              pickupAndStartMission(def);
                              return;
                        }
                  }
            });
      } catch (e) {}
}

function isBuyPointLocked(def) {
      if (def.length < 6) return false;
      if (def[5] !== "money") return false;
      return missionCache.indexOf(32) === -1;
}
