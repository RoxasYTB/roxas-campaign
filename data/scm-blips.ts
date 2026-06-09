// Mission entity data (models to track per mission)
// Extracted from SCM + manual corrections
var ScmMissions: Record<number, { models: number[] }> = {
	3: { models: [111] },           // The Party (Hilary)
	4: { models: [111, 112] },      // Back Alley Brawl (Hilary, Love Fist)
	5: { models: [27, 16, 38, 42] },// Jury Fury
	6: { models: [112, 113, 91] },  // Riot (Love Fist, Phil, bodyguard)
	7: { models: [122] },           // Treacherous Swine (Cortez)
	8: { models: [110, 109] },      // Mall Shootout (Candy, Ken)
	9: { models: [107, 89, 90] },   // Guardian Angels (Diaz, Diaz guys)
	10: { models: [107, 89, 90] },  // Sir, Yes Sir! (Diaz)
	11: { models: [122] },          // All Hands On Deck (Cortez)
	12: { models: [124] },          // The Chase (Columbian)
	13: { models: [124, 147] },     // Phnom Penh '86
	14: { models: [124] },          // The Fastest Boat (Columbian)
	15: { models: [107, 89, 90] },  // Supply & Demand (Diaz)
	16: { models: [107, 89, 90, 116, 121] }, // Rub Out (Diaz, Diaz guys, Lance)
	17: { models: [113, 116, 121] },// Death Row (Phil, Lance)
	18: { models: [] },             // Four Iron
	19: { models: [] },             // Demolition Man
	20: { models: [] },             // Two Bit Hit
	21: { models: [] },             // No Escape
	22: { models: [] },             // The Shootist
	23: { models: [] },             // The Driver
	24: { models: [] },             // The Job
	25: { models: [113, 129] },     // Gun Runner (Phil)
	26: { models: [113, 129] },     // Boomshine Saigon (Phil)
	27: { models: [110] },          // Recruitment Drive (Candy)
	28: { models: [110] },          // Dildo Dodo (Candy)
	29: { models: [110] },          // Martha's Mug Shot
	30: { models: [110] },          // G-spotlight
	32: { models: [95, 96] },       // Bar Brawl (Vercetti guys)
	33: { models: [95, 96] },       // Cop Land (Vercetti guys)
	34: { models: [] },             // Spilling the Beans
	35: { models: [] },             // Hit the Courier
	51: { models: [] },             // Cap the Collector
	52: { models: [115, 144, 145, 146] }, // Keep your Friends Close (Sonny, Forellis)
	53: { models: [93, 94] },       // Alloy Wheels of Steel (Bikers)
	54: { models: [93, 94] },       // Messing with the Man (Bikers)
	55: { models: [93, 94] },       // Hog Tied (Bikers)
	56: { models: [83, 84] },       // Stunt Boat Challenge (Cubans)
	57: { models: [83, 84] },       // Cannon Fodder (Cubans)
	58: { models: [83, 84] },       // Naval Engagement (Cubans)
	59: { models: [83, 84] },       // Trojan Voodoo (Cubans)
	60: { models: [85, 86] },       // Juju Scramble (Haitians)
	61: { models: [85, 86] },       // Bombs Away (Haitians)
	62: { models: [85, 86] },       // Dirty Lickins (Haitians)
	63: { models: [108, 112, 118] },// Love Juice (Love Fist)
	64: { models: [108, 112, 118] },// Psycho Killer (Love Fist)
	65: { models: [108, 112, 118] },// Publicity Tour (Love Fist)
	72: { models: [69] },           // V.I.P. (Kaufman Cabs)
	73: { models: [] },             // Friendly Rivalry
	74: { models: [] },             // Cabmaggedon
};
