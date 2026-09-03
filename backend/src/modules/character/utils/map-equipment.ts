import type { BlizzardEquipmentResponse, BlizzardEquippedItem } from '../../blizzard/types/blizzard.types';
import { EquippedItem, ItemStat } from '../types/character.types';
import { stripWowMarkup } from './character-utils';

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

const mapItem = (raw: BlizzardEquippedItem, slot: string): EquippedItem => {
	const quality = raw.quality?.type ?? 'COMMON';

	return {
		slot,
		itemId: raw.item?.id ?? 0,
		name: raw.name ?? '',
		itemLevel: raw.level?.value ?? 0,
		quality,
		qualityColor: QUALITY_COLORS[quality] ?? '#ffffff',
		icon: null,
		context: raw.name_description?.display_string ?? null,
		binding: raw.binding?.name ?? null,
		armor: raw.armor?.value ?? null,
		stats: (raw.stats ?? []).map(
			(st): ItemStat => ({
				type: st.type?.type ?? '',
				name: st.type?.name ?? '',
				value: st.value ?? 0,
				display: st.display?.display_string ?? `+${st.value ?? 0} ${st.type?.name ?? ''}`,
				isEquipBonus: st.is_equip_bonus,
				isNegated: st.is_negated,
			}),
		),
		enchantments: (raw.enchantments ?? []).map((ench) => ({
			id: ench.enchantment_id ?? 0,
			display: stripWowMarkup(ench.display_string ?? ''),
			slot: ench.enchantment_slot?.type ?? '',
			sourceItemId: ench.source_item?.id,
			sourceItemName: ench.source_item?.name,
			icon: null,
		})),
		sockets: (raw.sockets ?? []).map((sock) => ({
			type: sock.socket_type?.type ?? '',
			name: sock.socket_type?.name,
			itemId: sock.item?.id,
			itemName: sock.item?.name,
			display: stripWowMarkup(sock.display_string ?? ''),
			icon: null,
		})),
		set: raw.set
			? {
					name: raw.set.item_set?.name ?? '',
					equipped: raw.set.items?.filter((item) => item.is_equipped).length ?? 0,
					pieces: raw.set.items?.length ?? 0,
					effects: (raw.set.effects ?? []).map((ef) => ({
						text: stripWowMarkup(ef.display_string ?? ''),
						required: ef.required_count ?? 0,
						active: Boolean(ef.is_active),
					})),
				}
			: null,
		transmog: raw.transmog?.item
			? {
					itemId: raw.transmog.item.id ?? 0,
					name: raw.transmog.item.name ?? '',
				}
			: null,
		spells: (raw.spells ?? []).map((sp) => ({
			name: sp.spell?.name ?? '',
			description: stripWowMarkup(sp.description ?? ''),
		})),
		weapon: raw.weapon
			? {
					damage: raw.weapon.damage?.display_string ?? '',
					speed: raw.weapon.attack_speed?.display_string ?? '',
					dps: raw.weapon.dps?.display_string ?? '',
				}
			: null,
	};
};

export const mapEquipment = (data: BlizzardEquipmentResponse): Record<string, EquippedItem> => {
	const items: Record<string, EquippedItem> = {};

	for (const raw of data.equipped_items ?? []) {
		const slot = raw.slot?.type;
		if (!slot) continue;
		items[slot] = mapItem(raw, slot);
	}

	return items;
};
