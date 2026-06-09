var missions: {
	id: number;
	position: [number, number, number];
	key: string;
	blip: number;
	attachedBlip: Blip | null;
	sphere: Sphere | null;
}[] = [];
var missionsPositions: {
	position: [number, number, number];
	id: number;
	key: string;
	blip: number;
}[] = [];
var missionCache: number[] = [];
var fileMissions: number[] = [];
var sessionMissions: number[] = [];

function createBlipForNPCFromModelIndex(modelIndex: number, colour: number, size: number): Blip[] {
    if (colour === undefined) colour = BlipColour.NPC;
    if (size === undefined) size = 4;

    var peds = getPeds();
    var blips: Blip[] = [];

    for (var i = 0; i < peds.length; i++) {
        var ped = peds[i];
        if (ped.type == ELEMENT_PLAYER) continue;
        if (ped.modelIndex !== modelIndex) continue;

        var blip = gta.createBlipAttachedTo(ped, 0, size, colour, true, false);
        if (blip) {
            setInfiniteStream(blip);
            blips.push(blip);
        }
    }

    return blips;
}

function createBlipForNPCFromID(pedId: number, colour: number, size: number): Blip | null {
    if (colour === undefined) colour = BlipColour.NPC;
    if (size === undefined) size = 4;

    var peds = getPeds();

    for (var i = 0; i < peds.length; i++) {
        var ped = peds[i];
        if (ped.id !== pedId) continue;
        if (ped.type == ELEMENT_PLAYER) return null;

        var blip = gta.createBlipAttachedTo(ped, 0, size, colour, true, false);
        if (blip) {
            setInfiniteStream(blip);
        }
        return blip;
    }

    return null;
}

function rebuildEffectiveMissions(): void {
	var merged: number[] = [];
	for (var fi = 0; fi < fileMissions.length; fi++) {
		if (merged.indexOf(fileMissions[fi]) === -1) merged.push(fileMissions[fi]);
	}
	for (var si = 0; si < sessionMissions.length; si++) {
		if (merged.indexOf(sessionMissions[si]) === -1) merged.push(sessionMissions[si]);
	}
	missionCache = merged;
	cleanMissionCache();
}

function cleanMissionCache(): void {
	missionCache = missionCache
		.filter((v, i, a) => a.indexOf(v) === i)
		.sort((a, b) => a - b);
}

function getBlipIcon(key: string): number {
	if (key.indexOf("TOMMY") === 0) {
		return Icon.TOMMY;
	}
	if (key.indexOf("PHONE") === 0) {
		return Icon.PHONE;
	}
	return Icon[key as keyof typeof Icon] || Icon.SAVEHOUSE;
}

function rebuildMissionsPositions(): void {
	if (!missionCache.indexOf) {
		missionCache = [];
	}
	missionsPositions = [];
	var keys = Object.keys(missionsToGet);
	for (var ki = 0; ki < keys.length; ki++) {
		var key = keys[ki];
		var missionsList = missionsToGet[key];
		for (var mli = 0; mli < missionsList.length; mli++) {
			var entry = missionsList[mli];
			var toFinish = entry.toFinish;
			var id = entry.id;
			if (
				(missionCache.indexOf(toFinish) !== -1 || toFinish === -1) &&
				missionCache.indexOf(id) === -1 &&
				id !== -1
			) {
				if (entry.require) {
					var allReqMet = true;
					for (var ri = 0; ri < entry.require.length; ri++) {
						if (missionCache.indexOf(entry.require[ri]) === -1) {
							allReqMet = false;
							break;
						}
					}
					if (!allReqMet) {
						continue;
					}
				}
				if (entry.minAssets) {
					var totalAssets = buyPointState.length;
					if (totalAssets < entry.minAssets) {
						continue;
					}
				}
				var pos = Position[key] as [number, number, number];
				if (!pos) {
					continue;
				}
				missionsPositions.push({
					position: pos,
					id: id,
					key: key,
					blip: getBlipIcon(key),
				});
			}
		}
	}
	missions = createMissions(missionCache);
}
