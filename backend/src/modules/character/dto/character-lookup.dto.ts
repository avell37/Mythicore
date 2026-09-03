import { Transform } from 'class-transformer';
import { IsIn, IsString, MinLength } from 'class-validator';
import { BLIZZARD_REGIONS } from 'src/shared/utils/normalize';

export class CharacterLookupDto {
	@Transform(({ value }) => String(value).trim().toLowerCase())
	@IsIn([...BLIZZARD_REGIONS])
	region!: string;

	@Transform(({ value }) => String(value))
	@IsString()
	@MinLength(2)
	realm!: string;

	@Transform(({ value }) => String(value))
	@IsString()
	@MinLength(2)
	name!: string;
}
