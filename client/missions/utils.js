var missions = [];
var missionsPositions = [];
var missionCache = [];

function cleanMissionCache() {
      missionCache = missionCache.filter(function (v, i, a) {
            return a.indexOf(v) === i;
      }).sort(function (a, b) {
            return a - b;
      });
}

function getBlipIcon(key) {
      if (key.indexOf("TOMMY") === 0) return ICONS.TOMMY;
      if (key.indexOf("PHONE") === 0) return ICONS.PHONE;
      return ICONS[key] || ICONS.SAVEHOUSE;
}

function rebuildMissionsPositions() {
      if (!missionCache || !missionCache.indexOf) {
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
                              if (!allReqMet) continue;
                        }
                        if (entry.minAssets) {
                              var totalAssets = buyPointState.length;
                              if (totalAssets < entry.minAssets) continue;
                        }
                        var pos = POSITIONS[key];
                        if (!pos) continue;
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
