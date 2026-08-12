'use client';

import Image from 'next/image';
import { Crosshair } from 'lucide-react';
import { getFactionAccent } from '@/entities/character/lib/format';
import { CharacterHeroProps } from '../model/CharacterView';

export const CharacterHero = ({ character, region, accent, wowClass }: CharacterHeroProps) => {
	const factionAccent = getFactionAccent(character.faction?.type);

	return (
		<header className="mb-10 flex flex-col gap-6 sm:flex-row sm:items-start">
			<div className="relative flex size-24 shrink-0 items-center justify-center overflow-hidden rounded-xl ring-1 ring-white/10 sm:size-28">
				<div
					className="absolute inset-0 opacity-40"
					style={{
						background: `linear-gradient(145deg, ${accent}55, transparent 65%)`,
					}}
				/>
				{wowClass ? (
					<Image
						src={wowClass.icon}
						alt=""
						width={112}
						height={112}
						className="relative size-full object-cover"
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
					className="text-[clamp(2.25rem,5vw,3.5rem)] leading-none font-semibold tracking-[-0.045em]"
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
				<div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-muted-foreground">
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
