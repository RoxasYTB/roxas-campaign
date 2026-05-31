const _commandHandlers = {
      tp(client, text) {
            if (!isAdmin(client)) return;
            if (text.startsWith("[")) {
                  const coords = JSON.parse(text);
                  triggerNetworkEvent("fadeTeleport", client, coords[0], coords[1], coords[2]);
                  client.cameraInterior = 0;
            } else {
                  const targetClient = getClients().find((c) => c.player && c.player.name.toLowerCase().includes(text.toLowerCase()));
                  client.cameraInterior = targetClient ? targetClient.cameraInterior : 0;
                  if (targetClient && targetClient.player) {
                        var pos = targetClient.player.position;
                        triggerNetworkEvent("fadeTeleport", client, pos.x, pos.y, pos.z);
                  }
            }
      },
      save(client) {
            triggerNetworkEvent("adminSave", client);
            showHelp(client, "Game saved");
      },
      god(client) {
            var idx = godClients.indexOf(client);
            if (idx !== -1) {
                  godClients.splice(idx, 1);
                  triggerNetworkEvent("godToggle", client, false);
                  showHelp(client, "God mode off");
            } else {
                  godClients.push(client);
                  triggerNetworkEvent("godToggle", client, true);
                  showHelp(client, "God mode on");
            }
      },
};

Object.entries(_commandHandlers).forEach(([cmd, handler]) => {
      addCommandHandler(cmd, (command, text, client) => {
            if (client.player) handler(client, text);
      });
});

addNetworkHandler("serverTp", function (client, name) {
      _commandHandlers.tp(client, name);
});

addCommandHandler("block", function (cmd, text, client) {
      if (!text) {
            triggerNetworkEvent("freezePlayer", client, true);
            return;
      }
      if (!client.administrator) return;
      var target = findClientByName(text);
      if (!target) {
            showHelp(client, "Player not found");
            return;
      }
      triggerNetworkEvent("freezePlayer", target, true);
      showHelp(client, "Blocked " + target.player.name);
});

addCommandHandler("unblock", function (cmd, text, client) {
      if (!text) {
            triggerNetworkEvent("freezePlayer", client, false);
            return;
      }
      if (!client.administrator) return;
      var target = findClientByName(text);
      if (!target) {
            showHelp(client, "Player not found");
            return;
      }
      triggerNetworkEvent("freezePlayer", target, false);
      showHelp(client, "Unblocked " + target.player.name);
});
