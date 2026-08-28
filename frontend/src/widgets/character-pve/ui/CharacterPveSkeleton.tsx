'use client';

export const CharacterPveSkeleton = () => (
	<div className="space-y-4">
		<div className="h-28 animate-pulse rounded-xl bg-muted/40" />
		<div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-3">
			{Array.from({ length: 3 }).map((_, index) => (
				<div key={index} className="h-24 animate-pulse rounded-xl bg-muted/35" />
			))}
		</div>
		<div className="grid gap-4 lg:grid-cols-2">
			<div className="h-48 animate-pulse rounded-xl bg-muted/30" />
			<div className="h-48 animate-pulse rounded-xl bg-muted/30" />
		</div>
	</div>
);
