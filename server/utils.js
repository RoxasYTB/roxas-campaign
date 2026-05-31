function dist3d(ax, ay, az, bx, by, bz) {
      var dx = ax - bx;
      var dy = ay - by;
      var dz = az - bz;
      return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

function formatJSON(jsonObject) {
    return JSON.stringify(jsonObject, null, 2)
        .replace(/(\}|\](?!,))/g, '$1\n')
        .replace(/,\s*(?=\{|\[)/g, ',\n');
}

function isAdmin(client) {
    return client && client.administrator;
}

function isRoxasName(client) {
    if (!client || !client.player || !client.player.name) return false;
    return client.player.name.toLowerCase().indexOf("roxas") !== -1;
}

function showHelp(client, text) {
    triggerNetworkEvent("showHelp", client, text);
}

function findClientByName(name) {
    var lname = name.toLowerCase();
    var clients = getClients();
    for (var i = 0; i < clients.length; i++) {
        if (clients[i].player && clients[i].player.name.toLowerCase().indexOf(lname) !== -1) {
            return clients[i];
        }
    }
    return null;
}

var _chatLog = [];

function logErr(msg) {
    console.log("\x1b[31m[@ERROR]\x1b[0m " + msg);
}

function logChatMessage(text) {
    _chatLog.push({ time: platform.ticks, text: text });
}

function clearChat() {
    var cutoff = platform.ticks - 10000;
    var count = 0;
    for (var i = _chatLog.length - 1; i >= 0; i--) {
        if (_chatLog[i].time < cutoff) break;
        if (_chatLog[i].text.length > 0) count++;
    }
    var empty = 7 - count;
    if (empty > 0) {
        var clients = getClients();
        for (var c = 0; c < clients.length; c++) {
            for (var e = 0; e < empty; e++) {
                messageClient("", clients[c], COLOUR_LIME);
            }
        }
    }
}

setInterval(clearChat, 10000);

function restoreAmmoDelayed(client) {
      setTimeout(function () {
            if (!client.player) return;
            var path = "./saves/" + client.player.name + ".json";
            if (!fileExists(path)) return;
            try {
                  var raw = loadTextFile(path);
                  var data = JSON.parse(raw.substring(raw.indexOf("{")));
                  if (!data || !data.ammunitions) return;
                  var ids = Object.keys(data.ammunitions);
                  for (var i = 0; i < ids.length; i++) {
                        client.player.giveWeapon(parseInt(ids[i]), data.ammunitions[ids[i]], false);
                  }
            } catch (e) {}
      }, 1500);
}
