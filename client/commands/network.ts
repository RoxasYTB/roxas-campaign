addNetworkHandler("fadeTeleport", (x: number, y: number, z: number) => {
	game.setPlayerControl(false);
	localPlayer.invincible = true;
	game.fadeCamera(false, FADE_SHORT_SEC);
	setTimeout(() => {
		localPlayer.position = new Vec3(x, y, z);
		game.fadeCamera(true, FADE_SHORT_SEC);
		game.setPlayerControl(true);
		localPlayer.invincible = false;
	}, FADE_MS);
});

addNetworkHandler("deathFade", () => {
	game.fadeCamera(false, 0.5);
	setTimeout(() => {
		game.fadeCamera(true, 0.5);
	}, 2500);
});

addNetworkHandler(
	"createAssetPickup",
	(x: number, y: number, z: number, qty: number) => {
		try {
			natives.CREATE_PROTECTION_PICKUP(new Vec3(x, y, z), qty, qty);
		} catch (_e) {
			var pos = new Vec3(x, y, z);
			var pickup = gta.createPickup(
				PickupModel.BIG_DOLLAR,
				pos,
				PickupType.MONEY
			);
			if (pickup) {
				pickup.quantity = qty;
			}
		}
	}
);
