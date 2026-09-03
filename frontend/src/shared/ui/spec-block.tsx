'use client';

import { motion } from 'framer-motion';
import { ROLE_LABEL, WowSpec } from '../lib/wow-classes';
import { cn } from '../lib/utils';
import Image from 'next/image';

type SpecBlockProps = {
	spec: WowSpec;
	accent: string;
	index: number;
	motionReady: boolean;
};

export function SpecBlock({ spec, accent, index, motionReady }: SpecBlockProps) {
	return (
		<motion.article
			initial={{ opacity: 0, y: 12 }}
			animate={motionReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 12 }}
			transition={{
				duration: 0.35,
				delay: 0.06 + index * 0.05,
				ease: [0.22, 1, 0.36, 1],
			}}
			className={cn(
				'rounded-xl border border-border bg-panel/55 p-4 sm:p-5',
				'transition-colors hover:border-primary/30 hover:bg-accent/35',
			)}
			style={{
				backgroundImage: `linear-gradient(135deg, ${accent}10, transparent 42%)`,
			}}
		>
			<div className="mb-3 flex items-center gap-3">
				<span className="relative size-11 shrink-0 overflow-hidden rounded-lg ring-1 ring-white/10">
					<Image
						src={spec.icon}
						alt=""
						aria-hidden
						width={44}
						height={44}
						className="size-full object-cover"
					/>
				</span>

				<div className="min-w-0">
					<h2 className="truncate text-lg font-semibold tracking-[-0.02em] text-foreground">
						{spec.name}
					</h2>
					<p className="text-xs font-medium tracking-[0.12em] text-muted-foreground uppercase">
						{ROLE_LABEL[spec.role]}
					</p>
				</div>
			</div>

			<p className="text-sm leading-relaxed text-muted-foreground">{spec.description}</p>
		</motion.article>
	);
}
