'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { getFactionAccent } from '@/entities/character/lib/format';
import { getWowClassByName } from '@/shared/lib/wow-classes';
import { getCharacterStats } from '../lib/getCharacterStats';
import { CharacterHero } from './CharacterHero';
import { CharacterStats } from './CharacterStats';
import { CharacterProfileProps } from '../model/CharacterView';

export const CharacterProfile = ({ character, region, motionReady }: CharacterProfileProps) => {
	const wowClass = getWowClassByName(character.character_class.name);
	const accent = wowClass?.color ?? getFactionAccent(character.faction?.type);
	const stats = getCharacterStats(character);

	return (
		<div className="relative mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 h-64 opacity-80"
			/>

			<motion.div
				initial={{ opacity: 0, y: 14 }}
				animate={motionReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
				transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
				className="relative"
			>
				<Link
					href="/"
					className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="size-3.5" />
					Back
				</Link>

				<CharacterHero
					character={character}
					region={region}
					accent={accent}
					wowClass={wowClass}
				/>

				<CharacterStats stats={stats} accent={accent} motionReady={motionReady} />
			</motion.div>
		</div>
	);
};
