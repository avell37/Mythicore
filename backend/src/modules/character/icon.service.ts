import { Injectable, Logger } from '@nestjs/common';
import { RedisService } from 'src/core/redis/redis.service';
import { BLIZZARD_MEDIA_CONCURRENCY, mapLimit } from 'src/shared/utils/map-limit';
import { BlizzardService } from '../blizzard/blizzard.service';
import type { BlizzardMediaResponse } from '../blizzard/types/blizzard.types';
import { characterCacheKey } from './cache-keys';
import type { EquippedItem, TalentTreeView } from './types/character.types';

@Injectable()
export class IconService {
	private readonly logger = new Logger(IconService.name);

	constructor(
		private readonly blizzard: BlizzardService,
		private readonly redis: RedisService,
	) {}

	async getItemIcon(region: string, itemId: number): Promise<string | null> {
		const cacheKey = characterCacheKey.itemIcon(region, itemId);
		const cached = await this.redis.get(cacheKey);
		if (cached) return cached;

		const res = await this.blizzard.fetchItemMedia(region, itemId);
		if (!res.ok) {
			this.logger.warn(`Item icon ${itemId} unavailable: ${res.status}`);
			return null;
		}

		const data = (await res.json()) as BlizzardMediaResponse;
		const icon = data.assets?.find((asset) => asset.key === 'icon')?.value ?? null;
		if (icon) await this.redis.set(cacheKey, icon, 60 * 60 * 24 * 7);
		return icon;
	}

	async getSpellIcon(region: string, spellId: number): Promise<string | null> {
		const cacheKey = characterCacheKey.spellIcon(region, spellId);
		const cached = await this.redis.get(cacheKey);
		if (cached) return cached;

		const res = await this.blizzard.fetchSpellMedia(region, spellId);
		if (!res.ok) {
			this.logger.warn(`Spell icon ${spellId} unavailable: ${res.status}`);
			return null;
		}

		const data = (await res.json()) as BlizzardMediaResponse;
		const icon = data.assets?.find((asset) => asset.key === 'icon')?.value ?? null;
		if (icon) await this.redis.set(cacheKey, icon, 60 * 60 * 24 * 7);
		return icon;
	}

	async loadItemIcons(region: string, ids: number[]): Promise<Map<number, string | null>> {
		const icons = new Map<number, string | null>();
		await mapLimit(ids, BLIZZARD_MEDIA_CONCURRENCY, async (itemId) => {
			icons.set(itemId, await this.getItemIcon(region, itemId));
		});
		return icons;
	}

	async loadSpellIcons(region: string, ids: number[]): Promise<Map<number, string | null>> {
		const icons = new Map<number, string | null>();
		await mapLimit(ids, BLIZZARD_MEDIA_CONCURRENCY, async (spellId) => {
			icons.set(spellId, await this.getSpellIcon(region, spellId));
		});
		return icons;
	}

	applyEquipmentIcons(
		equipment: Record<string, EquippedItem>,
		icons: Map<number, string | null>,
	) {
		for (const item of Object.values(equipment)) {
			item.icon = icons.get(item.itemId) ?? item.icon;
			for (const socket of item.sockets) {
				if (socket.itemId) socket.icon = icons.get(socket.itemId) ?? socket.icon;
			}
			for (const ench of item.enchantments) {
				if (ench.sourceItemId) ench.icon = icons.get(ench.sourceItemId) ?? ench.icon;
			}
		}
	}

	applyTalentIcons(trees: TalentTreeView[], icons: Map<number, string | null>) {
		for (const tree of trees) {
			for (const node of tree.nodes) {
				if (node.spellId) node.icon = icons.get(node.spellId) ?? node.icon;
				for (const choice of node.choices ?? []) {
					if (choice.spellId) choice.icon = icons.get(choice.spellId) ?? choice.icon;
				}
			}
		}
	}
}
