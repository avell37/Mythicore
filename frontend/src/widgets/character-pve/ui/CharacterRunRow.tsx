import { Clock } from 'lucide-react';
import { formatDuration, formatRunScore, getRunTimedLabel, type PveKeyRun } from '@/entities/character';
import { cn } from '@/shared/lib/utils';

export const CharacterRunRow = ({ run }: { run: PveKeyRun }) => {
	const { label: timedLabel, timed } = getRunTimedLabel(run);

	return (
		<div className="flex items-center justify-between gap-3 rounded-lg border border-border/70 bg-black/20 px-3 py-2.5">
			<div className="min-w-0">
				<p className="truncate text-sm font-medium">
					{run.shortName || run.dungeon}
					{run.shortName && run.dungeon ? (
						<span className="ml-2 text-muted-foreground">{run.dungeon}</span>
					) : null}
				</p>
				<div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
					<span className="inline-flex items-center gap-1">
						<Clock className="size-3 shrink-0 opacity-70" />
						<span>
							{formatDuration(run.clearTimeMs)}
							{run.parTimeMs ? ` / ${formatDuration(run.parTimeMs)}` : ''}
						</span>
					</span>
					<span>·</span>
					<span
						className={cn(
							'font-medium',
							timed ? 'text-emerald-400/90' : 'text-red-400/80',
						)}
					>
						{timedLabel}
					</span>
					{run.completedAt ? (
						<>
							<span>·</span>
							<span>{new Date(run.completedAt).toLocaleDateString('en-GB')}</span>
						</>
					) : null}
				</div>
			</div>
			<div className="shrink-0 text-right">
				<p className="text-sm font-semibold">+{run.level}</p>
				<p className="mt-0.5 text-xs text-muted-foreground">{formatRunScore(run.score)}</p>
			</div>
		</div>
	);
};
