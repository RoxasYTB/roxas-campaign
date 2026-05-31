function saveFromSavePoint(position) {
      const pos = new Vec3(...position);
      setInterval(function () {
            if (gta.onMission) return;
            if (localPlayer.position.distance(pos) <= 2) {
                  saveGame();
            }
      }, 1000);
}

addNetworkHandler("adminSave", function () {
      saveGame(true);
});
