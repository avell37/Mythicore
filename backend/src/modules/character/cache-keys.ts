export const characterCacheKey = {
	summary: (region: string, realm: string, name: string) =>
		`char:v2:${region}:${realm}:${name}`,
	media: (region: string, realm: string, name: string) =>
		`char:media:v2:${region}:${realm}:${name}`,
	equipment: (region: string, realm: string, name: string) =>
		`char:equip:v2:${region}:${realm}:${name}`,
	build: (region: string, realm: string, name: string) =>
		`char:build:v4:${region}:${realm}:${name}`,
	pve: (region: string, realm: string, name: string) => `char:pve:v2:${region}:${realm}:${name}`,
	titles: (region: string, realm: string, name: string) =>
		`char:titles:v2:${region}:${realm}:${name}`,
	itemIcon: (region: string, itemId: number) => `item:icon:${region}:${itemId}`,
	spellIcon: (region: string, spellId: number) => `spell:icon:${region}:${spellId}`,
	talentTreeIndex: (region: string) => `talent-tree-index:${region}`,
	talentTree: (region: string, treeId: number, specId: number) =>
		`talent-tree:${region}:${treeId}:${specId}`,
	heroTree: (region: string, treeId: number, heroTreeId: number) =>
		`hero-tree:v3:${region}:${treeId}:${heroTreeId}`,
};
