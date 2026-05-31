cheats.hits.youwonttakemealive = function() {
    try {
        var wanted = localPlayer.wantedLevel || 0;
        localPlayer.wantedLevel = Math.min(wanted + 2, 6);
    } catch(e) {}
};
