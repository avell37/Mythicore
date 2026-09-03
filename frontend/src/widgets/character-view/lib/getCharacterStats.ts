'use client';

import { Award, CalendarDays, Shield, Swords } from 'lucide-react';
import { getCharacterStatValues, type Character } from '@/entities/character';
import type { CharacterStatItem } from '../ui/CharacterStats';

export const getCharacterStats = (character: Character): CharacterStatItem[] => {
	const values = getCharacterStatValues(character);

	return [
		{
			label: 'Equipped ilvl',
			value: values.equippedIlvl,
			icon: Swords,
		},
		{
			label: 'Average ilvl',
			value: values.averageIlvl,
			icon: Shield,
		},
		{
			label: 'Achievement points',
			value: values.achievementPoints,
			icon: Award,
		},
		{
			label: 'Last login',
			value: values.lastLogin,
			icon: CalendarDays,
		},
	];
};
