export const accentWash = (accent: string, amount: number) =>
	`color-mix(in oklab, ${accent} ${amount}%, transparent)`;

export const accentPanelGradient = (
	accent: string,
	angle = 180,
	amount = 8,
	fadeAt = 50,
) => `linear-gradient(${angle}deg, ${accentWash(accent, amount)}, transparent ${fadeAt}%)`;
