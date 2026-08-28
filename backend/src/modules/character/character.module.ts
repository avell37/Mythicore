import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { BlizzardModule } from '../blizzard/blizzard.module';
import { RaiderModule } from '../raider/raider.module';

@Module({
	imports: [BlizzardModule, RaiderModule],
	controllers: [CharacterController],
	providers: [CharacterService],
})
export class CharacterModule {}
