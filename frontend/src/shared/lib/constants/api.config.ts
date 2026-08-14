export const SERVER_URL = process.env.NEXT_PUBLIC_API_URL as string;

export const API_URL = {
	root: (url = '') => `${url ? url : ''}`,

	character: (url = '') => API_URL.root(`/character${url}`),
};
