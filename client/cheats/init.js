// [cheats] init loaded

var cheats = {};
cheats.maxBufferLength = 100;
cheats.buffer = '';
cheats.hits = {};

addEventHandler("onCharacter", function(event, text) {
    try {
        cheats.addToBuffer(text);
        cheats.checkToTriggerCheat();
    } catch(e) {
        // [cheats] error
    }
});

cheats.addToBuffer = function(text) {
    if (cheats.buffer.length == cheats.maxBufferLength) {
        cheats.buffer = cheats.buffer.substring(2);
    }
    cheats.buffer += text.toLowerCase();
};

addNetworkHandler("cheatBigBangExplode", function(count, posStr) {
    var nums = posStr.split(",");
    for (var i = 0; i < count; i++) {
        var x = parseFloat(nums[i * 3]);
        var y = parseFloat(nums[i * 3 + 1]);
        var z = parseFloat(nums[i * 3 + 2]);
        natives.ADD_EXPLOSION(new Vec3(x, y, z), 3);
    }
    var pp = localPlayer.position;
    for (var vi = 0; vi < 110; vi++) {
        try {
            var pos = natives.GET_CAR_COORDINATES(vi);
            if (!pos) continue;
            if (dist3d(pp.x, pp.y, pp.z, pos.x, pos.y, pos.z) <= 150) {
                natives.EXPLODE_CAR(vi);
                natives.ADD_EXPLOSION(pos, 3);
            }
        } catch(e) {}
    }
});

cheats.checkToTriggerCheat = function() {
    if (!CHEATS_ENABLED) { return; }
    if (CHEATS_ADMIN_ONLY && !admin) { return; }
    for (var i = 0; i < cheats.buffer.length; i++) {
        var sub = cheats.buffer.substring(i);
        if (cheats.hits[sub]) {
            // [cheats] triggering
            try {
                cheats.hits[sub]();
                showHelp("Cheat activated");
            } catch(e) {
                // [cheats] trigger error
            }
            cheats.buffer = '';
            break;
        }
    }
};
