function handleStartMission(missionId) {
      if (!isInMission && !gta.onMission && missionId !== -1) {
            for (var mi = 0; mi < missions.length; mi++) {
                  var m = missions[mi];
                  if (m.sphere) {
                        try { m.sphere.position = new Vec3(0, 0, -1000); } catch (e) {}
                        try { destroyElement(m.sphere); } catch (e) {}
                        m.sphere = null;
                  }
                  if (m.attachedBlip) {
                        try { destroyElement(m.attachedBlip); } catch (e) {}
                        m.attachedBlip = null;
                  }
            }
            missions = [];
            gta.startMission(missionId);
            selectedMission = missionId;
      }
}
