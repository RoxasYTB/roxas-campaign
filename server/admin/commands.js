addCommandHandler("password", function (cmd, text, client) {
      try {
            if (!text || !client || !client.player) return;
            var pwd = getAdminPassword(client.player.name);
            if (pwd === null) {
                  showHelp(client, "You are not an administrator");
                  return;
            }
            if (text.trim() === pwd) {
client.administrator = true;
                    triggerNetworkEvent("setAdmin", client, true);
                    showHelp(client, "You are now authenticated");
                    console.log("\x1b[36m[@AUTH]\x1b[0m " + client.player.name + " authenticated");
            } else {
                  showHelp(client, "Wrong password");
            }
      } catch (e) {
            console.log("\x1b[31m[@AUTH]\x1b[0m Error: " + e);
      }
});

addCommandHandler("setpassword", function (cmd, text, client) {
      try {
            if (!text || !client || !client.player) return;
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
            console.log("\x1b[36m[@AUTH]\x1b[0m " + client.player.name + " changed password");
      } catch (e) {
            console.log("\x1b[31m[@AUTH]\x1b[0m Error: " + e);
      }
});

addCommandHandler("op", function (cmd, text, client) {
      try {
            if (!text || !client) return;
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
            var targetPwd = parts.length > 1 ? parts.slice(1).join(" ") : "changeme";
            var target = findClientByName(targetName);
            if (!target) {
                  showHelp(client, "Player not found");
                  return;
            }
            target.administrator = true;
            triggerNetworkEvent("setAdmin", target, true);
            adminData[target.player.name] = targetPwd;
            saveAdmins();
            showHelp(client, target.player.name + " is now admin");
            showHelp(target, "You are now admin");
            console.log("\x1b[36m[@AUTH]\x1b[0m " + target.player.name + " op'd by " + client.player.name);
      } catch (e) {
            console.log("\x1b[31m[@AUTH]\x1b[0m Error: " + e);
      }
});

addCommandHandler("deop", function (cmd, text, client) {
      try {
            if (!text || !client) return;
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
            delete adminData[target.player.name];
            saveAdmins();
            showHelp(client, target.player.name + " is no longer admin");
            showHelp(target, "You are no longer admin");
      } catch (e) {
            console.log("\x1b[31m[@AUTH]\x1b[0m deop error: " + e);
      }
});

addCommandHandler("admin", function (cmd, text, client) {
      try {
            if (!client) return;
            if (!client.administrator) {
                  showHelp(client, "Use /password <pw> to authenticate");
                  return;
            }
            showHelp(client, "/op <name> [pw] /deop <name> /setpassword <pw> /save /god");
      } catch (e) {
            console.log("\x1b[31m[@AUTH]\x1b[0m admin error: " + e);
      }
});
