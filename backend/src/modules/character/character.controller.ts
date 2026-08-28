import { Controller, Get, Param } from '@nestjs/common';
import { CharacterService } from './character.service';

@Controller('character')
export class CharacterController {
	constructor(private readonly characterService: CharacterService) {}

	@Get(':region/:realm/:name/media')
	async getCharacterMedia(
		@Param('region') region: string,
		@Param('realm') realm: string,
		@Param('name') name: string,
	) {
		return this.characterService.getCharacterMedia(region, realm, name);
	}

	@Get(':region/:realm/:name/equipment')
	async getCharacterEquipment(
		@Param('region') region: string,
		@Param('realm') realm: string,
		@Param('name') name: string,
	) {
		return this.characterService.getCharacterEquipment(region, realm, name);
	}

	@Get(':region/:realm/:name/specializations')
	async getCharacterTalents(
		@Param('region') region: string,
		@Param('realm') realm: string,
		@Param('name') name: string,
	) {
		return this.characterService.getCharacterTalents(region, realm, name);
	}
	@Get(':region/:realm/:name/mythic')
	async getCharacterMythicStats(
		@Param('region') region: string,
		@Param('realm') realm: string,
		@Param('name') name: string,
	) {
		return this.characterService.getCharacterMythicStats(region, realm, name);
	}

	@Get(':region/:realm/:name')
	async getCharacterSummary(
		@Param('region') region: string,
		@Param('realm') realm: string,
		@Param('name') name: string,
	) {
		return this.characterService.getCharacterSummary(region, realm, name);
	}
}
