'use client';

import { useMemo, useState } from 'react';
import { Flag, Search } from 'lucide-react';
import type { CharacterReputations } from '@/entities/character';
import { accentPanelGradient, accentWash } from '@/shared/lib/accent';
import { FIELD_CLASS } from '@/shared/lib/field-class';
import { cn } from '@/shared/lib/utils';
import { standingColor, standingLabel } from '../utils/standing';
import { ReputationRow } from './ReputationRow';

type CharacterReputationsPanelProps = {
	reputations: CharacterReputations;
	accent: string;
};

export const CharacterReputationsPanel = ({
	reputations,
	accent,
}: CharacterReputationsPanelProps) => {
	const [query, setQuery] = useState('');

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return reputations.reputations;

		return reputations.reputations.filter(
			(rep) =>
				rep.name.toLowerCase().includes(normalized) ||
				rep.standing.toLowerCase().includes(normalized) ||
				(rep.renownLevel != null && `renown ${rep.renownLevel}`.includes(normalized)),
		);
	}, [query, reputations.reputations]);

	const featured = reputations.reputations[0] ?? null;
	const exaltedCount = reputations.reputations.filter((rep) =>
		rep.standing.toLowerCase().includes('exalted'),
	).length;
	const renownCount = reputations.reputations.filter((rep) => rep.renownLevel != null).length;

	return (
		<div className="space-y-6">
			<section
				className="relative overflow-hidden rounded-xl border border-border bg-panel/55 p-4 sm:p-6"
				style={{
					backgroundImage: accentPanelGradient(accent, 135, 12, 58),
				}}
			>
				<div
					className="pointer-events-none absolute -top-8 right-0 size-32 rounded-full blur-3xl"
					style={{ backgroundColor: accentWash(accent, 22) }}
				/>

				<div className="relative flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
					<div className="min-w-0">
						<p className="flex items-center gap-1.5 text-[0.7rem] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
							<Flag className="size-3.5" />
							Highest standing
						</p>
						{featured ? (
							<>
								<p
									className="mt-2 truncate text-[clamp(1.5rem,4vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em]"
									style={{
										textShadow: `0 0 28px ${accentWash(accent, 35)}`,
									}}
								>
									{featured.name}
								</p>
								<p
									className="mt-1 text-sm font-medium"
									style={{ color: standingColor(featured) }}
								>
									{standingLabel(featured)}
								</p>
							</>
						) : (
							<p className="mt-2 text-lg text-muted-foreground">No reputations yet</p>
						)}
					</div>

					<div className="flex shrink-0 items-center gap-5 px-1 sm:px-4 sm:py-3">
						<div className="text-center">
							<p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Factions
							</p>
							<p className="mt-0.5 text-2xl font-semibold tracking-[-0.03em]">
								{reputations.total.toLocaleString('en-US')}
							</p>
						</div>
						<div className="text-center">
							<p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Exalted
							</p>
							<p className="mt-0.5 text-2xl font-semibold tracking-[-0.03em]">
								{exaltedCount.toLocaleString('en-US')}
							</p>
						</div>
						<div className="text-center">
							<p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Renown
							</p>
							<p className="mt-0.5 text-2xl font-semibold tracking-[-0.03em]">
								{renownCount.toLocaleString('en-US')}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="space-y-3">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<h3 className="text-sm font-medium">All factions</h3>
					<p className="text-xs text-muted-foreground">
						{filtered.length.toLocaleString('en-US')} shown
					</p>
				</div>

				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search factions…"
						autoComplete="off"
						aria-label="Search factions"
						className={cn(FIELD_CLASS, 'h-10 rounded-lg pr-3 pl-9')}
					/>
				</div>

				{reputations.total === 0 ? (
					<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
						No reputations yet.
					</p>
				) : filtered.length === 0 ? (
					<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
						No factions match your search.
					</p>
				) : (
					<div className="overflow-hidden rounded-xl border border-border bg-panel/40">
						<div className="max-h-[min(28rem,60vh)] overflow-y-auto">
							{filtered.map((rep) => (
								<ReputationRow key={`${rep.id}-${rep.name}`} rep={rep} />
							))}
						</div>
					</div>
				)}
			</section>
		</div>
	);
};
