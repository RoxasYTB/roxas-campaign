var blipSprite = 1;
var gamePaused = false;
var lastPaused = false;
var pauseConfirm = 0;

function recreatePlayerBlips() {
    try {
        var players = getPlayers();
        var blips = getBlips();

        var pids = {};
        for (var i = 0; i < players.length; i++) {
            if (players[i].id !== localPlayer.id) pids[players[i].id] = true;
        }

        for (var j = 0; j < blips.length; j++) {
            var b = blips[j];
            try {
                if (b.parent && pids[b.parent.id]) {
                    try { destroyElement(b); } catch(e) {}
                }
            } catch(e) {}
        }

        for (var i = 0; i < players.length; i++) {
            if (players[i].id === localPlayer.id) continue;
            try {
                var blip = gta.createBlipAttachedTo(players[i], blipSprite);
                if (blip) {
                    blip.streamInDistance = 999999;
                    blip.streamOutDistance = 999999;
                }
            } catch(e) {}
        }
    } catch(e) {}
}

function cleanOrphanBlips() {
    try {
        var players = getPlayers();
        var blips = getBlips();
        var pids = {};
        for (var i = 0; i < players.length; i++) {
            if (players[i].id !== localPlayer.id) pids[players[i].id] = true;
        }
        for (var j = 0; j < blips.length; j++) {
            var b = blips[j];
            try {
                if (!b.parent) { destroyElement(b); continue; }
                if (typeof b.parent.id === "number" && b.parent.id > 0 && b.parent.id !== localPlayer.id && !pids[b.parent.id]) {
                    destroyElement(b);
                }
            } catch(e) {}
        }
    } catch(e) {}
}

addEventHandler("OnProcess", function() {
    var paused = typeof gta.paused !== 'undefined' && gta.paused;

    if (paused === lastPaused) {
        pauseConfirm = 3;
    } else {
        pauseConfirm--;
        if (pauseConfirm > 0) return;
        pauseConfirm = 3;
        lastPaused = paused;
        gamePaused = paused;
        blipSprite = paused ? 28 : 1;
        recreatePlayerBlips();
    }

    cleanOrphanBlips();

    if (typeof updateSavePointVisibility === 'function') updateSavePointVisibility();
    if (typeof updateBuyPointVisibility === 'function') updateBuyPointVisibility();
});

setInterval(recreatePlayerBlips, 5000);
