import {
	BlizzardReputation,
	BlizzardReputationsResponse,
} from 'src/modules/blizzard/types/blizzard.types';
import { CharacterReputation, CharacterReputations } from '../types/character.types';

const mapReputation = (raw: BlizzardReputation): CharacterReputation => ({
	id: raw.faction?.id ?? 0,
	name: raw.faction?.name ?? '',
	standing: raw.standing?.name ?? '',
	tier: raw.standing?.tier ?? 0,
	value: raw.standing?.value ?? 0,
	max: raw.standing?.max ?? 0,
	raw: raw.standing?.raw ?? 0,
	renownLevel: raw.standing?.renown_level ?? null,
	paragon: raw.paragon
		? {
				value: raw.paragon.value ?? 0,
				max: raw.paragon.max ?? 0,
				raw: raw.paragon.raw ?? 0,
			}
		: null,
});

export const mapReputations = (data: BlizzardReputationsResponse): CharacterReputations => {
	const reputations = (data.reputations ?? []).map(mapReputation).sort((a, b) => {
		const aRenown = a.renownLevel !== null ? 1 : 0;
		const bRenown = b.renownLevel !== null ? 1 : 0;
		if (aRenown !== bRenown) return bRenown - aRenown;
		if (a.raw !== b.raw) return b.raw - a.raw;
		return a.name.localeCompare(b.name, 'en');
	});

	return {
		total: reputations.length,
		reputations,
	};
};
