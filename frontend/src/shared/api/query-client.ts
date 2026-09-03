import { QueryClient } from '@tanstack/react-query';

export const QUERY_STALE_TIME = 60_000;

export const createQueryClient = () =>
	new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: QUERY_STALE_TIME,
				refetchOnWindowFocus: false,
			},
		},
	});
