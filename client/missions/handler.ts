function handleStartMission(missionId: number): void {
	if (isGroupMember) return;
	if (!(isInMission || gta.onMission) && missionId !== -1) {
		for (var mi = 0; mi < missions.length; mi++) {
			var m = missions[mi];
			if (m.sphere) {
				try {
					m.sphere.position = new Vec3(0, 0, HIDE_SPHERE_Z);
				} catch (_e) {}
				try {
					destroyElement(m.sphere);
				} catch (_e) {}
				m.sphere = null;
			}
			if (m.attachedBlip) {
				try {
					destroyElement(m.attachedBlip);
				} catch (_e) {}
				m.attachedBlip = null;
			}
		}
		missions = [];

		if (isGroupHost) {
			triggerNetworkEvent("groupMissionStart", missionId);
		}

		gta.startMission(missionId);
		selectedMission = missionId;
	}
}
