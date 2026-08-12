import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlizzardTokenResponse } from './types/blizzard.types';
import { RedisService } from 'src/core/redis/redis.service';
import { normalizeName, normalizeRealm, normalizeRegion } from 'src/shared/utils/normalize';

@Injectable()
export class BlizzardService {
	constructor(
		private readonly config: ConfigService,
		private readonly redis: RedisService,
	) {}

	async getCharacterSummary(region, realm, name) {
		const normalizedRegion = normalizeRegion(region);
		const normalizedRealm = normalizeRealm(realm);
		const normalizedName = normalizeName(name);

		const cacheKey = `char:${normalizedRegion}:${normalizedRealm}:${normalizedName}`;

		const cached = await this.redis.getJson(cacheKey);
		if (cached) return cached;

		const token = await this.getAccessToken();

		const response = await fetch(
			`https://${normalizedRegion}.api.blizzard.com/profile/wow/character/${normalizedRealm}/${encodeURIComponent(normalizedName)}?namespace=profile-${normalizedRegion}&locale=en_US`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			},
		);

		if (!response.ok) {
			const text = await response.text();
			throw new NotFoundException({
				status: 404,
				message: `Blizzard Character failed. Status: ${response.status}. Error: ${text}`,
			});
		}

		const data = await response.json();

		await this.redis.setJson(cacheKey, data, 900);

		return data;
	}

	private async getAccessToken(): Promise<string> {
		const cached = await this.redis.get('blizzard:token');

		if (cached) return cached;

		const { access_token, expires_in } = await this.fetchNewToken();

		await this.redis.set('blizzard:token', access_token, Math.max(expires_in - 60, 30));

		return access_token;
	}

	private async fetchNewToken() {
		const client_id = this.config.getOrThrow<string>('BLIZZARD_CLIENT_ID');
		const client_secret = this.config.getOrThrow<string>('BLIZZARD_CLIENT_SECRET');

		const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

		const response = await fetch('https://oauth.battle.net/token', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/x-www-form-urlencoded',
				Authorization: `Basic ${basic}`,
			},
			body: 'grant_type=client_credentials',
		});

		if (!response.ok) {
			const text = await response.text();
			throw new UnauthorizedException({
				status: 401,
				message: `Blizzard OAuth failed. Status: ${response.status}. Error: ${text}`,
			});
		}

		const data = (await response.json()) as BlizzardTokenResponse;

		return data;
	}
}
