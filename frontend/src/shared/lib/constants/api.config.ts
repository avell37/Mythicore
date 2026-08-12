export const SERVER_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const API_URL = {
	root: (url = '') => `${url ? url : ''}`,

	blizzard: (url = '') => API_URL.root(`/blizzard${url}`),
};
