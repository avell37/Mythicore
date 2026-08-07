import Link from 'next/link';

export default function NotFound() {
	return (
		<div className="mx-auto flex min-h-[60vh] max-w-lg flex-col justify-center px-6 py-16">
			<p className="mb-2 text-xs font-semibold tracking-[0.18em] text-primary uppercase">
				404
			</p>
			<h1 className="text-3xl font-semibold tracking-[-0.03em]">Class not found</h1>
			<p className="mt-3 text-muted-foreground">
				This class slug doesn&apos;t exist. Pick one from the sidebar.
			</p>
			<Link
				href="/"
				className="mt-6 inline-flex w-fit text-sm font-medium text-primary transition-colors hover:text-primary/80"
			>
				Back to home
			</Link>
		</div>
	);
}
