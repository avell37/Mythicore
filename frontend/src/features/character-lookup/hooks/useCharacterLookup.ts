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

	return {
		region,
		realm,
		name,
		motionReady,
		setRegion,
		setRealm,
		setName,
		onSubmit,
	};
};
