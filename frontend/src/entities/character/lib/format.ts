export const formatLastLogin = (timestamp: number): string => {
	if (!timestamp) return 'Unknown';

	return new Intl.DateTimeFormat('en-GB', {
		day: 'numeric',
		month: 'short',
		year: 'numeric',
	}).format(new Date(timestamp));
};

export const getFactionAccent = (factionType?: string): string => {
	if (factionType === 'ALLIANCE') return '#3b82f6';
	if (factionType === 'HORDE') return '#ef4444';
	return '#7b5cff';
};

export const formatNameFromParam = (name: string): string => {
	const decoded = decodeURIComponent(name).trim();
	if (!decoded) return decoded;
	return decoded.charAt(0).toUpperCase() + decoded.slice(1);
};
