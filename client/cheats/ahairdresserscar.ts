cheats.hits.ahairdresserscar = () => {
	try {
		var vehicles = (getElementsByType as any)("vehicle");
		for (var i = 0; i < vehicles.length; i++) {
			natives.CHANGE_CAR_COLOUR(
				vehicles[i],
				Colour.PINK_WHITE,
				Colour.PINK_WHITE
			);
		}
	} catch (_e) {}
};
