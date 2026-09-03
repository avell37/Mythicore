'use client';

import { useMemo, useState } from 'react';
import { Search, Sparkles } from 'lucide-react';
import type { CharacterTitles } from '@/entities/character';
import { accentPanelGradient, accentWash } from '@/shared/lib/accent';
import { FIELD_CLASS } from '@/shared/lib/field-class';
import { cn } from '@/shared/lib/utils';
import { TitleRow } from './TitleRow';

type CharacterTitlesPanelProps = {
	titles: CharacterTitles;
	accent: string;
};

export const CharacterTitlesPanel = ({ titles, accent }: CharacterTitlesPanelProps) => {
	const [query, setQuery] = useState('');

	const filtered = useMemo(() => {
		const normalized = query.trim().toLowerCase();
		if (!normalized) return titles.titles;

		return titles.titles.filter(
			(title) =>
				title.displayString.toLowerCase().includes(normalized) ||
				title.name.toLowerCase().includes(normalized),
		);
	}, [query, titles.titles]);

	const active = titles.active;

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
							<Sparkles className="size-3.5" />
							Active title
						</p>
						{active ? (
							<>
								<p
									className="mt-2 text-[clamp(1.5rem,4vw,2.25rem)] leading-tight font-semibold tracking-[-0.03em] text-yellow-100"
									style={{
										textShadow: `0 0 28px ${accentWash(accent, 35)}`,
									}}
								>
									{active.name}
								</p>
							</>
						) : (
							<p className="mt-2 text-lg text-muted-foreground">No title selected</p>
						)}
					</div>

					<div className="flex shrink-0 items-center gap-3 rounded-lg text-center px-4 py-3">
						<div>
							<p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
								Earned
							</p>
							<p className="mt-0.5 text-2xl font-semibold tracking-[-0.03em]">
								{titles.total.toLocaleString('en-US')}
							</p>
						</div>
					</div>
				</div>
			</section>

			<section className="space-y-3">
				<div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
					<h3 className="text-sm font-medium">All titles</h3>
					<p className="text-xs text-muted-foreground">
						{filtered.length.toLocaleString('en-US')} shown
					</p>
				</div>

				<div className="relative">
					<Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
					<input
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search titles…"
						autoComplete="off"
						aria-label="Search titles"
						className={cn(FIELD_CLASS, 'h-10 rounded-lg pr-3 pl-9')}
					/>
				</div>

				{titles.total === 0 ? (
					<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
						No titles earned yet.
					</p>
				) : filtered.length === 0 ? (
					<p className="rounded-xl border border-border bg-panel/55 p-4 text-sm text-muted-foreground">
						No titles match your search.
					</p>
				) : (
					<div className="overflow-hidden rounded-xl border border-border bg-panel/40">
						<div className="max-h-[min(28rem,60vh)] overflow-y-auto">
							{filtered.map((title) => (
								<TitleRow key={title.id} title={title} accent={accent} />
							))}
						</div>
					</div>
				)}
			</section>
		</div>
	);
};
