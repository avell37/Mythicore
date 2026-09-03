const DEFAULT_TIMEOUT_MS = 10_000;

export class FetchTimeoutError extends Error {
	constructor(message = 'Upstream request timed out') {
		super(message);
		this.name = 'FetchTimeoutError';
	}
}

export async function fetchWithTimeout(
	url: string,
	init?: RequestInit,
	timeoutMs = DEFAULT_TIMEOUT_MS,
): Promise<Response> {
	try {
		return await fetch(url, {
			...init,
			signal: AbortSignal.timeout(timeoutMs),
		});
	} catch (err) {
		if (err instanceof DOMException && err.name === 'AbortError') {
			throw new FetchTimeoutError();
		}
		throw err;
	}
}
