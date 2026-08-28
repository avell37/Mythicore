import { TalentNode } from '@/entities/character/model/CharacterTalents';

export const isRenderableTalent = (node: TalentNode) =>
	Boolean(node.name?.trim()) && node.name !== 'Unknown talent';

export const isVisibleTalent = (node: TalentNode, pickedOnly: boolean) =>
	isRenderableTalent(node) && (!pickedOnly || node.rank > 0);

export const uniqueTalents = (nodes: TalentNode[]) => {
	const byId = new Map<number, TalentNode>();

	for (const node of nodes) {
		const existing = byId.get(node.id);
		if (!existing || node.rank > existing.rank) byId.set(node.id, node);
	}

	return [...byId.values()];
};

export const getTreeLayout = (nodes: TalentNode[], pickedOnly = false) => {
	const visible = uniqueTalents(nodes.filter((node) => isVisibleTalent(node, pickedOnly)));

	if (visible.length === 0) {
		return {
			cols: 1,
			rows: 1,
			items: [] as Array<TalentNode & { gridCol: number; gridRow: number }>,
		};
	}

	const cols = [...new Set(visible.map((node) => node.col))].sort((a, b) => a - b);
	const rows = [...new Set(visible.map((node) => node.row))].sort((a, b) => a - b);
	const colIndex = new Map(cols.map((col, index) => [col, index + 1]));
	const rowIndex = new Map(rows.map((row, index) => [row, index + 1]));

	return {
		cols: cols.length,
		rows: rows.length,
		items: visible.map((node) => ({
			...node,
			gridCol: colIndex.get(node.col) ?? 1,
			gridRow: rowIndex.get(node.row) ?? 1,
		})),
	};
};

export const getCenteredRows = (nodes: TalentNode[], pickedOnly = false) => {
	const visible = uniqueTalents(nodes.filter((node) => isVisibleTalent(node, pickedOnly)));
	const rows = [...new Set(visible.map((node) => node.row))].sort((a, b) => a - b);

	return rows.map((row) =>
		visible.filter((node) => node.row === row).sort((a, b) => a.col - b.col),
	);
};
