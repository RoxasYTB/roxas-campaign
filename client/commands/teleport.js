var TP_LOCATIONS = mergeTPLocations();

function mergeTPLocations() {
    var out = {};
    var shared = ["LAWYER","CORTEZ","DIAZ","KENT","AVERY","PHIL","FILM",
        "PRINTWORKS","BIKERS","CUBANS","HAITIANS","LOVEFIST",
        "PHONE","PHONEONE","PHONETWO","PHONETHREE","PHONEFOUR","PHONEFIVE",
        "KCABS","ICE","SUNYARD","BOATYARD",
        "TOMMY","TOMMYTWO","TOMMYTHREE"];
    for (var i = 0; i < shared.length; i++) {
        out[shared[i]] = POSITIONS[shared[i]];
    }
    out.MALIBU = [487.2, -81.5, 11.4];
    out.SUNSHINE = [-1033.8, -846.9, 13.0];
    out.POLE = [99.5, -1468.5, 9.9];
    out.STRIPCLUB = [99.5, -1468.5, 9.9];
    out.HOTEL = [219.3, -1273.5, 11.5];
    out.OCEAN = [14.0, -1500.7, 12.7];
    out.WASHINGTON = [88.5, -804.7, 11.2];
    out.VICEPOINT = [531.4, 1273.7, 17.6];
    out.LINKS = [304.5, 376.3, 12.7];
    out.ELSWANKO = [428.4, 605.9, 12.2];
    out.SKUMOLE = [-562.8, 699.7, 20.6];
    out.HYMAN = [-834.8, 1306.9, 11.0];
    return out;
}

var TP_INTERIOR = {
    TOMMY: 2,
    TOMMYTWO: 2,
};

addCommandHandler("tp", function (cmd, text) {
    if (!admin) return;
    if (!text) {
        var names = Object.keys(TP_LOCATIONS).join(", ");
        showHelp("/tp <" + names + ">");
        return;
    }
    var key = text.toUpperCase();
    var pos = TP_LOCATIONS[key];
    if (!pos) {
        triggerNetworkEvent("serverTp", text);
        return;
    }
    game.setPlayerControl(false);
    localPlayer.invincible = true;
    game.fadeCamera(false, 0.3);
    setTimeout(function () {
        localPlayer.position = new Vec3(pos[0], pos[1], pos[2]);
        gta.cameraInterior = TP_INTERIOR[key] || 0;
        game.fadeCamera(true, 0.3);
        game.setPlayerControl(true);
        localPlayer.invincible = false;
    }, 300);
});
