function getSavePath(playerName) {
      return "./saves/" + playerName + ".json";
}

function emptySaveState(client) {
      return {
            missions: [],
            playerposition: [SPAWN_POSITION[0], SPAWN_POSITION[1], SPAWN_POSITION[2]],
            money: 0,
            health: 100,
            armour: 0,
            hour: 13,
            camerainterior: 0,
            minute: 30,
            equippedWeapon: 0,
            ammunitions: {},
            clothesBought: [],
            bonuses: {},
            skin: 161,
      };
}

function loadPlayerSave(client) {
      var path = getSavePath(client.player.name);
      if (!fileExists(path)) return null;
      try {
            var raw = loadTextFile(path);
            return JSON.parse(raw.substring(raw.indexOf("{")));
      } catch (e) {
            return null;
      }
}

