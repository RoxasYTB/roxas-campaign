function startHealthMonitor(client) {
      var interval = setInterval(function () {
            if (!client.player) {
                  clearInterval(interval);
                  return;
            }

            if (client.player.health < 1 && !isDead.get(client)) {
                  isDead.set(client, true);
                  setTimeout(function () {
                        triggerNetworkEvent("deathFade", client);
                        setTimeout(function () {
                              inGame.set(client.player.name, false);
                              respawnPlayer(client);
                              setTimeout(function () {
                                    isDead.set(client, false);
                              }, 1000);
                        }, 1500);
                  }, 11000);
            }
      }, 200);
}
