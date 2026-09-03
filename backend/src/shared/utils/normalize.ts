import { BadRequestException } from '@nestjs/common';

export const BLIZZARD_REGIONS = ['eu', 'us', 'kr', 'tw'] as const;

export type BlizzardRegion = (typeof BLIZZARD_REGIONS)[number];

export const isBlizzardRegion = (value: string): value is BlizzardRegion =>
	(BLIZZARD_REGIONS as readonly string[]).includes(value);

export function normalizeRegion(region: string): BlizzardRegion {
	const normalized = region.trim().toLowerCase();

	if (!isBlizzardRegion(normalized)) {
		throw new BadRequestException({
			status: 400,
			message: 'Invalid region. Use eu, us, kr, or tw.',
		});
	}

	return normalized;
}

export function normalizeRealm(realm: string): string {
	return realm.trim().toLowerCase().replace(/['’]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-');
}

export function normalizeName(name: string): string {
	return name.trim().toLowerCase();
}
