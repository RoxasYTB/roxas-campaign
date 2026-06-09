var missionNames: Record<number, string> = {
	[Mission.INITIAL]: "Initial",
	[Mission.INTRO]: "Intro",
	[Mission.AN_OLD_FRIEND]: "An Old Friend",
	[Mission.THE_PARTY]: "The Party",
	[Mission.BACK_ALLEY_BRAWL]: "Back Alley Brawl",
	[Mission.JURY_FURY]: "Jury Fury",
	[Mission.RIOT]: "Riot",
	[Mission.TREACHEROUS_SWINE]: "Treacherous Swine",
	[Mission.MALL_SHOOTOUT]: "Mall Shootout",
	[Mission.GUARDIAN_ANGELS]: "Guardian Angels",
	[Mission.SIR_YES_SIR]: "Sir, Yes Sir!",
	[Mission.ALL_HANDS_ON_DECK]: "All Hands On Deck!",
	[Mission.THE_CHASE]: "The Chase",
	[Mission.PHNOM_PENH_86]: "Phnom Penh '86",
	[Mission.THE_FASTEST_BOAT]: "The Fastest Boat",
	[Mission.SUPPLY_AND_DEMAND]: "Supply & Demand",
	[Mission.RUB_OUT]: "Rub Out",
	[Mission.DEATH_ROW]: "Death Row",
	[Mission.FOUR_IRON]: "Four Iron",
	[Mission.DEMOLITION_MAN]: "Demolition Man",
	[Mission.TWO_BIT_HIT]: "Two Bit Hit",
	[Mission.NO_ESCAPE]: "No Escape?",
	[Mission.THE_SHOOTIST]: "The Shootist",
	[Mission.THE_DRIVER]: "The Driver",
	[Mission.THE_JOB]: "The Job",
	[Mission.GUN_RUNNER]: "Gun Runner",
	[Mission.BOOMSHINE_SAIGON]: "Boomshine Saigon",
	[Mission.RECRUITMENT_DRIVE]: "Recruitment Drive",
	[Mission.DILDO_DODO]: "Dildo Dodo",
	[Mission.MARTHAS_MUG_SHOT]: "Martha's Mug Shot",
	[Mission.G_SPOTLIGHT]: "G-spotlight",
	[Mission.SHAKEDOWN]: "Shakedown",
	[Mission.BAR_BRAWL]: "Bar Brawl",
	[Mission.COP_LAND]: "Cop Land",
	[Mission.SPILLING_THE_BEANS]: "Spilling the Beans",
	[Mission.HIT_THE_COURIER]: "Hit the Courier",
	[Mission.PRINTWORKS_BUY]: "Printworks Buy",
	[Mission.SUNSHINE_AUTOS]: "Sunshine Autos",
	[Mission.INTERGLOBAL_FILMS_BUY]: "Interglobal Films Buy",
	[Mission.CHERRY_POPPER_ICECREAMS_BUY]: "Cherry Popper Icecreams Buy",
	[Mission.KAUFMAN_CABS_BUY]: "Kaufman Cabs Buy",
	[Mission.MALIBU_CLUB_BUY]: "Malibu Club Buy",
	[Mission.THE_BOATYARD_BUY]: "The Boatyard Buy",
	[Mission.POLE_POSITION_CLUB_BUY]: "Pole Position Club Buy",
	[Mission.EL_SWANKO_CASA_BUY]: "El Swanko Casa Buy",
	[Mission.LINKS_VIEW_APARTMENT_BUY]: "Links View Apartment Buy",
	[Mission.HYMAN_CONDO_BUY]: "Hyman Condo Buy",
	[Mission.OCEAN_HEIGHTS_APT_BUY]: "Ocean Heights Apt. Buy",
	[Mission.WASHINGTON_STREET_BUY]: "1102 Washington Street Buy",
	[Mission.VICE_POINT_BUY]: "Vice Point Buy",
	[Mission.SKUMOLE_SHACK_BUY]: "Skumole Shack Buy",
	[Mission.CAP_THE_COLLECTOR]: "Cap the Collector",
	[Mission.KEEP_YOUR_FRIENDS_CLOSE]: "Keep your Friends Close...",
	[Mission.ALLOY_WHEELS_OF_STEEL]: "Alloy Wheels of Steel",
	[Mission.MESSING_WITH_THE_MAN]: "Messing with the Man",
	[Mission.HOG_TIED]: "Hog Tied",
	[Mission.STUNT_BOAT_CHALLENGE]: "Stunt Boat Challenge",
	[Mission.CANNON_FODDER]: "Cannon Fodder",
	[Mission.NAVAL_ENGAGEMENT]: "Naval Engagement",
	[Mission.TROJAN_VOODOO]: "Trojan Voodoo",
	[Mission.JUJU_SCRAMBLE]: "Juju Scramble",
	[Mission.BOMBS_AWAY]: "Bombs Away!",
	[Mission.DIRTY_LICKINS]: "Dirty Lickin's",
	[Mission.LOVE_JUICE]: "Love Juice",
	[Mission.PSYCHO_KILLER]: "Psycho Killer",
	[Mission.PUBLICITY_TOUR]: "Publicity Tour",
	[Mission.WEAPON_RANGE]: "Weapon Range",
	[Mission.ROAD_KILL]: "Road Kill",
	[Mission.WASTE_THE_WIFE]: "Waste the Wife",
	[Mission.AUTOCIDE]: "Autocide",
	[Mission.CHECK_OUT_AT_THE_CHECK_IN]: "Check Out at the Check In",
	[Mission.LOOSE_ENDS]: "Loose Ends",
	[Mission.V_I_P]: "V.I.P.",
	[Mission.FRIENDLY_RIVALRY]: "Friendly Rivalry",
	[Mission.CABMAGGEDON]: "Cabmaggedon",
	[Mission.TAXI_DRIVER]: "TAXI DRIVER",
	[Mission.PARAMEDIC]: "PARAMEDIC",
	[Mission.FIREFIGHTER]: "FIREFIGHTER",
	[Mission.VIGILANTE]: "VIGILANTE",
	[Mission.HOTRING]: "HOTRING",
	[Mission.BLOODRING]: "BLOODRING",
	[Mission.DIRTRING]: "DIRTRING",
	[Mission.SUNSHINE_AUTOS_RACES]: "Sunshine Autos Races",
	[Mission.DISTRIBUTION]: "Distribution",
	[Mission.DOWNTOWN_CHOPPER_CHECKPOINT]: "Downtown Chopper Checkpoint",
	[Mission.OCEAN_BEACH_CHOPPER_CHECKPOINT]: "Ocean Beach Chopper Checkpoint",
	[Mission.VICE_POINT_CHOPPER_CHECKPOINT]: "Vice Point Chopper Checkpoint",
	[Mission.LITTLE_HAITI_CHOPPER_CHECKPOINT]: "Little Haiti Chopper Checkpoint",
	[Mission.TRIAL_BY_DIRT]: "Trial by Dirt",
	[Mission.TEST_TRACK]: "Test Track",
	[Mission.PCJ_PLAYGROUND]: "PCJ Playground",
	[Mission.CONE_CRAZY]: "Cone Crazy",
	[Mission.PIZZA_BOY]: "PIZZA BOY",
	[Mission.RC_RAIDER_PICKUP]: "RC Raider Pickup",
	[Mission.RC_BANDIT_RACE]: "RC Bandit Race",
	[Mission.RC_BARON_RACE]: "RC Baron Race",
	[Mission.CHECKPOINT_CHARLIE]: "Checkpoint Charlie",
};

addNetworkHandler("missionStart", (client: Client, missionId: number) => {
	if (client.player) {
		inMission.set(client.player.name, true);
		var name = missionNames[missionId] || `Unknown (${missionId})`;
		success(
			"MISSION",
			`${client.player.name} started mission ${missionId} (${name})`
		);
	}
});

addNetworkHandler("missionEnd", (client: Client) => {
	if (client.player) {
		inMission.set(client.player.name, false);
		success("MISSION", `${client.player.name} ended mission`);
	}
});

addNetworkHandler("groupMissionStart", (client: Client, missionId: number) => {
	if (!client.player) return;
	var group = missionGroups.get(client);
	if (!group) {
		showHelp(client, "You are not hosting a group.");
		return;
	}
	if (group.host !== client) {
		showHelp(client, "Only the host can start a mission.");
		return;
	}
	group.missionId = missionId;
	group.missionName = missionNames[missionId] || "Unknown";
	inMission.set(client.player.name, true);
	success("MISSION", `Group host ${client.player.name} started mission ${missionId} (${group.missionName})`);

	var hostSave = getCachedSave(client);
	var hostMissions: number[] = (hostSave && hostSave.missions as number[]) || [];
	if (hostMissions.indexOf(missionId) !== -1) {
		showHelp(client, "You have already completed this mission. Cannot host it.");
		group.missionId = null;
		group.missionName = null;
		inMission.set(client.player.name, false);
		return;
	}

	var eligible: Client[] = [];
	var ineligible: Client[] = [];
	for (var i = 0; i < group.members.length; i++) {
		var member = group.members[i];
		if (!member.player) {
			ineligible.push(member);
			continue;
		}
		var save = getCachedSave(member);
		var completed: number[] = (save && save.missions as number[]) || [];
		if (completed.indexOf(missionId) !== -1) {
			ineligible.push(member);
		} else {
			eligible.push(member);
		}
	}

	for (var ei = 0; ei < ineligible.length; ei++) {
		var kicked = ineligible[ei];
		var idx = group.members.indexOf(kicked);
		if (idx !== -1) {
			group.members.splice(idx, 1);
		}
		if (kicked.player) {
			triggerNetworkEvent("groupDisbanded", kicked);
			triggerNetworkEvent("groupHealth", kicked, "[]");
			showHelp(kicked, "Removed from group: you already completed this mission.");
			showHelp(client, kicked.player.name + " was removed (already completed this mission).");
		}
	}

	group.members = eligible;

	for (var mi = 0; mi < eligible.length; mi++) {
		triggerNetworkEvent("groupPlayMission", eligible[mi], missionId);
		inMission.set(eligible[mi].player!.name, true);
	}

});

addNetworkHandler("groupMissionResult", (client: Client, missionId: number, passed: boolean) => {
	if (!client.player) return;
	var group = missionGroups.get(client);
	if (!group || group.host !== client) return;
	if (group.missionId !== missionId) return;

	if (passed) {
		success("MISSION", `Group host ${client.player.name} completed mission ${missionId} (${group.missionName})`);
		broadcastToGroup(group, "groupMissionPassed", missionId);
	} else {
		success("MISSION", `Group host ${client.player.name} failed mission ${missionId} (${group.missionName})`);
		broadcastToGroup(group, "groupMissionFailed", missionId);
	}

	group.missionId = null;
	group.missionName = null;

	var all = getAllGroupClients(group);
	for (var i = 0; i < all.length; i++) {
		if (all[i].player) {
			inMission.set(all[i].player!.name, false);
		}
	}
});
