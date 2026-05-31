var SIDE_MISSION_VEHICLES = {
      police: [144, 147, 148, 149, 155, 157, 163, 164],
      pizza: [192],
};

var sideMissionTracking = {
      inVehicle: false,
      vehicleModel: 0,
      enterTime: 0,
      policeStints: 0,
      pizzaStints: 0,
};

function applyMaxBonuses() {
      var bonuses = (data && data.bonuses) || {};
      if (bonuses.pizza) {
            try { natives.INCREASE_PLAYER_MAX_HEALTH(0, 50); } catch (e) {}
      }
      if (bonuses.vigilante) {
            try { natives.INCREASE_PLAYER_MAX_ARMOUR(0, 50); } catch (e) {}
      }
      if (bonuses.complete) {
            try { natives.INCREASE_PLAYER_MAX_HEALTH(0, 50); } catch (e) {}
            try { natives.INCREASE_PLAYER_MAX_ARMOUR(0, 50); } catch (e) {}
            try { natives.SET_PLAYER_HEALTH(0, 200); } catch (e) {}
            try { natives.ADD_ARMOUR_TO_PLAYER(0, 200); } catch (e) {}
      }
}

function saveBonusesState() {
      if (!data || !localPlayer) return;
      saveGame();
}

function grantPizzaBonus() {
      if (!data) return;
      var bonuses = data.bonuses || {};
      if (bonuses.pizza) return;
      bonuses.pizza = true;
      data.bonuses = bonuses;
      try { natives.INCREASE_PLAYER_MAX_HEALTH(0, 50); } catch (e) {}
      localPlayer.money += 5000;
      saveBonusesState();
}

function grantVigilanteBonus() {
      if (!data) return;
      var bonuses = data.bonuses || {};
      if (bonuses.vigilante) return;
      bonuses.vigilante = true;
      data.bonuses = bonuses;
      try { natives.INCREASE_PLAYER_MAX_ARMOUR(0, 50); } catch (e) {}
      try { natives.ADD_ARMOUR_TO_PLAYER(0, 150); } catch (e) {}
      saveBonusesState();
}

function grantCompleteBonus() {
      if (!data) return;
      var bonuses = data.bonuses || {};
      if (bonuses.complete) return;
      bonuses.complete = true;
      data.bonuses = bonuses;
      try { natives.INCREASE_PLAYER_MAX_HEALTH(0, 50); } catch (e) {}
      try { natives.INCREASE_PLAYER_MAX_ARMOUR(0, 50); } catch (e) {}
      try { natives.SET_PLAYER_HEALTH(0, 200); } catch (e) {}
      try { natives.ADD_ARMOUR_TO_PLAYER(0, 200); } catch (e) {}
      saveBonusesState();
}

function checkCompleteBonus() {
      if (!data) return;
      var bonuses = data.bonuses || {};
      if (bonuses.complete) return;
      if (bonuses.pizza && bonuses.vigilante && missionCache.indexOf(26) !== -1) {
            grantCompleteBonus();
      }
}

function startSideMissionDetection() {
      setInterval(function () {
            if (!localPlayer || !data) return;
            var bonuses = data.bonuses || {};
            var veh = localPlayer.vehicle;
            if (veh && !sideMissionTracking.inVehicle) {
                  var model = veh.modelIndex;
                  if (SIDE_MISSION_VEHICLES.police.indexOf(model) !== -1) {
                        sideMissionTracking.inVehicle = true;
                        sideMissionTracking.vehicleModel = model;
                        sideMissionTracking.enterTime = game.tick;
                  } else if (SIDE_MISSION_VEHICLES.pizza.indexOf(model) !== -1) {
                        sideMissionTracking.inVehicle = true;
                        sideMissionTracking.vehicleModel = model;
                        sideMissionTracking.enterTime = game.tick;
                  }
            } else if (!veh && sideMissionTracking.inVehicle) {
                  var elapsed = (game.tick - sideMissionTracking.enterTime) / 1000;
                  var model = sideMissionTracking.vehicleModel;
                  if (SIDE_MISSION_VEHICLES.police.indexOf(model) !== -1) {
                        if (elapsed >= 10 && !bonuses.vigilante) {
                              sideMissionTracking.policeStints++;
                              if (sideMissionTracking.policeStints >= 3) {
                                    grantVigilanteBonus();
                                    checkCompleteBonus();
                              }
                        }
                  } else if (SIDE_MISSION_VEHICLES.pizza.indexOf(model) !== -1) {
                        if (elapsed >= 10 && !bonuses.pizza) {
                              sideMissionTracking.pizzaStints++;
                              if (sideMissionTracking.pizzaStints >= 3) {
                                    grantPizzaBonus();
                                    checkCompleteBonus();
                              }
                        }
                  }
                  sideMissionTracking.inVehicle = false;
                  sideMissionTracking.vehicleModel = 0;
                  sideMissionTracking.enterTime = 0;
            }
      }, 3000);
}
