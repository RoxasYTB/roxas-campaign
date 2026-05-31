cheats.hits.deepfriedmarsbars = function() {
    try {
        var skins = [163, 164, 165, 166, 167, 168, 169, 170, 171];
        var current = localPlayer.skin || 161;
        var idx = skins.indexOf(current);
        localPlayer.skin = skins[(idx + 1) % skins.length];
    } catch(e) {
        triggerNetworkEvent("cheatSetSkin", 168);
    }
};
