'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getFactionAccent } from '@/entities/character/lib/format';
import { getWowClassByName } from '@/shared/lib/wow-classes';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { getCharacterStats } from '../lib/getCharacterStats';
import { CharacterHero } from './CharacterHero';
import { CharacterStats } from './CharacterStats';
import { CharacterProfileProps } from '../model/CharacterView';
import { CharacterDoll } from '@/widgets/character-doll/ui/CharacterDoll';
import { TalentBuild } from '@/widgets/talent-build/ui/TalentBuild';
import { TalentBuildSkeleton } from '@/widgets/talent-build/ui/TalentBuildSkeleton';
import { CharacterPvePanel } from '@/widgets/character-pve/ui/CharacterPvePanel';
import { CharacterPveSkeleton } from '@/widgets/character-pve/ui/CharacterPveSkeleton';

export const CharacterProfile = ({
	character,
	region,
	motionReady,
	media,
	equip,
	build,
	isBuildPending,
	isBuildError,
	pve,
	isPvePending,
	isPveError,
}: CharacterProfileProps) => {
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

				<Tabs defaultValue="overview" className="gap-4">
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="talents">Talents</TabsTrigger>
						<TabsTrigger value="pve">PvE</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4">
						<CharacterDoll media={media} equip={equip} />
						<CharacterStats stats={stats} accent={accent} motionReady={motionReady} />
					</TabsContent>

					<TabsContent value="talents">
						{isBuildPending ? (
							<TalentBuildSkeleton />
						) : isBuildError || !build ? (
							<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
								Talent loadout is unavailable. The character may need to log out in-game.
							</p>
						) : (
							<TalentBuild build={build} accent={accent} wowClass={wowClass} />
						)}
					</TabsContent>

					<TabsContent value="pve">
						{isPvePending ? (
							<CharacterPveSkeleton />
						) : isPveError || !pve ? (
							<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
								PvE data is unavailable. The character may not be indexed on Raider.IO yet.
							</p>
						) : (
							<CharacterPvePanel pve={pve} accent={accent} />
						)}
					</TabsContent>
				</Tabs>
			</motion.div>
		</div>
	);
};
