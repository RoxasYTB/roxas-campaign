setInterval(() => {
	var vehicles = getVehicles();
	if (!vehicles) {
		return;
	}

	var toDestroy: Set<Vehicle> = new Set();

	for (var i = 0; i < vehicles.length; i++) {
		var veh1 = vehicles[i];

		if (!veh1.position || toDestroy.has(veh1)) {
			continue;
		}

		var occ1 = veh1.getOccupants();
		if (occ1 && occ1.length > 0) {
			continue;
		}

		for (var j = i + 1; j < vehicles.length; j++) {
			var veh2 = vehicles[j];

			if (!veh2.position || toDestroy.has(veh2)) {
				continue;
			}

			var occ2 = veh2.getOccupants();
			if (occ2 && occ2.length > 0) {
				continue;
			}

			if (veh1.position.distance(veh2.position) < DUPE_VEHICLE_DIST) {
				toDestroy.add(veh2);
			}
		}
	}

	toDestroy.forEach((veh: Vehicle) => {
		try {
			var pos = veh.position;
			veh.position = new Vec3(pos.x, pos.y, OFF_WORLD_Z);

			setTimeout(() => {
				if (veh) {
					destroyElement(veh);
				}
			}, IV_100);
		} catch (_e) {}
	});
}, IV_100);
