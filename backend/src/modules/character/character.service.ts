import { Injectable, NotFoundException } from '@nestjs/common';
import { RedisService } from 'src/core/redis/redis.service';
import { normalizeName, normalizeRealm, normalizeRegion } from 'src/shared/utils/normalize';
import { BlizzardService } from '../blizzard/blizzard.service';
import { mapEquipment } from './utils/map-equipment';

@Injectable()
export class CharacterService {
	constructor(
		private readonly redis: RedisService,
		private readonly blizzard: BlizzardService,
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
			const text = await response.text();
			throw new NotFoundException({
				status: 404,
				message: `Blizzard character fetch failed. Status: ${response.status}. Error: ${text}`,
			});
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
			const text = await response.text();
			throw new NotFoundException({
				status: 404,
				message: `Blizzard media fetch failed. Status: ${response.status}. Error: ${text}`,
			});
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
			const text = await response.text();
			throw new NotFoundException({
				status: 404,
				message: `Blizzard equip fetch failed. Status: ${response.status}. Error: ${text}`,
			});
		}

		const data = await response.json();
		const equipment = mapEquipment(data);

		const ids = [
			...new Set(
				Object.values(equipment)
					.map((i) => i.itemId)
					.filter(Boolean),
			),
		];

		await Promise.all(
			ids.map(async (itemId) => {
				const icon = await this.getItemIcon(normalizedRegion, itemId);
				for (const item of Object.values(equipment)) {
					if (item.itemId === itemId) item.icon = icon;
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
}
