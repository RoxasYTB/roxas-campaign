var buyPointHelpCooldown: Record<string, number> = {};

function startBuyPointTouchDetection(): void {
	setInterval(() => {
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
			var el:
				| {
						id: number;
						pickup: Pickup | null;
						position: [number, number, number];
						type: number;
						model: number;
				  }
				| undefined = buyPointElements.find((b) => b.id === id);
			var locked: boolean = isBuyPointLocked(def);
			var wantedModel: number = locked
				? PickupModel.BLUE_HOUSE
				: PickupModel.GREEN_HOUSE;
			var wantedType: number = locked
				? PickupType.LOCKED
				: localPlayer.money >= price
					? PickupType.AVAILABLE
					: PickupType.LOCKED;
			if (
				el &&
				el.pickup &&
				(el.type !== wantedType || el.model !== wantedModel)
			) {
				destroyElement(el.pickup);
				var newPos: Vec3 = new Vec3(pos[0], pos[1], pos[2]);
				el.pickup = gta.createPickup(wantedModel, newPos, wantedType);
				el.type = wantedType;
				el.model = wantedModel;
			}
			var dist: number = dist3d(px, py, pz, pos[0], pos[1], pos[2]);
			if (dist <= BUYPOINT_DETECT_DIST && !localPlayer.isInVehicle) {
				if (
					buyPointHelpCooldown[id] === undefined ||
					buyPointHelpCooldown[id] <= 0
				) {
					if (locked) {
						showHelp(`You cannot buy ${name} at this time, come back later.`);
					} else {
						showHelp(`Press TAB to purchase ${name} for $${price}`);
					}
					buyPointHelpCooldown[id] = HELP_COOLDOWN_CYCLES;
				}
			} else {
				buyPointHelpCooldown[id] = 0;
			}
		}
		var keys: string[] = Object.keys(buyPointHelpCooldown);
		for (var ki = 0; ki < keys.length; ki++) {
			var key: string = keys[ki];
			if (buyPointHelpCooldown[key] > 0) {
				buyPointHelpCooldown[key]--;
			}
		}
	}, BUYPOINT_DETECT_IV);
}

function setupTabKeyHandler(): void {
	try {
		addEventHandler(
			"onKeyDown",
			(
				_event: unknown,
				virtualKey: number,
				_physicalKey: unknown,
				_keyModifiers: unknown
			) => {
				if (virtualKey !== KEY_TAB) {
					return;
				}
				if (localPlayer.isInVehicle) {
					return;
				}
				var px: number = Math.round(localPlayer.position.x);
				var py: number = Math.round(localPlayer.position.y);
				var pz: number = Math.round(localPlayer.position.z);
				for (var i = 0; i < BUY_POINTS.length; i++) {
					var def: BuyPointDef = BUY_POINTS[i];
					var id: number = def[0];
					if (buyPointState.indexOf(id) !== -1) {
						continue;
					}
					var pos: [number, number, number] = def[3];
					var dist: number = dist3d(px, py, pz, pos[0], pos[1], pos[2]);
					if (dist <= BUYPOINT_DETECT_DIST) {
						if (gta.onMission) {
							showHelp("You cannot buy property whilst on a mission");
							return;
						}
						if (isBuyPointLocked(def)) {
							return;
						}
						if (localPlayer.money < def[2]) {
							showHelp("You don't have enough cash for this property");
							return;
						}
						pickupAndStartMission(def);
						return;
					}
				}
			}
		);
	} catch (_e) {}
}

function isBuyPointLocked(def: BuyPointDef): boolean {
	if (def.length < 6) {
		return false;
	}
	if (def[5] !== "money") {
		return false;
	}
	return missionCache.indexOf(Mission.BAR_BRAWL) === -1;
}
