'use client';

import { useEffect, useState } from 'react';

export function useMotionReady() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	return ready;
}
