import { baseAxios } from '@/shared/api/http';
import { API_URL } from '@/shared/lib/constants/api.config';
import type { CharacterProps } from '../model/Character';

export const getCharacterApi = async ({ region, realm, name }: CharacterProps) => {
	const { data } = await baseAxios.get(
		`${API_URL.blizzard()}/character/${region}/${realm}/${name}`,
	);
	return data;
};
