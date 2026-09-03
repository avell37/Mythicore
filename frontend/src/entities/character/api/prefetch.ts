import type { QueryClient } from '@tanstack/react-query';
import type { CharacterProps } from '../model/Character';
import {
	getCharacterApi,
	getCharacterEquipmentApi,
	getCharacterMediaApi,
} from './character.api';
import { characterKeys } from './query-keys';

export const prefetchCharacterOverview = async (
	queryClient: QueryClient,
	lookup: CharacterProps,
) => {
	await queryClient.fetchQuery({
		queryKey: characterKeys.getCharacter(lookup),
		queryFn: () => getCharacterApi(lookup),
	});

	await Promise.allSettled([
		queryClient.prefetchQuery({
			queryKey: characterKeys.getCharacterMedia(lookup),
			queryFn: () => getCharacterMediaApi(lookup),
		}),
		queryClient.prefetchQuery({
			queryKey: characterKeys.getCharacterEquipment(lookup),
			queryFn: () => getCharacterEquipmentApi(lookup),
		}),
	]);
};
