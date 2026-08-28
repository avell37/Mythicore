'use client';

import Link from 'next/link';
import { ExternalLink } from 'lucide-react';
import type { CharacterPve } from '@/entities/character/model/CharacterMythic';
import { cn } from '@/shared/lib/utils';
import { formatRank } from '../utils/character-pve.utils';
import { CharacterRaidCard } from './CharacterRaidCard';
import { CharacterRunRow } from './CharacterRunRow';

type CharacterPvePanelProps = {
	pve: CharacterPve;
	accent: string;
};

export const CharacterPvePanel = ({ pve, accent }: CharacterPvePanelProps) => {
	const { mythicPlus, raids } = pve;
	const hasScore = mythicPlus.score > 0;
	const overall = mythicPlus.ranks.overall;
	const classRank = mythicPlus.ranks.class;

	return (
		<div className="space-y-6">
			<section
				className="rounded-xl border border-border bg-panel/55 p-4 sm:p-5"
				style={{
					backgroundImage: `linear-gradient(180deg, color-mix(in oklab, ${accent} 8%, transparent), transparent 50%)`,
				}}
			>
				<div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
					<div>
						<p className="text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
							Mythic+
							{mythicPlus.season ? ` · ${mythicPlus.season}` : ''}
						</p>
						<p
							className={cn('mt-1 text-4xl font-semibold tracking-[-0.04em]')}
							style={{ color: hasScore ? mythicPlus.scoreColor : undefined }}
						>
							{hasScore ? Math.round(mythicPlus.score).toLocaleString('en-US') : '—'}
						</p>
						<div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-sm text-muted-foreground">
							<span>World {formatRank(overall?.world)}</span>
							<span>Region {formatRank(overall?.region)}</span>
							<span>Realm {formatRank(overall?.realm)}</span>
							{classRank ? <span>Class {formatRank(classRank.world)}</span> : null}
						</div>
					</div>

					{pve.profileUrl ? (
						<Link
							href={pve.profileUrl}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
						>
							Raider.IO
							<ExternalLink className="size-3.5" />
						</Link>
					) : null}
				</div>
			</section>

			<section className="space-y-3">
				<h3 className="text-sm font-medium">Raid progression</h3>
				{raids.length === 0 ? (
					<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
						No raid progression indexed yet.
					</p>
				) : (
					<div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
						{raids.map((raid) => (
							<CharacterRaidCard key={raid.slug} raid={raid} accent={accent} />
						))}
					</div>
				)}
			</section>

			<section className="grid gap-6 lg:grid-cols-2">
				<div className="space-y-3">
					<h3 className="text-sm font-medium">Best runs</h3>
					{mythicPlus.bestRuns.length === 0 ? (
						<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
							No timed keys this season.
						</p>
					) : (
						<div className="space-y-2">
							{mythicPlus.bestRuns.map((run, index) => (
								<CharacterRunRow
									key={`${run.shortName}-${run.level}-${index}`}
									run={run}
								/>
							))}
						</div>
					)}
				</div>

				<div className="space-y-3">
					<h3 className="text-sm font-medium">Recent runs</h3>
					{mythicPlus.recentRuns.length === 0 ? (
						<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
							No recent runs.
						</p>
					) : (
						<div className="space-y-2">
							{mythicPlus.recentRuns.slice(0, 8).map((run, index) => (
								<CharacterRunRow
									key={`${run.completedAt ?? 'recent'}-${run.level}-${index}`}
									run={run}
								/>
							))}
						</div>
					)}
				</div>
			</section>

			{pve.lastCrawledAt ? (
				<p className="text-xs text-muted-foreground">
					Data from Raider.IO · scanned{' '}
					{new Date(pve.lastCrawledAt).toLocaleString('en-GB')}
				</p>
			) : (
				<p className="text-xs text-muted-foreground">Data from Raider.IO</p>
			)}
		</div>
	);
};
