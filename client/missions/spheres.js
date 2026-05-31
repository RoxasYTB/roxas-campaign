function createMission(missionData) {
      var id = missionData.id;
      var position = missionData.position;
      var blip = missionData.blip;
      var pos = new Vec3(position[0], position[1], id === -1 ? -1000 : position[2]);
      return {
            id: id,
            position: position,
            key: missionData.key,
            blip: blip,
            attachedBlip: null,
            sphere: missionData.sphere || gta.createSphere(pos, 2),
      };
}

function createMissions(missionsCompleted) {
      for (var mi = 0; mi < missions.length; mi++) {
            var m = missions[mi];
            if (m.sphere) destroyElement(m.sphere);
            if (m.attachedBlip) destroyElement(m.attachedBlip);
      }
      var result = [];
      for (var mpi = 0; mpi < missionsPositions.length; mpi++) {
            var mp = missionsPositions[mpi];
            if (missionsCompleted.indexOf(mp.id) !== -1) continue;
            var missionElement = createMission(mp);
            if (mp.blip !== ICONS.NONE) {
                  missionElement.attachedBlip = gta.createBlipAttachedTo(missionElement.sphere, mp.blip, 100, 0);
            }
            result.push(missionElement);
      }
      missions = result;
      return missions;
}
