type BuyPointDef = [
	number,
	string,
	number,
	[number, number, number],
	number,
	string,
];

var BUY_POINTS: BuyPointDef[] = [
	[
		39,
		"Ice Cream Factory",
		20000,
		[...Position.ICE],
		-Mission.CHERRY_POPPER_ICECREAMS_BUY,
		"money",
	],
	[
		38,
		"Car Showroom",
		50000,
		[...Position.SUNYARD],
		Mission.SUNSHINE_AUTOS,
		"money",
	],
	[
		43,
		"the Boatyard",
		10000,
		[...Position.BOATYARD],
		Mission.THE_BOATYARD_BUY,
		"money",
	],
	[
		1,
		"3321 Vice Point",
		2500,
		[...Position.VICEPOINT],
		Mission.VICE_POINT_BUY,
		"safehouse",
	],
	[
		2,
		"Links View Apartment",
		6000,
		[...Position.LINKS],
		Mission.LINKS_VIEW_APARTMENT_BUY,
		"safehouse",
	],
	[
		3,
		"El Swanko Casa",
		8000,
		[...Position.ELSWANKO],
		Mission.EL_SWANKO_CASA_BUY,
		"safehouse",
	],
	[
		4,
		"1102 Washington Street",
		3000,
		[...Position.WASHINGTON],
		Mission.WASHINGTON_STREET_BUY,
		"safehouse",
	],
	[
		5,
		"Ocean Heights Apartment",
		7000,
		[...Position.OCEAN],
		Mission.OCEAN_HEIGHTS_APT_BUY,
		"safehouse",
	],
	[
		6,
		"Skumole Shack",
		1000,
		[-560.1, 703.6, 20.5],
		Mission.SKUMOLE_SHACK_BUY,
		"safehouse",
	],
	[
		7,
		"Hyman Condo",
		14000,
		[...Position.HYMAN],
		Mission.HYMAN_CONDO_BUY,
		"safehouse",
	],
	[
		40,
		"Taxi Company",
		40000,
		[-1011.7, 203.9, 11.2],
		Mission.KAUFMAN_CABS_BUY,
		"money",
	],
	[
		9,
		"The Malibu",
		120000,
		[...Position.MALIBU],
		Mission.MALIBU_CLUB_BUY,
		"money",
	],
	[
		10,
		"the Pole Position Club",
		30000,
		[...Position.STRIPCLUB],
		Mission.POLE_POSITION_CLUB_BUY,
		"money",
	],
	[
		11,
		"the Film Studios",
		60000,
		[15.2, 962.6, 10.9],
		Mission.INTERGLOBAL_FILMS_BUY,
		"money",
	],
	[
		12,
		"the Print Works",
		70000,
		[-1059.6, -274.5, 11.4],
		Mission.PRINTWORKS_BUY,
		"money",
	],
];

var _bpById: Map<number, BuyPointDef> = new Map();
var _bpByMission: Map<number, BuyPointDef> = new Map();
BUY_POINTS.forEach((def: BuyPointDef) => {
	_bpById.set(def[0], def);
	if (def.length >= 5 && def[4] !== null) {
		_bpByMission.set(def[4], def);
	}
});

var buyPointState: number[] = [];
var buyPointElements: {
	id: number;
	pickup: Pickup | null;
	position: [number, number, number];
	type: number;
	model: number;
}[] = [];
var buyPointLastTouch: Record<number, number> = {};

function rebuildBuyPointState(): void {
	buyPointState = [];
	for (var i = 0; i < BUY_POINTS.length; i++) {
		var def: BuyPointDef = BUY_POINTS[i];
		var missionId: number | null = def[4] === null ? null : Math.abs(def[4]);
		if (missionId !== null && missionCache.indexOf(missionId) !== -1) {
			buyPointState.push(def[0]);
		}
	}
}
