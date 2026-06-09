addCommandHandler("scripts", () => {
	var active = gta.getActiveScripts();
	console.log("=== Active scripts (" + active.length + ") ===");
	for (var i = 0; i < active.length; i++) {
		console.log("  " + active[i]);
	}
	showHelp("Check console for active scripts.");
});

addCommandHandler("stopscript", (_cmd: string, text: string) => {
	var name = text.trim();
	if (!name) { showHelp("Usage: /stopscript <name>"); return; }
	try {
		gta.terminateScript(name);
		console.log("Terminated script: " + name);
		showHelp("Script terminated: " + name);
	} catch (e) {
		console.log("Failed to terminate script: " + name + " - " + ((e as any).message || String(e)));
	}
});

addCommandHandler("startscript", (_cmd: string, text: string) => {
	var name = text.trim();
	if (!name) { showHelp("Usage: /startscript <name>"); return; }
	try {
		(gta as any).startNewScript(name);
		console.log("Started script: " + name);
		showHelp("Script started: " + name);
	} catch (e) {
		console.log("Failed to start script: " + name + " - " + ((e as any).message || String(e)));
	}
});

addCommandHandler("scriptcmd", (_cmd: string, text: string) => {
	if (!text.trim()) { showHelp("Usage: /scriptcmd <command string>"); return; }
	try {
		(gta as any).scriptCommand(text);
		console.log("Executed: " + text);
		showHelp("Script command executed.");
	} catch (e) {
		console.log("scriptCommand failed: " + ((e as any).message || String(e)));
	}
});

var _prevScripts: string[] = [];
setInterval(function() {
	var current = gta.getActiveScripts();
	if (_prevScripts.length > 0) {
		for (var i = 0; i < current.length; i++) {
			var found = false;
			for (var j = 0; j < _prevScripts.length; j++) {
				if (_prevScripts[j] === current[i]) { found = true; break; }
			}
			if (!found) console.log("Script started: " + current[i]);
		}
		for (var i = 0; i < _prevScripts.length; i++) {
			var found = false;
			for (var j = 0; j < current.length; j++) {
				if (current[j] === _prevScripts[i]) { found = true; break; }
			}
			if (!found) console.log("Script stopped: " + _prevScripts[i]);
		}
	}
	_prevScripts = current;
}, IV_1000);

var _hijackedBlips: any[] = [];
var _hijacking: boolean = false;

var _nativeTargets: string[] = [
	"ADD_BLIP_FOR_COORD",
	"ADD_BLIP_FOR_CHAR",
	"ADD_BLIP_FOR_CAR",
	"ADD_BLIP_FOR_OBJECT",
	"ADD_BLIP_FOR_PICKUP",
	"ADD_SPRITE_BLIP_FOR_COORD",
	"ADD_BLIP_FOR_CONTACT_POINT",
	"ADD_BLIP_FOR_COORD_OLD",
	"ADD_BLIP_FOR_CHAR_OLD",
	"ADD_BLIP_FOR_CAR_OLD",
	"ADD_SPRITE_BLIP_FOR_CONTACT_POINT",
	"CHANGE_BLIP_COLOUR",
	"CHANGE_BLIP_DISPLAY",
	"CHANGE_BLIP_SCALE",
	"REMOVE_BLIP",
	"DIM_BLIP",
];

function tryHijack(name: string): boolean {
	try {
		var orig = (natives as any)[name];
		if (typeof orig !== "function") {
			console.log("  " + name + " is not a function, skipping");
			return false;
		}
		(natives as any)[name] = function() {
			var args = Array.prototype.slice.call(arguments);
			console.log("[HIJACK] " + name + "(" + JSON.stringify(args) + ")");
			try {
				_hijackedBlips.push({ native: name, args: args, time: platform.ticks });
			} catch (_) {}
			return orig.apply(this, args);
		};
		console.log("  Hijacked: " + name);
		return true;
	} catch (e) {
		console.log("  FAILED: " + name + " - " + ((e as any).message || String(e)));
		return false;
	}
}

addCommandHandler("hijack", () => {
	if (_hijacking) {
		showHelp("Already hijacking.");
		return;
	}
	_hijacking = true;
	_hijackedBlips = [];
	console.log("=== Attempting to hijack natives ===");
	var ok = 0;
	var fail = 0;
	for (var i = 0; i < _nativeTargets.length; i++) {
		if (tryHijack(_nativeTargets[i])) {
			ok++;
		} else {
			fail++;
		}
	}
	console.log("Hijack result: " + ok + " OK, " + fail + " FAILED");
	showHelp("Hijack: " + ok + " OK, " + fail + " FAILED. Check console.");
});

addCommandHandler("unhijack", () => {
	_hijacking = false;
	console.log("=== Hijack buffer (" + _hijackedBlips.length + " calls logged) ===");
	for (var i = 0; i < _hijackedBlips.length; i++) {
		var h = _hijackedBlips[i];
		console.log("  " + h.native + "(" + JSON.stringify(h.args) + ")");
	}
	_hijackedBlips = [];
	showHelp("Hijack stopped. Buffer dumped.");
});

var _trackBlips: Blip[] = [];
var _trackedPedIds: number[] = [];

var _modelColours: Record<number, number> = {
	107: 0x69C8D9, 108: 0x69C8D9, 109: 0x69C8D9, 110: 0xFF69B4,
	111: 0xFFD700, 112: 0x69C8D9, 113: 0xFF8C00, 114: 0x69C8D9,
	115: 0x69C8D9, 116: 0xFFD700, 117: 0xFF69B4, 118: 0x69C8D9,
	119: 0x69C8D9, 120: 0x0000FF, 121: 0xFFD700, 122: 0x69C8D9,
	124: 0x8B0000, 125: 0xFFD700, 126: 0xFF69B4, 127: 0x69C8D9,
	128: 0x69C8D9, 129: 0xFF8C00, 130: 0xFF8C00,
	83: 0x00FF00, 84: 0x00FF00, 85: 0xFF69B4, 86: 0xFF69B4,
	89: 0xFF69B4, 90: 0xFF69B4,
	93: 0xFF8C00, 94: 0xFF8C00,
	95: 0x69C8D9, 96: 0x69C8D9,
	147: 0x8B0000,
};

function getModelColour(modelIndex: number): number {
	return _modelColours[modelIndex] || 0xFFD700;
}

function getModelsToTrack(missionId: number): number[] {
	var data = ScmMissions[missionId];
	if (data && data.models.length > 0) return data.models;
	var fallback: number[] = [];
	for (var m = 83; m <= 200; m++) fallback.push(m);
	return fallback;
}

var _lastOnMission: boolean = false;

function updateEntityBlips(): void {
	if (!gta.onMission) {
		if (_lastOnMission && _trackBlips.length > 0) {
			for (var i = 0; i < _trackBlips.length; i++) {
				try { destroyElement(_trackBlips[i]); } catch (_e) {}
			}
			_trackBlips = [];
			_trackedPedIds = [];
		}
		_lastOnMission = false;
		return;
	}
	_lastOnMission = true;
	var missionId = selectedMission;
	var models = getModelsToTrack(missionId);
	if (models.length === 0) return;

	var peds = getPeds();
	var activePedIds: Record<number, boolean> = {};

	for (var i = 0; i < peds.length; i++) {
		var p = peds[i];
		if (p.type === ELEMENT_PLAYER) continue;
		var found = false;
		for (var mi = 0; mi < models.length; mi++) {
			if (p.modelIndex === models[mi]) { found = true; break; }
		}
		if (!found) continue;

		activePedIds[p.id] = true;
		var hasBlip = false;
		for (var bi = 0; bi < _trackBlips.length; bi++) {
			if (_trackBlips[bi] && _trackBlips[bi].parent && (_trackBlips[bi].parent as Element).id === p.id) {
				hasBlip = true; break;
			}
		}
		if (!hasBlip) {
			try {
				var colour = getModelColour(p.modelIndex);
				var blip: any = null;
				try {
					blip = (gta as any).createBlipAttachedTo(p, 0, 2, colour, true, false);
				} catch (_e2) {
					blip = gta.createBlipAttachedTo(p, 0, STREAM_INFINITE, 0);
				}
				if (blip) {
					setInfiniteStream(blip);
					_trackBlips.push(blip);
					_trackedPedIds.push(p.id);
				}
			} catch (_e) {}
		}
	}

	for (var bi = _trackBlips.length - 1; bi >= 0; bi--) {
		if (_trackBlips[bi] && _trackBlips[bi].parent) {
			var parentId = (_trackBlips[bi].parent as Element).id;
			if (!activePedIds[parentId]) {
				try { destroyElement(_trackBlips[bi]); } catch (_e) {}
				_trackBlips.splice(bi, 1);
				var idx = _trackedPedIds.indexOf(parentId);
				if (idx !== -1) _trackedPedIds.splice(idx, 1);
			}
		} else {
			try { destroyElement(_trackBlips[bi]); } catch (_e) {}
			_trackBlips.splice(bi, 1);
		}
	}
}

addCommandHandler("track", () => {
	console.log("Tracking started with ScmMissions + colour mapping");
	showHelp("Entity tracking ON.");
});

addCommandHandler("untrack", () => {
	for (var i = 0; i < _trackBlips.length; i++) {
		try { destroyElement(_trackBlips[i]); } catch (_e) {}
	}
	_trackBlips = [];
	_trackedPedIds = [];
	console.log("Tracking stopped. Blips cleared.");
	showHelp("Tracking OFF.");
});

addCommandHandler("pedlist", () => {
	console.log("=== Tracked peds (" + _trackedPedIds.length + ") ===");
	for (var i = 0; i < _trackedPedIds.length; i++) {
		var pid = _trackedPedIds[i];
		var peds = getPeds();
		for (var pi = 0; pi < peds.length; pi++) {
			if (peds[pi].id === pid) {
				console.log("  #" + pid + " model=" + peds[pi].modelIndex + " health=" + peds[pi].health);
				break;
			}
		}
	}
	showHelp("Check console for tracked ped list.");
});

var _scanTargets: string[] = [
	"GET_BLIP_COORDINATES", "DOES_BLIP_EXIST", "GET_BLIP_ICON",
	"GET_CHAR_COORDINATES", "GET_PLAYER_COORDINATES",
	"GET_CAR_COORDINATES", "GET_VEHICLE_COORDINATES",
	"GET_OBJECT_COORDINATES",
	"GET_ACTIVE_BLIPS", "GET_NUMBER_OF_BLIPS", "GET_BLIP_POSITION",
	"GET_RADAR_BLIP", "GET_BLIP_INFO",
	"GET_SCRIPT_VAR_INT", "GET_SCRIPT_VAR_FLOAT", "GET_VAR",
	"READ_SCM_VAR", "GET_SCM_VAR", "READ_VAR",
	"GET_INTEGER_STAT", "GET_FLOAT_STAT", "GET_STAT",
	"GET_PLAYER_MISSION", "GET_CURRENT_MISSION", "GET_MISSION_ID",
	"GET_PLAYER_HEADING", "GET_CHAR_HEADING", "GET_OBJECT_HEADING",
	"GET_CAR_HEADING", "GET_VEHICLE_HEADING",
	"GET_TIME", "GET_GAME_TIMER", "GET_CURRENT_TIME",
	"FIND_BLIP", "FIND_RADAR_BLIP",
	"GET_BLIP_TYPE", "GET_BLIP_COLOR", "GET_BLIP_COLOUR",
	"GET_CHAR_HEALTH", "GET_PLAYER_HEALTH",
	"GET_ACTIVE_CAMERA", "GET_CAMERA_POSITION",
	"GET_OBJECT_TYPES", "GET_ELEMENT_BY_ID", "GET_ELEMENT_DATA",
	"HAS_BLIP_BEEN_DISPLAYED", "IS_BLIP_ON_SCREEN",
	"IS_BLIP_ACTIVE", "IS_BLIP_VISIBLE",
	"IS_RADAR_BLIP_ACTIVE", "IS_RADAR_BLIP_VISIBLE",
	"SET_BLIP_POSITION", "SET_BLIP_COORDINATES",
	"IS_CHAR_ACTIVE", "IS_CAR_ACTIVE", "IS_OBJECT_ACTIVE",
	"GET_ACTIVE_SCRIPT_VARS", "GET_SCRIPT_LOCAL_VAR",
	"GET_SCRIPT_GLOBAL_VAR", "READ_SCRIPT_VAR",
	"GET_PED_POINTER", "GET_VEHICLE_POINTER",
	"GET_BLIP_POINTER", "GET_OBJECT_POINTER",
	"GET_BLIP_HANDLE", "GET_CHAR_HANDLE", "GET_CAR_HANDLE",
	"GET_MISSION_SCRIPT", "GET_CURRENT_SCRIPT_NAME",
	"IS_SCRIPT_ACTIVE", "GET_SCRIPT_POSITION",
	"GET_OBJECTIVE", "GET_PLAYER_OBJECTIVE",
	"GET_ENTERED_CAR", "GET_LAST_ENTERED_VEHICLE",
	"GET_PLAYER_TARGET", "GET_PLAYER_AIMING_AT",
	"GET_CHAR_TARGET", "GET_CHAR_AIMING_AT",
	"GET_CHAR_WEAPON", "GET_CURRENT_WEAPON",
	"GET_NEAREST_BLIP", "GET_CLOSEST_BLIP",
	"FIND_NEAREST_BLIP", "FIND_CLOSEST_BLIP",
	"GET_BLIP_FOR_CHAR", "GET_BLIP_FOR_CAR",
	"GET_CHAR_CURRENT_TASK", "GET_ACTIVE_TASK",
	"GET_CHAR_MISSION", "GET_MISSION_FLAG",
	"GET_BLIP_POS", "GET_BLIP_POSITION",
	"GET_CHAR_IN_AREA", "GET_CAR_IN_AREA",
	"GET_NUMBER_OF_PEDS", "GET_NUMBER_OF_VEHICLES",
	"GET_MAX_BLIPS", "GET_BLIP_SLOT",
	"IS_BLIP_IN_USE", "GET_BLIP_IN_SLOT",
	"GET_CHAR_MODEL", "GET_CAR_MODEL",
	"GET_PED_MODEL", "GET_VEHICLE_MODEL",
	"GET_BLIP_MODEL", "GET_BLIP_ATTACHED_TO",
	"GET_BLIP_ENTITY", "GET_BLIP_TYPE",
	"GET_CHAR_INTERIOR", "GET_PLAYER_INTERIOR",
	"GET_CHAR_DIMENSION", "GET_PLAYER_DIMENSION",
];

addCommandHandler("scannatives", () => {
	console.log("=== Scanning " + _scanTargets.length + " potential natives ===");
	var found: string[] = [];
	for (var i = 0; i < _scanTargets.length; i++) {
		var name = _scanTargets[i];
		try {
			var fn = (natives as any)[name];
			if (typeof fn === "function") {
				try {
					var result = fn(0);
					found.push(name + " → " + JSON.stringify(result));
				} catch (e) {
					found.push(name + " exists but threw: " + ((e as any).message || String(e)).substring(0, 80));
				}
			}
		} catch (_e) {}
	}
	console.log("=== Found " + found.length + " natives ===");
	for (var i = 0; i < found.length; i++) {
		console.log("  " + found[i]);
	}
	showHelp(found.length + " natives found. Check console.");
});
