import type { CharacterProps } from '../model/Character';

export const characterBase = ['character'] as const;

const lookupKey = ({ region, realm, name }: CharacterProps) =>
	[region, realm, name] as const;

export const characterKeys = {
	all: characterBase,
	getCharacter: (lookup: CharacterProps) => [...characterBase, ...lookupKey(lookup)] as const,
	getCharacterMedia: (lookup: CharacterProps) =>
		[...characterBase, 'media', ...lookupKey(lookup)] as const,
	getCharacterEquipment: (lookup: CharacterProps) =>
		[...characterBase, 'equipment', ...lookupKey(lookup)] as const,
	getCharacterTalents: (lookup: CharacterProps) =>
		[...characterBase, 'talents', ...lookupKey(lookup)] as const,
	getCharacterPve: (lookup: CharacterProps) =>
		[...characterBase, 'pve', ...lookupKey(lookup)] as const,
	getCharacterTitles: (lookup: CharacterProps) =>
		[...characterBase, 'titles', ...lookupKey(lookup)] as const,
};
