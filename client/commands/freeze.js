var freezeInterval = null;

addCommandHandler("block", function () {
      if (!admin) return;
      if (!freezeInterval) {
            freezeInterval = setInterval(function () {
                  localPlayer.velocity = new Vec3(localPlayer.velocity.x * 0.6, localPlayer.velocity.y * 0.6, localPlayer.velocity.z * 0.6);
            }, 50);
            showHelp("Movement slowed");
      }
});

addCommandHandler("unblock", function () {
      if (freezeInterval) {
            clearInterval(freezeInterval);
            freezeInterval = null;
            showHelp("Movement restored");
      }
});

addNetworkHandler("freezePlayer", function (enabled) {
      if (enabled) {
            if (!freezeInterval) {
                  freezeInterval = setInterval(function () {
                        localPlayer.velocity = new Vec3(localPlayer.velocity.x * 0.6, localPlayer.velocity.y * 0.6, localPlayer.velocity.z * 0.6);
                  }, 50);
            }
      } else {
            if (freezeInterval) {
                  clearInterval(freezeInterval);
                  freezeInterval = null;
            }
      }
});
