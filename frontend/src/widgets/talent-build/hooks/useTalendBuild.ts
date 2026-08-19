import { toast } from 'sonner';
import { TalentBuildProps } from '../model/TalentBuild';
import { useState } from 'react';

export const useTalendBuild = ({ build, wowClass }: TalentBuildProps) => {
	const [copied, setCopied] = useState(false);
	const spec = wowClass?.specs.find(
		(item) => item.name.toLowerCase() === build.spec.name.toLowerCase(),
	);
	const metaHref = wowClass ? `/meta/${wowClass.slug}${spec ? `?spec=${spec.slug}` : ''}` : null;
	const activeHero =
		build.heroTrees.find((tree) => tree.active) ??
		build.heroTrees.find((tree) => tree.id === build.heroTree?.id) ??
		build.heroTrees.find(
			(tree) =>
				build.heroTree?.name &&
				tree.name.toLowerCase() === build.heroTree.name.toLowerCase(),
		);

	const copyLoadout = async () => {
		if (!build.loadoutCode) return;

		try {
			await navigator.clipboard.writeText(build.loadoutCode);
			setCopied(true);
			toast.success('Talent loadout copied');
			window.setTimeout(() => setCopied(false), 1600);
		} catch {
			toast.error('Could not copy loadout');
		}
	};

	return { activeHero, copied, metaHref, spec, copyLoadout };
};
