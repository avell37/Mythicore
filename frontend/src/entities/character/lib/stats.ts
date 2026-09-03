import type { Character } from '../model/Character';
import { formatLastLogin } from './format';

export const getCharacterStatValues = (character: Character) => ({
	equippedIlvl: String(character.equipped_item_level ?? '—'),
	averageIlvl: String(character.average_item_level ?? '—'),
	achievementPoints: character.achievement_points?.toLocaleString('en-US') ?? '—',
	lastLogin: formatLastLogin(character.last_login_timestamp),
});
