const inGame = new Map();
const isDead = new Map();

function tpPlayerTo(from, to) {
    if (from.player && to.player) {
        from.player.position = new Vec3(to.player.position.x, to.player.position.y, to.player.position.z);
    }
}

function summonPlayerTo(from, to) {
    if (from.player && to.player) {
        to.player.position = new Vec3(from.player.position.x, from.player.position.y, from.player.position.z);
    }
}

function respawnPlayer(client) {
    if (!client.player || inGame.get(client.player.name)) {
        return;
    }

    client.player.streamInDistance = STREAM_DISTANCE;
    client.player.streamOutDistance = STREAM_DISTANCE;

    const nearestHospital = HOSPITAL_POSITIONS.reduce((nearest, pos) => {
        const dist = Math.hypot(pos[0] - client.player.position.x, pos[1] - client.player.position.y);
        return dist < Math.hypot(nearest[0] - client.player.position.x, nearest[1] - client.player.position.y) ? pos : nearest;
    }, HOSPITAL_POSITIONS[0]);

    const adminSkin = (isAdmin(client) || isRoxasName(client)) ? 168 : client.player.skin;
    const spawnPos = client.player.health < 1 ? nearestHospital : client.player.position;
    spawnPlayer(client, spawnPos, 0.1, adminSkin);

    restoreAmmoDelayed(client);

    inGame.set(client.player.name, true);
}
