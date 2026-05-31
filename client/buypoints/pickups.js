function showBuyPointPickups() {
      for (var i = 0; i < BUY_POINTS.length; i++) {
            var def = BUY_POINTS[i];
            var id = def[0];
            var posArr = def[3];
            var existing = buyPointElements.find(function (b) {
                  return b.id === id;
            });
            if (existing && existing.pickup) continue;
            if (existing) {
                  var idx = buyPointElements.indexOf(existing);
                  if (idx !== -1) buyPointElements.splice(idx, 1);
            }
            var purchased = buyPointState.indexOf(id) !== -1;
            if (purchased) continue;
            var locked = isBuyPointLocked(def);
            var type = locked ? 17 : 18;
            var model = locked ? 406 : 407;
            if (!locked) {
                  type = localPlayer.money >= def[2] ? 18 : 17;
            }
            var pos = new Vec3(posArr[0], posArr[1], posArr[2]);
            var pickup = gta.createPickup(model, pos, type);
            buyPointElements.push({
                  id: id,
                  pickup: pickup,
                  position: posArr,
                  type: type,
                  model: model,
            });
      }
}

function refreshBuyPointPickups() {
      for (var i = 0; i < buyPointElements.length; i++) {
            var el = buyPointElements[i];
            var id = el.id;
            if (buyPointState.indexOf(id) !== -1) continue;
            var def = _bpById.get(id);
            if (!def) continue;
            var locked = isBuyPointLocked(def);
            var wantedModel = locked ? 406 : 407;
            var wantedType = locked ? 17 : (localPlayer.money >= def[2] ? 18 : 17);
            if (el.pickup && (el.type !== wantedType || el.model !== wantedModel)) {
                  destroyElement(el.pickup);
                  var posArr = def[3];
                  var pos = new Vec3(posArr[0], posArr[1], posArr[2]);
                  el.pickup = gta.createPickup(wantedModel, pos, wantedType);
                  el.type = wantedType;
                  el.model = wantedModel;
            }
      }
}

function updateBuyPointPickup(id, purchased) {
      var el = buyPointElements.find(function (b) {
            return b.id === id;
      });
      if (!el || !el.pickup) return;
      destroyElement(el.pickup);
      el.pickup = null;
      if (!purchased) {
            var def = _bpById.get(id);
            if (!def) return;
            var locked = isBuyPointLocked(def);
            var posArr = def[3];
            var pos = new Vec3(posArr[0], posArr[1], posArr[2]);
            el.pickup = gta.createPickup(locked ? 406 : 407, pos, locked ? 17 : 18);
            el.type = locked ? 17 : 18;
            el.model = locked ? 406 : 407;
      }
}

function updateBuyPointVisibility() {
      var isPaused = typeof gamePaused !== 'undefined' ? gamePaused : (typeof gta.paused !== 'undefined' && gta.paused);
      var px = localPlayer.position.x;
      var py = localPlayer.position.y;
      var pz = localPlayer.position.z;
      for (var i = 0; i < buyPointElements.length; i++) {
            var el = buyPointElements[i];
            var id = el.id;
            if (buyPointState.indexOf(id) !== -1) continue;
            var dist = dist3d(px, py, pz, el.position[0], el.position[1], el.position[2]);
            var shouldShow = !gta.onMission && (isPaused || dist <= 300);
            if (shouldShow && !el.pickup) {
                  var def = _bpById.get(id);
                  if (!def) continue;
                  var locked = isBuyPointLocked(def);
                  var posArr = def[3];
                  var pos = new Vec3(posArr[0], posArr[1], posArr[2]);
                  el.pickup = gta.createPickup(locked ? 406 : 407, pos, locked ? 17 : 18);
                  el.type = locked ? 17 : 18;
                  el.model = locked ? 406 : 407;
            } else if (!shouldShow && el.pickup) {
                  destroyElement(el.pickup);
                  el.pickup = null;
            }
      }
}
