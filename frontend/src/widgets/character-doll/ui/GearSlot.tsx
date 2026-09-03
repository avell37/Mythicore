'use client';

import Image from 'next/image';
import { PreviewCard } from '@base-ui/react/preview-card';
import type { EquippedItem } from '@/entities/character';
import type { GearSlotDef } from '../lib/gear-slots';
import { cn } from '@/shared/lib/utils';
import { ItemTooltip } from './ItemTooltip';

type GearSlotProps = {
	slot: GearSlotDef;
	item?: EquippedItem;
	side: 'left' | 'right' | 'bottom';
	variant?: 'doll' | 'list';
};

const SIDE_MAP = {
	left: 'right',
	right: 'left',
	bottom: 'top',
} as const;

const SlotContent = ({
	slot,
	item,
	side,
	variant,
}: {
	slot: GearSlotDef;
	item?: EquippedItem;
	side: GearSlotProps['side'];
	variant: 'doll' | 'list';
}) => {
	const showMeta = variant === 'list' || (side !== 'bottom' && Boolean(item));

	return (
		<>
			<div
				className="relative size-12 shrink-0 overflow-hidden rounded-md border bg-panel/80"
				style={{ borderColor: item?.qualityColor ?? undefined }}
			>
				{item?.icon ? (
					<Image
						src={item.icon}
						alt={item.name}
						width={48}
						height={48}
						className="size-full object-cover"
					/>
				) : (
					<span className="flex size-full items-center justify-center text-[9px] text-muted-foreground/50 uppercase">
						{slot.short.slice(0, 3)}
					</span>
				)}
			</div>

			{showMeta ? (
				<div
					className={cn(
						'min-w-0',
						variant === 'list' ? 'flex-1' : 'max-w-35',
						side === 'right' && variant === 'doll' && 'text-right',
					)}
				>
					{item ? (
						<>
							<p
								className="truncate text-sm font-medium"
								style={{ color: item.qualityColor }}
							>
								{item.name}
							</p>
							<p className="text-xs text-muted-foreground">
								{slot.label} · {item.itemLevel}
							</p>
						</>
					) : variant === 'list' ? (
						<p className="truncate text-sm text-muted-foreground/70">{slot.label}</p>
					) : null}
				</div>
			) : null}
		</>
	);
};

export const GearSlot = ({ slot, item, side, variant = 'doll' }: GearSlotProps) => {
	const rowClass = cn(
		'flex items-center gap-2',
		variant === 'list' && 'w-full rounded-lg px-1 py-1.5 hover:bg-white/[0.03]',
		side === 'right' && variant === 'doll' && 'flex-row-reverse',
		side === 'bottom' && variant === 'doll' && 'flex-col',
	);

	if (!item) {
		return (
			<div className={rowClass}>
				<SlotContent slot={slot} side={side} variant={variant} />
			</div>
		);
	}

	return (
		<PreviewCard.Root>
			<PreviewCard.Trigger
				delay={80}
				closeDelay={60}
				render={
					<button
						type="button"
						className={cn(rowClass, 'border-0 bg-transparent p-0 text-left')}
						aria-label={`${item.name}, ${slot.label}`}
					/>
				}
			>
				<SlotContent slot={slot} item={item} side={side} variant={variant} />
			</PreviewCard.Trigger>

			<PreviewCard.Portal>
				<PreviewCard.Positioner
					side={SIDE_MAP[side]}
					align="start"
					sideOffset={10}
					collisionPadding={16}
					positionMethod="fixed"
					collisionAvoidance={{
						side: 'flip',
						align: 'shift',
						fallbackAxisSide: 'end',
					}}
					className="z-50 outline-none"
				>
					<PreviewCard.Popup
						className={cn(
							'w-[min(18rem,calc(100vw-1.5rem))] origin-(--transform-origin) outline-none',
							'transition-[transform,opacity] duration-150 ease-out',
							'data-starting-style:scale-95 data-starting-style:opacity-0',
							'data-ending-style:scale-95 data-ending-style:opacity-0',
						)}
					>
						<div className="max-h-[min(70vh,36rem)] overflow-y-auto overscroll-contain">
							<ItemTooltip item={item} />
						</div>
					</PreviewCard.Popup>
				</PreviewCard.Positioner>
			</PreviewCard.Portal>
		</PreviewCard.Root>
	);
};
