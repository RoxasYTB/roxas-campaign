cheats.hits.iwantitpaintedblack = function() {
    try {
        var vehicles = getElementsByType("vehicle");
        for (var i = 0; i < vehicles.length; i++) {
            natives.CHANGE_CAR_COLOUR(vehicles[i], 0, 0);
        }
    } catch(e) {}
};
