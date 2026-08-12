'use client';
import { useRef, useState } from 'react';

export const useAppShell = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);
	const lookupRef = useRef<HTMLElement | null>(null);

	const focusLookup = () => {
		const form = document.getElementById('character-lookup');
		if (!form) return;

		form.scrollIntoView({ behavior: 'smooth', block: 'center' });
		const nameInput = form.querySelector<HTMLInputElement>('input[placeholder="Name"]');
		nameInput?.focus();
	};

	return {
		sidebarOpen,
		lookupRef,
		focusLookup,
		setSidebarOpen,
	};
};
