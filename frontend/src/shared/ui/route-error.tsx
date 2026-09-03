'use client';

import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

export const RouteError = ({
	title,
	description,
	onRetry,
}: {
	title: string;
	description: string;
	onRetry?: () => void;
}) => (
	<div className="relative mx-auto flex min-h-[60vh] w-full max-w-5xl flex-col justify-center px-5 py-12 sm:px-8 lg:px-12">
		<Link
			href="/"
			className="mb-8 inline-flex w-fit items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
		>
			<ArrowLeft className="size-3.5" />
			Back
		</Link>
		<p className="mb-2 text-[0.7rem] font-semibold tracking-[0.2em] text-primary uppercase">
			Error
		</p>
		<h1 className="text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
			{title}
		</h1>
		<p className="mt-3 max-w-md text-muted-foreground">{description}</p>
		{onRetry ? (
			<button
				type="button"
				onClick={onRetry}
				className="mt-6 inline-flex h-10 w-fit items-center rounded-lg bg-primary px-4 text-sm font-semibold text-primary-foreground transition-[filter] hover:brightness-110"
			>
				Try again
			</button>
		) : null}
	</div>
);
