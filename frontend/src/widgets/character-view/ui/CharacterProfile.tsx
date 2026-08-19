'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getFactionAccent } from '@/entities/character/lib/format';
import { getWowClassByName } from '@/shared/lib/wow-classes';
import { cn } from '@/shared/lib/utils';
import { getCharacterStats } from '../lib/getCharacterStats';
import { CharacterHero } from './CharacterHero';
import { CharacterStats } from './CharacterStats';
import { CharacterProfileProps } from '../model/CharacterView';
import { CharacterDoll } from '@/widgets/character-doll/ui/CharacterDoll';
import { TalentBuild } from '@/widgets/talent-build/ui/TalentBuild';
import { TalentBuildSkeleton } from '@/widgets/talent-build/ui/TalentBuildSkeleton';

type ProfileTab = 'overview' | 'talents';

export const CharacterProfile = ({
	character,
	region,
	motionReady,
	media,
	equip,
	build,
	isBuildPending,
	isBuildError,
}: CharacterProfileProps) => {
	const [tab, setTab] = useState<ProfileTab>('overview');
	const wowClass = getWowClassByName(character.character_class.name);
	const accent = wowClass?.color ?? getFactionAccent(character.faction?.type);
	const stats = getCharacterStats(character);

	return (
		<div className="relative mx-auto w-full max-w-6xl px-4 py-6 sm:px-8 sm:py-10 lg:px-12 lg:py-14">
			<motion.div
				initial={{ opacity: 0, y: 14 }}
				animate={motionReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
				transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
				className="relative space-y-4"
			>
				<Link
					href="/"
					className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground sm:mb-8"
				>
					<ArrowLeft className="size-3.5" />
					Back
				</Link>

				<CharacterHero
					character={character}
					region={region}
					accent={accent}
					wowClass={wowClass}
					media={media}
				/>

				<div className="flex w-fit gap-1 rounded-lg border border-border bg-panel/55 p-1">
					{(
						[
							['overview', 'Overview'],
							['talents', 'Talents'],
						] as const
					).map(([id, label]) => (
						<button
							key={id}
							type="button"
							onClick={() => setTab(id)}
							className={cn(
								'rounded-md px-3 py-1.5 text-sm transition-colors',
								tab === id
									? 'text-foreground'
									: 'text-muted-foreground hover:text-foreground',
							)}
							style={
								tab === id
									? {
											backgroundColor: `color-mix(in oklab, ${accent} 22%, transparent)`,
										}
									: undefined
							}
						>
							{label}
						</button>
					))}
				</div>

				{tab === 'overview' ? (
					<>
						<CharacterDoll media={media} equip={equip} />
						<CharacterStats stats={stats} accent={accent} motionReady={motionReady} />
					</>
				) : isBuildPending ? (
					<TalentBuildSkeleton />
				) : isBuildError || !build ? (
					<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
						Talent loadout is unavailable. The character may need to log out in-game.
					</p>
				) : (
					<TalentBuild build={build} accent={accent} wowClass={wowClass} />
				)}
			</motion.div>
		</div>
	);
};
