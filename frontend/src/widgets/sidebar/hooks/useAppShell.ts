'use client';

import { useState } from 'react';

export const useAppShell = () => {
	const [sidebarOpen, setSidebarOpen] = useState(false);

	const focusLookup = () => {
		const form = document.getElementById('character-lookup');
		if (!form) return;

		form.scrollIntoView({ behavior: 'smooth', block: 'center' });
		const nameInput = form.querySelector<HTMLInputElement>('#character-lookup-name');
		nameInput?.focus();
	};

	return {
		sidebarOpen,
		focusLookup,
		setSidebarOpen,
	};
};
