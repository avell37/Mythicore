'use client';

export const CharacterViewSkeleton = () => (
	<div className="relative mx-auto w-full max-w-5xl px-5 py-10 sm:px-8 lg:px-12 lg:py-14">
		<div className="mb-8 h-4 w-16 animate-pulse rounded bg-muted/60" />
		<div className="mb-10 flex flex-col gap-6 sm:flex-row">
			<div className="size-24 animate-pulse rounded-xl bg-muted/50 sm:size-28" />
			<div className="flex-1 space-y-3 pt-2">
				<div className="h-3 w-40 animate-pulse rounded bg-muted/50" />
				<div className="h-10 w-64 max-w-full animate-pulse rounded bg-muted/60" />
				<div className="h-4 w-52 animate-pulse rounded bg-muted/40" />
			</div>
		</div>
		<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
			{Array.from({ length: 4 }).map((_, index) => (
				<div key={index} className="h-24 animate-pulse rounded-xl bg-muted/40" />
			))}
		</div>
	</div>
);
