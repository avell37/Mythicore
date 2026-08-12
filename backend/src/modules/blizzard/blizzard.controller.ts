import { Controller, Get, Param } from '@nestjs/common';
import { BlizzardService } from './blizzard.service';

@Controller('blizzard')
export class BlizzardController {
	constructor(private readonly blizzardService: BlizzardService) {}

	@Get('character/:region/:realm/:name')
	async getCharacterSummary(
		@Param('region') region: string,
		@Param('realm') realm: string,
		@Param('name') name: string,
	) {
		return this.blizzardService.getCharacterSummary(region, realm, name);
	}
}
