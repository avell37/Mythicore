import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { APP_FILTER, APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { BlizzardModule } from 'src/modules/blizzard/blizzard.module';
import { CharacterModule } from 'src/modules/character/character.module';
import { FetchTimeoutFilter } from './filters/fetch-timeout.filter';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.development', '.env'],
		}),
		ThrottlerModule.forRoot({
			throttlers: [{ name: 'default', ttl: 60_000, limit: 30 }],
		}),
		BlizzardModule,
		CharacterModule,
		PrismaModule,
		RedisModule,
	],
	providers: [
		{ provide: APP_GUARD, useClass: ThrottlerGuard },
		{ provide: APP_FILTER, useClass: FetchTimeoutFilter },
	],
	exports: [PrismaModule, RedisModule],
})
export class AppModule {}
