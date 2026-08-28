import { PveKeyRun } from '@/entities/character/model/CharacterMythic';

export const titleFromSlug = (slug: string) =>
	slug
		.split('-')
		.filter(Boolean)
		.map((part) => part.charAt(0).toUpperCase() + part.slice(1))
		.join(' ');

export const formatRank = (value: number | null | undefined) =>
	!value || value <= 0 ? '-' : `#${value.toLocaleString('en-US')}`;

export const formatDuration = (ms: number) => {
	if (!ms) return '-';
	const total = Math.floor(ms / 1000);
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${m}:${String(s).padStart(2, '0')}`;
};

export const formatUpgrades = (run: PveKeyRun) => {
	if (run.upgrades < 0) return 'OT';
	if (run.upgrades === 0) return 'Timed';
	return `+${run.upgrades}`;
};
