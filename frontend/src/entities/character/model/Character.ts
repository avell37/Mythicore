export type CharacterProps = {
	region: string;
	realm: string;
	name: string;
};

export type ItemStat = {
	type: string;
	name: string;
	value: number;
	display: string;
	isEquipBonus?: boolean;
	isNegated?: boolean;
};

export interface Character {
	id: number;
	name: string;
	gender: {
		type: string;
		name: string;
	};
	faction: {
		type: string;
		name: string;
	};
	race: {
		name: string;
		id: number;
	};
	character_class: {
		name: string;
		id: number;
	};
	active_spec?: {
		name: string;
		id: number;
	};
	realm: {
		name: string;
		id: number;
		slug: string;
	};
	level: number;
	experience: number;
	achievement_points: number;
	last_login_timestamp: number;
	average_item_level: number;
	equipped_item_level: number;
	is_remix?: boolean;
}

export interface CharacterMedia {
	avatar: string | null;
	inset: string | null;
	main: string | null;
}

export interface EquippedItem {
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
}

export type CharacterEquipment = Record<string, EquippedItem>;
