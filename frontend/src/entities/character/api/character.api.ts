import { baseAxios } from '@/shared/api/http';
import { API_URL } from '@/shared/lib/constants/api.config';
import type {
	Character,
	CharacterEquipment,
	CharacterMedia,
	CharacterProps,
} from '../model/Character';

export const getCharacterApi = async ({
	region,
	realm,
	name,
}: CharacterProps): Promise<Character> => {
	const { data } = await baseAxios.get(`${API_URL.character()}/${region}/${realm}/${name}`);
	return data;
};

export const getCharacterMediaApi = async ({
	region,
	realm,
	name,
}: CharacterProps): Promise<CharacterMedia> => {
	const { data } = await baseAxios.get(`${API_URL.character()}/${region}/${realm}/${name}/media`);
	return data;
};

export const getCharacterEquipmentApi = async ({
	region,
	realm,
	name,
}: CharacterProps): Promise<CharacterEquipment> => {
	const { data } = await baseAxios.get(
		`${API_URL.character()}/${region}/${realm}/${name}/equipment`,
	);
	return data;
};
