import { PveRaid } from '@/entities/character/model/CharacterMythic';
import { titleFromSlug } from '../utils/character-pve.utils';

export const CharacterRaidCard = ({ raid, accent }: { raid: PveRaid; accent: string }) => (
	<div
		className="rounded-xl border border-border bg-panel/55 p-4"
		style={{
			backgroundImage: `linear-gradient(160deg, color-mix(in oklab, ${accent} 10%, transparent), transparent 55%)`,
		}}
	>
		<p className="text-[0.65rem] font-semibold tracking-[0.14em] text-muted-foreground uppercase">
			{titleFromSlug(raid.slug)}
		</p>
		<p className="mt-2 text-2xl font-semibold tracking-[-0.03em]">
			{raid.summary || `${raid.mythic}/${raid.totalBosses} M`}
		</p>
		<p className="mt-2 text-xs text-muted-foreground">
			N {raid.normal}/{raid.totalBosses} · H {raid.heroic}/{raid.totalBosses} · M{' '}
			{raid.mythic}/{raid.totalBosses}
		</p>
	</div>
);
