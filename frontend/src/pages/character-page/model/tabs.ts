export const CHARACTER_TABS = ['overview', 'talents', 'pve', 'titles'] as const;

export type CharacterTab = (typeof CHARACTER_TABS)[number];

export const DEFAULT_CHARACTER_TAB: CharacterTab = 'overview';

export const isCharacterTab = (value: string): value is CharacterTab =>
	CHARACTER_TABS.some((tab) => tab === value);
