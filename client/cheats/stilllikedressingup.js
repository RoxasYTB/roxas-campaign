cheats.hits.stilllikedressingup = function() {
    try {
        var skins = [161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 180];
        var current = localPlayer.skin || 161;
        var idx = skins.indexOf(current);
        localPlayer.skin = skins[(idx + 1) % skins.length];
    } catch(e) {
        triggerNetworkEvent("cheatSetSkin", 161);
    }
};
