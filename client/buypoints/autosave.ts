setInterval(() => {
	var scripts = gta.getActiveScripts();
	for (var i = 0; i < scripts.length; i++) {
		var scriptName = String(scripts[i]);
		if (scriptName.toLowerCase().indexOf("save") !== -1) {
			gta.terminateScript(scriptName);
			triggerCustomSave();
			break;
		}
	}
}, 500);

function triggerCustomSave(): void {
	saveGame();
}
