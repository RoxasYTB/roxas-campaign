var CLOTHES_PICKUPS = [
      [1, 226.4, -1265.6, 20.1, 3],
      [1, -384.5, -591.9, 25.3, 16],
      [1, -820.2, 1364.1, 66.4, 46],
      [2, 97.5, -1133.6, 10.4, 3],
      [3, 364.2, 1086.1, 19.0, 6],
      [4, 106.5, 253.0, 21.7, 18],
      [5, -1025.2, -429.2, 10.8, 20],
      [6, 405.7, -485.6, 12.3, 33],
      [7, 465.3, -57.4, 15.7, 24],
      [8, 414.3, 1042.0, 25.4, 7],
      [9, 158.3, -1275.9, 10.6, 43],
      [10, -917.4, 885.1, 11.0, 15],
      [11, -1200.3, -322.9, 10.9, 1],
      [12, -382.6, -585.9, 25.3, -2],
];
var clothesPickupHandles = [];
var clothesSkinCooldown = {};
var validSkin = 161;
var CLOTHES_SKIN_MAP = { 1:161, 2:162, 3:163, 4:164, 5:165, 6:166, 7:167, 8:168, 9:169, 10:170, 11:171 };

function changePlayerSkin(clothesId) {
      var skinId = CLOTHES_SKIN_MAP[clothesId];
      if (!skinId) return;
      _lastSkinChange = platform.ticks;
      validSkin = skinId;
      if (data) data.skin = skinId;
      triggerNetworkEvent("changePlayerSkin", skinId);
      if (typeof saveBonusesState === "function") saveBonusesState();
      game.fadeCamera(false, 0.5, toColour(0, 0, 0, 255));
      setTimeout(function () {
            game.fadeCamera(true, 0.5, toColour(0, 0, 0, 255));
      }, 800);
}

function createClothesPickups() {
      destroyOldClothesPickups();
      resetClothesCooldown();
      var created = 0;
      for (var i = 0; i < CLOTHES_PICKUPS.length; i++) {
            var p = CLOTHES_PICKUPS[i];
            var missionReq = p[4];
            var hasMission = false;
            if (missionReq === -2) {
                  hasMission = data !== null;
            } else if (missionReq === -1) {
                  hasMission = true;
            } else {
                  hasMission = missionCache && missionCache.indexOf(missionReq) !== -1;
            }
            if (!hasMission) continue;
            try {
                  var pos = new Vec3(p[1], p[2], p[3]);
                  var pickup = gta.createPickup(409, pos, 2);
                  if (pickup) {
                        clothesPickupHandles.push({ handle: pickup, id: p[0], position: pos });
                        created++;
                  }
            } catch (e) {}
      }
      startClothesDetection();
}

function refreshClothesPickups() {
      createClothesPickups();
}

function destroyOldClothesPickups() {
      if (clothesDetectionInterval) {
            clearInterval(clothesDetectionInterval);
            clothesDetectionInterval = null;
      }
      for (var i = 0; i < clothesPickupHandles.length; i++) {
            try { destroyElement(clothesPickupHandles[i].handle); } catch (e) {}
      }
      clothesPickupHandles = [];
}

var clothesDetectionInterval = null;
var _lastSkinChange = 0;

function clothesPosKey(pos) {
      return Math.round(pos.x) + "," + Math.round(pos.y) + "," + Math.round(pos.z);
}

function startClothesDetection() {
      if (clothesDetectionInterval) clearInterval(clothesDetectionInterval);
      clothesDetectionInterval = setInterval(function () {
            if (clothesPickupHandles.length === 0) return;
            if (platform.ticks - _lastSkinChange < 2000) return;
            var pp = localPlayer.position;
            for (var i = 0; i < clothesPickupHandles.length; i++) {
                  var cp = clothesPickupHandles[i];
                  var key = clothesPosKey(cp.position);
                  if (clothesSkinCooldown[key]) continue;
                  var dx = pp.x - cp.position.x;
                  var dy = pp.y - cp.position.y;
                  var dz = pp.z - cp.position.z;
                  if (dx * dx + dy * dy + dz * dz <= 2.25 && typeof changePlayerSkin === "function") {
                        clothesSkinCooldown[key] = true;
                        changePlayerSkin(cp.id);
                  }
            }
      }, 1000);
}

function resetClothesCooldown() {
      clothesSkinCooldown = {};
}
