import { Module } from '@nestjs/common';
import { RaiderService } from './raider.service';

@Module({
	providers: [RaiderService],
	exports: [RaiderService],
})
export class RaiderModule {}
