'use client';

import Image from 'next/image';
import type { TalentTreeView } from '@/entities/character/model/CharacterTalents';
import { getCenteredRows, getTreeLayout } from '../utils/talent-tree.utils';
import { TalentNodeIcon } from '@/shared/ui/talent';

export const TalentTreePanel = ({
	tree,
	accent,
	icon,
	centerRows = false,
}: {
	tree: TalentTreeView;
	accent: string;
	icon?: string | null;
	centerRows?: boolean;
}) => {
	const layout = centerRows ? null : getTreeLayout(tree.nodes);
	const centeredRows = centerRows ? getCenteredRows(tree.nodes) : null;
	const isEmpty = centerRows
		? !centeredRows?.some((row) => row.length > 0)
		: !layout?.items.length;

	return (
		<div className="min-w-0">
			<div className="mb-3 flex items-center justify-center gap-2">
				{icon ? (
					<Image src={icon} alt="" width={18} height={18} className="size-4 rounded-sm" />
				) : null}
				<p className="text-sm font-medium">{tree.name}</p>
			</div>

			{isEmpty ? (
				<p className="text-sm text-muted-foreground">No talents</p>
			) : centeredRows ? (
				<div className="flex w-max flex-col items-center gap-2">
					{centeredRows.map((row, rowIndex) => (
						<div key={rowIndex} className="flex justify-center gap-2">
							{row.map((node) => (
								<TalentNodeIcon key={node.id} node={node} accent={accent} />
							))}
						</div>
					))}
				</div>
			) : (
				<div className="overflow-x-auto">
					<div
						className="grid w-max gap-2"
						style={{
							gridTemplateColumns: `repeat(${layout!.cols}, 2.25rem)`,
							gridTemplateRows: `repeat(${layout!.rows}, 2.25rem)`,
						}}
					>
						{layout!.items.map((node) => (
							<div
								key={node.id}
								style={{ gridColumn: node.gridCol, gridRow: node.gridRow }}
							>
								<TalentNodeIcon node={node} accent={accent} />
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	);
};
