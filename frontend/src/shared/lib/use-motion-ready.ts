'use client';

import { useSyncExternalStore } from 'react';

const subscribe = () => () => {};

export function useMotionReady() {
	return useSyncExternalStore(subscribe, () => true, () => false);
}
