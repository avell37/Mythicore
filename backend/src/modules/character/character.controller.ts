import { Controller, Get, Param } from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { CharacterService } from './character.service';
import { CharacterLookupDto } from './dto/character-lookup.dto';

@Throttle({ default: { limit: 30, ttl: 60_000 } })
@Controller('character')
export class CharacterController {
	constructor(private readonly characterService: CharacterService) {}

	@Get(':region/:realm/:name/media')
	getCharacterMedia(@Param() params: CharacterLookupDto) {
		return this.characterService.getCharacterMedia(params.region, params.realm, params.name);
	}

	@Get(':region/:realm/:name/equipment')
	getCharacterEquipment(@Param() params: CharacterLookupDto) {
		return this.characterService.getCharacterEquipment(params.region, params.realm, params.name);
	}

	@Get(':region/:realm/:name/talents')
	getCharacterTalents(@Param() params: CharacterLookupDto) {
		return this.characterService.getCharacterTalents(params.region, params.realm, params.name);
	}

	@Get(':region/:realm/:name/pve')
	getCharacterPve(@Param() params: CharacterLookupDto) {
		return this.characterService.getCharacterPve(params.region, params.realm, params.name);
	}

	@Get(':region/:realm/:name/titles')
	getCharacterTitles(@Param() params: CharacterLookupDto) {
		return this.characterService.getCharacterTitles(params.region, params.realm, params.name);
	}

	@Get(':region/:realm/:name')
	getCharacterSummary(@Param() params: CharacterLookupDto) {
		return this.characterService.getCharacterSummary(params.region, params.realm, params.name);
	}
}
