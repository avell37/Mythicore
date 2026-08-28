export type ItemStat = {
	type: string;
	name: string;
	value: number;
	display: string;
	isEquipBonus?: boolean;
	isNegated?: boolean;
};

export type ItemSocket = {
	type: string;
	name?: string;
	itemId?: number;
	itemName?: string;
	display?: string;
	icon: string | null;
};

export type ItemEnchantment = {
	id: number;
	display: string;
	slot: string;
	sourceItemId?: number;
	sourceItemName?: string;
	icon: string | null;
};

export type EquippedItem = {
	slot: string;
	itemId: number;
	name: string;
	itemLevel: number;
	quality: string;
	qualityColor: string;
	icon: string | null;
	context: string | null;

	binding: string | null;
	armor: number | null;
	stats: ItemStat[];
	enchantments: ItemEnchantment[];
	sockets: ItemSocket[];
	set: {
		name: string;
		equipped: number;
		pieces: number;
		effects: {
			text: string;
			required: number;
			active: boolean;
		}[];
	} | null;
	transmog: {
		itemId: number;
		name: string;
	} | null;
	spells: {
		name: string;
		description: string;
	}[];
	weapon: {
		damage: string;
		speed: string;
		dps: string;
	} | null;
};

export type TalentChoice = {
	name: string;
	spellId?: number;
	description?: string;
	icon: string | null;
	selected: boolean;
};

export type TalentNode = {
	id: number;
	name: string;
	spellId?: number;
	description?: string;
	icon: string | null;
	rank: number;
	maxRank: number;
	row: number;
	col: number;
	type: string;
	choices: TalentChoice[];
};

export type TalentTreeView = {
	id: number;
	name: string;
	active: boolean;
	nodes: TalentNode[];
};

export type CharacterBuild = {
	spec: {
		id: number;
		name: string;
	};
	heroTree: {
		id: number;
		name: string;
	} | null;
	loadoutCode: string | null;
	classTree: TalentTreeView;
	specTree: TalentTreeView;
	heroTrees: TalentTreeView[];
};

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
	url: string | null;
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
		weeklyRuns: PveKeyRun[];
	};
	raids: PveRaid[];
};
