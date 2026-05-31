addCommandHandler("msg", function (cmd, text, client) {
      message(text, COLOUR_LIME);
      logChatMessage(text);
});

addCommandHandler("summon", function (cmd, text, client) {
      if (!isAdmin(client)) return;
      const targetClient = getClients().find((c) => c.player && c.player.name.toLowerCase().includes(text.toLowerCase()));
      if (targetClient && targetClient.player) {
            var pos = client.player.position;
            triggerNetworkEvent("fadeTeleport", targetClient, pos.x, pos.y, pos.z);
            targetClient.cameraInterior = client.cameraInterior;
      }
});

addCommandHandler("createasset", function (cmd, text, client) {
      var pos = client.player.position;
      var qty = parseInt(text) || 100;
      triggerNetworkEvent("createAssetPickup", client, pos.x, pos.y, pos.z, qty);
      messageClient("Asset pickup created (qty: " + qty + ")", client, COLOUR_LIME);
      logChatMessage("Asset pickup created (qty: " + qty + ")");
});

addCommandHandler("play", function (cmd, text, client) {
      var missionId = parseInt(text);
      if (isNaN(missionId)) {
            showHelp(client, "Usage: /play <mission_id>");
            return;
      }
      triggerNetworkEvent("playMission", client, missionId);
      showHelp(client, "Mission " + missionId + " started");
});

addCommandHandler("position", function (cmd, text, client) {
      var target = client;
      if (text) {
            var found = getClients().find((c) => c.player && c.player.name.toLowerCase().includes(text.toLowerCase()));
            if (found) target = found;
      }
      if (!target || !target.player) {
            showHelp(client, "Player not found");
            return;
      }
      var pos = target.player.position;
      var msg = target.player.name + " (" + Math.round(pos.x) + ", " + Math.round(pos.y) + ", " + Math.round(pos.z) + ")";
      console.log("\x1b[36m[@POSITION]\x1b[0m " + msg);
      showHelp(client, msg);
});
