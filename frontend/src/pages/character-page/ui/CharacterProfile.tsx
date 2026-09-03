'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import {
	getFactionAccent,
	type Character,
	type CharacterBuild,
	type CharacterEquipment,
	type CharacterMedia,
	type CharacterPve,
	type CharacterTitles,
} from '@/entities/character';
import { getWowClassByName } from '@/shared/lib/wow-classes';
import { ErrorBoundary } from '@/shared/ui/error-boundary';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/ui/tabs';
import { CharacterDoll } from '@/widgets/character-doll';
import { CharacterHero, CharacterStats, getCharacterStats } from '@/widgets/character-view';
import { CharacterPvePanel, CharacterPveSkeleton } from '@/widgets/character-pve';
import { CharacterTitlesPanel, CharacterTitlesSkeleton } from '@/widgets/character-titles';
import { TalentBuild, TalentBuildSkeleton } from '@/widgets/talent-build';
import { isCharacterTab, type CharacterTab } from '../model/tabs';
import { SectionCrash } from './SectionCrash';
import { UnavailableNote } from './UnavailableNote';

type CharacterProfileProps = {
	character: Character;
	region: string;
	activeTab: CharacterTab;
	onTabChange: (tab: CharacterTab) => void;
	motionReady: boolean;
	media?: CharacterMedia;
	isMediaPending?: boolean;
	isMediaError?: boolean;
	equip?: CharacterEquipment;
	isEquipPending?: boolean;
	isEquipError?: boolean;
	build?: CharacterBuild;
	isBuildPending?: boolean;
	isBuildError?: boolean;
	pve?: CharacterPve;
	isPvePending?: boolean;
	isPveError?: boolean;
	titles?: CharacterTitles;
	isTitlesPending?: boolean;
	isTitlesError?: boolean;
};

export const CharacterProfile = ({
	character,
	region,
	activeTab,
	onTabChange,
	motionReady,
	media,
	isMediaPending,
	isMediaError,
	equip,
	isEquipPending,
	isEquipError,
	build,
	isBuildPending,
	isBuildError,
	pve,
	isPvePending,
	isPveError,
	titles,
	isTitlesPending,
	isTitlesError,
}: CharacterProfileProps) => {
	const wowClass = getWowClassByName(character.character_class.name);
	const accent = wowClass?.color ?? getFactionAccent(character.faction?.type);
	const stats = getCharacterStats(character);
	const overviewLoading = isMediaPending || isEquipPending;

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

				<ErrorBoundary fallback={<SectionCrash />}>
					<CharacterHero
						character={character}
						region={region}
						accent={accent}
						wowClass={wowClass}
						media={media}
					/>
				</ErrorBoundary>

				<Tabs
					value={activeTab}
					onValueChange={(tab) => {
						if (isCharacterTab(tab)) onTabChange(tab);
					}}
					className="gap-4"
				>
					<TabsList>
						<TabsTrigger value="overview">Overview</TabsTrigger>
						<TabsTrigger value="talents">Talents</TabsTrigger>
						<TabsTrigger value="pve">PvE</TabsTrigger>
						<TabsTrigger value="titles">Titles</TabsTrigger>
					</TabsList>

					<TabsContent value="overview" className="space-y-4">
						<ErrorBoundary fallback={<SectionCrash />}>
							{overviewLoading ? (
								<div className="h-64 animate-pulse rounded-xl border border-border bg-panel/55 sm:h-80" />
							) : isEquipError || !equip ? (
								<UnavailableNote>
									Equipment is unavailable. Blizzard may be rate-limiting or the
									profile is not synced yet.
								</UnavailableNote>
							) : (
								<CharacterDoll media={media} equip={equip} />
							)}

							{!overviewLoading && isMediaError ? (
								<p className="text-xs text-muted-foreground">
									Portrait could not be loaded — showing class icon in the header.
								</p>
							) : null}

							<CharacterStats
								stats={stats}
								accent={accent}
								motionReady={motionReady}
							/>
						</ErrorBoundary>
					</TabsContent>

					<TabsContent value="talents">
						<ErrorBoundary fallback={<SectionCrash />}>
							{activeTab !== 'talents' ? null : isBuildPending ? (
								<TalentBuildSkeleton />
							) : isBuildError || !build ? (
								<UnavailableNote>
									Talent loadout is unavailable. The character may need to log out
									in-game.
								</UnavailableNote>
							) : (
								<TalentBuild build={build} accent={accent} wowClass={wowClass} />
							)}
						</ErrorBoundary>
					</TabsContent>

					<TabsContent value="pve">
						<ErrorBoundary fallback={<SectionCrash />}>
							{activeTab !== 'pve' ? null : isPvePending ? (
								<CharacterPveSkeleton />
							) : isPveError || !pve ? (
								<UnavailableNote>
									PvE data is unavailable. The character may not be indexed on
									Raider.IO yet.
								</UnavailableNote>
							) : (
								<CharacterPvePanel pve={pve} accent={accent} />
							)}
						</ErrorBoundary>
					</TabsContent>

					<TabsContent value="titles">
						<ErrorBoundary fallback={<SectionCrash />}>
							{activeTab !== 'titles' ? null : isTitlesPending ? (
								<CharacterTitlesSkeleton />
							) : isTitlesError || !titles ? (
								<UnavailableNote>
									Titles are unavailable. The character profile may be private or
									not synced yet.
								</UnavailableNote>
							) : (
								<CharacterTitlesPanel titles={titles} accent={accent} />
							)}
						</ErrorBoundary>
					</TabsContent>
				</Tabs>
			</motion.div>
		</div>
	);
};
