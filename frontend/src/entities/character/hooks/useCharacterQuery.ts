import { useQuery } from '@tanstack/react-query';
import type {
	Character,
	CharacterEquipment,
	CharacterMedia,
	CharacterProps,
} from '../model/Character';
import {
	getCharacterApi,
	getCharacterEquipmentApi,
	getCharacterMediaApi,
} from '../api/character.api';
import { characterKeys } from '@/shared/api/query-keys';

export const useGetCharacterQuery = ({ region, realm, name }: CharacterProps) =>
	useQuery<Character>({
		queryKey: characterKeys.getCharacter({ region, realm, name }),
		queryFn: () => getCharacterApi({ region, realm, name }),
		enabled: Boolean(region && realm && name),
	});

export const useGetCharacterMediaQuery = ({ region, realm, name }: CharacterProps) =>
	useQuery<CharacterMedia>({
		queryKey: characterKeys.getCharacterMedia({ region, realm, name }),
		queryFn: () => getCharacterMediaApi({ region, realm, name }),
		enabled: Boolean(region && realm && name),
	});

export const useGetCharacterEquipmentQuery = ({ region, realm, name }: CharacterProps) =>
	useQuery<CharacterEquipment>({
		queryKey: characterKeys.getCharacterEquipment({ region, realm, name }),
		queryFn: () => getCharacterEquipmentApi({ region, realm, name }),
		enabled: Boolean(region && realm && name),
	});
