import { blizzardKeys } from '@/shared/api/query-keys';
import { useQuery } from '@tanstack/react-query';
import type { Character, CharacterProps } from '../model/Character';
import { getCharacterApi } from '../api/character.api';

export const useGetCharacterQuery = ({ region, realm, name }: CharacterProps) =>
	useQuery<Character>({
		queryKey: blizzardKeys.getCharacter({ region, realm, name }),
		queryFn: () => getCharacterApi({ region, realm, name }),
		enabled: Boolean(region && realm && name),
	});
