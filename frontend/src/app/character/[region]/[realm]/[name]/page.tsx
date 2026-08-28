import { CharacterView } from '@/widgets/character-view';
import { formatNameFromParam } from '@/entities/character/lib/format';
import type { Metadata } from 'next';

export const generateMetadata = async ({
	params,
}: {
	params: Promise<{ region: string; realm: string; name: string }>;
}): Promise<Metadata> => {
	const { region, realm, name } = await params;

	if (!region && !realm && !name) {
		return { title: 'Character not found · Mythicore' };
	}

	return {
		title: `${formatNameFromParam(name)} · Mythicore`,
	};
};

const CharacterPage = async ({
	params,
}: {
	params: Promise<{ region: string; realm: string; name: string }>;
}) => {
	const { region, realm, name } = await params;

	return <CharacterView region={region} realm={realm} name={name} />;
};

export default CharacterPage;
