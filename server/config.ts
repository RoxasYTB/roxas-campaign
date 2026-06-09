var SPAWN_POSITION: [number, number, number] = Position.SPAWN as [number, number, number];
var SPAWN_ROTATION: number = Rotation.SPAWN;
var SPAWN_SKIN: number = PedSkin.TOMMY_VERCETTI;

var HOSPITAL_POSITIONS: [number, number, number][] = Hospitals;

var NEED_ADMIN_PASSWORD: boolean = true;
var CHEATS_ENABLED: boolean = true;
var CHEATS_ADMIN_ONLY: boolean = true;

try {
	var raw = loadTextFile("./config.json");
	var cfg = JSON.parse(raw!);
	if (cfg.admin && cfg.admin.needPassword !== undefined) NEED_ADMIN_PASSWORD = cfg.admin.needPassword;
	if (cfg.cheats) {
		if (cfg.cheats.enabled !== undefined) CHEATS_ENABLED = cfg.cheats.enabled;
		if (cfg.cheats.adminOnly !== undefined) CHEATS_ADMIN_ONLY = cfg.cheats.adminOnly;
	}
} catch (_e) {
	saveTextFile("./config.json", JSON.stringify({
		cheats: { enabled: CHEATS_ENABLED, adminOnly: CHEATS_ADMIN_ONLY },
		admin: { needPassword: NEED_ADMIN_PASSWORD },
	}, null, 4));
}
