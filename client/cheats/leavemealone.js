cheats.hits.leavemealone = function() {
    try { natives.CLEAR_WANTED_LEVEL(0); } catch(e) {
        try { localPlayer.wantedLevel = 0; } catch(e2) {}
    }
};
