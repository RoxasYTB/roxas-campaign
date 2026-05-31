cheats.hits.ahairdresserscar = function() {
    try {
        var vehicles = getElementsByType("vehicle");
        for (var i = 0; i < vehicles.length; i++) {
            natives.CHANGE_CAR_COLOUR(vehicles[i], 15, 15);
        }
    } catch(e) {}
};
