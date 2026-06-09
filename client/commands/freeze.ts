var freezeInterval: number | null = null;

function dampenPlayerVelocity(): void {
	localPlayer.velocity = new Vec3(
		localPlayer.velocity.x * FREEZE_DAMPEN,
		localPlayer.velocity.y * FREEZE_DAMPEN,
		localPlayer.velocity.z * FREEZE_DAMPEN
	);
}

function startFreezeInterval(helpText?: string): void {
	if (freezeInterval) {
		return;
	}
	freezeInterval = setInterval(dampenPlayerVelocity, FREEZE_INTERVAL);
	if (helpText) {
		showHelp(helpText);
	}
}

function stopFreezeInterval(): void {
	if (freezeInterval) {
		clearInterval(freezeInterval);
		freezeInterval = null;
	}
}

addCommandHandler("block", () => {
	if (!admin) {
		return;
	}
	startFreezeInterval("Movement slowed");
});

addCommandHandler("unblock", () => {
	stopFreezeInterval();
	showHelp("Movement restored");
});

addNetworkHandler("freezePlayer", (enabled: boolean) => {
	if (enabled) {
		startFreezeInterval();
	} else {
		stopFreezeInterval();
	}
});
