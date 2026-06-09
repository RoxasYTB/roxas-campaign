var _C = "\x1b[36m";
var _G = "\x1b[32m";
var _R = "\x1b[31m";
var _X = "\x1b[0m";

function info(tag: string, msg: string): void {
	console.log(_C + "[" + tag + "]" + _X + " " + msg);
}

function success(tag: string, msg: string): void {
	console.log(_G + "[" + tag + "]" + _X + " " + msg);
}

function error(tag: string, msg: string): void {
	console.log(_R + "[" + tag + "]" + _X + " " + msg);
}

var _chatLog: { time: number; text: string }[] = [];

function logChatMessage(text: string): void {
	_chatLog.push({ time: platform.ticks, text: text });
}

function clearChat(): void {
	var cutoff = platform.ticks - CHAT_CUTOFF;
	var count = 0;
	for (var i = _chatLog.length - 1; i >= 0; i--) {
		if (_chatLog[i].time < cutoff) break;
		if (_chatLog[i].text.length > 0) count++;
	}
	var empty = CHAT_LINE_CAPACITY - count;
	if (empty > 0) {
		var clients = getClients();
		for (var c = 0; c < clients.length; c++) {
			for (var e = 0; e < empty; e++) {
				messageClient("", clients[c], COLOUR_LIME);
			}
		}
	}
}

setInterval(clearChat, IV_10000);

addNetworkHandler("clientError", (client: Client, msg: string) => {
	if (client.player)
		console.log("\x1b[31m[@CLIENTERROR]\x1b[0m " + client.player.name + " : " + msg);
});

addNetworkHandler("clientLog", (client: Client, msg: string) => {
	if (client.player)
		console.log("\x1b[36m[@CLIENTLOG]\x1b[0m " + client.player.name + " : " + msg);
});
