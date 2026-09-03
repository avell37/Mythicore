import Image from 'next/image';
import type { CharacterEquipment, CharacterMedia } from '@/entities/character';
import { DOLL_ALL, DOLL_BOTTOM, DOLL_LEFT, DOLL_RIGHT } from '../lib/gear-slots';
import { GearSlot } from './GearSlot';

type CharacterDollProps = {
	media?: CharacterMedia;
	equip?: CharacterEquipment;
};

const Portrait = ({
	portrait,
	isMainRaw,
	className,
}: {
	portrait: string | null;
	isMainRaw: boolean;
	className?: string;
}) => {
	if (!portrait) return null;

	return (
		<div className={className}>
			<Image
				src={portrait}
				alt="Character portrait"
				fill
				sizes="(max-width: 768px) 90vw, 560px"
				quality={95}
				priority
				unoptimized={isMainRaw}
				className={
					isMainRaw
						? 'origin-bottom scale-[1.5] object-contain object-bottom'
						: 'object-cover object-[50%_18%]'
				}
			/>
		</div>
	);
};

export const CharacterDoll = ({ media, equip }: CharacterDollProps) => {
	const portrait = media?.main ?? media?.inset ?? null;
	const isMainRaw = Boolean(media?.main);

	return (
		<>
			<div className="rounded-md border p-3 py-6 md:hidden">
				<div className="relative mx-auto mb-4 h-64 w-full max-w-xs overflow-hidden">
					<Portrait
						portrait={portrait}
						isMainRaw={isMainRaw}
						className="pointer-events-none absolute inset-0 z-0"
					/>
				</div>

				<div className="flex flex-col gap-0.5">
					{DOLL_ALL.map((slot) => (
						<GearSlot
							key={slot.id}
							slot={slot}
							item={equip?.[slot.id]}
							side="left"
							variant="list"
						/>
					))}
				</div>
			</div>

			<div className="hidden rounded-md border p-4 py-6 md:block">
				<div className="relative flex items-center justify-between gap-3 sm:gap-5">
					<div className="relative flex shrink-0 flex-col gap-2">
						{DOLL_LEFT.map((slot) => (
							<GearSlot
								key={slot.id}
								slot={slot}
								item={equip?.[slot.id]}
								side="left"
							/>
						))}
					</div>

					<div className="pointer-events-none absolute top-1/2 left-1/2 z-0 h-140 w-full max-w-140 -translate-x-1/2 -translate-y-1/2 overflow-hidden">
						<Portrait
							portrait={portrait}
							isMainRaw={isMainRaw}
							className="absolute inset-0"
						/>
					</div>

					<div className="relative flex shrink-0 flex-col gap-2">
						{DOLL_RIGHT.map((slot) => (
							<GearSlot
								key={slot.id}
								slot={slot}
								item={equip?.[slot.id]}
								side="right"
							/>
						))}
					</div>
				</div>
				<div className="relative flex justify-center gap-2">
					{DOLL_BOTTOM.map((slot) => (
						<GearSlot key={slot.id} slot={slot} item={equip?.[slot.id]} side="bottom" />
					))}
				</div>
			</div>
		</>
	);
};
