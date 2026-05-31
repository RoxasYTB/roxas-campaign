function switchInteriorAndFadeIn(interiorID, position, heading) {
      if (interiorID !== -1 && typeof interiorID !== 'undefined') {
            localPlayer.interior = interiorID;
            game.cameraInterior = interiorID;
            savedCameraInterior = interiorID;
      } else {
            localPlayer.interior = 0;
            game.cameraInterior = 0;
            savedCameraInterior = 0;
      }

      if (position !== false && typeof position !== 'undefined') {
            localPlayer.position = position;
      }

      if (heading !== false && typeof heading !== 'undefined') {
            localPlayer.heading = heading;
      }

      game.fadeCamera(true, 0.3, toColour(0, 0, 0, 255));

      setTimeout(function () {
            game.setPlayerControl(true);
            localPlayer.invincible = false;
      }, 500);
}
