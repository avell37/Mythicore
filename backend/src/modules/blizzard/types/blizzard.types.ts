export type BlizzardTokenResponse = {
	access_token: string;
	token_type: string;
	expires_in: number;
};

export type BlizzardNamedId = {
	id?: number;
	name?: string;
};

export type BlizzardKeyedName = {
	type?: string;
	name?: string;
};

export type BlizzardMediaAsset = {
	key?: string;
	value?: string;
};

export type BlizzardMediaResponse = {
	assets?: BlizzardMediaAsset[];
};

export type BlizzardCharacterSummary = {
	id?: number;
	name?: string;
	gender?: BlizzardKeyedName;
	faction?: BlizzardKeyedName;
	race?: BlizzardNamedId;
	character_class?: BlizzardNamedId;
	active_spec?: BlizzardNamedId;
	realm?: {
		id?: number;
		name?: string;
		slug?: string;
	};
	level?: number;
	experience?: number;
	achievement_points?: number;
	last_login_timestamp?: number;
	average_item_level?: number;
	equipped_item_level?: number;
	is_remix?: boolean;
};

export type BlizzardHref = {
	href?: string;
};

export type BlizzardSpellTooltip = {
	spell?: BlizzardNamedId;
	description?: string;
};

export type BlizzardTalentTooltip = {
	talent?: BlizzardNamedId;
	spell_tooltip?: BlizzardSpellTooltip;
};

export type BlizzardTalentRank = {
	tooltip?: BlizzardTalentTooltip;
	choice_of_tooltips?: BlizzardTalentTooltip[];
};

export type BlizzardTalentNode = {
	id: number;
	node_type?: BlizzardKeyedName;
	display_row?: number;
	display_col?: number;
	ranks?: BlizzardTalentRank[];
	tooltip?: BlizzardTalentTooltip;
};

export type BlizzardLoadoutTalent = {
	id: number;
	rank?: number;
	tooltip?: BlizzardTalentTooltip;
};

export type BlizzardLoadout = {
	is_active?: boolean;
	talent_loadout_code?: string;
	selected_class_talents?: BlizzardLoadoutTalent[];
	selected_spec_talents?: BlizzardLoadoutTalent[];
	selected_hero_talents?: BlizzardLoadoutTalent[];
	selected_class_talent_tree?: { key?: BlizzardHref };
	selected_spec_talent_tree?: { key?: BlizzardHref };
	selected_hero_talent_tree?: { key?: BlizzardHref; name?: string };
};

export type BlizzardSpecializationBlock = {
	specialization?: BlizzardNamedId;
	loadouts?: BlizzardLoadout[];
};

export type BlizzardSpecializationsResponse = {
	active_specialization?: BlizzardNamedId;
	active_hero_talent_tree?: { key?: BlizzardHref; name?: string };
	specializations?: BlizzardSpecializationBlock[];
};

export type BlizzardHeroListing = {
	id?: number;
	name?: string;
	key?: BlizzardHref;
	hero_talent_nodes?: BlizzardTalentNode[];
	talent_nodes?: BlizzardTalentNode[];
	spec_talent_nodes?: BlizzardTalentNode[];
	class_talent_nodes?: BlizzardTalentNode[];
};

export type BlizzardTalentTree = {
	id?: number;
	playable_class?: BlizzardNamedId;
	playable_specialization?: BlizzardNamedId;
	class_talent_nodes?: BlizzardTalentNode[];
	spec_talent_nodes?: BlizzardTalentNode[];
	hero_talent_trees?: BlizzardHeroListing[];
};

export type BlizzardTalentTreeIndex = {
	spec_talent_trees?: { key?: BlizzardHref }[];
};

export type BlizzardEquipmentStat = {
	type?: BlizzardKeyedName;
	value?: number;
	display?: { display_string?: string };
	is_equip_bonus?: boolean;
	is_negated?: boolean;
};

export type BlizzardEquippedItem = {
	slot?: BlizzardKeyedName;
	item?: BlizzardNamedId;
	name?: string;
	level?: { value?: number };
	quality?: BlizzardKeyedName;
	name_description?: { display_string?: string };
	binding?: { name?: string };
	armor?: { value?: number };
	stats?: BlizzardEquipmentStat[];
	enchantments?: {
		enchantment_id?: number;
		display_string?: string;
		enchantment_slot?: BlizzardKeyedName;
		source_item?: BlizzardNamedId;
	}[];
	sockets?: {
		socket_type?: BlizzardKeyedName;
		item?: BlizzardNamedId;
		display_string?: string;
	}[];
	set?: {
		item_set?: { name?: string };
		items?: { is_equipped?: boolean }[];
		effects?: {
			display_string?: string;
			required_count?: number;
			is_active?: boolean;
		}[];
	};
	transmog?: { item?: BlizzardNamedId };
	spells?: { spell?: BlizzardNamedId; description?: string }[];
	weapon?: {
		damage?: { display_string?: string };
		attack_speed?: { display_string?: string };
		dps?: { display_string?: string };
	};
};

export type BlizzardEquipmentResponse = {
	equipped_items?: BlizzardEquippedItem[];
};

export type BlizzardTitle = {
	id?: number;
	name?: string;
	display_string?: string;
};

export type BlizzardTitlesResponse = {
	active_title?: BlizzardTitle;
	titles?: BlizzardTitle[];
};

export type BlizzardReputationParagon = {
	max?: number;
	raw?: number;
	value?: number;
};

export type BlizzardReputationStanding = {
	max?: number;
	name?: string;
	raw?: number;
	renown_level?: number;
	tier?: number;
	value?: number;
};

export type BlizzardReputation = {
	faction?: BlizzardNamedId;
	standing?: BlizzardReputationStanding;
	paragon?: BlizzardReputationParagon;
};

export type BlizzardReputationsResponse = {
	reputations?: BlizzardReputation[];
};
