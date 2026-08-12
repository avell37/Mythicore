import { Module } from '@nestjs/common';
import { BlizzardService } from './blizzard.service';
import { BlizzardController } from './blizzard.controller';

@Module({
  controllers: [BlizzardController],
  providers: [BlizzardService],
})
export class BlizzardModule {}
