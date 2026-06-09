function switchInteriorAndFadeIn(
	interiorID: number,
	position?: Vec3 | false,
	heading?: number
): void {
	if (interiorID !== -1 && typeof interiorID !== "undefined") {
		localPlayer.interior = interiorID;
		game.cameraInterior = interiorID;
		savedCameraInterior = interiorID;
	} else {
		localPlayer.interior = Interior.NONE;
		game.cameraInterior = Interior.NONE;
		savedCameraInterior = Interior.NONE;
	}

	if (position !== false && typeof position !== "undefined") {
		localPlayer.position = position;
	}

	if ((heading as any) !== false && typeof heading !== "undefined") {
		localPlayer.heading = heading;
	}

	game.fadeCamera(true, FADE_SHORT_SEC, toColour(0, 0, 0, ALPHA_OPAQUE));

	setTimeout(() => {
		game.setPlayerControl(true);
		localPlayer.invincible = false;
	}, IV_500);
}
