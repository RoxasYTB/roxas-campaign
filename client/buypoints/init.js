function initBuyPoints() {
      if (typeof rebuildBuyPointState === "function") rebuildBuyPointState();
      showBuyPointPickups();
      startBuyPointTouchDetection();
      setupTabKeyHandler();
      applyPropertyGarages();
      applyPropertyRevenue();
      applyPropertyChanges();
      createClothesPickups();
}
