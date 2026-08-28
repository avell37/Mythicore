'use client';

import { isAxiosError } from 'axios';
import {
	useGetCharacterEquipmentQuery,
	useGetCharacterMediaQuery,
	useGetCharacterMythicQuery,
	useGetCharacterQuery,
	useGetCharacterTalentsQuery,
} from '@/entities/character/hooks/useCharacterQuery';
import type { CharacterProps } from '@/entities/character/model/Character';
import { useMotionReady } from '@/shared/lib/use-motion-ready';
import { CharacterError } from './CharacterError';
import { CharacterProfile } from './CharacterProfile';
import { CharacterViewSkeleton } from './CharacterViewSkeleton';

export const CharacterView = ({ region, realm, name }: CharacterProps) => {
	const motionReady = useMotionReady();
	const { data, isPending, isError, error } = useGetCharacterQuery({
		region,
		realm,
		name,
	});
	const { data: media } = useGetCharacterMediaQuery({
		region,
		realm,
		name,
	});
	const { data: equip } = useGetCharacterEquipmentQuery({
		region,
		realm,
		name,
	});
	const {
		data: build,
		isPending: isBuildPending,
		isError: isBuildError,
	} = useGetCharacterTalentsQuery({
		region,
		realm,
		name,
	});
	const {
		data: pve,
		isPending: isPvePending,
		isError: isPveError,
	} = useGetCharacterMythicQuery({
		region,
		realm,
		name,
	});

	if (isPending) {
		return <CharacterViewSkeleton />;
	}

	if (isError || !data) {
		const status = isAxiosError(error) ? error.response?.status : undefined;
		return <CharacterError notFound={status === 404} />;
	}

	return (
		<CharacterProfile
			character={data}
			region={region}
			motionReady={motionReady}
			media={media}
			equip={equip}
			build={build}
			isBuildPending={isBuildPending}
			isBuildError={isBuildError}
			pve={pve}
			isPvePending={isPvePending}
			isPveError={isPveError}
		/>
	);
};
