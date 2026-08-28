import { CharacterBuild, TalentNode } from '../types/character.types';
import { stripWowMarkup } from './character-utils';

const heroIdOf = (hero) => parseTalentTreeHref(hero.key?.href)?.heroTreeId ?? hero.id;

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

const tipMeta = (tip) => ({
	name: tip?.talent?.name ?? tip?.spell_tooltip?.spell?.name ?? '',
	spellId: tip?.spell_tooltip?.spell?.id as number | undefined,
	description: stripWowMarkup(tip?.spell_tooltip?.description ?? ''),
});

const choiceTipsOf = (node) => {
	for (const rank of node.ranks ?? []) {
		if (Array.isArray(rank.choice_of_tooltips) && rank.choice_of_tooltips.length > 1) {
			return rank.choice_of_tooltips;
		}
	}
	return [];
};

export const mapNode = (node, rankById): TalentNode => {
	let picked = rankById.get(node.id);
	if (!picked) {
		for (const talentId of talentIdsOf(node)) {
			picked = rankById.get(talentId);
			if (picked) break;
		}
	}

	const choiceTips = choiceTipsOf(node);
	const isChoice =
		node.node_type?.type === 'CHOICE' || choiceTips.length > 1;
	const tip = tooltipOf(node, picked);
	const selected = tipMeta(tip);

	const choices = isChoice
		? choiceTips.map((choiceTip) => {
				const meta = tipMeta(choiceTip);
				const selectedByTalent =
					typeof picked?.tooltip?.talent?.id === 'number' &&
					picked.tooltip.talent.id === choiceTip?.talent?.id;
				const selectedBySpell =
					typeof selected.spellId === 'number' && selected.spellId === meta.spellId;

				return {
					...meta,
					icon: null,
					selected: Boolean(picked) && (selectedByTalent || selectedBySpell),
				};
			})
		: [];

	if (choices.length && picked && !choices.some((c) => c.selected)) {
		const byName = choices.find(
			(c) => c.name && selected.name && c.name === selected.name,
		);
		if (byName) byName.selected = true;
	}

	choices.sort((a, b) => Number(b.selected) - Number(a.selected));

	return {
		id: node.id,
		name: selected.name,
		spellId: selected.spellId,
		description: selected.description,
		icon: null,
		rank: picked?.rank ?? 0,
		maxRank: isChoice ? 1 : (node.ranks?.length ?? 1),
		row: node.display_row ?? 0,
		col: node.display_col ?? 0,
		type: isChoice ? 'CHOICE' : (node.node_type?.type ?? 'ACTIVE'),
		choices,
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

export const mapBuild = (picks, tree, heroTrees): CharacterBuild => {
	const loadout = picks.loadout;
	const classRanks = ranksFrom(loadout?.selected_class_talents);
	const specRanks = ranksFrom(loadout?.selected_spec_talents);
	const heroRanks = ranksFrom(loadout?.selected_hero_talents);

	const activeHeroId = picks.heroTreeId;
	const heroNodeIds = new Set(
		heroTrees.flatMap((hero) => nodesOfHero(hero).map((node) => node.id)),
	);
	const withoutHeroNodes = (nodes) => (nodes ?? []).filter((node) => !heroNodeIds.has(node.id));

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
		heroTree:
			activeHeroId || picks.heroName
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
