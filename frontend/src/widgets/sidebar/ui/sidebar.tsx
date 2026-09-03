'use client';

import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { Search, X } from 'lucide-react';
import { useMotionReady } from '@/shared/lib/use-motion-ready';
import { WOW_CLASSES } from '@/shared/lib/wow-classes';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { SidebarProps } from '../types/sidebar.types';

const FOCUSABLE =
	'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';

export const Sidebar = ({ open, onClose, onFindCharacter }: SidebarProps) => {
	const pathname = usePathname();
	const motionReady = useMotionReady();
	const panelRef = useRef<HTMLElement>(null);

	useEffect(() => {
		if (!open) return;

		const panel = panelRef.current;
		if (!panel) return;

		const previous = document.activeElement as HTMLElement | null;
		const focusables = () => Array.from(panel.querySelectorAll<HTMLElement>(FOCUSABLE));
		focusables()[0]?.focus();

		const onKey = (event: KeyboardEvent) => {
			if (event.key === 'Escape') {
				onClose();
				return;
			}

			if (event.key !== 'Tab') return;

			const items = focusables();
			if (!items.length) return;

			const first = items[0];
			const last = items[items.length - 1];

			if (event.shiftKey && document.activeElement === first) {
				event.preventDefault();
				last.focus();
			} else if (!event.shiftKey && document.activeElement === last) {
				event.preventDefault();
				first.focus();
			}
		};

		document.addEventListener('keydown', onKey);
		return () => {
			document.removeEventListener('keydown', onKey);
			previous?.focus();
		};
	}, [open, onClose]);

	return (
		<>
			<div
				className={cn(
					'fixed inset-0 z-40 bg-ink/70 backdrop-blur-[2px] transition-opacity lg:hidden',
					open ? 'opacity-100' : 'pointer-events-none opacity-0',
				)}
				onClick={onClose}
				aria-hidden={!open}
			/>

			<aside
				ref={panelRef}
				className={cn(
					'fixed inset-y-0 left-0 z-50 flex w-70 flex-col border-r border-sidebar-border bg-sidebar/95 backdrop-blur-md transition-transform duration-300 lg:static lg:z-auto lg:translate-x-0',
					open ? 'translate-x-0' : '-translate-x-full',
				)}
				id="site-navigation"
				role={open ? 'dialog' : 'navigation'}
				aria-modal={open || undefined}
				aria-label="Site navigation"
			>
				<div className="flex items-center justify-between gap-3 px-5 pt-5 pb-4">
					<Link href="/" className="group flex min-w-0 flex-col" onClick={onClose}>
						<span className="text-[1.35rem] font-semibold tracking-[-0.03em] text-foreground transition-colors group-hover:text-primary">
							Mythicore
						</span>
						<span className="text-[0.7rem] font-medium tracking-[0.18em] text-muted-foreground uppercase">
							Meta & armory
						</span>
					</Link>
					<Button
						onClick={onClose}
						className="grid size-8 place-items-center bg-transparent p-0 text-muted-foreground hover:bg-sidebar-accent hover:text-foreground lg:hidden"
						aria-label="Close menu"
					>
						<X className="size-4" />
					</Button>
				</div>

				<div className="px-3 pb-3">
					<Button
						onClick={() => {
							onFindCharacter();
							onClose();
						}}
						className="w-full justify-start gap-2.5 bg-primary px-3 py-2.5 text-left text-primary-foreground"
					>
						<Search className="size-4 shrink-0 opacity-90" />
						Find your character
					</Button>
				</div>

				<div className="px-5 pb-2">
					<p className="text-[0.65rem] font-semibold tracking-[0.2em] text-muted-foreground uppercase">
						Classes
					</p>
				</div>

				<nav className="scrollbar-thin flex-1 overflow-y-auto px-2 pb-4">
					<ul className="flex flex-col gap-0.5">
						{WOW_CLASSES.map((wowClass, index) => {
							const href = `/meta/${wowClass.slug}`;
							const active = pathname?.startsWith(href);

							return (
								<motion.li
									key={wowClass.id}
									initial={{ opacity: 0, x: -8 }}
									animate={
										motionReady ? { opacity: 1, x: 0 } : { opacity: 0, x: -8 }
									}
									transition={{ delay: index * 0.02, duration: 0.25 }}
								>
									<Link
										href={href}
										onClick={onClose}
										className={cn(
											'group relative flex items-center gap-3 rounded-md px-2.5 py-2 text-sm transition-colors',
											active
												? 'bg-sidebar-accent text-foreground'
												: 'text-sidebar-foreground/80 hover:bg-sidebar-accent/70 hover:text-foreground',
										)}
									>
										<span
											className={cn(
												'absolute inset-y-1.5 left-0 w-0.5 rounded-full transition-opacity',
												active
													? 'opacity-100'
													: 'opacity-0 group-hover:opacity-60',
											)}
											style={{ backgroundColor: wowClass.color }}
										/>
										<span className="relative size-7 shrink-0 overflow-hidden rounded-[5px] ring-1 ring-white/10">
											<Image
												src={wowClass.icon}
												alt=""
												aria-hidden
												width={28}
												height={28}
												className="size-full object-cover"
											/>
										</span>
										<span className="font-medium tracking-[-0.01em]">
											{wowClass.name}
										</span>
									</Link>
								</motion.li>
							);
						})}
					</ul>
				</nav>

				<div className="border-t border-sidebar-border px-4 py-3">
					<p className="text-[0.7rem] leading-relaxed text-muted-foreground">
						Pick a class for meta, or look up a character by realm.
					</p>
				</div>
			</aside>
		</>
	);
};
