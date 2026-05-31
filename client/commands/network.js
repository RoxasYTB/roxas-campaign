addNetworkHandler("fadeTeleport", function (x, y, z) {
      game.setPlayerControl(false);
      localPlayer.invincible = true;
      game.fadeCamera(false, 0.3);
      setTimeout(function () {
            localPlayer.position = new Vec3(x, y, z);
            game.fadeCamera(true, 0.3);
            game.setPlayerControl(true);
            localPlayer.invincible = false;
      }, 300);
});

addNetworkHandler("deathFade", function () {
      game.fadeCamera(false, 0.5);
      setTimeout(function () {
            game.fadeCamera(true, 0.5);
      }, 2500);
});

addNetworkHandler("createAssetPickup", function (x, y, z, qty) {
      try {
            natives.CREATE_PROTECTION_PICKUP(new Vec3(x, y, z), qty, qty);
      } catch (e) {
            var pos = new Vec3(x, y, z);
            var pickup = gta.createPickup(408, pos, 16);
            if (pickup) pickup.quantity = qty;
      }
});
