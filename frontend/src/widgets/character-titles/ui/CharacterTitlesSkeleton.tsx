'use client';

export const CharacterTitlesSkeleton = () => (
	<div className="space-y-6">
		<div className="h-40 animate-pulse rounded-xl bg-muted/40" />
		<div className="h-10 animate-pulse rounded-lg bg-muted/30" />
		<div className="space-y-2">
			{Array.from({ length: 8 }).map((_, index) => (
				<div key={index} className="h-12 animate-pulse rounded-lg bg-muted/25" />
			))}
		</div>
	</div>
);
