import type { BlizzardCharacterSummary } from '../../blizzard/types/blizzard.types';
import type { Character } from '../types/character.types';

const named = (raw?: { id?: number; name?: string }) => ({
	id: raw?.id ?? 0,
	name: raw?.name ?? '',
});

const keyed = (raw?: { type?: string; name?: string }) => ({
	type: raw?.type ?? '',
	name: raw?.name ?? '',
});

export const mapSummary = (data: BlizzardCharacterSummary): Character => ({
	id: data.id ?? 0,
	name: data.name ?? '',
	gender: keyed(data.gender),
	faction: keyed(data.faction),
	race: named(data.race),
	character_class: named(data.character_class),
	active_spec: data.active_spec ? named(data.active_spec) : undefined,
	realm: {
		id: data.realm?.id ?? 0,
		name: data.realm?.name ?? '',
		slug: data.realm?.slug ?? '',
	},
	level: data.level ?? 0,
	experience: data.experience ?? 0,
	achievement_points: data.achievement_points ?? 0,
	last_login_timestamp: data.last_login_timestamp ?? 0,
	average_item_level: data.average_item_level ?? 0,
	equipped_item_level: data.equipped_item_level ?? 0,
	is_remix: data.is_remix,
});
