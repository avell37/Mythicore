import { CharacterPve, PveKeyRun, PveRaid, PveRank } from '../types/character.types';

export const MIN_RAID_BOSSES_TO_SHOW = 6;

type RaiderRank = {
	world?: number;
	region?: number;
	realm?: number;
};

type RaiderRun = {
	dungeon?: string;
	short_name?: string;
	mythic_level?: number;
	score?: number;
	num_keystone_upgrades?: number;
	clear_time_ms?: number;
	par_time_ms?: number;
	completed_at?: string | null;
};

type RaiderSeason = {
	season?: string;
	scores?: { all?: number };
	segments?: { all?: { score?: number; color?: string } };
};

type RaiderRaid = {
	summary?: string;
	total_bosses?: number;
	normal_bosses_killed?: number;
	heroic_bosses_killed?: number;
	mythic_bosses_killed?: number;
};

export type RaiderProfile = {
	profile_url?: string;
	last_crawled_at?: string;
	mythic_plus_scores_by_season?: RaiderSeason[];
	mythic_plus_ranks?: {
		overall?: RaiderRank;
		class?: RaiderRank;
	};
	mythic_plus_best_runs?: RaiderRun[];
	mythic_plus_recent_runs?: RaiderRun[];
	raid_progression?: Record<string, RaiderRaid>;
};

const mapRank = (raw?: RaiderRank): PveRank | null => {
	if (!raw) return null;
	const world = raw.world ?? 0;
	const region = raw.region ?? 0;
	const realm = raw.realm ?? 0;
	if (world <= 0 && region <= 0 && realm <= 0) return null;
	return { world, region, realm };
};

const mapRun = (raw: RaiderRun): PveKeyRun => ({
	dungeon: raw.dungeon ?? '',
	shortName: raw.short_name ?? '',
	level: raw.mythic_level ?? 0,
	score: raw.score ?? 0,
	upgrades: raw.num_keystone_upgrades ?? 0,
	clearTimeMs: raw.clear_time_ms ?? 0,
	parTimeMs: raw.par_time_ms ?? 0,
	completedAt: raw.completed_at ?? null,
});

const currentSeason = (seasons: RaiderSeason[] = []) =>
	seasons.find((season) => String(season.season ?? '').toLowerCase().includes('current')) ??
	seasons[0];

export const mapPve = (data: RaiderProfile): CharacterPve => {
	const seasonBlock = currentSeason(data.mythic_plus_scores_by_season);
	const segment = seasonBlock?.segments?.all;
	const ranks = data.mythic_plus_ranks;

	const raids: PveRaid[] = Object.entries(data.raid_progression ?? {})
		.map(([slug, raid]) => ({
			slug,
			summary: raid.summary ?? '',
			totalBosses: raid.total_bosses ?? 0,
			normal: raid.normal_bosses_killed ?? 0,
			heroic: raid.heroic_bosses_killed ?? 0,
			mythic: raid.mythic_bosses_killed ?? 0,
		}))
		.filter((raid) => raid.summary || raid.totalBosses >= MIN_RAID_BOSSES_TO_SHOW)
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
		},
		raids,
	};
};
