var inMission: Map<string, boolean> = new Map();

interface MissionGroup {
		host: Client;
		members: Client[];
		missionId: number | null;
		missionName: string | null;
}

var missionGroups: Map<Client, MissionGroup> = new Map();
