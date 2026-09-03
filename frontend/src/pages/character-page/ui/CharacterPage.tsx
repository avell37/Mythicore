'use client';

import { isAxiosError } from 'axios';
import { useState } from 'react';
import {
	useGetCharacterEquipmentQuery,
	useGetCharacterMediaQuery,
	useGetCharacterPveQuery,
	useGetCharacterQuery,
	useGetCharacterTalentsQuery,
	useGetCharacterTitlesQuery,
	useGetCharacterReputationsQuery,
	type CharacterProps,
} from '@/entities/character';
import { useMotionReady } from '@/shared/lib/use-motion-ready';
import { DEFAULT_CHARACTER_TAB, type CharacterTab } from '../model/tabs';
import { CharacterError } from './CharacterError';
import { CharacterPageSkeleton } from './CharacterPageSkeleton';
import { CharacterProfile } from './CharacterProfile';

export const CharacterPage = ({ region, realm, name }: CharacterProps) => {
	const motionReady = useMotionReady();
	const [activeTab, setActiveTab] = useState<CharacterTab>(DEFAULT_CHARACTER_TAB);

	const lookup = { region, realm, name };
	const { data, isPending, isError, error } = useGetCharacterQuery(lookup);
	const {
		data: media,
		isPending: isMediaPending,
		isError: isMediaError,
	} = useGetCharacterMediaQuery(lookup);
	const {
		data: equip,
		isPending: isEquipPending,
		isError: isEquipError,
	} = useGetCharacterEquipmentQuery(lookup);
	const {
		data: build,
		isPending: isBuildPending,
		isError: isBuildError,
	} = useGetCharacterTalentsQuery(lookup, activeTab === 'talents');
	const {
		data: pve,
		isPending: isPvePending,
		isError: isPveError,
	} = useGetCharacterPveQuery(lookup, activeTab === 'pve');
	const {
		data: titles,
		isPending: isTitlesPending,
		isError: isTitlesError,
	} = useGetCharacterTitlesQuery(lookup, activeTab === 'titles');
	const {
		data: reputations,
		isPending: isReputationsPending,
		isError: isReputationsError,
	} = useGetCharacterReputationsQuery(lookup, activeTab === 'reputations');

	if (isPending) {
		return <CharacterPageSkeleton />;
	}

	if (isError || !data) {
		const status = isAxiosError(error) ? error.response?.status : undefined;
		return <CharacterError notFound={status === 404} />;
	}

	return (
		<CharacterProfile
			character={data}
			region={region}
			activeTab={activeTab}
			onTabChange={setActiveTab}
			motionReady={motionReady}
			media={media}
			isMediaPending={isMediaPending}
			isMediaError={isMediaError}
			equip={equip}
			isEquipPending={isEquipPending}
			isEquipError={isEquipError}
			build={build}
			isBuildPending={isBuildPending}
			isBuildError={isBuildError}
			pve={pve}
			isPvePending={isPvePending}
			isPveError={isPveError}
			titles={titles}
			isTitlesPending={isTitlesPending}
			isTitlesError={isTitlesError}
			reputations={reputations}
			isReputationsPending={isReputationsPending}
			isReputationsError={isReputationsError}
		/>
	);
};
