'use client';

import { useEffect, useState } from 'react';

/** Flip to true after mount so framer-motion can animate without SSR mismatch. */
export function useMotionReady() {
	const [ready, setReady] = useState(false);

	useEffect(() => {
		setReady(true);
	}, []);

	return ready;
}
