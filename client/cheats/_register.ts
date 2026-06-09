// ===== Data-Driven Cheat Registration =====
// Replaces 33 individual cheat files (skin, vehicle, weather, weapon)
// with a single registration file. Loads after init.ts.

// --- Skin Cheats ---
const SKIN_CHEATS: Record<string, number> = {
	tommy: PedSkin.TOMMY_DEFAULT,
	iwantbigtits: PedSkin.CANDY_SUXX,
	cheatshavebeencracked: PedSkin.RICARDO_DIAZ,
	ilooklikehilary: PedSkin.HILARY_111,
	weloveourdick: PedSkin.LOVE_FIST_112,
	idonthavethemoneysonny: PedSkin.SONNY,
	rockandrollman: PedSkin.LOVE_FIST_118,
	looklikelance: PedSkin.LANCE_116,
	onearmedbandit: PedSkin.PHIL_113,
	mysonisalawyer: PedSkin.KEN_ROSENBURG,
	foxylittlething: PedSkin.MERCEDES_117,
	roxas: PedSkin.TOMMY_TSHIRT_JEANS,
};

for (var skinCode in SKIN_CHEATS) {
	cheats.hits[skinCode] = (function (skinId: number) {
		return function () {
			triggerNetworkEvent("cheatSetSkin", skinId);
		};
	})(SKIN_CHEATS[skinCode]);
}

// --- Vehicle Cheats ---
const VEHICLE_CHEATS: Record<string, number> = {
	thelastride: VehicleModel.ROMEROS_HEARSE,
	rockandrollcar: VehicleModel.LOVE_FIST,
	travelinstyle: VehicleModel.BLOODRING_BANGER_1,
	getthereveryfastindeed: VehicleModel.HOTRING_RACER_1,
	gettherafast: VehicleModel.SABRE_TURBO,
	getthereamazinglyfast: VehicleModel.HOTRING_RACER_2,
	gettherequickly: VehicleModel.BLOODRING_BANGER_2,
	betterthanwalking: VehicleModel.CADDY,
	americahelicopter: VehicleModel.SPARROW,
	flyingways: VehicleModel.WASHINGTON,
	rubbishcar: VehicleModel.TRASHMASTER,
	pcj: VehicleModel.PCJ600,
	panzer: VehicleModel.RHINO,
};

for (var vehCode in VEHICLE_CHEATS) {
	cheats.hits[vehCode] = (function (model: number) {
		return function () {
			triggerNetworkEvent("cheatSpawnVehicle", model);
		};
	})(VEHICLE_CHEATS[vehCode]);
}

// --- Weather Cheats ---
const WEATHER_CHEATS: Record<string, number> = {
	apleasantday: Weather.PLEASANT,
	alovelyday: Weather.EXTRA_SUNNY,
	cantseeathing: Weather.FOGGY,
	catsanddogs: Weather.CLOUDY,
	abitdrieg: Weather.SUNNY,
};

for (var wCode in WEATHER_CHEATS) {
	cheats.hits[wCode] = (function (weatherId: number) {
		return function () {
			(gta as any).weather = weatherId;
		};
	})(WEATHER_CHEATS[wCode]);
}

// --- Weapon Cheats ---
function giveWeaponSet(weapons: number[], ammo: number): void {
	for (var i = 0; i < weapons.length; i++) {
		localPlayer.giveWeapon(weapons[i], ammo, false);
	}
}

cheats.hits.nuttertools = () =>
	giveWeaponSet(
		[
			Weapon.CHAINSAW,
			Weapon.GRENADE,
			Weapon.SNIPERRIFLE,
			Weapon.LASERSCOPE,
			Weapon.ROCKETLAUNCHER,
			Weapon.FLAMETHROWER,
			Weapon.M60,
			Weapon.MINIGUN,
		],
		300
	);

cheats.hits.professionaltools = () =>
	giveWeaponSet(
		[
			Weapon.PYTHON,
			Weapon.SPAS12SHOTGUN,
			Weapon.UZI,
			Weapon.MP5,
			Weapon.M4,
			Weapon.SNIPERRIFLE,
		],
		200
	);

cheats.hits.thugstools = () =>
	giveWeaponSet(
		[Weapon.BASEBALLBAT, Weapon.COLT45, Weapon.SHOTGUN, Weapon.TEC9, Weapon.MOLOTOV],
		100
	);
