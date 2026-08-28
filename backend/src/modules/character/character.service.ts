import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/core/redis/redis.service';
import { normalizeName, normalizeRealm, normalizeRegion } from 'src/shared/utils/normalize';
import { BlizzardService } from '../blizzard/blizzard.service';

import { RaiderService } from '../raider/raider.service';
import { mapPve } from './utils/map-pve';
import { throwBlizzardError, throwRaiderError } from './utils/http-errors';
import { mapEquipment } from './utils/map-equipment';
import { mapBuild, nodesOfHero, parseTalentTreeHref } from './utils/map-build';

@Injectable()
export class CharacterService {
	constructor(
		private readonly redis: RedisService,
		private readonly blizzard: BlizzardService,
		private readonly raider: RaiderService,
	) {}

	async getCharacterSummary(region, realm, name) {
		const normalizedRegion = normalizeRegion(region);
		const normalizedRealm = normalizeRealm(realm);
		const normalizedName = normalizeName(name);

		const cacheKey = `char:${normalizedRegion}:${normalizedRealm}:${normalizedName}`;

		const cached = await this.redis.getJson(cacheKey);
		if (cached) return cached;

		const response = await this.blizzard.fetchCharacterSummary(
			normalizedRegion,
			normalizedRealm,
			normalizedName,
		);

		if (!response.ok) {
			await throwBlizzardError(response, 'summary');
		}

		const data = await response.json();

		await this.redis.setJson(cacheKey, data, 900);

		return data;
	}

	async getCharacterMedia(region, realm, name) {
		const normalizedRegion = normalizeRegion(region);
		const normalizedRealm = normalizeRealm(realm);
		const normalizedName = normalizeName(name);

		const cacheKey = `char:media:${normalizedRegion}:${normalizedRealm}:${normalizedName}`;

		const cached = await this.redis.getJson(cacheKey);
		if (cached) return cached;

		const response = await this.blizzard.fetchCharacterMedia(
			normalizedRegion,
			normalizedRealm,
			normalizedName,
		);

		if (!response.ok) {
			await throwBlizzardError(response, 'media');
		}

		const data = await response.json();

		const media = {
			avatar: data.assets?.find((a) => a.key === 'avatar')?.value ?? null,
			inset: data.assets?.find((a) => a.key === 'inset')?.value ?? null,
			main: data.assets?.find((a) => a.key === 'main-raw')?.value ?? null,
		};

		await this.redis.setJson(cacheKey, media, 900);

		return media;
	}

	async getCharacterEquipment(region, realm, name) {
		const normalizedRegion = normalizeRegion(region);
		const normalizedRealm = normalizeRealm(realm);
		const normalizedName = normalizeName(name);

		const cacheKey = `char:equip:${normalizedRegion}:${normalizedRealm}:${normalizedName}`;

		const cached = await this.redis.getJson(cacheKey);
		if (cached) return cached;

		const response = await this.blizzard.fetchCharacterEquipment(
			normalizedRegion,
			normalizedRealm,
			normalizedName,
		);

		if (!response.ok) {
			await throwBlizzardError(response, 'equipment');
		}

		const data = await response.json();
		const equipment = mapEquipment(data);

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

		await Promise.all(
			ids.map(async (itemId) => {
				const icon = await this.getItemIcon(normalizedRegion, itemId);
				for (const item of Object.values(equipment)) {
					if (item.itemId === itemId) item.icon = icon;

					for (const socket of item.sockets) {
						if (socket.itemId === itemId) socket.icon = icon;
					}

					for (const ench of item.enchantments) {
						if (ench.sourceItemId === itemId) ench.icon = icon;
					}
				}
			}),
		);

		const missingIcons = Object.values(equipment).some((item) => !item.icon);
		const ttl = missingIcons ? 45 : 900;

		await this.redis.setJson(cacheKey, equipment, ttl);

		return equipment;
	}

	async getItemIcon(region: string, itemId: number): Promise<string | null> {
		const cacheKey = `item:icon:${region}:${itemId}`;
		const cached = await this.redis.get(cacheKey);
		if (cached) return cached;

		const res = await this.blizzard.fetchItemMedia(region, itemId);
		if (!res.ok) return null;

		const data = await res.json();
		const icon = data.assets?.find((a) => a.key === 'icon')?.value ?? null;
		if (icon) await this.redis.set(cacheKey, icon, 60 * 60 * 24 * 7);

		return icon;
	}

	async getCharacterSpecializations(region, realm, name) {
		const normalizedRegion = normalizeRegion(region);
		const normalizedRealm = normalizeRealm(realm);
		const normalizedName = normalizeName(name);

		const response = await this.blizzard.fetchCharacterSpecializations(
			normalizedRegion,
			normalizedRealm,
			normalizedName,
		);

		if (!response.ok) {
			await throwBlizzardError(response, 'specializations');
		}

		const data = await response.json();

		const specId = data.active_specialization?.id;
		if (!specId) {
			throw new NotFoundException({
				status: 404,
				message: 'Character has no active specialization',
			});
		}

		const specName = data.active_specialization?.name;
		const specBlock = data.specializations?.find((spec) => spec.specialization?.id === specId);
		const loadout =
			specBlock?.loadouts?.find((load) => load.is_active) ?? specBlock?.loadouts?.[0];

		const fromLoadout =
			parseTalentTreeHref(loadout?.selected_class_talent_tree?.key?.href) ??
			parseTalentTreeHref(loadout?.selected_spec_talent_tree?.key?.href);

		let treeId = fromLoadout?.treeId ?? null;

		if (!treeId) {
			treeId = await this.resolveTreeIdFromIndex(normalizedRegion, specId);
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

	async getCharacterTalents(region, realm, name) {
		const normalizedRegion = normalizeRegion(region);
		const normalizedRealm = normalizeRealm(realm);
		const normalizedName = normalizeName(name);

		const cacheKey = `char:build:v3:${normalizedRegion}:${normalizedRealm}:${normalizedName}`;
		const cached = await this.redis.getJson(cacheKey);
		if (cached) return cached;

		const picks = await this.getCharacterSpecializations(
			normalizedRegion,
			normalizedRealm,
			normalizedName,
		);

		const tree = picks.treeId
			? await this.getTalentTree(normalizedRegion, picks.treeId, picks.specId)
			: null;

		const heroTrees = await Promise.all(
			(tree.hero_talent_trees ?? []).map((listing) =>
				this.resolveHeroTree(normalizedRegion, picks.treeId, listing),
			),
		);

		const build = mapBuild(picks, tree, heroTrees);

		const trees = [build.classTree, build.specTree, ...build.heroTrees];
		const ids = [
			...new Set(
				trees
					.flatMap((tree) =>
						tree.nodes.flatMap((n) => [
							n.spellId,
							...(n.choices ?? []).map((choice) => choice.spellId),
						]),
					)
					.filter((id): id is number => typeof id === 'number'),
			),
		];

		await Promise.all(
			ids.map(async (spellId) => {
				const icon = await this.getSpellIcon(normalizedRegion, spellId);
				for (const tree of trees) {
					for (const node of tree.nodes) {
						if (node.spellId === spellId) node.icon = icon;
						for (const choice of node.choices ?? []) {
							if (choice.spellId === spellId) choice.icon = icon;
						}
					}
				}
			}),
		);

		const missingIcons = trees.some((tree) =>
			tree.nodes.some(
				(n) =>
					(n.spellId && !n.icon) ||
					(n.choices ?? []).some((choice) => choice.spellId && !choice.icon),
			),
		);
		const ttl = missingIcons ? 45 : 900;
		await this.redis.setJson(cacheKey, build, ttl);

		return build;
	}

	async getCharacterMythicStats(region, realm, name) {
		const normalizedRegion = normalizeRegion(region);
		const normalizedRealm = normalizeRealm(realm);
		const normalizedName = normalizeName(name);

		const cacheKey = `char:mythic:${normalizedRegion}:${normalizedRealm}:${normalizedName}`;

		const cached = await this.redis.getJson(cacheKey);
		if (cached) return cached;

		const response = await this.raider.fetchCharacterMythicStats(
			normalizedRegion,
			normalizedRealm,
			normalizedName,
		);

		if (!response.ok) {
			if (response.status === 404) {
				const empty = mapPve({});
				await this.redis.setJson(cacheKey, empty, 900);
				return empty;
			}
			await throwRaiderError(response, 'character-profile');
		}

		const data = await response.json();
		const pve = mapPve(data);

		await this.redis.setJson(cacheKey, pve, 900);

		return pve;
	}

	private async resolveTreeIdFromIndex(region: string, specId: number) {
		const cacheKey = `talent-tree-index:${region}`;
		let index = await this.redis.getJson<{
			spec_talent_trees?: { key?: { href?: string } }[];
		}>(cacheKey);

		if (!index) {
			const res = await this.blizzard.fetchTalentTreeIndex(region);
			if (!res.ok) await throwBlizzardError(res, 'talent-tree-index');
			index = await res.json();
			await this.redis.setJson(cacheKey, index, 60 * 60 * 24 * 7);
		}

		if (!index) return null;

		const match = index.spec_talent_trees?.find((tree) => {
			const parsed = parseTalentTreeHref(tree.key?.href);
			return parsed?.specId === specId;
		});

		return parseTalentTreeHref(match?.key?.href)?.treeId ?? null;
	}

	private async getTalentTree(region, treeId, specId) {
		const cacheKey = `talent-tree:${region}:${treeId}:${specId}`;
		const cached = await this.redis.getJson(cacheKey);
		if (cached) return cached;

		const res = await this.blizzard.fetchTalentTree(region, treeId, specId);
		if (!res.ok) await throwBlizzardError(res, 'talent-tree');

		const tree = await res.json();
		await this.redis.setJson(cacheKey, tree, 60 * 60 * 24 * 7);

		return tree;
	}

	private async resolveHeroTree(region, treeId, listing) {
		const parsed = parseTalentTreeHref(listing?.key?.href);
		const parentTreeId = parsed?.treeId ?? treeId;
		const ids = [...new Set([parsed?.heroTreeId, listing?.id].filter(Boolean))];

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

		return {
			...listing,
			hero_talent_nodes: nodesOfHero(listing),
		};
	}

	private async getHeroTalentTree(region, treeId, heroTreeId) {
		const cacheKey = `hero-tree:v2:${region}:${treeId}:${heroTreeId}`;
		const cached = await this.redis.getJson(cacheKey);
		if (cached) return cached;

		const res = await this.blizzard.fetchHeroTalentTree(region, treeId, heroTreeId);
		if (!res.ok) return null;

		const tree = await res.json();
		await this.redis.setJson(cacheKey, tree, 60 * 60 * 24 * 7);

		return tree;
	}

	private async getSpellIcon(region: string, spellId: number) {
		const cacheKey = `spell:icon:${region}:${spellId}`;
		const cached = await this.redis.get(cacheKey);
		if (cached) return cached;

		const res = await this.blizzard.fetchSpellMedia(region, spellId);
		if (!res.ok) return null;

		const data = await res.json();
		const icon = data.assets?.find((a) => a.key === 'icon')?.value ?? null;
		if (icon) await this.redis.set(cacheKey, icon, 60 * 60 * 24 * 7);

		return icon;
	}
}
