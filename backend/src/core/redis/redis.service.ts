import { Injectable, Logger, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
	private readonly logger = new Logger(RedisService.name);
	private readonly client: Redis;

	constructor(configService: ConfigService) {
		const url = configService.get<string>('REDIS_URL');

		this.client = url
			? new Redis(url, { maxRetriesPerRequest: 3, lazyConnect: true })
			: new Redis({
					host: configService.get<string>('REDIS_HOST', 'localhost'),
					port: Number(configService.get<string>('REDIS_PORT', '6379')),
					maxRetriesPerRequest: 3,
					lazyConnect: true,
				});
	}

	getClient(): Redis {
		return this.client;
	}

	async get(key: string): Promise<string | null> {
		return this.client.get(key);
	}

	async set(key: string, value: string, ttlSeconds?: number): Promise<'OK'> {
		if (ttlSeconds && ttlSeconds > 0) {
			return this.client.set(key, value, 'EX', ttlSeconds);
		}

		return this.client.set(key, value);
	}

	async del(key: string): Promise<number> {
		return this.client.del(key);
	}

	async getJson<T>(key: string): Promise<T | null> {
		const raw = await this.get(key);
		if (!raw) return null;

		try {
			return JSON.parse(raw) as T;
		} catch {
			this.logger.warn(`Failed to parse JSON cache for key: ${key}`);
			await this.del(key);
			return null;
		}
	}

	async setJson(key: string, value: unknown, ttlSeconds?: number): Promise<'OK'> {
		return this.set(key, JSON.stringify(value), ttlSeconds);
	}

	async onModuleInit() {
		await this.client.connect();
		this.logger.log('Redis connected');
	}

	async onModuleDestroy() {
		await this.client.quit();
	}
}
