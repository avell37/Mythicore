import type {
	EquippedItem,
	ItemEnchantment,
	ItemSocket,
} from '@/entities/character';
import { ENCHANT_GREEN } from '@/shared/lib/enchant';
import { TinyIcon } from '@/shared/ui/tiny-icon';

const EnchantRow = ({ ench }: { ench: ItemEnchantment }) => (
	<div className="flex items-start gap-1.5">
		<TinyIcon src={ench.icon} alt={ench.sourceItemName ?? ench.display} />
		<p
			className="text-sm leading-snug"
			style={{ color: ench.slot === 'TEMPORARY' ? '#80e0ff' : ENCHANT_GREEN }}
		>
			{ench.display}
		</p>
	</div>
);

const SocketRow = ({ socket }: { socket: ItemSocket }) => {
	const filled = Boolean(socket.itemId);
	const label = filled ? (socket.display ?? socket.itemName) : (socket.name ?? socket.type);

	return (
		<div className="flex items-start gap-1.5">
			{filled && socket.icon ? (
				<TinyIcon src={socket.icon} alt={socket.itemName ?? socket.name ?? socket.type} />
			) : (
				<span className="mt-1 flex size-4 shrink-0 items-center justify-center">
					<span
						className="size-2 rotate-45 border"
						style={{ borderColor: filled ? ENCHANT_GREEN : 'rgba(255,255,255,0.35)' }}
					/>
				</span>
			)}
			<p
				className="text-sm leading-snug"
				style={{ color: filled ? ENCHANT_GREEN : '#808080' }}
			>
				{label}
			</p>
		</div>
	);
};

export const ItemTooltip = ({ item }: { item: EquippedItem }) => {
	const enchantments = item.enchantments ?? [];
	const sockets = item.sockets ?? [];
	const hasMods = enchantments.length > 0 || sockets.length > 0;

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
									? ENCHANT_GREEN
									: undefined,
						}}
					>
						{stat.display}
					</p>
				))}
			</div>

			{hasMods ? (
				<div className="mt-2 space-y-1">
					{enchantments.map((ench) => (
						<EnchantRow key={ench.id} ench={ench} />
					))}
					{sockets.map((socket, index) => (
						<SocketRow
							key={`${socket.type}-${socket.itemId ?? index}`}
							socket={socket}
						/>
					))}
				</div>
			) : null}

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
							style={{ color: ef.active ? ENCHANT_GREEN : '#808080' }}
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
