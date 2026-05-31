var _barrierData = [
      { model: 590, x: -97.3, y: 1061.8, z: 11.6, unlockMission: 38 },
      { model: 2141, x: -81.46, y: 81.358, z: 21.04, unlockMission: 13 },
      { model: 3518, x: -242.671, y: -935.667, z: 16.198, unlockMission: 13 },
      { model: 2446, x: -715.082, y: -489.689, z: 12.549, unlockMission: 13, rot: new Vec3(0, 0, 0) },
      { model: 2447, x: -181.451, y: -472.61, z: 11.353, unlockMission: 13, rot: new Vec3(0, 0, 103) },
];
var _barriers = [];

function spawnBarriers() {
      for (var i = 0; i < _barrierData.length; i++) {
            var b = _barrierData[i];
            try {
                  natives.REQUEST_MODEL(b.model);
                  natives.LOAD_ALL_MODELS_NOW();
                  var h = natives.CREATE_OBJECT_NO_OFFSET(b.model, new Vec3(b.x, b.y, b.z));
                  if (h != null && h !== 0) {
                        if (b.rot) { natives.SET_OBJECT_ROTATION(h, b.rot); }
                        natives.DONT_REMOVE_OBJECT(h);
                        _barriers.push({ handle: h, data: b });
                  }
            } catch (e) {}
      }
}

function checkBarriers() {
      for (var i = _barriers.length - 1; i >= 0; i--) {
            var entry = _barriers[i];
            if (missionCache.indexOf(entry.data.unlockMission) !== -1) {
                  try { natives.DELETE_OBJECT(entry.handle); } catch (e) {}
                  _barriers.splice(i, 1);
            }
      }
}



bindEventHandler("OnResourceStart", thisResource, function () {
      spawnBarriers();
      setInterval(checkBarriers, 3000);
});
