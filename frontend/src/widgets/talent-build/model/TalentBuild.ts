import { CharacterBuild } from '@/entities/character/model/CharacterTalents';
import { WowClass } from '@/shared/lib/wow-classes';

export type TalentBuildProps = {
	build: CharacterBuild;
	accent?: string;
	wowClass?: WowClass;
};
