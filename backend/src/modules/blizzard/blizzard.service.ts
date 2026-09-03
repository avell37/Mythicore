import { BadGatewayException, Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlizzardTokenResponse } from './types/blizzard.types';
import { RedisService } from 'src/core/redis/redis.service';
import { fetchWithTimeout } from 'src/shared/utils/fetch-with-timeout';

type BlizzardNamespace = 'profile' | 'static';

@Injectable()
export class BlizzardService {
	private readonly logger = new Logger(BlizzardService.name);
	private tokenInFlight: Promise<string> | null = null;

	constructor(
		private readonly config: ConfigService,
		private readonly redis: RedisService,
	) {}

	async fetchCharacterSummary(region: string, realm: string, name: string) {
		return this.blizzardFetch(this.characterPath(realm, name), region, 'profile');
	}

	async fetchCharacterMedia(region: string, realm: string, name: string) {
		return this.blizzardFetch(this.characterPath(realm, name, '/character-media'), region, 'profile');
	}

	async fetchCharacterEquipment(region: string, realm: string, name: string) {
		return this.blizzardFetch(this.characterPath(realm, name, '/equipment'), region, 'profile');
	}

	async fetchCharacterSpecializations(region: string, realm: string, name: string) {
		return this.blizzardFetch(
			this.characterPath(realm, name, '/specializations'),
			region,
			'profile',
		);
	}

	async fetchCharacterTitles(region: string, realm: string, name: string) {
		return this.blizzardFetch(this.characterPath(realm, name, '/titles'), region, 'profile');
	}

	async fetchItemMedia(region: string, itemId: number) {
		return this.blizzardFetch(`/data/wow/media/item/${itemId}`, region, 'static');
	}

	async fetchSpellMedia(region: string, spellId: number) {
		return this.blizzardFetch(`/data/wow/media/spell/${spellId}`, region, 'static');
	}

	async fetchTalentTree(region: string, treeId: number, specId: number) {
		return this.blizzardFetch(
			`/data/wow/talent-tree/${treeId}/playable-specialization/${specId}`,
			region,
			'static',
		);
	}

	async fetchHeroTalentTree(region: string, treeId: number, heroTreeId: number) {
		return this.blizzardFetch(
			`/data/wow/talent-tree/${treeId}/hero-talent/${heroTreeId}`,
			region,
			'static',
		);
	}

	async fetchTalentTreeIndex(region: string) {
		return this.blizzardFetch('/data/wow/talent-tree/index', region, 'static');
	}

	private characterPath(realm: string, name: string, suffix = '') {
		return `/profile/wow/character/${encodeURIComponent(realm)}/${encodeURIComponent(name)}${suffix}`;
	}

	private async blizzardFetch(path: string, region: string, namespace: BlizzardNamespace) {
		const token = await this.getAccessToken();

		return fetchWithTimeout(
			`https://${region}.api.blizzard.com${path}?namespace=${namespace}-${region}&locale=en_US`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			},
		);
	}

	private async getAccessToken(): Promise<string> {
		const cached = await this.redis.get('blizzard:token');
		if (cached) return cached;

		if (this.tokenInFlight) return this.tokenInFlight;

		this.tokenInFlight = this.refreshAccessToken().finally(() => {
			this.tokenInFlight = null;
		});

		return this.tokenInFlight;
	}

	private async refreshAccessToken(): Promise<string> {
		const stillCached = await this.redis.get('blizzard:token');
		if (stillCached) return stillCached;

		const { access_token, expires_in } = await this.fetchNewToken();
		await this.redis.set('blizzard:token', access_token, Math.max(expires_in - 60, 30));
		return access_token;
	}

	private async fetchNewToken() {
		const client_id = this.config.getOrThrow<string>('BLIZZARD_CLIENT_ID');
		const client_secret = this.config.getOrThrow<string>('BLIZZARD_CLIENT_SECRET');
		const basic = Buffer.from(`${client_id}:${client_secret}`).toString('base64');

		const response = await fetchWithTimeout(
			'https://oauth.battle.net/token',
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded',
					Authorization: `Basic ${basic}`,
				},
				body: 'grant_type=client_credentials',
			},
			15_000,
		);

		if (!response.ok) {
			const text = await response.text();
			this.logger.error(`Blizzard OAuth failed: ${response.status} ${text.slice(0, 200)}`);
			throw new BadGatewayException({
				status: 502,
				message: 'Authentication with Blizzard failed. Try again later.',
			});
		}

		return (await response.json()) as BlizzardTokenResponse;
	}
}
