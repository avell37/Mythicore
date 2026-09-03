import { useQuery } from '@tanstack/react-query';
import type { Character, CharacterProps } from '../model/Character';
import type { CharacterEquipment } from '../model/CharacterEquipment';
import type { CharacterMedia } from '../model/CharacterMedia';
import type { CharacterPve } from '../model/CharacterPve';
import type { CharacterBuild } from '../model/CharacterTalents';
import type { CharacterTitles } from '../model/CharacterTitles';
import type { CharacterReputations } from '../model/CharacterReputations';
import {
	getCharacterApi,
	getCharacterEquipmentApi,
	getCharacterMediaApi,
	getCharacterPveApi,
	getCharacterReputationsApi,
	getCharacterTalentsApi,
	getCharacterTitlesApi,
} from '../api/character.api';
import { characterKeys } from '../api/query-keys';

const isLookupReady = ({ region, realm, name }: CharacterProps) => Boolean(region && realm && name);

const createCharacterQuery = <T>(
	getKey: (lookup: CharacterProps) => readonly unknown[],
	queryFn: (lookup: CharacterProps) => Promise<T>,
) => {
	return (lookup: CharacterProps, enabled = true) =>
		useQuery({
			queryKey: getKey(lookup),
			queryFn: () => queryFn(lookup),
			enabled: enabled && isLookupReady(lookup),
		});
};

export const useGetCharacterQuery = createCharacterQuery<Character>(
	characterKeys.getCharacter,
	getCharacterApi,
);

export const useGetCharacterMediaQuery = createCharacterQuery<CharacterMedia>(
	characterKeys.getCharacterMedia,
	getCharacterMediaApi,
);

export const useGetCharacterEquipmentQuery = createCharacterQuery<CharacterEquipment>(
	characterKeys.getCharacterEquipment,
	getCharacterEquipmentApi,
);

export const useGetCharacterTalentsQuery = createCharacterQuery<CharacterBuild>(
	characterKeys.getCharacterTalents,
	getCharacterTalentsApi,
);

export const useGetCharacterPveQuery = createCharacterQuery<CharacterPve>(
	characterKeys.getCharacterPve,
	getCharacterPveApi,
);

export const useGetCharacterTitlesQuery = createCharacterQuery<CharacterTitles>(
	characterKeys.getCharacterTitles,
	getCharacterTitlesApi,
);

export const useGetCharacterReputationsQuery = createCharacterQuery<CharacterReputations>(
	characterKeys.getCharacterReputations,
	getCharacterReputationsApi,
);
