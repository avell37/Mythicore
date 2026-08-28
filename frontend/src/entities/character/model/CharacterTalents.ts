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
