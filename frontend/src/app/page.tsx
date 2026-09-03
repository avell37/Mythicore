'use client';

import { motion } from 'framer-motion';
import { useMotionReady } from '@/shared/lib/use-motion-ready';
import { CharacterLookup } from '@/features/character-lookup';

export default function HomePage() {
	const motionReady = useMotionReady();

	return (
		<div className="relative mx-auto flex min-h-[calc(100vh-3.5rem)] w-full max-w-4xl flex-col justify-center px-5 py-12 sm:px-8 lg:min-h-screen lg:px-14 lg:py-16">
			<motion.div
				initial={{ opacity: 0, y: 18 }}
				animate={motionReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 18 }}
				transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
				className="max-w-2xl"
			>
				<p className="mb-4 text-[0.7rem] font-semibold tracking-[0.22em] text-primary uppercase">
					Retail · EU / US
				</p>
				<h1 className="text-[clamp(2.75rem,7vw,4.5rem)] leading-[0.92] font-semibold tracking-[-0.05em] text-foreground">
					Mythicore
				</h1>
				<p className="mt-5 max-w-md text-base leading-relaxed text-muted-foreground sm:text-[1.05rem]">
					Look up any character, or open a class in the sidebar and dig into what the top
					of the ladder is actually running.
				</p>
			</motion.div>

			<div className="mt-12">
				<CharacterLookup />
			</div>
		</div>
	);
}
