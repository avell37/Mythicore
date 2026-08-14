export type GearSlotId =
	| 'HEAD'
	| 'NECK'
	| 'SHOULDER'
	| 'BACK'
	| 'CHEST'
	| 'SHIRT'
	| 'TABARD'
	| 'WRIST'
	| 'HANDS'
	| 'WAIST'
	| 'LEGS'
	| 'FEET'
	| 'FINGER_1'
	| 'FINGER_2'
	| 'TRINKET_1'
	| 'TRINKET_2'
	| 'MAIN_HAND'
	| 'OFF_HAND'
	| 'RANGED';

export type GearSlotDef = {
	id: GearSlotId;
	label: string;
	short: string;
};

export const DOLL_LEFT: GearSlotDef[] = [
	{ id: 'HEAD', label: 'Head', short: 'Head' },
	{ id: 'NECK', label: 'Neck', short: 'Neck' },
	{ id: 'SHOULDER', label: 'Shoulder', short: 'Shoulder' },
	{ id: 'BACK', label: 'Back', short: 'Back' },
	{ id: 'CHEST', label: 'Chest', short: 'Chest' },
	{ id: 'SHIRT', label: 'Shirt', short: 'Shirt' },
	{ id: 'TABARD', label: 'Tabard', short: 'Tabard' },
	{ id: 'WRIST', label: 'Wrist', short: 'Wrist' },
];

export const DOLL_RIGHT: GearSlotDef[] = [
	{ id: 'HANDS', label: 'Hands', short: 'Hands' },
	{ id: 'WAIST', label: 'Waist', short: 'Waist' },
	{ id: 'LEGS', label: 'Legs', short: 'Legs' },
	{ id: 'FEET', label: 'Feet', short: 'Feet' },
	{ id: 'FINGER_1', label: 'Finger', short: 'Finger' },
	{ id: 'FINGER_2', label: 'Finger', short: 'Finger' },
	{ id: 'TRINKET_1', label: 'Trinket', short: 'Trinket' },
	{ id: 'TRINKET_2', label: 'Trinket', short: 'Trinket' },
];

export const DOLL_BOTTOM: GearSlotDef[] = [
	{ id: 'MAIN_HAND', label: 'Main Hand', short: 'MH' },
	{ id: 'OFF_HAND', label: 'Off Hand', short: 'OH' },
	{ id: 'RANGED', label: 'Ranged', short: 'Ranged' },
];

export const DOLL_ALL: GearSlotDef[] = [...DOLL_LEFT, ...DOLL_RIGHT, ...DOLL_BOTTOM];
