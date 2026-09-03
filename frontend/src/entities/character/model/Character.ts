export type CharacterProps = {
	region: string;
	realm: string;
	name: string;
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
