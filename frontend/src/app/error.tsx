'use client';

import { RouteError } from '@/shared/ui/route-error';

export default function AppError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<RouteError
			title="Something went wrong"
			description="The page crashed. Try again, or go back home."
			onRetry={reset}
		/>
	);
}
