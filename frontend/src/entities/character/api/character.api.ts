import { baseAxios } from '@/shared/api/http';
import { API_URL } from '@/shared/lib/constants/api.config';
import type { Character, CharacterProps } from '../model/Character';
import type { CharacterEquipment } from '../model/CharacterEquipment';
import type { CharacterMedia } from '../model/CharacterMedia';
import type { CharacterPve } from '../model/CharacterPve';
import type { CharacterBuild } from '../model/CharacterTalents';
import type { CharacterTitles } from '../model/CharacterTitles';
import type { CharacterReputations } from '../model/CharacterReputations';

const characterPath = ({ region, realm, name }: CharacterProps, suffix = '') =>
	`${API_URL.character()}/${region}/${realm}/${name}${suffix}`;

const getCharacterResource = async <T>(lookup: CharacterProps, suffix = '') => {
	const { data } = await baseAxios.get<T>(characterPath(lookup, suffix));
	return data;
};

export const getCharacterApi = (lookup: CharacterProps) => getCharacterResource<Character>(lookup);

export const getCharacterMediaApi = (lookup: CharacterProps) =>
	getCharacterResource<CharacterMedia>(lookup, '/media');

export const getCharacterEquipmentApi = (lookup: CharacterProps) =>
	getCharacterResource<CharacterEquipment>(lookup, '/equipment');

export const getCharacterTalentsApi = (lookup: CharacterProps) =>
	getCharacterResource<CharacterBuild>(lookup, '/talents');

export const getCharacterPveApi = (lookup: CharacterProps) =>
	getCharacterResource<CharacterPve>(lookup, '/pve');

export const getCharacterTitlesApi = (lookup: CharacterProps) =>
	getCharacterResource<CharacterTitles>(lookup, '/titles');

export const getCharacterReputationsApi = (lookup: CharacterProps) =>
	getCharacterResource<CharacterReputations>(lookup, '/reputations');
