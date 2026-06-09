setInterval(() => {
	const vehicles: Vehicle[] = getVehicles();
	if (!vehicles) {
		return;
	}

	const toDestroy: Set<Vehicle> = new Set();

	for (let i = 0; i < vehicles.length; i++) {
		const veh1: Vehicle = vehicles[i];

		if (!veh1.position || toDestroy.has(veh1)) {
			continue;
		}

		const occ1: Player[] = veh1.getOccupants();
		if (occ1 && occ1.length > 0) {
			continue;
		}

		for (let j = i + 1; j < vehicles.length; j++) {
			const veh2: Vehicle = vehicles[j];

			if (!veh2.position || toDestroy.has(veh2)) {
				continue;
			}

			const occ2: Player[] = veh2.getOccupants();
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
			const pos: Vec3 = veh.position;
			veh.position = new Vec3(pos.x, pos.y, OFF_WORLD_Z);

			setTimeout(() => {
				if (veh) {
					destroyElement(veh);
				}
			}, IV_100);
		} catch (_e) {}
	});
}, IV_100);
