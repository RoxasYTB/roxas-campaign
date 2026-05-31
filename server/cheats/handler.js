function spawnCheatVehicle(client, vehicleId) {
    if (!client || !client.player) return;
    var heading = parseFloat(client.player.rotation[2]);
    var isHeli = HELICOPTERS.indexOf(vehicleId) !== -1;
    var z = client.player.position.z + (isHeli ? 15 : 1);
    var x = client.player.position.x + (Math.sin(heading) * 4);
    var y = client.player.position.y + (Math.cos(heading) * 4);
    var vehicle = gta.createVehicle(vehicleId, new Vec3(x, y, z));
    if (vehicle) {
        cheatVehicles.push({ id: vehicle.id, time: platform.ticks, clientPlayer: client.player });
    }
}

addNetworkHandler("cheatSpawnVehicle", function(client, vehicleId) {
    spawnCheatVehicle(client, vehicleId);
});

addNetworkHandler("cheatInfernus", function(client) {
    if (!client || !client.player) return;
    var heading = parseFloat(client.player.rotation[2]);
    var x = client.player.position.x + (Math.sin(heading) * 4);
    var y = client.player.position.y + (Math.cos(heading) * 4);
    var z = client.player.position.z + 1;
    var vehicle = gta.createVehicle(141, new Vec3(x, y, z));
    if (vehicle) {
        var c1 = Math.floor(Math.random() * 256);
        var c2 = Math.floor(Math.random() * 256);
        vehicle.colour1 = c1;
        vehicle.colour2 = c2;
        cheatVehicles.push({ id: vehicle.id, time: platform.ticks, clientPlayer: client.player });
    }
});

addNetworkHandler("cheatSetSkin", function(client, skinId) {
    if (!client || !client.player) return;
    client.player.skin = skinId;
    triggerNetworkEvent("skinUpdated", client, skinId);
});

addNetworkHandler("cheatBigBang", function(client) {
    if (!client || !client.player) return;
    var pp = client.player.position;
    var seen = {};
    var positions = [];
    for (var ci = 0; ci < cheatVehicles.length; ci++) {
        var v = getElementFromId(cheatVehicles[ci].id);
        if (!v) continue;
        if (v.id === (client.player.vehicle ? client.player.vehicle.id : -1)) continue;
        var dist = dist3d(pp.x, pp.y, pp.z, v.position.x, v.position.y, v.position.z);
        if (dist <= 150) {
            positions.push(v.position.x, v.position.y, v.position.z);
            destroyElement(v);
            seen[v.id] = true;
        }
    }
    var players = getPlayers();
    for (var pi = 0; pi < players.length; pi++) {
        var pv = players[pi].vehicle;
        if (!pv || seen[pv.id]) continue;
        var dist = dist3d(pp.x, pp.y, pp.z, pv.position.x, pv.position.y, pv.position.z);
        if (dist <= 150) {
            positions.push(pv.position.x, pv.position.y, pv.position.z);
            destroyElement(pv);
        }
    }
    if (positions.length > 0) {
        triggerNetworkEvent("cheatBigBangExplode", null, positions.length / 3, positions.join(","));
    }
});
