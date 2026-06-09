cheats.hits.deepfriedmarsbars = () => {
	try {
		var skins = [
			PedSkin.TOMMY_SPANDEX_OVERALLS,
			PedSkin.TOMMY_GOLFER,
			PedSkin.TOMMY_CUBAN,
			PedSkin.TOMMY_COP,
			PedSkin.TOMMY_ROBBERY_SUIT,
			PedSkin.TOMMY_TSHIRT_JEANS,
			PedSkin.TOMMY_STRIPED_SUIT,
			PedSkin.TOMMY_BLACK_TRACKSUIT,
			PedSkin.TOMMY_RED_TRACKSUIT,
		];
		var current = localPlayer.skin || PedSkin.TOMMY_VERCETTI;
		var idx = skins.indexOf(current);
		localPlayer.skin = skins[(idx + 1) % skins.length];
	} catch (_e) {
		triggerNetworkEvent("cheatSetSkin", PedSkin.TOMMY_TSHIRT_JEANS);
	}
};
