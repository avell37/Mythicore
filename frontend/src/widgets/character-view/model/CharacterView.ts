import { CharacterBuild } from '@/entities/character/model/CharacterTalents';
import {
	Character,
	CharacterEquipment,
	CharacterMedia,
} from '@/entities/character/model/Character';
import { WowClass } from '@/shared/lib/wow-classes';
import { LucideIcon } from 'lucide-react';

export type CharacterStatItem = {
	label: string;
	value: string;
	icon: LucideIcon;
};

export type CharacterFuturePanelProps = {
	title: string;
	hint: string;
	icon: LucideIcon;
	accent: string;
	motionReady: boolean;
	delay: number;
	className?: string;
};

export type CharacterHeroProps = {
	character: Character;
	region: string;
	accent: string;
	wowClass?: WowClass;
	media?: CharacterMedia;
};

export type CharacterProfileProps = {
	character: Character;
	region: string;
	motionReady: boolean;
	media?: CharacterMedia;
	equip?: CharacterEquipment;
	build?: CharacterBuild;
	isBuildPending?: boolean;
	isBuildError?: boolean;
};

export type CharacterStatsProps = {
	stats: CharacterStatItem[];
	accent: string;
	motionReady: boolean;
};
