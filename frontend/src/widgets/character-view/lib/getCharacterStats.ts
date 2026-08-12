import { Award, CalendarDays, Shield, Swords } from 'lucide-react';
import type { Character } from '@/entities/character/model/Character';
import { formatLastLogin } from '@/entities/character/lib/format';
import { CharacterStatItem } from '../model/CharacterView';

export const getCharacterStats = (character: Character): CharacterStatItem[] => [
	{
		label: 'Equipped ilvl',
		value: String(character.equipped_item_level ?? '—'),
		icon: Swords,
	},
	{
		label: 'Average ilvl',
		value: String(character.average_item_level ?? '—'),
		icon: Shield,
	},
	{
		label: 'Achievement points',
		value: character.achievement_points?.toLocaleString('en-US') ?? '—',
		icon: Award,
	},
	{
		label: 'Last login',
		value: formatLastLogin(character.last_login_timestamp),
		icon: CalendarDays,
	},
];
