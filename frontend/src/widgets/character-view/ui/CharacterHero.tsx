'use client';

import Image from 'next/image';
import { Crosshair } from 'lucide-react';
import { getFactionAccent, type Character, type CharacterMedia } from '@/entities/character';
import type { WowClass } from '@/shared/lib/wow-classes';

export type CharacterHeroProps = {
	character: Character;
	region: string;
	accent: string;
	wowClass?: WowClass;
	media?: CharacterMedia;
};

export const CharacterHero = ({
	character,
	region,
	accent,
	wowClass,
	media,
}: CharacterHeroProps) => {
	const portrait = media?.avatar ?? media?.inset ?? null;
	const factionAccent = getFactionAccent(character.faction?.type);

	return (
		<header className="mb-6 flex flex-col gap-5 sm:mb-10 sm:flex-row sm:items-start sm:gap-6">
			<div className="relative flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10 sm:size-28">
				{portrait ? (
					<Image
						src={portrait}
						alt={`${character.name} portrait`}
						width={224}
						height={224}
						quality={92}
						className="relative size-full object-cover"
						priority
					/>
				) : wowClass ? (
					<Image
						src={wowClass.icon}
						alt={`${wowClass.name} icon`}
						width={112}
						height={112}
						className="relative size-14 object-contain"
						priority
					/>
				) : (
					<Crosshair className="relative size-8 text-primary" />
				)}
			</div>

			<div className="min-w-0 flex-1 pt-0.5">
				<p className="mb-2 text-[0.7rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
					{region.toUpperCase()} · {character.realm.name}
				</p>
				<h1
					className="text-[clamp(2rem,7vw,3.5rem)] leading-none font-semibold tracking-[-0.045em]"
					style={{ color: accent }}
				>
					{character.name}
				</h1>
				<p className="mt-3 text-base text-foreground/90 sm:text-lg">
					<span className="font-medium">{character.active_spec?.name}</span>
					<span className="text-muted-foreground"> · </span>
					<span className="font-medium">{character.character_class.name}</span>
					<span className="text-muted-foreground"> · Level {character.level}</span>
				</p>
				<div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground sm:mt-4">
					<span className="inline-flex items-center gap-2">
						<span
							className="size-1.5 rounded-full"
							style={{ backgroundColor: factionAccent }}
						/>
						{character.faction.name}
					</span>
					<span>{character.race.name}</span>
					<span>{character.gender.name}</span>
					{character.is_remix ? <span className="text-primary">Remix</span> : null}
				</div>
			</div>
		</header>
	);
};
