import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BlizzardTokenResponse } from './types/blizzard.types';
import { RedisService } from 'src/core/redis/redis.service';

@Injectable()
export class BlizzardService {
	constructor(
		private readonly config: ConfigService,
		private readonly redis: RedisService,
	) {}

	async fetchCharacterSummary(region: string, realm: string, name: string) {
		const token = await this.getAccessToken();

		const response = await fetch(
			`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${encodeURIComponent(name)}?namespace=profile-${region}&locale=en_US`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			},
		);

		return response;
	}

	async fetchCharacterMedia(region: string, realm: string, name: string) {
		const token = await this.getAccessToken();

		const response = await fetch(
			`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${encodeURIComponent(name)}/character-media?namespace=profile-${region}&locale=en_US`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			},
		);

		return response;
	}

	async fetchCharacterEquipment(region: string, realm: string, name: string) {
		const token = await this.getAccessToken();

		const response = await fetch(
			`https://${region}.api.blizzard.com/profile/wow/character/${realm}/${encodeURIComponent(name)}/equipment?namespace=profile-${region}&locale=en_US`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			},
		);

		return response;
	}

	async fetchItemMedia(region: string, itemId: number) {
		const token = await this.getAccessToken();

		const response = await fetch(
			`https://${region}.api.blizzard.com/data/wow/media/item/${itemId}?namespace=static-${region}&locale=en_US`,
			{
				method: 'GET',
				headers: { Authorization: `Bearer ${token}` },
			},
		);

		return response;
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
