import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/core/redis/redis.service';
import { BlizzardService } from '../blizzard/blizzard.service';
import type {
	BlizzardHeroListing,
	BlizzardSpecializationsResponse,
	BlizzardTalentTree,
	BlizzardTalentTreeIndex,
} from '../blizzard/types/blizzard.types';
import { characterCacheKey } from './cache-keys';
import { throwBlizzardError } from './utils/http-errors';
import { nodesOfHero, parseTalentTreeHref, type TalentPicks } from './utils/map-build';

const HERO_UNAVAILABLE = { __unavailable: true } as const;
const HERO_NEGATIVE_TTL = 60 * 10;

const isUnavailable = (value: unknown): value is typeof HERO_UNAVAILABLE =>
	Boolean(value && typeof value === 'object' && '__unavailable' in value);

@Injectable()
export class TalentService {
	private readonly logger = new Logger(TalentService.name);

	constructor(
		private readonly blizzard: BlizzardService,
		private readonly redis: RedisService,
	) {}

	async getCharacterSpecializations(
		region: string,
		realm: string,
		name: string,
	): Promise<TalentPicks> {
		const response = await this.blizzard.fetchCharacterSpecializations(region, realm, name);

		if (!response.ok) {
			await throwBlizzardError(response, 'specializations');
		}

		const data = (await response.json()) as BlizzardSpecializationsResponse;
		const specId = data.active_specialization?.id;
		if (!specId) {
			throw new NotFoundException({
				status: 404,
				message: 'Character has no active specialization',
			});
		}

		const specName = data.active_specialization?.name ?? '';
		const specBlock = data.specializations?.find((spec) => spec.specialization?.id === specId);
		const loadout =
			specBlock?.loadouts?.find((load) => load.is_active) ?? specBlock?.loadouts?.[0];

		const fromLoadout =
			parseTalentTreeHref(loadout?.selected_class_talent_tree?.key?.href) ??
			parseTalentTreeHref(loadout?.selected_spec_talent_tree?.key?.href);

		let treeId = fromLoadout?.treeId ?? null;
		if (!treeId) {
			treeId = await this.resolveTreeIdFromIndex(region, specId);
		}

		const hero =
			parseTalentTreeHref(data.active_hero_talent_tree?.key?.href) ??
			parseTalentTreeHref(loadout?.selected_hero_talent_tree?.key?.href);

		return {
			specId,
			specName,
			loadout: loadout ?? null,
			treeId,
			heroTreeId: hero?.heroTreeId ?? null,
			heroName:
				data.active_hero_talent_tree?.name ??
				loadout?.selected_hero_talent_tree?.name ??
				null,
		};
	}

	async getTalentTree(
		region: string,
		treeId: number,
		specId: number,
	): Promise<BlizzardTalentTree> {
		const cacheKey = characterCacheKey.talentTree(region, treeId, specId);
		const cached = await this.redis.getJson<BlizzardTalentTree>(cacheKey);
		if (cached) return cached;

		const res = await this.blizzard.fetchTalentTree(region, treeId, specId);
		if (!res.ok) await throwBlizzardError(res, 'talent-tree');

		const tree = (await res.json()) as BlizzardTalentTree;
		await this.redis.setJson(cacheKey, tree, 60 * 60 * 24 * 7);
		return tree;
	}

	async resolveHeroTrees(
		region: string,
		treeId: number | null,
		listings: BlizzardHeroListing[],
	): Promise<BlizzardHeroListing[]> {
		return Promise.all(listings.map((listing) => this.resolveHeroTree(region, treeId, listing)));
	}

	private async resolveHeroTree(
		region: string,
		treeId: number | null,
		listing: BlizzardHeroListing,
	): Promise<BlizzardHeroListing> {
		const parsed = parseTalentTreeHref(listing?.key?.href);
		const parentTreeId = parsed?.treeId ?? treeId;
		const ids = [...new Set([parsed?.heroTreeId, listing?.id].filter(Boolean))] as number[];

		for (const heroTreeId of ids) {
			if (!parentTreeId || !heroTreeId) continue;

			const fetched = await this.getHeroTalentTree(region, parentTreeId, heroTreeId);
			const nodes = nodesOfHero(fetched);
			if (!nodes.length) continue;

			return {
				...listing,
				name: listing?.name ?? fetched?.name,
				hero_talent_nodes: nodes,
			};
		}

		const fallback = nodesOfHero(listing);
		if (!fallback.length) {
			this.logger.warn(
				`Hero tree empty after fetch: region=${region} tree=${parentTreeId} listing=${listing.id ?? listing.name}`,
			);
		}

		return {
			...listing,
			hero_talent_nodes: fallback,
		};
	}

	private async getHeroTalentTree(
		region: string,
		treeId: number,
		heroTreeId: number,
	): Promise<BlizzardHeroListing | null> {
		const cacheKey = characterCacheKey.heroTree(region, treeId, heroTreeId);
		const cached = await this.redis.getJson<BlizzardHeroListing | typeof HERO_UNAVAILABLE>(
			cacheKey,
		);
		if (isUnavailable(cached)) return null;
		if (cached) return cached;

		const res = await this.blizzard.fetchHeroTalentTree(region, treeId, heroTreeId);
		if (!res.ok) {
			this.logger.warn(`Hero tree ${treeId}/${heroTreeId} failed: ${res.status}`);
			await this.redis.setJson(cacheKey, HERO_UNAVAILABLE, HERO_NEGATIVE_TTL);
			return null;
		}

		const tree = (await res.json()) as BlizzardHeroListing;
		await this.redis.setJson(cacheKey, tree, 60 * 60 * 24 * 7);
		return tree;
	}

	private async resolveTreeIdFromIndex(region: string, specId: number): Promise<number | null> {
		const cacheKey = characterCacheKey.talentTreeIndex(region);
		let index = await this.redis.getJson<BlizzardTalentTreeIndex>(cacheKey);

		if (!index) {
			const res = await this.blizzard.fetchTalentTreeIndex(region);
			if (!res.ok) await throwBlizzardError(res, 'talent-tree-index');
			index = (await res.json()) as BlizzardTalentTreeIndex;
			await this.redis.setJson(cacheKey, index, 60 * 60 * 24 * 7);
		}

		const match = index.spec_talent_trees?.find((tree) => {
			const parsed = parseTalentTreeHref(tree.key?.href);
			return parsed?.specId === specId;
		});

		return parseTalentTreeHref(match?.key?.href)?.treeId ?? null;
	}
}
