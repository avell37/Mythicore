import { TalentNode } from '@/entities/character/model/CharacterTalents';
import { PreviewCard } from '@base-ui/react';
import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import Image from 'next/image';

const ENCHANT_GREEN = '#1eff00';

export const TalentTooltip = ({ node }: { node: TalentNode }) => (
	<div className="rounded-lg border border-white/10 bg-ink/95 p-3 backdrop-blur-md">
		<p className="text-sm font-semibold text-yellow-200">{node.name}</p>
		{node.rank > 1 ? (
			<p className="mt-0.5 text-xs text-muted-foreground">
				Rank {node.rank}
				{node.maxRank > 1 ? ` / ${node.maxRank}` : ''}
			</p>
		) : null}
		{node.description ? (
			<p className="mt-2 text-sm leading-snug" style={{ color: ENCHANT_GREEN }}>
				{node.description}
			</p>
		) : null}
	</div>
);

export const TalentHover = ({ node, children }: { node: TalentNode; children: ReactNode }) => (
	<PreviewCard.Root>
		<PreviewCard.Trigger
			delay={80}
			closeDelay={60}
			render={<div className="relative cursor-pointer outline-none" />}
		>
			{children}
		</PreviewCard.Trigger>
		<PreviewCard.Portal>
			<PreviewCard.Positioner
				side="top"
				align="center"
				sideOffset={8}
				collisionPadding={16}
				positionMethod="fixed"
				className="z-50 outline-none"
			>
				<PreviewCard.Popup
					className={cn(
						'w-[min(16rem,calc(100vw-1.5rem))] origin-(--transform-origin) outline-none',
						'transition-[transform,opacity] duration-150 ease-out',
						'data-starting-style:scale-95 data-starting-style:opacity-0',
						'data-ending-style:scale-95 data-ending-style:opacity-0',
					)}
				>
					<TalentTooltip node={node} />
				</PreviewCard.Popup>
			</PreviewCard.Positioner>
		</PreviewCard.Portal>
	</PreviewCard.Root>
);

export const TalentNodeIcon = ({ node, accent }: { node: TalentNode; accent: string }) => {
	const selected = node.rank > 0;

	return (
		<TalentHover node={node}>
			<span
				className={cn(
					'relative block size-9 overflow-hidden rounded-md border',
					selected ? 'opacity-100' : 'opacity-30',
				)}
				style={{
					borderColor: selected
						? `color-mix(in oklab, ${accent} 65%, #e8c96a)`
						: 'rgba(255,255,255,0.1)',
				}}
			>
				{node.icon ? (
					<Image
						src={node.icon}
						alt=""
						width={36}
						height={36}
						className="size-full object-cover"
					/>
				) : (
					<span className="block size-full bg-white/10" />
				)}
				{node.rank >= 1 ? (
					<span className="absolute right-0 bottom-0 min-w-3 rounded-tl bg-black/80 px-0.5 text-[9px] leading-3 font-semibold text-yellow-200">
						{node.rank}
					</span>
				) : null}
			</span>
		</TalentHover>
	);
};
