import { EquippedItem, ItemStat } from '../types/character.types';

const QUALITY_COLORS: Record<string, string> = {
	POOR: '#9d9d9d',
	COMMON: '#ffffff',
	UNCOMMON: '#1eff00',
	RARE: '#0070dd',
	EPIC: '#a335ee',
	LEGENDARY: '#ff8000',
	ARTIFACT: '#e6cc80',
	HEIRLOOM: '#00ccff',
};

export const mapEquipment = (data: any): Record<string, EquippedItem> => {
	const items: Record<string, EquippedItem> = {};

	for (const raw of data.equipped_items ?? []) {
		const slot = raw.slot?.type;
		if (!slot) continue;

		const quality = raw.quality?.type ?? 'COMMON';

		items[slot] = {
			slot,
			itemId: raw.item?.id,
			name: raw.name,
			itemLevel: raw.level?.value ?? 0,
			quality,
			qualityColor: QUALITY_COLORS[quality] ?? '#ffffff',
			icon: null,
			context: raw.name_description?.display_string ?? null,
			binding: raw.binding?.name ?? null,
			armor: raw.armor?.value ?? null,

			stats: (raw.stats ?? []).map((st): ItemStat => ({
				type: st.type?.type,
				name: st.type?.name,
				value: st.value,
				display: st.display?.display_string ?? `+${st.value} ${st.type?.name}`,
				isEquipBonus: st.is_equip_bonus,
				isNegated: st.is_negated,
			})),

			sockets: (raw.sockets ?? []).map((sock) => ({
				type: sock.socket_type?.type,
				itemId: sock.item?.id,
				icon: null,
			})),

			set: raw.set
				? {
						name: raw.set.item_set?.name,
						equipped: raw.set.items?.filter((i) => i.is_equipped).length ?? 0,
						pieces: raw.set.items?.length ?? 0,
						effects: (raw.set.effects ?? []).map((ef) => ({
							text: ef.display_string,
							required: ef.required_count,
							active: Boolean(ef.is_active),
						})),
					}
				: null,

			transmog: raw.transmog?.item
				? {
						itemId: raw.transmog.item.id,
						name: raw.transmog.item.name,
					}
				: null,

			spells: (raw.spells ?? []).map((sp) => ({
				name: sp.spell?.name,
				description: sp.description,
			})),

			weapon: raw.weapon
				? {
						damage: raw.weapon.damage?.display_string ?? '',
						speed: raw.weapon.attack_speed?.display_string ?? '',
						dps: raw.weapon.dps?.display_string ?? '',
					}
				: null,
		};
	}

	return items;
};
