var BUY_POINTS = [
      [39, "Ice Cream Factory", 20000, [-864.3, -576.6, 11.0], -39, "money"],
      [38, "Car Showroom", 50000, [-1007.3, -869.9, 12.8], 37, "money"],
      [43, "the Boatyard", 10000, [-685.8, -1495.6, 12.5], 42, "money"],
      [1, "3321 Vice Point", 2500, [531.4, 1273.7, 17.6], 49, "safehouse"],
      [2, "Links View Apartment", 6000, [304.5, 376.3, 12.7], 45, "safehouse"],
      [3, "El Swanko Casa", 8000, [428.4, 605.9, 12.2], 44, "safehouse"],
      [4, "1102 Washington Street", 3000, [88.5, -804.7, 11.2], 48, "safehouse"],
      [5, "Ocean Heights Apartment", 7000, [14.0, -1500.7, 12.7], 47, "safehouse"],
      [6, "Skumole Shack", 1000, [-560.1, 703.6, 20.5], 50, "safehouse"],
      [7, "Hyman Condo", 14000, [-834.8, 1306.9, 11.0], 46, "safehouse"],
      [40, "Taxi Company", 40000, [-1011.7, 203.9, 11.2], 40, "money"],
      [9, "The Malibu", 120000, [487.2, -81.5, 11.4], 41, "money"],
      [10, "the Pole Position Club", 30000, [99.5, -1468.5, 9.9], 43, "money"],
      [11, "the Film Studios", 60000, [15.2, 962.6, 10.9], 38, "money"],
      [12, "the Print Works", 70000, [-1059.6, -274.5, 11.4], 36, "money"],
];

var _bpById = new Map();
var _bpByMission = new Map();
BUY_POINTS.forEach(function (def) {
      _bpById.set(def[0], def);
      if (def.length >= 5 && def[4] != null) {
            _bpByMission.set(def[4], def);
      }
});

var buyPointState = [];
var buyPointElements = [];
var buyPointLastTouch = {};

function rebuildBuyPointState() {
      buyPointState = [];
      for (var i = 0; i < BUY_POINTS.length; i++) {
            var def = BUY_POINTS[i];
            var missionId = def[4] != null ? Math.abs(def[4]) : null;
            if (missionId != null && missionCache.indexOf(missionId) !== -1) {
                  buyPointState.push(def[0]);
            }
      }
}
