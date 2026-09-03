import { isAxiosError } from 'axios';
import { dehydrate, HydrationBoundary } from '@tanstack/react-query';
import { notFound } from 'next/navigation';
import { formatNameFromParam, prefetchCharacterOverview } from '@/entities/character';
import { createQueryClient } from '@/shared/api/query-client';
import type { Metadata } from 'next';
import { CharacterPage } from '@/pages/character-page';

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ region: string; realm: string; name: string }>;
}): Promise<Metadata> => {
	const { region, realm, name } = await params;

	if (!region || !realm || !name) {
		return { title: 'Character not found · Mythicore' };
	}

	return {
		title: `${formatNameFromParam(name)} · Mythicore`,
	};
};

const CharacterRoute = async ({
	params,
}: {
	params: Promise<{ region: string; realm: string; name: string }>;
}) => {
	const { region, realm, name } = await params;
	const lookup = { region, realm, name };
	const queryClient = createQueryClient();

	try {
		await prefetchCharacterOverview(queryClient, lookup);
	} catch (error) {
		if (isAxiosError(error) && error.response?.status === 404) {
			notFound();
		}
	}

	return (
		<HydrationBoundary state={dehydrate(queryClient)}>
			<CharacterPage region={region} realm={realm} name={name} />
		</HydrationBoundary>
	);
};

export default CharacterRoute;
