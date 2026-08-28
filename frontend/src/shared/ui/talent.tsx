'use client';

import { TalentNode } from '@/entities/character/model/CharacterTalents';
import { PreviewCard } from '@base-ui/react';
import { ReactNode } from 'react';
import { cn } from '../lib/utils';
import Image from 'next/image';

const ENCHANT_GREEN = '#1eff00';

const talentMeta = (node: TalentNode) => {
	if (node.rank > 1) {
		return node.maxRank > 1 ? `Rank ${node.rank} / ${node.maxRank}` : `Rank ${node.rank}`;
	}
	return node.rank > 0 ? 'Selected' : 'Not taken';
};

const TalentTooltipShell = ({
	children,
	wide = false,
}: {
	children: ReactNode;
	wide?: boolean;
}) => (
	<div className="rounded-2xl border border-white/15 bg-black/90 p-2 shadow-[0_18px_50px_rgba(0,0,0,0.75)] backdrop-blur-md">
		<div
			className={cn(
				wide
					? 'flex w-[min(35rem,calc(100vw-1.25rem))] gap-2'
					: 'w-[min(20rem,calc(100vw-1.25rem))]',
			)}
		>
			{children}
		</div>
	</div>
);

const TalentTooltipCard = ({
	name,
	icon,
	description,
	selected,
	meta,
	className,
}: {
	name: string;
	icon: string | null;
	description?: string;
	selected: boolean;
	meta: string;
	className?: string;
}) => (
	<div
		className={cn(
			'min-w-0 flex-1 rounded-xl border-2 p-4 shadow-xl',
			selected
				? 'border-yellow-300/70 bg-[#12141c] ring-1 ring-yellow-200/25'
				: 'border-white/20 bg-[#0c0e14]',
			className,
		)}
	>
		<div className="flex items-start gap-3">
			{icon ? (
				<Image
					src={icon}
					alt=""
					width={40}
					height={40}
					className={cn(
						'size-10 shrink-0 rounded-md border',
						selected ? 'border-yellow-300/50' : 'border-white/15 opacity-70',
					)}
				/>
			) : (
				<span className="size-10 shrink-0 rounded-md bg-white/10" />
			)}
			<div className="min-w-0">
				<p
					className={cn(
						'text-base font-bold leading-tight tracking-wide uppercase',
						selected ? 'text-yellow-200' : 'text-white/85',
					)}
				>
					{name}
				</p>
				<p
					className={cn(
						'mt-1 text-[11px] font-semibold tracking-[0.14em] uppercase',
						selected ? 'text-yellow-200/80' : 'text-white/45',
					)}
				>
					{meta}
				</p>
			</div>
		</div>
		{description ? (
			<p
				className={cn('mt-3 text-[0.95rem] leading-snug', selected ? '' : 'opacity-85')}
				style={{ color: ENCHANT_GREEN }}
			>
				{description}
			</p>
		) : null}
	</div>
);

export const TalentTooltip = ({ node }: { node: TalentNode }) => {
	const choices = node.choices ?? [];
	const isChoice = node.type === 'CHOICE' && choices.length > 1;

	if (isChoice) {
		return (
			<TalentTooltipShell wide>
				{choices.map((choice, index) => (
					<TalentTooltipCard
						key={`${choice.spellId ?? choice.name}-${index}`}
						name={choice.name}
						icon={choice.icon}
						description={choice.description}
						selected={choice.selected}
						meta={choice.selected ? 'Selected' : 'Not taken'}
					/>
				))}
			</TalentTooltipShell>
		);
	}

	return (
		<TalentTooltipShell>
			<TalentTooltipCard
				name={node.name}
				icon={node.icon}
				description={node.description}
				selected={node.rank > 0}
				meta={talentMeta(node)}
			/>
		</TalentTooltipShell>
	);
};

export const TalentHover = ({ node, children }: { node: TalentNode; children: ReactNode }) => {
	const isChoice = node.type === 'CHOICE' && (node.choices?.length ?? 0) > 1;

	return (
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
					sideOffset={10}
					collisionPadding={12}
					positionMethod="fixed"
					className="z-[80] outline-none"
				>
					<PreviewCard.Popup
						className={cn(
							'origin-(--transform-origin) outline-none',
							'transition-[transform,opacity] duration-150 ease-out',
							'data-starting-style:scale-95 data-starting-style:opacity-0',
							'data-ending-style:scale-95 data-ending-style:opacity-0',
							isChoice
								? 'max-w-[min(40rem,calc(100vw-1.25rem))]'
								: 'max-w-[min(22rem,calc(100vw-1.25rem))]',
						)}
					>
						<TalentTooltip node={node} />
					</PreviewCard.Popup>
				</PreviewCard.Positioner>
			</PreviewCard.Portal>
		</PreviewCard.Root>
	);
};

export const TalentNodeIcon = ({ node, accent }: { node: TalentNode; accent: string }) => {
	const selected = node.rank > 0;
	const isChoice = node.type === 'CHOICE' && (node.choices?.length ?? 0) > 1;

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
					boxShadow:
						selected && isChoice
							? `inset 0 0 0 1px color-mix(in oklab, ${accent} 40%, transparent)`
							: undefined,
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
				{isChoice ? (
					<span className="absolute top-0 left-0 rounded-br bg-black/75 px-0.5 text-[8px] leading-3 font-semibold text-yellow-200/90">
						↔
					</span>
				) : null}
				{node.rank >= 1 ? (
					<span className="absolute right-0 bottom-0 min-w-3 rounded-tl bg-black/80 px-0.5 text-[9px] leading-3 font-semibold text-yellow-200">
						{node.rank}
					</span>
				) : null}
			</span>
		</TalentHover>
	);
};
