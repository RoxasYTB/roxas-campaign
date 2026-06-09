function showBuyPointPickups(): void {
	for (var i = 0; i < BUY_POINTS.length; i++) {
		var def: BuyPointDef = BUY_POINTS[i];
		var id: number = def[0];
		var posArr: [number, number, number] = def[3];
		var existing:
			| {
					id: number;
					pickup: Pickup | null;
					position: [number, number, number];
					type: number;
					model: number;
			  }
			| undefined = buyPointElements.find((b) => b.id === id);
		if (existing) {
			if (existing.pickup) {
				continue;
			}
			var idx: number = buyPointElements.indexOf(existing);
			if (idx !== -1) {
				buyPointElements.splice(idx, 1);
			}
		}
		var purchased: boolean = buyPointState.indexOf(id) !== -1;
		if (purchased) {
			continue;
		}
		var locked: boolean = isBuyPointLocked(def);
		var type: number = locked ? PickupType.LOCKED : PickupType.AVAILABLE;
		var model: number = locked
			? PickupModel.BLUE_HOUSE
			: PickupModel.GREEN_HOUSE;
		if (!locked) {
			type =
				localPlayer.money >= def[2] ? PickupType.AVAILABLE : PickupType.LOCKED;
		}
		var pos: Vec3 = new Vec3(posArr[0], posArr[1], posArr[2]);
		var pickup: Pickup | null = gta.createPickup(model, pos, type);
		buyPointElements.push({
			id: id,
			pickup: pickup,
			position: posArr,
			type: type,
			model: model,
		});
	}
}

function refreshBuyPointPickups(): void {
	for (var i = 0; i < buyPointElements.length; i++) {
		var el: {
			id: number;
			pickup: Pickup | null;
			position: [number, number, number];
			type: number;
			model: number;
		} = buyPointElements[i];
		var id: number = el.id;
		if (buyPointState.indexOf(id) !== -1) {
			continue;
		}
		var def: BuyPointDef | undefined = _bpById.get(id);
		if (!def) {
			continue;
		}
		var locked: boolean = isBuyPointLocked(def);
		var wantedModel: number = locked
			? PickupModel.BLUE_HOUSE
			: PickupModel.GREEN_HOUSE;
		var wantedType: number = locked
			? PickupType.LOCKED
			: localPlayer.money >= def[2]
				? PickupType.AVAILABLE
				: PickupType.LOCKED;
		if (el.pickup && (el.type !== wantedType || el.model !== wantedModel)) {
			destroyElement(el.pickup);
			var posArr: [number, number, number] = def[3];
			var pos: Vec3 = new Vec3(posArr[0], posArr[1], posArr[2]);
			el.pickup = gta.createPickup(wantedModel, pos, wantedType);
			el.type = wantedType;
			el.model = wantedModel;
		}
	}
}

function updateBuyPointPickup(id: number, purchased: boolean): void {
	var el:
		| {
				id: number;
				pickup: Pickup | null;
				position: [number, number, number];
				type: number;
				model: number;
		  }
		| undefined = buyPointElements.find((b) => b.id === id);
	if (!(el && el.pickup)) {
		return;
	}
	destroyElement(el.pickup);
	el.pickup = null;
	if (!purchased) {
		var def: BuyPointDef | undefined = _bpById.get(id);
		if (!def) {
			return;
		}
		var locked: boolean = isBuyPointLocked(def);
		var posArr: [number, number, number] = def[3];
		var pos: Vec3 = new Vec3(posArr[0], posArr[1], posArr[2]);
		el.pickup = gta.createPickup(
			locked ? PickupModel.BLUE_HOUSE : PickupModel.GREEN_HOUSE,
			pos,
			locked ? PickupType.LOCKED : PickupType.AVAILABLE
		);
		el.type = locked ? PickupType.LOCKED : PickupType.AVAILABLE;
		el.model = locked ? PickupModel.BLUE_HOUSE : PickupModel.GREEN_HOUSE;
	}
}

function rebuildBuyPointPickups(): void {
	for (var i = 0; i < buyPointElements.length; i++) {
		if (buyPointElements[i].pickup) {
			destroyElement(buyPointElements[i].pickup);
		}
	}
	buyPointElements = [];
	showBuyPointPickups();
}

function updateBuyPointVisibility(): void {
	var isPaused: boolean =
		typeof gamePaused === "undefined"
			? typeof gta.paused !== "undefined" && gta.paused
			: gamePaused;
	var px: number = localPlayer.position.x;
	var py: number = localPlayer.position.y;
	var pz: number = localPlayer.position.z;
	for (var i = 0; i < buyPointElements.length; i++) {
		var el: {
			id: number;
			pickup: Pickup | null;
			position: [number, number, number];
			type: number;
			model: number;
		} = buyPointElements[i];
		var id: number = el.id;
		if (buyPointState.indexOf(id) !== -1) {
			continue;
		}
		var dist: number = dist3d(
			px,
			py,
			pz,
			el.position[0],
			el.position[1],
			el.position[2]
		);
		var shouldShow: boolean = !gta.onMission && (isPaused || dist <= BLIP_VISIBILITY_DIST);
		if (shouldShow && !el.pickup) {
			var def: BuyPointDef | undefined = _bpById.get(id);
			if (!def) {
				continue;
			}
			var locked: boolean = isBuyPointLocked(def);
			var posArr: [number, number, number] = def[3];
			var pos: Vec3 = new Vec3(posArr[0], posArr[1], posArr[2]);
			el.pickup = gta.createPickup(
				locked ? PickupModel.BLUE_HOUSE : PickupModel.GREEN_HOUSE,
				pos,
				locked ? PickupType.LOCKED : PickupType.AVAILABLE
			);
			el.type = locked ? PickupType.LOCKED : PickupType.AVAILABLE;
			el.model = locked ? PickupModel.BLUE_HOUSE : PickupModel.GREEN_HOUSE;
		} else if (!shouldShow && el.pickup) {
			destroyElement(el.pickup);
			el.pickup = null;
		}
	}
}
