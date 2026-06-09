var adminData: Record<string, string>;
try {
	var raw = loadTextFile("./admins.json");
	adminData = JSON.parse(raw!);
	info("ADMIN", `Admins loaded: ${Object.keys(adminData).join(", ")}`);
} catch (_e) {
	adminData = { Roxas: "changeme" };
	try {
		saveTextFile(
			"./admins.json",
			JSON.stringify(adminData, null, 4)
		);
	} catch (_e) {}
	info("ADMIN", "Created default admins.json");
}

function saveAdmins() {
	try {
		saveTextFile(
			"./admins.json",
			JSON.stringify(adminData, null, 4)
		);
		info("ADMIN", "Admins saved");
	} catch (e) {
		error("ADMIN", `Save error: ${e}`);
	}
}

function isAdminName(name: string): boolean {
	if (!name) {
		return false;
	}
	var keys = Object.keys(adminData);
	for (var i = 0; i < keys.length; i++) {
		if (keys[i].toLowerCase() === name.toLowerCase()) {
			return true;
		}
	}
	return false;
}

function getAdminPassword(name: string): string | null {
	var keys = Object.keys(adminData);
	for (var i = 0; i < keys.length; i++) {
		if (keys[i].toLowerCase() === name.toLowerCase()) {
			return adminData[keys[i]];
		}
	}
	return null;
}
