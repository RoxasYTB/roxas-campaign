var TP_LOCATIONS: Record<string, [number, number, number]> = {
	LAWYER: Position.LAWYER as [number, number, number],
	CORTEZ: Position.CORTEZ as [number, number, number],
	DIAZ: Position.DIAZ as [number, number, number],
	KENT: Position.KENT as [number, number, number],
	AVERY: Position.AVERY as [number, number, number],
	PHIL: Position.PHIL as [number, number, number],
	FILM: Position.FILM as [number, number, number],
	PRINTWORKS: Position.PRINTWORKS as [number, number, number],
	BIKERS: Position.BIKERS as [number, number, number],
	CUBANS: Position.CUBANS as [number, number, number],
	HAITIANS: Position.HAITIANS as [number, number, number],
	LOVEFIST: Position.LOVEFIST as [number, number, number],
	PHONE: Position.PHONE as [number, number, number],
	PHONEONE: Position.PHONEONE as [number, number, number],
	PHONETWO: Position.PHONETWO as [number, number, number],
	PHONETHREE: Position.PHONETHREE as [number, number, number],
	PHONEFOUR: Position.PHONEFOUR as [number, number, number],
	PHONEFIVE: Position.PHONEFIVE as [number, number, number],
	KCABS: Position.KCABS as [number, number, number],
	ICE: Position.ICE as [number, number, number],
	SUNYARD: Position.SUNYARD as [number, number, number],
	BOATYARD: Position.BOATYARD as [number, number, number],
	TOMMY: Position.TOMMY as [number, number, number],
	TOMMYTWO: Position.TOMMYTWO as [number, number, number],
	TOMMYTHREE: Position.TOMMYTHREE as [number, number, number],
	MALIBU: Position.MALIBU as [number, number, number],
	SUNSHINE: Position.SUNSHINE as [number, number, number],
	POLE: Position.POLE as [number, number, number],
	STRIPCLUB: Position.STRIPCLUB as [number, number, number],
	HOTEL: Position.HOTEL as [number, number, number],
	OCEAN: Position.OCEAN as [number, number, number],
	WASHINGTON: Position.WASHINGTON as [number, number, number],
	VICEPOINT: Position.VICEPOINT as [number, number, number],
	LINKS: Position.LINKS as [number, number, number],
	ELSWANKO: Position.ELSWANKO as [number, number, number],
	SKUMOLE: Position.SKUMOLE as [number, number, number],
	HYMAN: Position.HYMAN as [number, number, number],
};

var TP_INTERIOR: Record<string, number> = {
	TOMMY: Interior.VERCETTI_MANSION,
	TOMMYTWO: Interior.VERCETTI_MANSION,
};

addCommandHandler("tp", (_cmd: string, text: string) => {
	if (!admin) {
		return;
	}
	if (!text) {
		var names = Object.keys(TP_LOCATIONS).join(", ");
		showHelp(`/tp <${names}>`);
		return;
	}
	var key = text.toUpperCase();
	var pos = TP_LOCATIONS[key];
	if (!pos) {
		triggerNetworkEvent("serverTp", text);
		return;
	}
	game.setPlayerControl(false);
	localPlayer.invincible = true;
	game.fadeCamera(false, FADE_SHORT_SEC);
	setTimeout(() => {
		localPlayer.position = new Vec3(pos[0], pos[1], pos[2]);
		gta.cameraInterior = TP_INTERIOR[key] || Interior.NONE;
		game.fadeCamera(true, FADE_SHORT_SEC);
		game.setPlayerControl(true);
		localPlayer.invincible = false;
	}, FADE_MS);
});
