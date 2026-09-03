import type { PveKeyRun } from '../model/CharacterPve';

export const formatRank = (value: number | null | undefined) =>
	!value || value <= 0 ? '-' : `#${value.toLocaleString('en-US')}`;

export const formatDuration = (ms: number) => {
	if (!ms) return '-';
	const total = Math.floor(ms / 1000);
	const m = Math.floor(total / 60);
	const s = total % 60;
	return `${m}:${String(s).padStart(2, '0')}`;
};

export const getRunTimedLabel = (run: PveKeyRun) => {
	if (run.upgrades < 0) return { label: 'Not timed', timed: false };
	if (run.upgrades === 0) return { label: 'Timed', timed: true };
	return { label: `Timed +${run.upgrades}`, timed: true };
};

export const formatRunScore = (score: number) => `${Math.round(score)} pts`;
