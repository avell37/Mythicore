export const blizzardBase = ['blizzard'] as const;

export const blizzardKeys = {
	all: blizzardBase,
	getCharacter: ({ region, realm, name }: { region: string; realm: string; name: string }) =>
		[...blizzardBase, region, realm, name] as const,
};
