export type CharacterReputationParagon = {
	value: number;
	max: number;
	raw: number;
};

export type CharacterReputation = {
	id: number;
	name: string;
	standing: string;
	tier: number;
	value: number;
	max: number;
	raw: number;
	renownLevel: number | null;
	paragon: CharacterReputationParagon | null;
};

export type CharacterReputations = {
	total: number;
	reputations: CharacterReputation[];
};
