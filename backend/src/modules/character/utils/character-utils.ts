export const stripWowMarkup = (text: string) =>
	text
		.replace(/\|A:[^|]+\|a/gi, '')
		.replace(/\|T[^|]+\|t/gi, '')
		.replace(/\|c[0-9a-f]{8}/gi, '')
		.replace(/\|r/gi, '')
		.replace(/\|n/gi, ' ')
		.replace(/\s+\|\s+/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();
