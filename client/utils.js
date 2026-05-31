var admin = false;
var godInterval = null;

addNetworkHandler("setAdmin", function (value) {
      admin = value;
      console.log("\x1b[36m[@AUTH]\x1b[0m Client admin: " + admin);
});

addNetworkHandler("godToggle", function (enabled) {
      if (enabled) {
            if (!godInterval) {
                  godInterval = setInterval(function () {
                        localPlayer.health = 100;
                  }, 200);
            }
      } else {
            if (godInterval) {
                  clearInterval(godInterval);
                  godInterval = null;
            }
      }
});

addNetworkHandler("skinUpdated", function (skinId) {
      if (typeof validSkin !== "undefined") validSkin = skinId;
      if (data) data.skin = skinId;
});

var _helpKeyIndex = 0;
var _helpKeys = ["M_ANN", "M_AN1", "M_AN2", "M_AN3"];

function showHelp(text) {
      var key = _helpKeys[_helpKeyIndex % _helpKeys.length];
      _helpKeyIndex++;
      gta.setCustomText(key, text);
      natives.PRINT_HELP(key);
}

function showBuyHelp(text) {
      gta.setCustomText("M_BUY", text);
      try {
            natives.PRINT_STRING(0.05, 0.05, "M_BUY");
      } catch (e) {
            natives.PRINT_HELP("M_BUY");
      }
}

function dist3d(ax, ay, az, bx, by, bz) {
      var dx = ax - bx;
      var dy = ay - by;
      var dz = az - bz;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function buildSaveData() {
      return {
            missions: missionCache,
            playerposition: [Math.round(localPlayer.position.x), Math.round(localPlayer.position.y), Math.round(localPlayer.position.z)],
            health: localPlayer.health,
            armour: localPlayer.armour,
            money: localPlayer.money,
            hour: gta.time.hour,
            minute: gta.time.minute,
            camerainterior: typeof savedCameraInterior !== "undefined" ? savedCameraInterior : gta.cameraInterior,
            equippedWeapon: localPlayer.weapon,
            ammunitions: localPlayer.weapons.reduce(function (acc, weapon) {
                  acc[weapon] = localPlayer.getWeaponAmmunition(weapon);
                  return acc;
            }, {}),
            kcabsReward: typeof kcabsRewardUnlocked !== "undefined" ? kcabsRewardUnlocked : false,
            clothesBought: (data && data.clothesBought) || [],
            bonuses: (data && data.bonuses) || {},
            skin: validSkin,
      };
}

addCommandHandler("help", function () {
    showHelp("Commands: /help /tp /block /unblock | Cheat codes: type VC cheats in chat");
});

function saveGame(forced) {
      if (gta.onMission) return;
      localPlayer.health = 100;
      if (typeof cleanMissionCache === "function") cleanMissionCache();
      triggerNetworkEvent("saveSaveStates", JSON.stringify(buildSaveData()), forced);
}
