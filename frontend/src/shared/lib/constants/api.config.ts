const apiUrl = process.env.NEXT_PUBLIC_API_URL;

if (!apiUrl) {
	throw new Error('NEXT_PUBLIC_API_URL is not set');
}

export const SERVER_URL = apiUrl;

export const API_URL = {
	root: (url = '') => `${url ? url : ''}`,

	character: (url = '') => API_URL.root(`/character${url}`),
};
