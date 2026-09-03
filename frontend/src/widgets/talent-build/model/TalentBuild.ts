import type { CharacterBuild } from '@/entities/character';
import type { WowClass } from '@/shared/lib/wow-classes';

export type TalentBuildProps = {
	build: CharacterBuild;
	accent?: string;
	wowClass?: WowClass;
};
