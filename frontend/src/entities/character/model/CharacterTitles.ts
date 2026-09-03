export type CharacterTitle = {
	id: number;
	name: string;
	displayString: string;
	isActive: boolean;
};

export type CharacterTitles = {
	active: CharacterTitle | null;
	total: number;
	titles: CharacterTitle[];
};
