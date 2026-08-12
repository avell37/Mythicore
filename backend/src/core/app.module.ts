import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { RedisModule } from './redis/redis.module';
import { BlizzardModule } from 'src/modules/blizzard/blizzard.module';

@Module({
	imports: [
		ConfigModule.forRoot({
			isGlobal: true,
			envFilePath: ['.env.development', '.env'],
		}),
		BlizzardModule,
		PrismaModule,
		RedisModule,
	],
	exports: [PrismaModule, RedisModule],
})
export class AppModule {}
