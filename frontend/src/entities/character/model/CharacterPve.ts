export type PveRank = {
	world: number;
	region: number;
	realm: number;
};

export type PveKeyRun = {
	dungeon: string;
	shortName: string;
	level: number;
	score: number;
	upgrades: number;
	clearTimeMs: number;
	parTimeMs: number;
	completedAt: string | null;
};

export type PveRaid = {
	slug: string;
	summary: string;
	totalBosses: number;
	normal: number;
	heroic: number;
	mythic: number;
};

export type CharacterPve = {
	profileUrl: string | null;
	lastCrawledAt: string | null;
	mythicPlus: {
		season: string | null;
		score: number;
		scoreColor: string;
		ranks: {
			overall: PveRank | null;
			class: PveRank | null;
		};
		bestRuns: PveKeyRun[];
		recentRuns: PveKeyRun[];
	};
	raids: PveRaid[];
};
