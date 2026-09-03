export const BLIZZARD_MEDIA_CONCURRENCY = 6;

export const mapLimit = async <T, R>(
	items: T[],
	limit: number,
	fn: (item: T, index: number) => Promise<R>,
): Promise<R[]> => {
	const results = new Array<R>(items.length);
	let next = 0;

	const workers = Array.from({ length: Math.min(limit, items.length) || 0 }, async () => {
		while (true) {
			const index = next;
			next += 1;
			if (index >= items.length) return;
			results[index] = await fn(items[index], index);
		}
	});

	await Promise.all(workers);
	return results;
};
