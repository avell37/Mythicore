'use client';

import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import { useMotionReady } from '@/shared/lib/use-motion-ready';
import { type WowClass } from '@/shared/lib/wow-classes';
import { SpecBlock } from '@/shared/ui/spec-block';

export function ClassView({ wowClass }: { wowClass: WowClass }) {
	const motionReady = useMotionReady();

	return (
		<div className="relative mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
			<motion.div
				initial={{ opacity: 0, y: 14 }}
				animate={motionReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
				transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
			>
				<Link
					href="/"
					className="mb-8 inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
				>
					<ArrowLeft className="size-3.5" />
					Back
				</Link>

				<div className="mb-10 flex items-start gap-4 sm:gap-5">
					<span
						className="relative size-14 shrink-0 overflow-hidden rounded-xl ring-1 ring-white/10 sm:size-16"
						style={{ boxShadow: `0 0 0 1px ${wowClass.color}40` }}
					>
						<Image
							src={wowClass.icon}
							alt=""
							width={64}
							height={64}
							className="size-full object-cover"
							priority
						/>
					</span>

					<div className="min-w-0 pt-0.5">
						<p className="mb-1.5 text-[0.7rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
							Class
						</p>
						<h1
							className="text-[clamp(2rem,4vw,2.75rem)] leading-none font-semibold tracking-[-0.04em]"
							style={{ color: wowClass.color }}
						>
							{wowClass.name}
						</h1>
						<p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-[0.95rem]">
							{wowClass.summary}
						</p>
					</div>
				</div>
			</motion.div>

			<div className="grid gap-3 sm:grid-cols-2">
				{wowClass.specs.map((spec, index) => (
					<SpecBlock
						key={spec.slug}
						spec={spec}
						accent={wowClass.color}
						index={index}
						motionReady={motionReady}
					/>
				))}
			</div>
		</div>
	);
}
