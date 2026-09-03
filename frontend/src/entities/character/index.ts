export {
	useGetCharacterQuery,
	useGetCharacterMediaQuery,
	useGetCharacterEquipmentQuery,
	useGetCharacterTalentsQuery,
	useGetCharacterPveQuery,
	useGetCharacterTitlesQuery,
	useGetCharacterReputationsQuery,
} from './hooks/useCharacterQuery';

export { characterKeys } from './api/query-keys';
export { prefetchCharacterOverview } from './api/prefetch';

export type { Character, CharacterProps } from './model/Character';
export type { CharacterMedia } from './model/CharacterMedia';
export type {
	CharacterEquipment,
	EquippedItem,
	ItemStat,
	ItemSocket,
	ItemEnchantment,
} from './model/CharacterEquipment';
export type { CharacterTitle, CharacterTitles } from './model/CharacterTitles';
export type {
	CharacterReputation,
	CharacterReputations,
	CharacterReputationParagon,
} from './model/CharacterReputations';

export type {
	CharacterBuild,
	TalentNode,
	TalentTreeView,
	TalentChoice,
} from './model/CharacterTalents';

export type { CharacterPve, PveKeyRun, PveRaid, PveRank } from './model/CharacterPve';

export { formatLastLogin, getFactionAccent, formatNameFromParam } from './lib/format';
export { isRenderableTalent, uniqueTalents } from './lib/talents';
export { formatRank, formatDuration, formatRunScore, getRunTimedLabel } from './lib/pve';
export { getCharacterStatValues } from './lib/stats';
