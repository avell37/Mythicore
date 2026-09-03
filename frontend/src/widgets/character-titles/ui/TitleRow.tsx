import { CharacterTitle } from '@/entities/character';
import { cn } from '@/shared/lib/utils';
import { Crown } from 'lucide-react';

export const TitleRow = ({ title, accent }: { title: CharacterTitle; accent: string }) => (
	<div
		className={cn(
			'flex items-center justify-between gap-3 border-b border-border/50 px-3 py-2.5 last:border-b-0',
			title.isActive ? 'bg-white/3' : 'transition-colors hover:bg-white/2',
		)}
		style={
			title.isActive
				? {
						boxShadow: `inset 3px 0 0 color-mix(in oklab, ${accent} 75%, #e8c96a)`,
					}
				: undefined
		}
	>
		<div className="flex min-w-0 items-center gap-2.5">
			{title.isActive ? (
				<Crown
					className="size-3.5 shrink-0"
					style={{ color: `color-mix(in oklab, ${accent} 70%, #e8c96a)` }}
				/>
			) : (
				<span className="size-3.5 shrink-0" />
			)}
			<p
				className={cn(
					'truncate text-sm',
					title.isActive ? 'font-semibold text-yellow-100' : 'text-foreground/90',
				)}
			>
				{title.displayString}
			</p>
		</div>
		{title.isActive ? (
			<span
				className="shrink-0 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide uppercase"
				style={{
					backgroundColor: `color-mix(in oklab, ${accent} 18%, transparent)`,
					color: `color-mix(in oklab, ${accent} 55%, #fde68a)`,
				}}
			>
				Active
			</span>
		) : null}
	</div>
);
