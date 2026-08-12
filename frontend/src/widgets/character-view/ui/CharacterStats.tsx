'use client';

import { motion } from 'framer-motion';
import { CharacterStatsProps } from '../model/CharacterView';

export const CharacterStats = ({ stats, accent, motionReady }: CharacterStatsProps) => (
	<section className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
		{stats.map((stat, index) => (
			<motion.div
				key={stat.label}
				initial={{ opacity: 0, y: 10 }}
				animate={motionReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 10 }}
				transition={{
					duration: 0.35,
					delay: 0.05 + index * 0.04,
					ease: [0.22, 1, 0.36, 1],
				}}
				className="rounded-xl border border-border bg-panel/55 p-4"
				style={{
					backgroundImage: `linear-gradient(160deg, ${accent}0d, transparent 50%)`,
				}}
			>
				<div className="mb-3 flex items-center gap-2 text-muted-foreground">
					<stat.icon className="size-3.5" />
					<p className="text-[0.65rem] font-semibold tracking-[0.14em] uppercase">
						{stat.label}
					</p>
				</div>
				<p className="text-2xl font-semibold tracking-[-0.03em] text-foreground">
					{stat.value}
				</p>
			</motion.div>
		))}
	</section>
);
