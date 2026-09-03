'use client';

import { RouteError } from '@/shared/ui/route-error';

export default function CharacterRouteError({
	reset,
}: {
	error: Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<RouteError
			title="Something went wrong"
			description="This character page crashed. You can try again or go back to lookup."
			onRetry={reset}
		/>
	);
}
