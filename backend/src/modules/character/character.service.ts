import { Injectable } from '@nestjs/common';
import { RedisService } from 'src/core/redis/redis.service';
import { CACHE_TTL } from 'src/shared/utils/cache-ttl';
import { normalizeName, normalizeRealm, normalizeRegion } from 'src/shared/utils/normalize';
import { BlizzardService } from '../blizzard/blizzard.service';
import type {
	BlizzardCharacterSummary,
	BlizzardEquipmentResponse,
	BlizzardMediaResponse,
} from '../blizzard/types/blizzard.types';
import { RaiderService } from '../raider/raider.service';
import { characterCacheKey } from './cache-keys';
import { IconService } from './icon.service';
import { TalentService } from './talent.service';
import type {
	Character,
	CharacterBuild,
	CharacterMedia,
	CharacterPve,
	CharacterTitles,
	EquippedItem,
} from './types/character.types';
import { throwBlizzardError, throwRaiderError } from './utils/http-errors';
import { mapBuild } from './utils/map-build';
import { mapEquipment } from './utils/map-equipment';
import { mapPve } from './utils/map-pve';
import { mapSummary } from './utils/map-summary';
import { mapTitles } from './utils/map-titles';

@Injectable()
export class CharacterService {
	constructor(
		private readonly redis: RedisService,
		private readonly blizzard: BlizzardService,
		private readonly raider: RaiderService,
		private readonly icons: IconService,
		private readonly talents: TalentService,
	) {}

	async getCharacterSummary(region: string, realm: string, name: string): Promise<Character> {
		const lookup = this.normalizeLookup(region, realm, name);
		const cacheKey = characterCacheKey.summary(lookup.region, lookup.realm, lookup.name);

		const cached = await this.redis.getJson<Character>(cacheKey);
		if (cached) return cached;

		const response = await this.blizzard.fetchCharacterSummary(
			lookup.region,
			lookup.realm,
			lookup.name,
		);
		if (!response.ok) await throwBlizzardError(response, 'summary');

		const character = mapSummary((await response.json()) as BlizzardCharacterSummary);
		await this.redis.setJson(cacheKey, character, CACHE_TTL.success);
		return character;
	}

	async getCharacterMedia(region: string, realm: string, name: string): Promise<CharacterMedia> {
		const lookup = this.normalizeLookup(region, realm, name);
		const cacheKey = characterCacheKey.media(lookup.region, lookup.realm, lookup.name);

		const cached = await this.redis.getJson<CharacterMedia>(cacheKey);
		if (cached) return cached;

		const response = await this.blizzard.fetchCharacterMedia(
			lookup.region,
			lookup.realm,
			lookup.name,
		);
		if (!response.ok) await throwBlizzardError(response, 'media');

		const data = (await response.json()) as BlizzardMediaResponse;
		const media: CharacterMedia = {
			avatar: data.assets?.find((asset) => asset.key === 'avatar')?.value ?? null,
			inset: data.assets?.find((asset) => asset.key === 'inset')?.value ?? null,
			main: data.assets?.find((asset) => asset.key === 'main-raw')?.value ?? null,
		};

		await this.redis.setJson(cacheKey, media, CACHE_TTL.success);
		return media;
	}

	async getCharacterEquipment(
		region: string,
		realm: string,
		name: string,
	): Promise<Record<string, EquippedItem>> {
		const lookup = this.normalizeLookup(region, realm, name);
		const cacheKey = characterCacheKey.equipment(lookup.region, lookup.realm, lookup.name);

		const cached = await this.redis.getJson<Record<string, EquippedItem>>(cacheKey);
		if (cached) return cached;

		const response = await this.blizzard.fetchCharacterEquipment(
			lookup.region,
			lookup.realm,
			lookup.name,
		);
		if (!response.ok) await throwBlizzardError(response, 'equipment');

		const equipment = mapEquipment((await response.json()) as BlizzardEquipmentResponse);
		const ids = [
			...new Set(
				Object.values(equipment)
					.flatMap((item) => [
						item.itemId,
						...item.sockets.map((sock) => sock.itemId),
						...item.enchantments.map((ench) => ench.sourceItemId),
					])
					.filter((id): id is number => typeof id === 'number'),
			),
		];

		const icons = await this.icons.loadItemIcons(lookup.region, ids);
		this.icons.applyEquipmentIcons(equipment, icons);

		const missingIcons = Object.values(equipment).some((item) => !item.icon);
		await this.redis.setJson(
			cacheKey,
			equipment,
			missingIcons ? CACHE_TTL.missingIcons : CACHE_TTL.success,
		);
		return equipment;
	}

	async getCharacterTalents(
		region: string,
		realm: string,
		name: string,
	): Promise<CharacterBuild> {
		const lookup = this.normalizeLookup(region, realm, name);
		const cacheKey = characterCacheKey.build(lookup.region, lookup.realm, lookup.name);

		const cached = await this.redis.getJson<CharacterBuild>(cacheKey);
		if (cached) return cached;

		const picks = await this.talents.getCharacterSpecializations(
			lookup.region,
			lookup.realm,
			lookup.name,
		);

		const tree = picks.treeId
			? await this.talents.getTalentTree(lookup.region, picks.treeId, picks.specId)
			: null;

		const heroTrees = await this.talents.resolveHeroTrees(
			lookup.region,
			picks.treeId,
			tree?.hero_talent_trees ?? [],
		);

		const build = mapBuild(picks, tree, heroTrees);
		const trees = [build.classTree, build.specTree, ...build.heroTrees];
		const ids = [
			...new Set(
				trees
					.flatMap((talentTree) =>
						talentTree.nodes.flatMap((node) => [
							node.spellId,
							...(node.choices ?? []).map((choice) => choice.spellId),
						]),
					)
					.filter((id): id is number => typeof id === 'number'),
			),
		];

		const icons = await this.icons.loadSpellIcons(lookup.region, ids);
		this.icons.applyTalentIcons(trees, icons);

		const missingIcons = trees.some((talentTree) =>
			talentTree.nodes.some(
				(node) =>
					(node.spellId && !node.icon) ||
					(node.choices ?? []).some((choice) => choice.spellId && !choice.icon),
			),
		);
		await this.redis.setJson(
			cacheKey,
			build,
			missingIcons ? CACHE_TTL.missingIcons : CACHE_TTL.success,
		);
		return build;
	}

	async getCharacterPve(region: string, realm: string, name: string): Promise<CharacterPve> {
		const lookup = this.normalizeLookup(region, realm, name);
		const cacheKey = characterCacheKey.pve(lookup.region, lookup.realm, lookup.name);

		const cached = await this.redis.getJson<CharacterPve>(cacheKey);
		if (cached) return cached;

		const response = await this.raider.fetchCharacterPve(
			lookup.region,
			lookup.realm,
			lookup.name,
		);

		if (!response.ok) {
			if (response.status === 404) {
				const empty = mapPve({});
				await this.redis.setJson(cacheKey, empty, CACHE_TTL.notFound);
				return empty;
			}
			await throwRaiderError(response, 'character-profile');
		}

		const pve = mapPve(await response.json());
		await this.redis.setJson(cacheKey, pve, CACHE_TTL.success);
		return pve;
	}

	async getCharacterTitles(
		region: string,
		realm: string,
		name: string,
	): Promise<CharacterTitles> {
		const lookup = this.normalizeLookup(region, realm, name);
		const cacheKey = characterCacheKey.titles(lookup.region, lookup.realm, lookup.name);

		const cached = await this.redis.getJson<CharacterTitles>(cacheKey);
		if (cached) return cached;

		const response = await this.blizzard.fetchCharacterTitles(
			lookup.region,
			lookup.realm,
			lookup.name,
		);

		if (!response.ok) {
			if (response.status === 404) {
				const empty = mapTitles({});
				await this.redis.setJson(cacheKey, empty, CACHE_TTL.notFound);
				return empty;
			}
			await throwBlizzardError(response, 'character-titles');
		}

		const titles = mapTitles(await response.json());
		await this.redis.setJson(cacheKey, titles, CACHE_TTL.success);
		return titles;
	}

	private normalizeLookup(region: string, realm: string, name: string) {
		return {
			region: normalizeRegion(region),
			realm: normalizeRealm(realm),
			name: normalizeName(name),
		};
	}
}
