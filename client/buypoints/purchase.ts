function pickupAndStartMission(def: BuyPointDef): void {
	var id: number = def[0];
	var name: string = def[1];
	var price: number = def[2];
	var missionId: number | null =
		def.length >= 5 && def[4] !== null ? def[4] : null;
	var el:
		| {
				id: number;
				pickup: Pickup | null;
				position: [number, number, number];
				type: number;
				model: number;
		  }
		| undefined = buyPointElements.find((b) => b.id === id);
	if (el && el.pickup) {
		destroyElement(el.pickup);
		el.pickup = null;
	}
	var maxSteps: number = Math.min(MAX_DECREMENT_STEPS, price);
	var remaining: number = price;
	var decrements: number[] = [];
	for (var s = 0; s < maxSteps; s++) {
		if (remaining <= 0) {
			break;
		}
		var max: number = Math.min(remaining, Math.ceil(price / maxSteps) * 2);
		var step: number =
			s === maxSteps - 1 ? remaining : Math.floor(Math.random() * max) + 1;
		if (step > remaining) {
			step = remaining;
		}
		decrements.push(step);
		remaining -= step;
	}
	if (remaining > 0) {
		decrements[decrements.length - 1] += remaining;
	}
	var currentStep: number = 0;
	var countInterval: number = setInterval(() => {
		localPlayer.money -= decrements[currentStep];
		currentStep++;
		if (currentStep >= decrements.length) {
			clearInterval(countInterval);
			if (missionId !== null && missionId > 0) {
				selectedMission = missionId;
				gta.startMission(missionId);
			} else {
				completePropertyPurchase(def);
			}
		}
	}, DECREMENT_INTERVAL);
}

function buyProperty(def: BuyPointDef): void {
	var id: number = def[0];
	var name: string = def[1];
	var price: number = def[2];
	if (buyPointState.indexOf(id) !== -1) {
		return;
	}
	if (localPlayer.money < price) {
		showHelp(`Not enough money! Need $${price}`);
		return;
	}
	localPlayer.money -= price;
	buyPointState.push(id);
	buyPointState.sort((a: number, b: number) => a - b);
	updateBuyPointPickup(id, true);
	if (typeof refreshSavePoints === "function") {
		refreshSavePoints();
	}
	if (typeof refreshBuyPointPickups === "function") {
		refreshBuyPointPickups();
	}
}

function completePropertyPurchase(def: BuyPointDef): void {
	var id: number = def[0];
	var name: string = def[1];
	if (buyPointState.indexOf(id) !== -1) {
		return;
	}
	buyPointState.push(id);
	buyPointState.sort((a: number, b: number) => a - b);
	var missionId: number | null =
		def.length >= 5 && def[4] !== null ? Math.abs(def[4]) : null;
	if (missionId !== null && missionCache.indexOf(missionId) === -1) {
		sessionMissions.push(missionId);
		rebuildEffectiveMissions();
	}
	updateBuyPointPickup(id, true);
	applyPropertyGarages();
	applyPropertyRevenue();
	applyPropertyChanges();
	if (typeof refreshSavePoints === "function") {
		refreshSavePoints();
	}
	if (typeof refreshBuyPointPickups === "function") {
		refreshBuyPointPickups();
	}
}

function getBuyPointIdByMission(missionId: number): number | null {
	var def: BuyPointDef | undefined = _bpByMission.get(missionId);
	return def ? def[0] : null;
}

function checkPropertyPurchaseAfterMission(
	moneyBefore: number,
	moneyAfter: number
): void {
	if (moneyBefore <= moneyAfter) {
		return;
	}
	if (gta.onMission) {
		return;
	}
	var px: number = Math.round(localPlayer.position.x);
	var py: number = Math.round(localPlayer.position.y);
	var pz: number = Math.round(localPlayer.position.z);
	for (var i = 0; i < BUY_POINTS.length; i++) {
		var def: BuyPointDef = BUY_POINTS[i];
		var id: number = def[0];
		var name: string = def[1];
		var price: number = def[2];
		var pos: [number, number, number] = def[3];
		if (buyPointState.indexOf(id) !== -1) {
			continue;
		}
		var dist: number = dist3d(px, py, pz, pos[0], pos[1], pos[2]);
		if (dist <= PROPERTY_CHECK_DIST) {
			completePropertyPurchase(def);
			return;
		}
	}
}
