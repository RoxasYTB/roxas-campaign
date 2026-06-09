var SAVE_POINTS: (
	| [number, [number, number, number]]
	| [number, [number, number, number], string]
)[] = [
	[Mission.AN_OLD_FRIEND, [...Position.HOTEL]],
	[Mission.OCEAN_HEIGHTS_APT_BUY, [...Position.OCEAN]],
	[Mission.WASHINGTON_STREET_BUY, [...Position.WASHINGTON]],
	[Mission.EL_SWANKO_CASA_BUY, [...Position.ELSWANKO]],
	[Mission.VICE_POINT_BUY, [...Position.VICEPOINT]],
	[Mission.RUB_OUT, [-378.5, -597, 26], "TOMMY"],
	[Mission.HOG_TIED, [-585, 656, 11]],
	[Mission.HOG_TIED, [-823, 1145, 12]],
	[Mission.LINKS_VIEW_APARTMENT_BUY, [...Position.LINKS]],
	[Mission.SKUMOLE_SHACK_BUY, [...Position.SKUMOLE]],
	[Mission.HYMAN_CONDO_BUY, [...Position.HYMAN]],
	[Mission.THE_JOB, [499.5, -66.9, 11.4], "MALIBUCLUB"],
	[Mission.KAUFMAN_CABS_BUY, [-992.7, 193.4, 11.4], "KCABS"],
	[Mission.CHERRY_POPPER_ICECREAMS_BUY, [-878.5, -575.1, 11.2], "ICE"],
	[Mission.SUNSHINE_AUTOS, [...Position.SUNSHINE], "SUNYARD"],
	[Mission.THE_BOATYARD_BUY, [-664.1, -1476.3, 13.8], "BOATYARD"],
	[Mission.POLE_POSITION_CLUB_BUY, [...Position.STRIPCLUB], "STRIPCLUB"],
	[Mission.INTERGLOBAL_FILMS_BUY, [0.0, 957.9, 11.1], "FILM"],
	[Mission.PRINTWORKS_BUY, [-1059.6, -282.2, 11.2], "PRINTWORKS"],
];

var SPAWN_POSITION = Position.SPAWN;

var DEFAULT_STATE: Record<string, unknown> = {
	missions: [],
	playerposition: [...Position.SPAWN],
	money: DEFAULT_SAVE_MONEY,
	health: DEFAULT_SAVE_HEALTH,
	armour: DEFAULT_SAVE_ARMOUR,
	hour: DEFAULT_SAVE_HOUR,
	camerainterior: Interior.NONE,
	minute: DEFAULT_SAVE_MINUTE,
	equippedWeapon: Weapon.UNARMED,
	ammunitions: {},
	clothesBought: [],
	bonuses: {},
	skin: PedSkin.TOMMY_VERCETTI,
};
