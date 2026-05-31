var cheatVehicles = [];
var MAX_SPAWN_DIST = 150;
var HELICOPTERS = [155, 165, 177, 199, 217, 218, 227];

setInterval(function() {
    var i = 0;
    while (i < cheatVehicles.length) {
        var entry = cheatVehicles[i];
        try {
            var v = getElementFromId(entry.id);
            if (!v) {
                cheatVehicles.splice(i, 1);
                continue;
            }
            var players = getPlayers();
            var occupied = false;
            for (var p = 0; p < players.length; p++) {
                if (players[p].vehicle && players[p].vehicle.id === entry.id) {
                    occupied = true;
                    break;
                }
            }
            if (occupied) {
                i++;
                continue;
            }
            var client = getClientFromPlayerElement(entry.clientPlayer);
            if (!client || !client.player) {
                destroyElement(v);
                cheatVehicles.splice(i, 1);
                continue;
            }
            var dist = dist3d(client.player.position.x, client.player.position.y, client.player.position.z, v.position.x, v.position.y, v.position.z);
            if (dist > MAX_SPAWN_DIST) {
                destroyElement(v);
                cheatVehicles.splice(i, 1);
                continue;
            }
        } catch(e) {
            cheatVehicles.splice(i, 1);
            continue;
        }
        i++;
    }
}, 2000);
