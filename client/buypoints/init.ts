function initBuyPoints(): void {
	if (typeof rebuildBuyPointState === "function") {
		rebuildBuyPointState();
	}
	showBuyPointPickups();
	startBuyPointTouchDetection();
	setupTabKeyHandler();
	applyPropertyGarages();
	applyPropertyRevenue();
	applyPropertyChanges();
	createClothesPickups();
}
