export type WowRole = 'tank' | 'healer' | 'dps';

export type WowSpec = {
	name: string;
	slug: string;
	role: WowRole;
	icon: string;
	description: string;
};

export type WowClass = {
	id: string;
	name: string;
	slug: string;
	color: string;
	icon: string;
	summary: string;
	specs: WowSpec[];
};

const icon = (name: string) =>
	`https://render.worldofwarcraft.com/us/icons/56/${name}.jpg`;

export const WOW_CLASSES: WowClass[] = [
	{
		id: 'death-knight',
		name: 'Death Knight',
		slug: 'death-knight',
		color: '#C41E3A',
		icon: icon('classicon_deathknight'),
		summary:
			'Former champions of the Scourge who bend death, frost, and undeath to their will.',
		specs: [
			{
				name: 'Blood',
				slug: 'blood',
				role: 'tank',
				icon: icon('spell_deathknight_bloodpresence'),
				description:
					'A dark guardian who drinks the life of enemies to stay standing. Blood Death Knights tank through self-healing, bone shields, and relentless melee pressure.',
			},
			{
				name: 'Frost',
				slug: 'frost',
				role: 'dps',
				icon: icon('spell_deathknight_frostpresence'),
				description:
					'A dual-wielding frostbringer who freezes foes and shatters them with runic power. Frost leans on icy bursts, strong cooldown windows, and crisp melee tempo.',
			},
			{
				name: 'Unholy',
				slug: 'unholy',
				role: 'dps',
				icon: icon('spell_deathknight_unholypresence'),
				description:
					'A master of plague and undeath who fights beside raised minions. Unholy spreads disease, commands the dead, and overwhelms targets with necrotic force.',
			},
		],
	},
	{
		id: 'demon-hunter',
		name: 'Demon Hunter',
		slug: 'demon-hunter',
		color: '#A330C9',
		icon: icon('classicon_demonhunter'),
		summary:
			'Illidari who sacrificed everything to turn fel and void power against the Legion — and beyond.',
		specs: [
			{
				name: 'Havoc',
				slug: 'havoc',
				role: 'dps',
				icon: icon('ability_demonhunter_specdps'),
				description:
					'A mobile dual-glaive assassin who dances through combat in a blur of fel energy. Havoc thrives on momentum, leaps, and explosive burst windows.',
			},
			{
				name: 'Vengeance',
				slug: 'vengeance',
				role: 'tank',
				icon: icon('ability_demonhunter_spectank'),
				description:
					'A demonic warden who turns pain into power and protects allies with fiery resolve. Vengeance tanks by soaking hits, spending soul fragments, and striking back hard.',
			},
			{
				name: 'Devourer',
				slug: 'devourer',
				role: 'dps',
				icon: icon('classicon_demonhunter_void'),
				description:
					'A mid-range voidcaster who harvests souls and bends darkness instead of fel. Devourer blends Demon Hunter mobility with crushing spell pressure from just outside melee.',
			},
		],
	},
	{
		id: 'druid',
		name: 'Druid',
		slug: 'druid',
		color: '#FF7C0A',
		icon: icon('classicon_druid'),
		summary:
			'Keepers of nature who shift forms to heal, tank, and deal damage as the wild demands.',
		specs: [
			{
				name: 'Balance',
				slug: 'balance',
				role: 'dps',
				icon: icon('spell_nature_starfall'),
				description:
					'A celestial caster who channels solar and lunar power from afar. Balance druids weave astral damage, DoTs, and eclipse cycles into sustained ranged pressure.',
			},
			{
				name: 'Feral',
				slug: 'feral',
				role: 'dps',
				icon: icon('ability_druid_catform'),
				description:
					'A savage cat-form predator that bleeds and shreds from the shadows. Feral rewards sharp combo timing, bleed uptime, and opportunistic burst.',
			},
			{
				name: 'Guardian',
				slug: 'guardian',
				role: 'tank',
				icon: icon('ability_racial_bearform'),
				description:
					'A bear-form bulwark who shrugs off blows with thick hide and iron resolve. Guardian tanks through mitigation, rage spending, and strong multi-target control.',
			},
			{
				name: 'Restoration',
				slug: 'restoration',
				role: 'healer',
				icon: icon('spell_nature_healingtouch'),
				description:
					'A nature healer who mends allies with HoTs, blooms, and grove magic. Restoration shines when damage is spread and timing hot uptime matters.',
			},
		],
	},
	{
		id: 'evoker',
		name: 'Evoker',
		slug: 'evoker',
		color: '#33937F',
		icon: icon('classicon_evoker'),
		summary:
			"Dracthyr who weave the Aspects' gifts into devastating magic, support, and empowerment.",
		specs: [
			{
				name: 'Devastation',
				slug: 'devastation',
				role: 'dps',
				icon: icon('classicon_evoker_devastation'),
				description:
					'A mid-range spellcaster who unleashes the raw might of the dragonflights. Devastation focuses on empowered casts, aerial mobility, and explosive magical bursts.',
			},
			{
				name: 'Preservation',
				slug: 'preservation',
				role: 'healer',
				icon: icon('classicon_evoker_preservation'),
				description:
					'A temporal healer who rewinds harm and shields allies with bronze and green magic. Preservation blends unique mobility with reactive and proactive healing tools.',
			},
			{
				name: 'Augmentation',
				slug: 'augmentation',
				role: 'dps',
				icon: icon('classicon_evoker_augmentation'),
				description:
					"A support specialist who empowers allies instead of chasing raw personal damage. Augmentation buffs the party's output while still contributing meaningful magic of its own.",
			},
		],
	},
	{
		id: 'hunter',
		name: 'Hunter',
		slug: 'hunter',
		color: '#AAD372',
		icon: icon('classicon_hunter'),
		summary:
			'Master trackers who fight with beasts, bows, and traps from the wilds of Azeroth.',
		specs: [
			{
				name: 'Beast Mastery',
				slug: 'beast-mastery',
				role: 'dps',
				icon: icon('ability_hunter_bestialdiscipline'),
				description:
					'A companion-focused hunter who commands animals to tear through the fight. Beast Mastery is mobile, pet-driven, and strong when your beast stays glued to the target.',
			},
			{
				name: 'Marksmanship',
				slug: 'marksmanship',
				role: 'dps',
				icon: icon('ability_hunter_focusedaim'),
				description:
					'A precision sharpshooter who ends fights with carefully aimed shots. Marksmanship rewards positioning, focus management, and clean ranged burst.',
			},
			{
				name: 'Survival',
				slug: 'survival',
				role: 'dps',
				icon: icon('ability_hunter_camouflage'),
				description:
					'A melee wilderness fighter who mixes spears, bombs, and traps up close. Survival thrives in chaotic fights with strong utility and aggressive frontline pressure.',
			},
		],
	},
	{
		id: 'mage',
		name: 'Mage',
		slug: 'mage',
		color: '#3FC7EB',
		icon: icon('classicon_mage'),
		summary:
			'Scholars of the arcane who bend fire, frost, and pure magic into battlefield control.',
		specs: [
			{
				name: 'Arcane',
				slug: 'arcane',
				role: 'dps',
				icon: icon('spell_holy_magicalsentry'),
				description:
					'A mana-driven caster who builds charges and unleashes overwhelming arcane barrages. Arcane rewards careful resource pacing and decisive burn windows.',
			},
			{
				name: 'Fire',
				slug: 'fire',
				role: 'dps',
				icon: icon('spell_fire_firebolt02'),
				description:
					'A pyromancer who ignites enemies and detonates them with critical flames. Fire plays around hot streak procs, combustion, and satisfying burst sequences.',
			},
			{
				name: 'Frost',
				slug: 'frost',
				role: 'dps',
				icon: icon('spell_frost_frostbolt02'),
				description:
					'A frostcaster who slows, freezes, and shatters foes with icy precision. Frost mixes control, procs, and strong defensive tools while dealing steady ranged damage.',
			},
		],
	},
	{
		id: 'monk',
		name: 'Monk',
		slug: 'monk',
		color: '#00FF98',
		icon: icon('classicon_monk'),
		summary: 'Masters of chi who heal, tank, and strike with fluid martial discipline.',
		specs: [
			{
				name: 'Brewmaster',
				slug: 'brewmaster',
				role: 'tank',
				icon: icon('spell_monk_brewmaster_spec'),
				description:
					'A staggered tank who softens blows with brew, agility, and clever mitigation. Brewmaster turns incoming damage into manageable waves instead of raw spikes.',
			},
			{
				name: 'Mistweaver',
				slug: 'mistweaver',
				role: 'healer',
				icon: icon('spell_monk_mistweaver_spec'),
				description:
					'A mist-shrouded healer who restores allies through soothing chi and focused mists. Mistweaver can heal from range or lean into melee weaving when the fight allows.',
			},
			{
				name: 'Windwalker',
				slug: 'windwalker',
				role: 'dps',
				icon: icon('spell_monk_windwalker_spec'),
				description:
					'A lightning-fast striker who chains combos into rising damage. Windwalker thrives on mastery of chi, mobility, and crisp multi-ability rotations.',
			},
		],
	},
	{
		id: 'paladin',
		name: 'Paladin',
		slug: 'paladin',
		color: '#F48CBA',
		icon: icon('classicon_paladin'),
		summary:
			"Holy warriors who protect the Light's cause through healing, steel, and sacred judgment.",
		specs: [
			{
				name: 'Holy',
				slug: 'holy',
				role: 'healer',
				icon: icon('spell_holy_holybolt'),
				description:
					'A radiant healer who mends wounds with holy light and protective blessings. Holy paladins excel at strong single-target saves and reliable beacon healing.',
			},
			{
				name: 'Protection',
				slug: 'protection',
				role: 'tank',
				icon: icon('ability_paladin_shieldofthetemplar'),
				description:
					'A shield-bearing sentinel who stands between danger and the party. Protection mixes block, holy power, and powerful cooldowns to hold the line.',
			},
			{
				name: 'Retribution',
				slug: 'retribution',
				role: 'dps',
				icon: icon('spell_holy_auraoflight'),
				description:
					'A crusading melee fighter who judges enemies with holy wrath. Retribution delivers bursty holy strikes, strong utility, and decisive cooldown windows.',
			},
		],
	},
	{
		id: 'priest',
		name: 'Priest',
		slug: 'priest',
		color: '#FFFFFF',
		icon: icon('classicon_priest'),
		summary: 'Devoted casters who heal through faith — or unravel minds with shadow.',
		specs: [
			{
				name: 'Discipline',
				slug: 'discipline',
				role: 'healer',
				icon: icon('spell_holy_powerwordshield'),
				description:
					'A hybrid healer who shields allies and turns damage dealt into atonement healing. Discipline rewards foresight, absorption, and precise damage contribution.',
			},
			{
				name: 'Holy',
				slug: 'holy',
				role: 'healer',
				icon: icon('spell_holy_guardianspirit'),
				description:
					'A classic light-based healer focused on powerful direct heals and sacred cooldowns. Holy shines in reactionary saving and strong group recovery tools.',
			},
			{
				name: 'Shadow',
				slug: 'shadow',
				role: 'dps',
				icon: icon('spell_shadow_shadowwordpain'),
				description:
					'A void-touched caster who fractures sanity and melts foes with shadowy damage. Shadow builds around DoTs, insanity, and surreal burst from the void.',
			},
		],
	},
	{
		id: 'rogue',
		name: 'Rogue',
		slug: 'rogue',
		color: '#FFF468',
		icon: icon('classicon_rogue'),
		summary:
			'Silent killers who strike from stealth with poisons, pistols, and precise blades.',
		specs: [
			{
				name: 'Assassination',
				slug: 'assassination',
				role: 'dps',
				icon: icon('ability_rogue_deadlybrew'),
				description:
					'A poison specialist who bleeds and toxins targets into the ground. Assassination thrives on lethal uptime, energy flow, and ruthless single-target pressure.',
			},
			{
				name: 'Outlaw',
				slug: 'outlaw',
				role: 'dps',
				icon: icon('ability_rogue_waylay'),
				description:
					'A swashbuckling combatant who mixes blades, pistols, and risky gambles. Outlaw is mobile, opportunistic, and built around roll-the-bones style momentum.',
			},
			{
				name: 'Subtlety',
				slug: 'subtlety',
				role: 'dps',
				icon: icon('ability_stealth'),
				description:
					'A shadow dancer who vanishes and reappears for devastating openings. Subtlety rewards cooldown planning, stealth windows, and sharp burst execution.',
			},
		],
	},
	{
		id: 'shaman',
		name: 'Shaman',
		slug: 'shaman',
		color: '#0070DD',
		icon: icon('classicon_shaman'),
		summary: 'Spiritual conduits who call on the elements to heal, empower, and destroy.',
		specs: [
			{
				name: 'Elemental',
				slug: 'elemental',
				role: 'dps',
				icon: icon('spell_nature_lightning'),
				description:
					'A ranged caster who hurls lightning, lava, and elemental fury. Elemental plays around maelstrom, procs, and impactful elemental cooldowns.',
			},
			{
				name: 'Enhancement',
				slug: 'enhancement',
				role: 'dps',
				icon: icon('spell_shaman_improvedstormstrike'),
				description:
					'A dual-wielding stormcaller who fights up close with elemental weapons. Enhancement blends melee tempo, totems, and bursty nature magic.',
			},
			{
				name: 'Restoration',
				slug: 'restoration',
				role: 'healer',
				icon: icon('spell_nature_magicimmunity'),
				description:
					'A spirit healer who restores allies through water, earth, and ancestral guidance. Restoration offers flexible healing, strong utility, and valuable raid tools.',
			},
		],
	},
	{
		id: 'warlock',
		name: 'Warlock',
		slug: 'warlock',
		color: '#8788EE',
		icon: icon('classicon_warlock'),
		summary: 'Dark sorcerers who bargain with demons and wield fel magic at terrible cost.',
		specs: [
			{
				name: 'Affliction',
				slug: 'affliction',
				role: 'dps',
				icon: icon('spell_shadow_deathcoil'),
				description:
					'A specialist in lingering curses who drains life over time. Affliction dominates through DoT uptime, soul shards, and multi-target suffering.',
			},
			{
				name: 'Demonology',
				slug: 'demonology',
				role: 'dps',
				icon: icon('spell_shadow_metamorphosis'),
				description:
					'A summoner who overwhelms enemies with demonic armies. Demonology builds power, calls minions, and turns the battlefield into a fel swarm.',
			},
			{
				name: 'Destruction',
				slug: 'destruction',
				role: 'dps',
				icon: icon('spell_shadow_rainoffire'),
				description:
					'A chaos mage who incinerates foes with fel fire and explosive immolation. Destruction rewards soul shard spending and devastating burst casts.',
			},
		],
	},
	{
		id: 'warrior',
		name: 'Warrior',
		slug: 'warrior',
		color: '#C69B6D',
		icon: icon('classicon_warrior'),
		summary: 'Battle-hardened fighters who master arms, rage, and the art of holding the line.',
		specs: [
			{
				name: 'Arms',
				slug: 'arms',
				role: 'dps',
				icon: icon('ability_warrior_savageblow'),
				description:
					'A two-handed weapon master who controls the fight with precise, crushing blows. Arms leans on colossus smash windows, bleeds, and disciplined rage use.',
			},
			{
				name: 'Fury',
				slug: 'fury',
				role: 'dps',
				icon: icon('ability_warrior_innerrage'),
				description:
					'A dual-wielding berserker who thrives in relentless, high-tempo combat. Fury generates rage quickly and spends it on furious, continuous pressure.',
			},
			{
				name: 'Protection',
				slug: 'protection',
				role: 'tank',
				icon: icon('ability_warrior_defensivestance'),
				description:
					'A shield specialist who intercepts danger and answers with thunderous force. Protection tanks through mitigation, interrupts, and strong group utility.',
			},
		],
	},
];

export const REGIONS = [
	{ value: 'eu', label: 'EU' },
	{ value: 'us', label: 'US' },
	{ value: 'kr', label: 'KR' },
	{ value: 'tw', label: 'TW' },
] as const;

export const getWowClass = (slug: string): WowClass | undefined =>
	WOW_CLASSES.find((wowClass) => wowClass.slug === slug);

export const getWowClassByName = (name: string): WowClass | undefined => {
	const normalized = name.trim().toLowerCase();
	return WOW_CLASSES.find((wowClass) => wowClass.name.toLowerCase() === normalized);
};

export const ROLE_LABEL: Record<WowRole, string> = {
	tank: 'Tank',
	healer: 'Healer',
	dps: 'DPS',
};
