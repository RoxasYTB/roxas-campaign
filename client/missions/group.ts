var isGroupHost: boolean = false;
var isGroupMember: boolean = false;
var groupHostName: string = "";
var groupMembers: string[] = [];
var groupMissionActive: boolean = false;
var _pedBlips: Record<number, Blip> = {};

function clearAllPedBlips(): void {
	for (var id in _pedBlips) {
		try { destroyElement(_pedBlips[id]); } catch (_e) {}
	}
	_pedBlips = {};
	for (var bid in progressBars) {
		if (bid.indexOf("pedhp_") === 0) {
			delete progressBars[bid];
			delete progressBarY[bid];
		}
	}
}

addNetworkHandler("trackPed", (pedId: number, modelIndex: number, colour: number, size: number) => {
	if (_pedBlips[pedId]) return;
	if (size === undefined) size = 3;

	function tryAttach(): void {
		try {
			var peds = getPeds();
			for (var i = 0; i < peds.length; i++) {
				if (peds[i].id === pedId) {
					var blip = gta.createBlipAttachedTo(peds[i], 0, size, colour, true, false);
					if (blip) {
						setInfiniteStream(blip);
						_pedBlips[pedId] = blip;
					}
					return;
				}
			}
			setTimeout(tryAttach, IV_500);
		} catch (_e) {
			setTimeout(tryAttach, IV_500);
		}
	}
	tryAttach();
});

addNetworkHandler("untrackPed", (pedId: number) => {
	var blip = _pedBlips[pedId];
	if (blip) {
		try { destroyElement(blip); } catch (_e) {}
		delete _pedBlips[pedId];
	}
});

addNetworkHandler("untrackAllPeds", () => {
	clearAllPedBlips();
});

addNetworkHandler("pedHealth", (pedId: number, modelIndex: number, health: number) => {
	var barId = "pedhp_" + pedId;
	var pct = Math.max(0, Math.min(100, health));
	var name = modelIndex === 116 ? "Lance" : "NPC #" + modelIndex;
	progressBars[barId] = { title: name, percent: pct };
	progressBarY[barId] = progressTop;
});

addNetworkHandler("groupFormed", (isHost: boolean, otherName: string) => {
	isGroupHost = isHost;
	isGroupMember = !isHost;
	if (isHost) {
		groupMembers = [otherName];
		groupHostName = "";
	} else {
		groupMembers = [];
		groupHostName = otherName;
	}
});

addNetworkHandler("groupDisbanded", () => {
	isGroupHost = false;
	isGroupMember = false;
	groupHostName = "";
	groupMembers = [];
	groupMissionActive = false;
	clearAllPedBlips();
	if (gta.onMission) {
		gta.cancelMission(true);
	}
});

addNetworkHandler("groupMemberJoined", (memberName: string) => {
	if (groupMembers.indexOf(memberName) === -1) {
		groupMembers.push(memberName);
	}
});

addNetworkHandler("groupMemberLeft", (memberName: string) => {
	var idx = groupMembers.indexOf(memberName);
	if (idx !== -1) {
		groupMembers.splice(idx, 1);
	}
});

addNetworkHandler("groupPlayMission", (missionId: number) => {
	if (isGroupMember) {
		groupMissionActive = true;
		isInMission = true;
		selectedMission = missionId;
		moneyBeforeMission = localPlayer.money;

		for (var mi = 0; mi < missions.length; mi++) {
			var m = missions[mi];
			if (m.sphere) {
				try { destroyElement(m.sphere); } catch (_e) {}
				m.sphere = null;
			}
			if (m.attachedBlip) {
				try { destroyElement(m.attachedBlip); } catch (_e) {}
				m.attachedBlip = null;
			}
		}
		missions = [];

		try { hideSavePoints(); } catch (_e) {}
		try {
			if (typeof hideClothesPickups === "function") hideClothesPickups();
		} catch (_e) {}

		showHelp("Mission started by host " + groupHostName);
	}
});

function showMissionPassed(missionId: number, reward?: number): void {
	if (reward === undefined) reward = (MissionRewards[missionId] as number) || 100;
	try { gta.cancelMission(true); } catch (_e) {}
	try { natives.CLEAR_WANTED_LEVEL(0); } catch (_e) {}
	try { natives.PRINT_WITH_NUMBER_BIG("M_PASS", reward, BIG_TEXT_DURATION, 1); } catch (_e) {
		try { natives.PRINT_BIG("M_PASS", BIG_TEXT_DURATION, 1); } catch (_e2) {}
	}
	try { natives.PLAY_MISSION_PASSED_TUNE(1); } catch (_e) {
		try { natives.LOAD_MISSION_AUDIO(1, "M_PAS1"); natives.MISSION_AUDIO_PLAY(); } catch (_e2) {
			try { natives.LOAD_MISSION_AUDIO(1, "M_PASS"); natives.MISSION_AUDIO_PLAY(); } catch (_e3) {}
		}
	}
	localPlayer.money += reward;
	clearAllPedBlips();

	var notYetCompleted: boolean = missionCache.indexOf(missionId) === -1;
	if (notYetCompleted) {
		sessionMissions.push(missionId);
		rebuildEffectiveMissions();
		resetMissionState();
		groupMissionActive = false;
	}
	try { showSavePoints(); } catch (_e) {}
	try { if (typeof showClothesPickups === "function") showClothesPickups(); } catch (_e) {}
	try { if (typeof refreshBuyPointPickups === "function") refreshBuyPointPickups(); } catch (_e) {}
	try { if (typeof applyPropertyRevenue === "function") applyPropertyRevenue(); } catch (_e) {}
}

function showMissionFailed(): void {
	try { gta.cancelMission(true); } catch (_e) {}
	try { natives.PRINT_BIG("M_FAIL", BIG_TEXT_DURATION, 1); } catch (_e) {}
	resetMissionState();
	groupMissionActive = false;
	clearAllPedBlips();
	try { showSavePoints(); } catch (_e) {}
	try {
		if (typeof showClothesPickups === "function") showClothesPickups();
	} catch (_e) {}
	try {
		if (typeof refreshBuyPointPickups === "function") refreshBuyPointPickups();
	} catch (_e) {}
}

addNetworkHandler("groupMissionPassed", (missionId: number) => {
	if (isGroupHost || isGroupMember) {
		showMissionPassed(missionId);
	}
});

addNetworkHandler("groupMissionFailed", (_missionId: number) => {
	if (isGroupHost || isGroupMember) {
		showMissionFailed();
	}
});

addNetworkHandler("groupHealth", (healthDataJson: string) => {
	var healthData: { name: string; health: number }[] = JSON.parse(healthDataJson);
	var activeBars: Record<string, boolean> = {};
	for (var i = 0; i < healthData.length; i++) {
		var entry = healthData[i];
		var barId = "group_" + entry.name;
		var pct = Math.min(100, Math.max(0, entry.health));
		progressBars[barId] = {
			title: entry.name,
			percent: pct,
		};
		progressBarY[barId] = progressTop + (i + 1) * progressSpacing;
		activeBars[barId] = true;
	}
	for (var barId in progressBars) {
		if (barId.indexOf("group_") === 0 && !activeBars[barId]) {
			delete progressBars[barId];
			delete progressBarY[barId];
		}
	}
});

addCommandHandler("passed", (_cmd: string, text: string) => {
	var parts = text.trim().split(/\s+/);
	var missionId = parseInt(parts[0], 10);
	var reward = parseInt(parts[1], 10);
	if (isNaN(missionId) || missionId < 0) missionId = selectedMission;
	if (isNaN(reward) || reward < 0) reward = MissionRewards[missionId] as number || 100;
	showMissionPassed(missionId, reward);
	if (isGroupHost) {
		triggerNetworkEvent("groupMissionResult", selectedMission, true);
	}
});

addCommandHandler("failed", (_cmd: string, _text: string) => {
	showMissionFailed();
	if (isGroupHost) {
		triggerNetworkEvent("groupMissionResult", selectedMission, false);
	}
});

var _lastHostPos: string = "";
var _hostMovedSent: boolean = false;
setInterval(function() {
	if (!isGroupHost || !gta.onMission) return;

	var posStr = localPlayer.position.x.toFixed(1) + "," + localPlayer.position.y.toFixed(1);
	if (!_hostMovedSent && _lastHostPos !== "" && posStr !== _lastHostPos) {
		_hostMovedSent = true;
		triggerNetworkEvent("hostMoved", localPlayer.position.x, localPlayer.position.y, localPlayer.position.z);
	}
	_lastHostPos = posStr;

	try {
		var peds = getPeds();
		for (var i = 0; i < peds.length; i++) {
			var ped = peds[i];
			if (ped.type === ELEMENT_PLAYER) continue;
			if (ped.modelIndex === 116 || ped.modelIndex === 121) {
				triggerNetworkEvent("pedHealthReport", ped.id, ped.modelIndex, ped.health);
			}
		}
	} catch (_e) {
		console.log("[pedHealthReport] Error: " + ((_e as any).message || String(_e)));
	}
}, HOST_MOVE_CHECK_IV);

addCommandHandler("play", (_cmd: string, text: string) => {
	var missionId = parseInt(text.trim(), 10);
	if (isNaN(missionId) || missionId < 0) {
		showHelp("Usage: /play <missionId>");
		return;
	}
	handleStartMission(missionId);
});
