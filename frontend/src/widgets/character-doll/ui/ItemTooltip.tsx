import { EquippedItem } from '@/entities/character/model/Character';

export const ItemTooltip = ({ item }: { item: EquippedItem }) => {
	return (
		<div
			className="rounded-lg border bg-ink/95 p-3 backdrop-blur-md"
			style={{
				borderColor: `color-mix(in oklab, ${item.qualityColor} 45%, transparent)`,
			}}
		>
			<p className="text-base font-semibold" style={{ color: item.qualityColor }}>
				{item.name}
			</p>

			{item.context ? <p className="mt-0.5 text-xs text-green-400">{item.context}</p> : null}

			<p className="mt-1 text-sm text-yellow-200">Item Level {item.itemLevel}</p>

			{item.binding ? (
				<p className="mt-1 text-sm text-foreground/80">{item.binding}</p>
			) : null}

			{item.armor != null ? <p className="text-sm">{item.armor} armor</p> : null}

			{item.weapon ? (
				<div className="mt-1 text-sm">
					<p>{item.weapon.damage}</p>
					<p>{item.weapon.speed}</p>
					<p className="text-muted-foreground">{item.weapon.dps}</p>
				</div>
			) : null}

			<div className="mt-2 space-y-0.5">
				{item.stats.map((stat) => (
					<p
						key={`${stat.type}-${stat.value}`}
						className="text-sm"
						style={{
							color: stat.isNegated
								? '#808080'
								: stat.isEquipBonus
									? '#00ff00'
									: undefined,
						}}
					>
						{stat.display}
					</p>
				))}
			</div>

			{item.spells.map((sp) => (
				<p key={sp.name} className="mt-2 text-sm text-green-400">
					{sp.description}
				</p>
			))}

			{item.set ? (
				<div className="mt-2">
					<p className="text-sm text-yellow-200">
						{item.set.name} ({item.set.equipped}/{item.set.pieces})
					</p>
					{item.set.effects.map((ef) => (
						<p
							key={ef.required}
							className="text-sm"
							style={{ color: ef.active ? '#00ff00' : '#808080' }}
						>
							({ef.required}) {ef.text}
						</p>
					))}
				</div>
			) : null}

			{item.transmog ? (
				<p className="mt-2 text-sm text-muted-foreground">Transmog: {item.transmog.name}</p>
			) : null}
		</div>
	);
};
