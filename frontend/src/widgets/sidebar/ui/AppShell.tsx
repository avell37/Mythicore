'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/shared/ui/button';
import { useAppShell } from '../hooks/useAppShell';
import { Sidebar } from './Sidebar';

export const AppShell = ({ children }: { children: React.ReactNode }) => {
	const { sidebarOpen, focusLookup, setSidebarOpen } = useAppShell();

	return (
		<div className="flex min-h-full flex-1">
			<Sidebar
				open={sidebarOpen}
				onClose={() => setSidebarOpen(false)}
				onFindCharacter={focusLookup}
			/>

			<div className="relative flex min-w-0 flex-1 flex-col">
				<header className="sticky top-0 z-30 flex items-center gap-3 border-b border-border/70 bg-background/70 px-4 py-3 backdrop-blur-md lg:hidden">
					<Button
						onClick={() => setSidebarOpen(true)}
						className="grid size-9 place-items-center border border-border bg-transparent p-0 text-foreground hover:bg-accent"
						aria-label="Open menu"
						aria-expanded={sidebarOpen}
						aria-controls="site-navigation"
					>
						<Menu className="size-4" />
					</Button>
					<span className="text-base font-semibold tracking-[-0.02em]">Mythicore</span>
				</header>

				<main className="relative flex-1">
					<div
						aria-hidden
						className="pointer-events-none absolute inset-0 texture-noise opacity-[0.035] mix-blend-overlay"
					/>
					{children}
				</main>
			</div>
		</div>
	);
};
