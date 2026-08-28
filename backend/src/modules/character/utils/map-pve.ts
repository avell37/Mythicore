import { CharacterPve, PveKeyRun, PveRaid, PveRank } from '../types/character.types';

const mapRank = (raw): PveRank | null => {
	if (!raw) return null;
	const world = raw.world ?? 0;
	const region = raw.region ?? 0;
	const realm = raw.realm ?? 0;
	if (world <= 0 && region <= 0 && realm <= 0) return null;
	return { world, region, realm };
};

const mapRun = (raw): PveKeyRun => ({
	dungeon: raw.dungeon ?? '',
	shortName: raw.short_name ?? '',
	level: raw.mythic_level ?? 0,
	score: raw.score ?? 0,
	upgrades: raw.num_keystone_upgrades ?? 0,
	clearTimeMs: raw.clear_time_ms ?? 0,
	parTimeMs: raw.par_time_ms ?? 0,
	completedAt: raw.completed_at ?? null,
	url: raw.url ?? null,
});

export const mapPve = (data: any): CharacterPve => {
	const seasonBlock = data.mythic_plus_scores_by_season?.[0];
	const segment = seasonBlock?.segments?.all;
	const ranks = data.mythic_plus_ranks;

	const raids: PveRaid[] = Object.entries(data.raid_progression ?? {})
		.map(([slug, raid]: [string, any]) => ({
			slug,
			summary: raid.summary ?? '',
			totalBosses: raid.total_bosses ?? 0,
			normal: raid.normal_bosses_killed ?? 0,
			heroic: raid.heroic_bosses_killed ?? 0,
			mythic: raid.mythic_bosses_killed ?? 0,
		}))
		.filter((raid) => raid.summary || raid.totalBosses >= 6)
		.sort((a, b) => {
			if (Boolean(a.summary) !== Boolean(b.summary)) return a.summary ? -1 : 1;
			return b.totalBosses - a.totalBosses;
		});

	return {
		profileUrl: data.profile_url ?? null,
		lastCrawledAt: data.last_crawled_at ?? null,
		mythicPlus: {
			season: seasonBlock?.season ?? null,
			score: segment?.score ?? seasonBlock?.scores?.all ?? 0,
			scoreColor: segment?.color ?? '#ffffff',
			ranks: {
				overall: mapRank(ranks?.overall),
				class: mapRank(ranks?.class),
			},
			bestRuns: (data.mythic_plus_best_runs ?? []).map(mapRun),
			recentRuns: (data.mythic_plus_recent_runs ?? []).map(mapRun),
			weeklyRuns: (data.mythic_plus_weekly_highest_level_runs ?? []).map(mapRun),
		},
		raids,
	};
};
