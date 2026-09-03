import type { TalentNode } from '../model/CharacterTalents';

export const isRenderableTalent = (node: TalentNode) =>
	Boolean(node.name?.trim()) && node.name !== 'Unknown talent';

export const uniqueTalents = (nodes: TalentNode[]) => {
	const byId = new Map<number, TalentNode>();

	for (const node of nodes) {
		const existing = byId.get(node.id);
		if (!existing || node.rank > existing.rank) byId.set(node.id, node);
	}

	return [...byId.values()];
};
