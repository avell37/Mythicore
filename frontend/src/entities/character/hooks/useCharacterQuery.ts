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
	getCharacterMythicApi,
	getCharacterTalentsApi,
} from '../api/character.api';
import { characterKeys } from '@/shared/api/query-keys';
import { CharacterBuild } from '../model/CharacterTalents';
import { CharacterPve } from '../model/CharacterMythic';

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

export const useGetCharacterTalentsQuery = ({ region, realm, name }: CharacterProps) =>
	useQuery<CharacterBuild>({
		queryKey: characterKeys.getCharacterTalents({ region, realm, name }),
		queryFn: () => getCharacterTalentsApi({ region, realm, name }),
		enabled: Boolean(region && realm && name),
	});

export const useGetCharacterMythicQuery = ({ region, realm, name }: CharacterProps) =>
	useQuery<CharacterPve>({
		queryKey: characterKeys.getCharacterMythic({ region, realm, name }),
		queryFn: () => getCharacterMythicApi({ region, realm, name }),
		enabled: Boolean(region && realm && name),
	});
