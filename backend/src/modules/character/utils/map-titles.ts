import type { BlizzardTitle, BlizzardTitlesResponse } from '../../blizzard/types/blizzard.types';
import { CharacterTitle, CharacterTitles } from '../types/character.types';

const mapTitle = (raw: BlizzardTitle, activeId?: number): CharacterTitle => ({
	id: raw.id ?? 0,
	name: raw.name ?? '',
	displayString: raw.display_string ?? raw.name ?? '',
	isActive: typeof activeId === 'number' && raw.id === activeId,
});

export const mapTitles = (data: BlizzardTitlesResponse): CharacterTitles => {
	const activeId = data.active_title?.id;
	const titles = (data.titles ?? []).map((title) => mapTitle(title, activeId));

	const activeRaw = data.active_title;
	const active = activeRaw
		? mapTitle(activeRaw, activeRaw.id)
		: (titles.find((title) => title.isActive) ?? null);

	return {
		active,
		total: titles.length,
		titles: titles.sort((a, b) => a.displayString.localeCompare(b.displayString, 'en')),
	};
};
