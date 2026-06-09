var DEFAULT_ADMIN_PASSWORD = "changeme";

addCommandHandler("password", (_cmd: string, text: string, client: Client) => {
	try {
		if (!(text && client && client.player)) {
			return;
		}
		var pwd = getAdminPassword(client.player.name);
		if (pwd === null) {
			showHelp(client, "You are not an administrator");
			return;
		}
		if (text.trim() === pwd) {
			client.administrator = true;
			triggerNetworkEvent("setAdmin", client, true);
			showHelp(client, "You are now authenticated");
			info("AUTH", client.player.name + " authenticated");
		} else {
			showHelp(client, "Wrong password");
		}
	} catch (e) {
		error("AUTH", "Error: " + e);
	}
});

addCommandHandler(
	"setpassword",
	(_cmd: string, text: string, client: Client) => {
		try {
			if (!(text && client && client.player)) {
				return;
			}
			if (!client.administrator) {
				showHelp(client, "Authenticate with /password first");
				return;
			}
			if (!isAdminName(client.player.name)) {
				showHelp(client, "You are not in the admin list");
				return;
			}
			adminData[client.player.name] = text.trim();
			saveAdmins();
			showHelp(client, "Password changed");
			info("AUTH", client.player.name + " changed password");
		} catch (e) {
			error("AUTH", "Error: " + e);
		}
	}
);

addCommandHandler("op", (_cmd: string, text: string, client: Client) => {
	try {
		if (!(text && client)) {
			return;
		}
		if (!client.administrator) {
			showHelp(client, "Authenticate with /password first");
			return;
		}
		if (!isAdminName(client.player ? client.player.name : "")) {
			showHelp(client, "You are not in the admin list");
			return;
		}
		var parts = text.split(" ");
		var targetName = parts[0];
		var targetPwd = parts.length > 1 ? parts.slice(1).join(" ") : DEFAULT_ADMIN_PASSWORD;
		var target = findClientByName(targetName);
		if (!target) {
			showHelp(client, "Player not found");
			return;
		}
		target.administrator = true;
		triggerNetworkEvent("setAdmin", target, true);
		adminData[target.player!.name] = targetPwd;
		saveAdmins();
		showHelp(client, target.player!.name + " is now admin");
		showHelp(target, "You are now admin");
		info("AUTH", target.player!.name + " op'd by " + client.player!.name);
	} catch (e) {
		error("AUTH", "Error: " + e);
	}
});

addCommandHandler("deop", (_cmd: string, text: string, client: Client) => {
	try {
		if (!(text && client)) {
			return;
		}
		if (!client.administrator) {
			showHelp(client, "Authenticate with /password first");
			return;
		}
		if (!isAdminName(client.player ? client.player.name : "")) {
			showHelp(client, "You are not in the admin list");
			return;
		}
		var targetName = text.trim();
		var target = findClientByName(targetName);
		if (!target) {
			showHelp(client, "Player not found");
			return;
		}
		target.administrator = false;
		triggerNetworkEvent("setAdmin", target, false);
		delete adminData[target.player!.name];
		saveAdmins();
		showHelp(client, target.player!.name + " is no longer admin");
		showHelp(target, "You are no longer admin");
	} catch (e) {
		error("AUTH", "deop error: " + e);
	}
});

addCommandHandler("admin", (_cmd: string, _text: string, client: Client) => {
	try {
		if (!client) {
			return;
		}
		if (!client.administrator) {
			showHelp(client, "Use /password <pw> to authenticate");
			return;
		}
		showHelp(
			client,
			"/op <name> [pw] /deop <name> /setpassword <pw> /save /god"
		);
	} catch (e) {
		error("AUTH", "admin error: " + e);
	}
});
