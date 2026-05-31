var PROPERTY_DOORS = {
      10: {
            modelOpen: 3061,
            modelClosed: 3062,
            pos: [97.203, -1469.731, 10.578],
      },
      38: {
            modelOpen: 1444,
            modelClosed: null,
            pos: [-981.754, -841.278, 8.586],
      },
      43: {
            modelOpen: null,
            modelClosed: 857,
            pos: [-640.012, -1485.941, 15.457],
      },
};

var doorHandles = [];

function destroyObjectsByModel(modelId, pos) {
      var handle = natives.SET_VISIBILITY_OF_CLOSEST_OBJECT_OF_TYPE(pos, 10.0, modelId, 0);
      if (handle != null && handle !== 0 && handle !== true) {
            natives.DELETE_OBJECT(handle);
            return;
      }
      for (var h = 1; h < 2000; h++) {
            try {
                  var coords = natives.GET_OBJECT_COORDINATES(h);
                  if (!coords) continue;
                  var dx = coords.x - pos.x;
                  var dy = coords.y - pos.y;
                  var dz = coords.z - pos.z;
                  if (dx * dx + dy * dy + dz * dz <= 25) {
                        natives.DELETE_OBJECT(h);
                  }
            } catch (e) {}
      }
}

function applyPropertyChanges() {
      for (var bpId in PROPERTY_DOORS) {
            if (buyPointState.indexOf(parseInt(bpId)) === -1) continue;
            var d = PROPERTY_DOORS[bpId];
            try {
                  var pos = new Vec3(d.pos[0], d.pos[1], d.pos[2]);
                  if (d.modelClosed != null) {
                        natives.REQUEST_MODEL(d.modelClosed);
                        natives.LOAD_ALL_MODELS_NOW();
                        destroyObjectsByModel(d.modelClosed, pos);
                  }
                  if (d.modelOpen != null) {
                        natives.REQUEST_MODEL(d.modelOpen);
                        natives.LOAD_ALL_MODELS_NOW();
                        var h = natives.CREATE_OBJECT_NO_OFFSET(d.modelOpen, pos);
                        if (typeof h !== 'undefined' && h !== null) {
                              natives.SET_OBJECT_COLLISION(h, 0);
                              natives.DONT_REMOVE_OBJECT(h);
                              doorHandles.push(h);
                        }
                  }
            } catch (e) {}
      }
}

var ASSET_REVENUE = {
      9: [[487.2, -81.5, 11.4, 10000, 10000]],
      10: [[93.3, -1472.14, 9.9, 4000, 4000]],
      12: [[-1059.6, -274.5, 11.4, 8000, 8000]],
      38: [[-1007.3, -869.9, 12.8, 1500, 1500]],
      39: [[-864.3, -576.6, 11.0, 3000, 3000]],
      40: [[-997.1, 189.8, 11.4, 5000, 5000]],
      43: [[-640.8, -1491.8, 13.7, 2000, 2000]],
};
var revenuePickups = {};

function applyPropertyRevenue() {
      for (var bpId in ASSET_REVENUE) {
            if (buyPointState.indexOf(parseInt(bpId)) === -1) continue;
            if (revenuePickups[bpId]) continue;
            if (parseInt(bpId) === 9 && missionCache.indexOf(24) === -1) continue;
            var pickups = ASSET_REVENUE[bpId];
            for (var pi = 0; pi < pickups.length; pi++) {
                  var p = pickups[pi];
                  try {
                        var h = natives.CREATE_PROTECTION_PICKUP(new Vec3(p[0], p[1], p[2]), p[3], p[4]);
                        if (!revenuePickups[bpId]) revenuePickups[bpId] = [];
                        revenuePickups[bpId].push(h);
                  } catch (e) {}
            }
      }
      if (missionCache.indexOf(33) !== -1 && !revenuePickups.vercetti) {
            try {
                  var h = natives.CREATE_PROTECTION_PICKUP(new Vec3(-378.4, -536.9, 17.2), 5000, 5000);
                  revenuePickups.vercetti = [h];
            } catch (e) {}
      }
      if (missionCache.indexOf(30) !== -1 && !revenuePickups.film) {
            try {
                  var h = natives.CREATE_PROTECTION_PICKUP(new Vec3(-1.9, 959.9, 10.9), 7000, 7000);
                  revenuePickups.film = [h];
            } catch (e) {}
      }
      if (buyPointState.indexOf(9) !== -1 && missionCache.indexOf(24) !== -1 && !revenuePickups[9]) {
            var p = ASSET_REVENUE[9][0];
            try {
                  var h = natives.CREATE_PROTECTION_PICKUP(new Vec3(p[0], p[1], p[2]), p[3], p[4]);
                  revenuePickups[9] = [h];
            } catch (e) {}
      }
}

var PROPERTY_GARAGES = {
      2: [[10, 26]],
      3: [[15, 16]],
      5: [[14, 25]],
      7: [[11, 17], [12, 18], [13, 24]],
      38: [[7, 8], [16, 27], [17, 28], [18, 29], [19, 30]],
};

function applyPropertyGarages() {
      for (var bpId in PROPERTY_GARAGES) {
            if (buyPointState.indexOf(parseInt(bpId)) === -1) continue;
            var garages = PROPERTY_GARAGES[bpId];
            for (var gi = 0; gi < garages.length; gi++) {
                  try {
                        natives.CHANGE_GARAGE_TYPE(garages[gi][0], garages[gi][1]);
                  } catch (e) {}
            }
      }
      if (missionCache.indexOf(16) !== -1) {
            try { natives.CHANGE_GARAGE_TYPE(20, 31); } catch (e) {}
      }
}
