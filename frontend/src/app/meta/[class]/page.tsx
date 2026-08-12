import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getWowClass } from '@/shared/lib/wow-classes';
import { ClassView } from '@/widgets/class-view/ClassView';

export async function generateMetadata({
	params,
}: {
	params: Promise<{ class: string }>;
}): Promise<Metadata> {
	const { class: classSlug } = await params;
	const wowClass = getWowClass(classSlug);

	if (!wowClass) {
		return { title: 'Class not found · Mythicore' };
	}

	return {
		title: `${wowClass.name} · Mythicore`,
		description: wowClass.summary,
	};
}

export default async function ClassPage({ params }: { params: Promise<{ class: string }> }) {
	const { class: classSlug } = await params;
	const wowClass = getWowClass(classSlug);

	if (!wowClass) {
		notFound();
	}

	return <ClassView wowClass={wowClass} />;
}
