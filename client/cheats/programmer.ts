cheats.hits.programmer = () => {
	try {
		natives.SET_CHAR_SCALE(localPlayer, 0.6);
	} catch (_e) {
		try {
			localPlayer.skin = PedSkin.DRAG_QUEEN;
		} catch (_e) {}
	}
};
