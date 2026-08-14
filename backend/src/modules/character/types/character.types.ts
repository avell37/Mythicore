export type ItemStat = {
	type: string;
	name: string;
	value: number;
	display: string;
	isEquipBonus?: boolean;
	isNegated?: boolean;
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
	sockets: {
		type: string;
		itemId?: number;
		icon?: string | null;
	}[];
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
