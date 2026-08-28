'use client';

import Link from 'next/link';
import { Check, Copy, ArrowRightLeft } from 'lucide-react';
import { TalentTreePanel } from './TalentTreePanel';
import { TalentBuildProps } from '../model/TalentBuild';
import { useTalendBuild } from '../hooks/useTalendBuild';

export const TalentBuild = ({ build, accent, wowClass }: TalentBuildProps) => {
	const { activeHero, copyLoadout, copied, metaHref, spec } = useTalendBuild({ build, wowClass });

	return (
		<div className="space-y-4">
			<div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
				<div>
					<p className="text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
						Talents
					</p>
					<h2 className="mt-1 text-xl font-semibold tracking-[-0.03em]">
						{build.spec.name}
						{activeHero ? (
							<span className="text-muted-foreground"> · {activeHero.name}</span>
						) : null}
					</h2>
				</div>

				<div className="flex flex-wrap items-center gap-2">
					<button
						type="button"
						onClick={copyLoadout}
						disabled={!build.loadoutCode}
						className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-panel/80 px-3 py-1.5 text-sm transition-colors hover:bg-white/[0.04] disabled:cursor-not-allowed disabled:opacity-40"
					>
						{copied ? <Check className="size-3.5" /> : <Copy className="size-3.5" />}
						{copied ? 'Copied' : 'Copy'}
					</button>

					{metaHref ? (
						<Link
							href={metaHref}
							className="inline-flex items-center gap-1.5 rounded-lg border border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							<ArrowRightLeft className="size-3.5" />
							Compare with meta
						</Link>
					) : null}
				</div>
			</div>

			<section
				className="overflow-x-auto rounded-xl border border-border bg-panel/55 p-4"
				style={{
					backgroundImage: `linear-gradient(180deg, color-mix(in oklab, ${accent} 8%, transparent), transparent 42%)`,
				}}
			>
				<div className="flex min-w-max items-start justify-center gap-10">
					<TalentTreePanel
						tree={build.classTree}
						accent={accent ?? ''}
						icon={wowClass?.icon}
					/>

					<div
						className="hidden h-full w-px self-stretch sm:block"
						style={{
							backgroundColor: `color-mix(in oklab, ${accent} 22%, transparent)`,
						}}
					/>

					{activeHero ? (
						<TalentTreePanel
							tree={activeHero}
							accent={accent ?? ''}
							centerRows
							pickedOnly
						/>
					) : (
						<div className="w-40 shrink-0" />
					)}

					<div
						className="hidden h-full w-px self-stretch sm:block"
						style={{
							backgroundColor: `color-mix(in oklab, ${accent} 22%, transparent)`,
						}}
					/>

					<TalentTreePanel
						tree={build.specTree}
						accent={accent ?? ''}
						icon={spec?.icon}
					/>
				</div>
			</section>
		</div>
	);
};
