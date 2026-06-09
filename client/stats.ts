var SIDE_MISSION_VEHICLES: Record<string, number[]> = {
	police: [
		VehicleModel.MULE,
		VehicleModel.FBI_WASHINGTON,
		VehicleModel.MOONBEAM,
		VehicleModel.ESPERANTO,
		VehicleModel.HUNTER,
		VehicleModel.ENFORCER,
		VehicleModel.BARRACKS_OL,
		VehicleModel.CUBAN_HERMES,
	],
	pizza: [VehicleModel.FAGGIO],
};

var sideMissionTracking: {
	inVehicle: boolean;
	vehicleModel: number;
	enterTime: number;
	policeStints: number;
	pizzaStints: number;
} = {
	inVehicle: false,
	vehicleModel: 0,
	enterTime: 0,
	policeStints: 0,
	pizzaStints: 0,
};

function applyMaxBonuses(): void {
	var bonuses: Record<string, boolean> = data!.bonuses || {};
	if (bonuses.pizza) {
		try {
			natives.INCREASE_PLAYER_MAX_HEALTH(0, 50);
		} catch (_e) {}
	}
	if (bonuses.vigilante) {
		try {
			natives.INCREASE_PLAYER_MAX_ARMOUR(0, 50);
		} catch (_e) {}
	}
	if (bonuses.complete) {
		try {
			natives.INCREASE_PLAYER_MAX_HEALTH(0, 50);
		} catch (_e) {}
		try {
			natives.INCREASE_PLAYER_MAX_ARMOUR(0, 50);
		} catch (_e) {}
		try {
			natives.SET_PLAYER_HEALTH(0, 200);
		} catch (_e) {}
		try {
			natives.ADD_ARMOUR_TO_PLAYER(0, 200);
		} catch (_e) {}
	}
}

function saveBonusesState(): void {
	if (!(data && localPlayer)) {
		return;
	}
	saveGame();
}

function grantPizzaBonus(): void {
	if (!data) {
		return;
	}
	var bonuses: Record<string, boolean> = data!.bonuses || {};
	if (bonuses.pizza) {
		return;
	}
	bonuses.pizza = true;
	data!.bonuses = bonuses;
	try {
		natives.INCREASE_PLAYER_MAX_HEALTH(0, 50);
	} catch (_e) {}
	localPlayer.money += 5000;
	saveBonusesState();
}

function grantVigilanteBonus(): void {
	if (!data) {
		return;
	}
	var bonuses: Record<string, boolean> = data!.bonuses || {};
	if (bonuses.complete) {
		return;
	}
	bonuses.complete = true;
	data!.bonuses = bonuses;
	try {
		natives.INCREASE_PLAYER_MAX_ARMOUR(0, 50);
	} catch (_e) {}
	try {
		natives.ADD_ARMOUR_TO_PLAYER(0, 150);
	} catch (_e) {}
	saveBonusesState();
}

function grantCompleteBonus(): void {
	if (!data) {
		return;
	}
	var bonuses: Record<string, boolean> = data!.bonuses || {};
	if (bonuses.vigilante) {
		return;
	}
	bonuses.vigilante = true;
	data!.bonuses = bonuses;
	try {
		natives.INCREASE_PLAYER_MAX_HEALTH(0, 50);
	} catch (_e) {}
	try {
		natives.INCREASE_PLAYER_MAX_ARMOUR(0, 50);
	} catch (_e) {}
	try {
		natives.SET_PLAYER_HEALTH(0, 200);
	} catch (_e) {}
	try {
		natives.ADD_ARMOUR_TO_PLAYER(0, 200);
	} catch (_e) {}
	saveBonusesState();
}

function checkCompleteBonus(): void {
	if (!data) {
		return;
	}
	var bonuses: Record<string, boolean> = data!.bonuses || {};
	if (bonuses.complete) {
		return;
	}
	if (
		bonuses.pizza &&
		bonuses.vigilante &&
		missionCache.indexOf(Mission.BOOMSHINE_SAIGON) !== -1
	) {
		grantCompleteBonus();
	}
}

function startSideMissionDetection(): void {
	setInterval(() => {
		if (!(localPlayer && data)) {
			return;
		}
		var bonuses: Record<string, boolean> = data!.bonuses || {};
		var veh: Vehicle | null = localPlayer.vehicle;
		if (veh && !sideMissionTracking.inVehicle) {
			var model: number = veh.modelIndex;
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
			var elapsed: number = (game.tick - sideMissionTracking.enterTime) / IV_1000;
			model = sideMissionTracking.vehicleModel;
			if (SIDE_MISSION_VEHICLES.police.indexOf(model) !== -1) {
				if (elapsed >= 10 && !bonuses.vigilante) {
					sideMissionTracking.policeStints++;
					if (sideMissionTracking.policeStints >= 3) {
						grantVigilanteBonus();
						checkCompleteBonus();
					}
				}
			} else if (
				SIDE_MISSION_VEHICLES.pizza.indexOf(model) !== -1 &&
				elapsed >= 10 &&
				!bonuses.pizza
			) {
				sideMissionTracking.pizzaStints++;
				if (sideMissionTracking.pizzaStints >= 3) {
					grantPizzaBonus();
					checkCompleteBonus();
				}
			}
			sideMissionTracking.inVehicle = false;
			sideMissionTracking.vehicleModel = 0;
			sideMissionTracking.enterTime = 0;
		}
	}, IV_3000);
}
