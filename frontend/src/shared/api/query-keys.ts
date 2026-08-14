export const characterBase = ['character'] as const;

export const characterKeys = {
	all: characterBase,
	getCharacter: ({ region, realm, name }: { region: string; realm: string; name: string }) =>
		[...characterBase, region, realm, name] as const,
	getCharacterMedia: ({ region, realm, name }: { region: string; realm: string; name: string }) =>
		[...characterBase, 'media', region, realm, name] as const,
	getCharacterEquipment: ({
		region,
		realm,
		name,
	}: {
		region: string;
		realm: string;
		name: string;
	}) => [...characterBase, 'equipment', region, realm, name] as const,
};
