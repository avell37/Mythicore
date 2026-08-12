'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const CharacterError = ({ notFound = false }: { notFound?: boolean }) => (
	<div className="relative mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col justify-center px-5 py-12 sm:px-8 lg:px-12">
		<Link
			href="/"
			className="mb-8 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft className="size-3.5" />
			Back
		</Link>
		<p className="mb-2 text-[0.7rem] font-semibold tracking-[0.2em] text-primary uppercase">
			{notFound ? '404' : 'Error'}
		</p>
		<h1 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
			{notFound ? 'Character not found' : 'Failed to load character'}
		</h1>
		<p className="mt-3 max-w-md text-muted-foreground">
			{notFound
				? 'Check realm slug and character name, then try another lookup.'
				: 'Blizzard or the API is unavailable right now. Try again in a moment.'}
		</p>
	</div>
);
