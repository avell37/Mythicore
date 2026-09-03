import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { fetchWithTimeout } from 'src/shared/utils/fetch-with-timeout';

@Injectable()
export class RaiderService {
	constructor(private readonly config: ConfigService) {}

	async fetchCharacterPve(region: string, realm: string, name: string) {
		const fields = [
			'mythic_plus_scores_by_season:current',
			'mythic_plus_ranks',
			'mythic_plus_best_runs',
			'mythic_plus_recent_runs',
			'mythic_plus_weekly_highest_level_runs',
			'raid_progression',
		].join(',');
		const key = this.config.getOrThrow<string>('RAIDERIO_ACCESS_KEY');

		const url =
			`https://raider.io/api/v1/characters/profile` +
			`?region=${encodeURIComponent(region)}` +
			`&realm=${encodeURIComponent(realm)}` +
			`&name=${encodeURIComponent(name)}` +
			`&fields=${fields}`;

		return fetchWithTimeout(url, {
			headers: { Authorization: `Bearer ${key}` },
		});
	}
}
