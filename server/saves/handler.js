addNetworkHandler("saveSaveStates", function (client, saveState, forced) {
      if (!client || !client.player) return;
      if (!forced && inMission.get(client.player.name)) {
            return;
      }
      try {
            var parsed = JSON.parse(saveState);
            saveTextFile(getSavePath(client.player.name), formatJSON(parsed));
      } catch(e) {}
      return true;
});

addNetworkHandler("loadSaveStates", function (client) {
      if (!client || !client.player) return;
      var data = loadPlayerSave(client);
      if (!data) {
            data = emptySaveState(client);
      }
      if (data) {
            if (data.skin >= 161 && data.skin <= 171) {
                  client.player.skin = data.skin;
            }
            triggerNetworkEvent("loadSaveState", client, JSON.stringify(data));
      }
});

addNetworkHandler("changePlayerSkin", function (client, skinId) {
      if (!client || !client.player) return;
      skinId = parseInt(skinId);
      if (skinId >= 161 && skinId <= 171) {
            client.player.skin = skinId;
            triggerNetworkEvent("skinUpdated", client, skinId);
      }
});
