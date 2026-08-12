import type { Character } from '../model/Character';

export const formatLastLogin = (timestamp: number): string => {
	if (!timestamp) return 'Unknown';

	return new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(new Date(timestamp));
};

export const getFactionAccent = (factionType?: string): string => {
	if (factionType === 'ALLIANCE') return '#3b82f6';
	if (factionType === 'HORDE') return '#ef4444';
	return '#7b5cff';
};

export const buildCharacterDocumentTitle = (character: Character): string =>
	[
		character.name,
		character.active_spec?.name,
		character.character_class?.name,
		character.equipped_item_level ? `${character.equipped_item_level} ilvl` : null,
		'Mythicore',
	]
		.filter(Boolean)
		.join(' · ');
