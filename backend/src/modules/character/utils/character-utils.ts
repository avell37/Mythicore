import { CharacterBuild, EquippedItem, ItemStat, TalentNode } from '../types/character.types';
import { HttpException, HttpStatus } from '@nestjs/common';

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

export const stripWowMarkup = (text: string) =>
	text
		.replace(/\|A:[^|]+\|a/gi, '')
		.replace(/\|T[^|]+\|t/gi, '')
		.replace(/\|c[0-9a-f]{8}/gi, '')
		.replace(/\|r/gi, '')
		.replace(/\|n/gi, ' ')
		.replace(/\s+\|\s+/g, ' ')
		.replace(/\s{2,}/g, ' ')
		.trim();

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

			enchantments: (raw.enchantments ?? []).map((ench) => ({
				id: ench.enchantment_id,
				display: stripWowMarkup(ench.display_string ?? ''),
				slot: ench.enchantment_slot?.type,
				sourceItemId: ench?.source_item?.id,
				sourceItemName: ench?.source_item?.name,
				icon: null,
			})),

			sockets: (raw.sockets ?? []).map((sock) => ({
				type: sock.socket_type?.type,
				name: sock?.socket_type?.name,
				itemId: sock.item?.id,
				itemName: sock?.item?.name,
				display: stripWowMarkup(sock.display_string ?? ''),
				icon: null,
			})),

			set: raw.set
				? {
						name: raw.set.item_set?.name,
						equipped: raw.set.items?.filter((i) => i.is_equipped).length ?? 0,
						pieces: raw.set.items?.length ?? 0,
						effects: (raw.set.effects ?? []).map((ef) => ({
							text: stripWowMarkup(ef.display_string ?? ''),
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
	}

	return items;
};

const mapBlizzardStatus = (status: number): number => {
	if (status === 404 || status === 403) return HttpStatus.NOT_FOUND;
	if (status === 429) return HttpStatus.TOO_MANY_REQUESTS;
	if (status === 401) return HttpStatus.BAD_GATEWAY;
	if (status >= 500) return HttpStatus.BAD_GATEWAY;
	return HttpStatus.BAD_GATEWAY;
};

export const throwBlizzardError = async (response: Response, what: string): Promise<never> => {
	const text = await response.text();
	const status = mapBlizzardStatus(response.status);

	throw new HttpException(
		{
			status,
			message: `Blizzard ${what} failed. Status: ${response.status}. Error: ${text}`,
		},
		status,
	);
};

export const parseTalentTreeHref = (href?: string) => {
	if (!href) return null;

	const spec = href.match(/talent-tree\/(\d+)\/playable-specialization\/(\d+)/);
	if (spec) {
		return { treeId: Number(spec[1]), specId: Number(spec[2]) };
	}

	const hero = href.match(/talent-tree\/(\d+)\/(?:hero-talent|hero-talents|sub-tree)\/(\d+)/);
	if (hero) {
		return { treeId: Number(hero[1]), heroTreeId: Number(hero[2]) };
	}

	return null;
};

export const tooltipOf = (node, picked) => {
	if (picked?.tooltip) return picked.tooltip;

	for (const rank of node.ranks ?? []) {
		if (rank.tooltip) return rank.tooltip;
		if (rank.choice_of_tooltips?.[0]) return rank.choice_of_tooltips[0];
	}

	return node.tooltip ?? null;
};

const isHeroSized = (nodes) => Array.isArray(nodes) && nodes.length >= 6 && nodes.length <= 40;

export const nodesOfHero = (hero) => {
	if (!hero) return [];

	const named = hero.hero_talent_nodes;
	if (isHeroSized(named)) return named;

	for (const nodes of [hero.talent_nodes, hero.spec_talent_nodes, hero.class_talent_nodes]) {
		if (isHeroSized(nodes)) return nodes;
	}

	if (Array.isArray(named) && named.length) return named;
	if (Array.isArray(hero.talent_nodes) && hero.talent_nodes.length) return hero.talent_nodes;

	return [];
};

const talentIdsOf = (node): number[] => {
	const ids: number[] = [];

	for (const rank of node.ranks ?? []) {
		if (typeof rank.tooltip?.talent?.id === 'number') ids.push(rank.tooltip.talent.id);
		for (const choice of rank.choice_of_tooltips ?? []) {
			if (typeof choice.talent?.id === 'number') ids.push(choice.talent.id);
		}
	}

	return ids;
};

export const mapNode = (node, rankById): TalentNode => {
	let picked = rankById.get(node.id);
	if (!picked) {
		for (const talentId of talentIdsOf(node)) {
			picked = rankById.get(talentId);
			if (picked) break;
		}
	}
	const tip = tooltipOf(node, picked);

	return {
		id: node.id,
		name: tip?.talent?.name ?? tip?.spell_tooltip?.spell?.name ?? '',
		spellId: tip?.spell_tooltip?.spell?.id,
		description: stripWowMarkup(tip?.spell_tooltip?.description ?? ''),
		icon: null,
		rank: picked?.rank ?? 0,
		maxRank: node.ranks?.length ?? 1,
		row: node.display_row ?? 0,
		col: node.display_col ?? 0,
	};
};

export const ranksFrom = (talents) => {
	const map = new Map<number, any>();
	for (const tal of talents ?? []) {
		map.set(tal.id, tal);
		const talentId = tal.tooltip?.talent?.id;
		if (typeof talentId === 'number') map.set(talentId, tal);
	}
	return map;
};

const heroIdOf = (hero) => parseTalentTreeHref(hero.key?.href)?.heroTreeId ?? hero.id;

export const mapBuild = (picks, tree, heroTrees): CharacterBuild => {
	const loadout = picks.loadout;
	const classRanks = ranksFrom(loadout?.selected_class_talents);
	const specRanks = ranksFrom(loadout?.selected_spec_talents);
	const heroRanks = ranksFrom(loadout?.selected_hero_talents);

	const activeHeroId = picks.heroTreeId;
	const heroNodeIds = new Set(
		heroTrees.flatMap((hero) => nodesOfHero(hero).map((node) => node.id)),
	);
	const withoutHeroNodes = (nodes) =>
		(nodes ?? []).filter((node) => !heroNodeIds.has(node.id));

	const heroName = (picks.heroName ?? '').toLowerCase();
	const isActiveHero = (hero) => {
		const id = heroIdOf(hero);
		if (activeHeroId && id === activeHeroId) return true;
		if (heroName && hero.name?.toLowerCase() === heroName) return true;
		return false;
	};
	const activeHero = heroTrees.find(isActiveHero);

	return {
		spec: {
			id: picks.specId,
			name: picks.specName,
		},
		heroTree: activeHeroId || picks.heroName
			? {
					id: activeHeroId,
					name: activeHero?.name ?? picks.heroName ?? '',
				}
			: null,
		loadoutCode: loadout?.talent_loadout_code ?? null,
		classTree: {
			id: tree?.id,
			name: tree?.playable_class?.name ?? 'Class',
			active: true,
			nodes: withoutHeroNodes(tree?.class_talent_nodes).map((n) => mapNode(n, classRanks)),
		},
		specTree: {
			id: picks?.specId,
			name: tree?.playable_specialization?.name ?? picks.specName,
			active: true,
			nodes: withoutHeroNodes(tree?.spec_talent_nodes).map((n) => mapNode(n, specRanks)),
		},
		heroTrees: heroTrees.map((hero) => {
			const id = heroIdOf(hero);

			return {
				id,
				name: hero.name,
				active: isActiveHero(hero),
				nodes: nodesOfHero(hero).map((n) => mapNode(n, heroRanks)),
			};
		}),
	};
};
