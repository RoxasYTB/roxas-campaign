var adminData;
try {
      var raw = loadTextFile("./server/config/admins.json");
      adminData = JSON.parse(raw);
      console.log("\x1b[36m[@ADMIN]\x1b[0m Admins loaded: " + Object.keys(adminData).join(", "));
} catch (e) {
      adminData = { Roxas: "changeme" };
      try {
            saveTextFile(
                  "./server/config/admins.json",
                  JSON.stringify(adminData, null, 4),
            );
      } catch (e) {}
      console.log("\x1b[36m[@ADMIN]\x1b[0m Created default admins.json");
}

function saveAdmins() {
      try {
            saveTextFile(
                  "./server/config/admins.json",
                  JSON.stringify(adminData, null, 4),
            );
            console.log("\x1b[36m[@ADMIN]\x1b[0m Admins saved");
      } catch (e) {
            console.log("\x1b[31m[@ADMIN]\x1b[0m Save error: " + e);
      }
}

function isAdminName(name) {
      if (!name) return false;
      var keys = Object.keys(adminData);
      for (var i = 0; i < keys.length; i++) {
            if (keys[i].toLowerCase() === name.toLowerCase()) return true;
      }
      return false;
}

function getAdminPassword(name) {
      var keys = Object.keys(adminData);
      for (var i = 0; i < keys.length; i++) {
            if (keys[i].toLowerCase() === name.toLowerCase())
                  return adminData[keys[i]];
      }
      return null;
}
