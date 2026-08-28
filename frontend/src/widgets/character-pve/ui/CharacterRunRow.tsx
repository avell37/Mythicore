import { PveKeyRun } from '@/entities/character/model/CharacterMythic';
import { formatDuration, formatUpgrades } from '../utils/character-pve.utils';

export const CharacterRunRow = ({ run }: { run: PveKeyRun }) => (
	<div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-black/20 px-3 py-2">
		<div className="min-w-0">
			<p className="truncate text-sm font-medium">
				{run.shortName || run.dungeon}
				<span className="ml-2 text-muted-foreground">{run.dungeon}</span>
			</p>
			<p className="mt-0.5 text-xs text-muted-foreground">
				{formatDuration(run.clearTimeMs)}
				{run.parTimeMs ? ` / ${formatDuration(run.parTimeMs)}` : ''}
				{run.completedAt
					? ` · ${new Date(run.completedAt).toLocaleDateString('en-GB')}`
					: ''}
			</p>
		</div>
		<div className="shrink-0 text-right">
			<p className="text-sm font-semibold">+{run.level}</p>
			<p className="text-xs text-muted-foreground">
				{formatUpgrades(run)} · {Math.round(run.score)}
			</p>
		</div>
	</div>
);
