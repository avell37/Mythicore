import type { CharacterReputation } from '@/entities/character';
import { standingColor, standingLabel, standingProgress } from '../utils/standing';

export const ReputationRow = ({ rep }: { rep: CharacterReputation }) => {
	const color = standingColor(rep);
	const label = standingLabel(rep);
	const paragonAsPrimary = Boolean(rep.paragon) && rep.max <= 0;
	const barValue = paragonAsPrimary && rep.paragon ? rep.paragon.value : rep.value;
	const barMax = paragonAsPrimary && rep.paragon ? rep.paragon.max : rep.max;
	const pct = standingProgress(barValue, barMax, rep.standing);
	const remaining = Math.max(0, barMax - barValue);
	const showParagonBar = Boolean(rep.paragon) && !paragonAsPrimary;

	return (
		<div className="space-y-2 border-b border-border/50 px-3 py-3 transition-colors last:border-b-0 hover:bg-white/2">
			<div className="flex items-center justify-between gap-3">
				<p className="min-w-0 truncate text-sm text-foreground/90">{rep.name}</p>
				<span
					className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
					style={{
						backgroundColor: `color-mix(in oklab, ${color} 18%, transparent)`,
						color,
					}}
				>
					{label}
				</span>
			</div>

			<div
				role="progressbar"
				aria-label={`${rep.name} standing`}
				aria-valuemin={0}
				aria-valuemax={barMax || 100}
				aria-valuenow={barValue}
				className="h-1.5 overflow-hidden rounded-full bg-white/8"
			>
				<div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: color }} />
			</div>

			{showParagonBar && rep.paragon ? (
				<div
					role="progressbar"
					aria-label={`${rep.name} paragon`}
					aria-valuemin={0}
					aria-valuemax={rep.paragon.max || 100}
					aria-valuenow={rep.paragon.value}
					className="h-1 overflow-hidden rounded-full bg-white/8"
				>
					<div
						className="h-full rounded-full"
						style={{
							width: `${standingProgress(rep.paragon.value, rep.paragon.max)}%`,
							backgroundColor: '#e8c96a',
						}}
					/>
				</div>
			) : null}

			<p className="text-[11px] text-muted-foreground">
				{barMax > 0
					? `${barValue.toLocaleString('en-US')} / ${barMax.toLocaleString('en-US')}${
							remaining > 0 ? ` · ${remaining.toLocaleString('en-US')} remaining` : ''
						}`
					: label}
				{rep.paragon && !paragonAsPrimary
					? ` · Paragon ${rep.paragon.value.toLocaleString('en-US')} / ${rep.paragon.max.toLocaleString('en-US')}`
					: ''}
				{paragonAsPrimary ? ' · Paragon' : ''}
			</p>
		</div>
	);
};
