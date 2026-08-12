'use client';

import { useMotionReady } from '@/shared/lib/use-motion-ready';
import { useRouter } from 'next/navigation';
import { FormEvent, useState } from 'react';

export const useCharacterLookup = () => {
	const router = useRouter();
	const motionReady = useMotionReady();
	const [region, setRegion] = useState('eu');
	const [realm, setRealm] = useState('');
	const [name, setName] = useState('');

	const onSubmit = (event: FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		const trimmedRealm = realm.trim().toLowerCase().replace(/\s+/g, '-');
		const trimmedName = name.trim().toLowerCase();
		if (!trimmedRealm || !trimmedName) return;

		router.push(`/character/${region}/${trimmedRealm}/${trimmedName}`);
	};

	const fieldClass =
		'h-11 w-full rounded-md border border-input bg-panel/80 px-3 text-sm text-foreground outline-none transition-[border-color,box-shadow] placeholder:text-muted-foreground/70 focus:border-primary/60 focus:shadow-[0_0_0_3px_var(--violet-glow)]';

	return {
		region,
		realm,
		name,
		motionReady,
		fieldClass,
		setRegion,
		setRealm,
		setName,
		onSubmit,
	};
};
