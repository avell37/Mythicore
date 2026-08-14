import { Module } from '@nestjs/common';
import { CharacterService } from './character.service';
import { CharacterController } from './character.controller';
import { BlizzardModule } from '../blizzard/blizzard.module';

@Module({
	imports: [BlizzardModule],
	controllers: [CharacterController],
	providers: [CharacterService],
})
export class CharacterModule {}
