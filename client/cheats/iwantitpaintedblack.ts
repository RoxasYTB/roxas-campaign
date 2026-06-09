cheats.hits.iwantitpaintedblack = () => {
	try {
		var vehicles = (getElementsByType as any)("vehicle");
		for (var i = 0; i < vehicles.length; i++) {
			natives.CHANGE_CAR_COLOUR(vehicles[i], Colour.BLACK, Colour.BLACK);
		}
	} catch (_e) {}
};
