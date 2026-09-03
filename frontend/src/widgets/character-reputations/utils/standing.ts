import type { CharacterReputation } from '@/entities/character';

export const standingColor = (rep: CharacterReputation) => {
	if (rep.renownLevel != null || rep.paragon) return '#e8c96a';

	const name = rep.standing.toLowerCase();
	if (name.includes('exalted')) return '#00ffff';
	if (name.includes('revered')) return '#00ffcc';
	if (name.includes('honored')) return '#00ff88';
	if (name.includes('friendly')) return '#00ff00';
	if (name.includes('neutral')) return '#ffff00';
	if (name.includes('unfriendly')) return '#ee6622';
	if (name.includes('hostile') || name.includes('hated')) return '#ff4d4d';
	return '#9b93b5';
};

export const standingLabel = (rep: CharacterReputation) =>
	rep.renownLevel != null ? `Renown ${rep.renownLevel}` : rep.standing;

export const standingProgress = (value: number, max: number, standing = '') => {
	if (max > 0) return Math.min(100, Math.round((value / max) * 100));
	if (standing.toLowerCase().includes('exalted')) return 100;
	return 0;
};
