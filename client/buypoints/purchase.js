function pickupAndStartMission(def) {
      var id = def[0];
      var name = def[1];
      var price = def[2];
      var missionId = def.length >= 5 && def[4] !== null ? def[4] : null;
      var el = buyPointElements.find(function (b) {
            return b.id === id;
      });
      if (el && el.pickup) {
            destroyElement(el.pickup);
            el.pickup = null;
      }
      var maxSteps = Math.min(60, price);
      var remaining = price;
      var decrements = [];
      for (var s = 0; s < maxSteps; s++) {
            if (remaining <= 0) break;
            var max = Math.min(remaining, Math.ceil(price / maxSteps) * 2);
            var step = s === maxSteps - 1 ? remaining : Math.floor(Math.random() * max) + 1;
            if (step > remaining) step = remaining;
            decrements.push(step);
            remaining -= step;
      }
      if (remaining > 0) decrements[decrements.length - 1] += remaining;
      var currentStep = 0;
      var countInterval = setInterval(function () {
            localPlayer.money -= decrements[currentStep];
            currentStep++;
            if (currentStep >= decrements.length) {
                  clearInterval(countInterval);
                  if (missionId !== null && missionId > 0) {
                        selectedMission = missionId;
                        gta.startMission(missionId);
                  } else {
                        completePropertyPurchase(def);
                  }
            }
      }, 50);
}

function buyProperty(def) {
      var id = def[0];
      var name = def[1];
      var price = def[2];
      if (buyPointState.indexOf(id) !== -1) return;
      if (localPlayer.money < price) {
            showHelp("Not enough money! Need $" + price);
            return;
      }
      localPlayer.money -= price;
      buyPointState.push(id);
      buyPointState.sort(function (a, b) { return a - b; });
      updateBuyPointPickup(id, true);
      if (typeof refreshSavePoints === "function") refreshSavePoints();
      if (typeof refreshBuyPointPickups === "function") refreshBuyPointPickups();
}

function completePropertyPurchase(def) {
      var id = def[0];
      var name = def[1];
      if (buyPointState.indexOf(id) !== -1) return;
      buyPointState.push(id);
      buyPointState.sort(function (a, b) { return a - b; });
      var missionId = def.length >= 5 && def[4] !== null ? Math.abs(def[4]) : null;
      if (missionId !== null && missionCache.indexOf(missionId) === -1) {
            missionCache.push(missionId);
      }
      updateBuyPointPickup(id, true);
      applyPropertyGarages();
      applyPropertyRevenue();
      applyPropertyChanges();
      if (typeof refreshSavePoints === "function") refreshSavePoints();
      if (typeof refreshBuyPointPickups === "function") refreshBuyPointPickups();
}

function getBuyPointIdByMission(missionId) {
      var def = _bpByMission.get(missionId);
      return def ? def[0] : null;
}

function checkPropertyPurchaseAfterMission(moneyBefore, moneyAfter) {
      if (moneyBefore <= moneyAfter) return;
      if (gta.onMission) return;
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
            var dist = dist3d(px, py, pz, pos[0], pos[1], pos[2]);
            if (dist <= 10) {
                  completePropertyPurchase(def);
                  return;
            }
      }
}
