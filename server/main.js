var kcabsVehicle = null;

addEventHandler("OnPlayerJoined", (event, client) => {
      if (!client) return;

      if (client.player) inMission.set(client.player.name, false);
      isDead.set(client, false);

      var saveCam = 0;
      try {
            var raw = loadTextFile(getSavePath(client.player.name));
            if (raw) {
                  var parsed = JSON.parse(raw.substring(raw.indexOf("{")));
                  if (parsed.camerainterior !== undefined)
                        saveCam = parsed.camerainterior;
            }
      } catch (e) {}

      client.cameraInterior = saveCam;
      spawnPlayer(
            client,
            SPAWN_POSITION,
            SPAWN_ROTATION,
            isAdmin(client) || isRoxasName(client) ? 168 : SPAWN_SKIN,
      );
      fadeCamera(client, false);
      client.cameraInterior = saveCam;

      Array(10)
            .fill()
            .forEach(() => messageClient("", client, COLOUR_LIME));
      if (!client.player) return;
      console.log("\x1b[36m[@JOIN]\x1b[0m " + client.player.name + " joined the server");

      if (NEED_ADMIN_PASSWORD === false) {
            client.administrator = true;
            triggerNetworkEvent("setAdmin", client, true);
      }

      var data = loadPlayerSave(client);
      if (data) {
            if (data.playerposition) {
                  client.player.position = new Vec3(
                        data.playerposition[0],
                        data.playerposition[1],
                        data.playerposition[2],
                  );
            }
            if (data.hour !== undefined) {
                  gta.time.hour = data.hour;
                  gta.time.minute = data.minute;
            }
            if (isAdmin(client) || isRoxasName(client)) {
                  client.player.skin = 168;
            }
      }

      if (data) restoreAmmoDelayed(client);

      if (data && data.missions && data.missions.indexOf(40) !== -1) {
            var cabModel = data.kcabsReward ? 188 : 216;
            if (kcabsVehicle) {
                  if (kcabsVehicle.modelIndex !== cabModel) {
                        try { destroyElement(kcabsVehicle); } catch(e) {}
                        kcabsVehicle = null;
                  }
            }
            if (!kcabsVehicle) {
                  var cab = gta.createVehicle(cabModel, new Vec3(-1003, 207, 11));
                  if (cab) {
                        cab.colour1 = 89;
                        cab.colour2 = 90;
                        cab.heading = 2.907677412033081;
                        kcabsVehicle = cab;
                  }
            }
      }

      inGame.set(client.player.name, true);
      startHealthMonitor(client);
      getClients().forEach(function (c) {
            if (c.player && c !== client)
                  showHelp(
                        c,
                        client.player.name + " joined the server",
                  );
      });
});

addEventHandler("OnPlayerQuit", (event, client) => {
      if (client.player) {
            console.log("\x1b[36m[@LEAVE]\x1b[0m " + client.player.name + " left the server");
            inGame.delete(client.player.name);
            inMission.delete(client.player.name);
            getClients().forEach(function (c) {
                  if (c.player)
                        showHelp(
                              c,
                              client.player.name + " left the server",
                        );
            });
      }
      var idx = godClients.indexOf(client);
      if (idx !== -1) godClients.splice(idx, 1);
});
