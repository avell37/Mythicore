'use client';

import { motion } from 'framer-motion';
import { ArrowRight, Crosshair } from 'lucide-react';
import { FIELD_CLASS } from '@/shared/lib/field-class';
import { cn } from '@/shared/lib/utils';
import { Button } from '@/shared/ui/button';
import { REGIONS } from '@/shared/lib/wow-classes';
import { useCharacterLookup } from '../hooks/useCharacterLookup';

export const CharacterLookup = ({ formId = 'character-lookup' }: { formId?: string }) => {
	const { region, realm, name, motionReady, setRegion, setRealm, setName, onSubmit } =
		useCharacterLookup();
	const fieldClass = cn(FIELD_CLASS, 'h-11 rounded-md px-3');

	return (
		<motion.form
			id={formId}
			onSubmit={onSubmit}
			initial={{ opacity: 0, y: 14 }}
			animate={motionReady ? { opacity: 1, y: 0 } : { opacity: 0, y: 14 }}
			transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1], delay: 0.08 }}
			className="relative w-full max-w-xl"
		>
			<div className="mb-5 flex items-center gap-2 text-muted-foreground">
				<Crosshair className="size-4 text-primary" />
				<span className="text-xs font-semibold tracking-[0.16em] uppercase">
					Character lookup
				</span>
			</div>

			<div className="grid gap-3 sm:grid-cols-[7rem_1fr_1fr]">
				<label className="block" htmlFor="character-lookup-region">
					<span className="mb-1.5 block text-xs font-medium text-muted-foreground">
						Region
					</span>
					<select
						id="character-lookup-region"
						value={region}
						onChange={(e) => setRegion(e.target.value)}
						className={cn(fieldClass, 'appearance-none pr-8')}
						style={{
							backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%239b93b5' stroke-width='2'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
							backgroundRepeat: 'no-repeat',
							backgroundPosition: 'right 0.75rem center',
						}}
					>
						{REGIONS.map((item) => (
							<option key={item.value} value={item.value}>
								{item.label}
							</option>
						))}
					</select>
				</label>

				<label className="block" htmlFor="character-lookup-realm">
					<span className="mb-1.5 block text-xs font-medium text-muted-foreground">
						Realm
					</span>
					<input
						id="character-lookup-realm"
						value={realm}
						onChange={(e) => setRealm(e.target.value)}
						placeholder="Howling Fjord"
						autoComplete="off"
						className={fieldClass}
					/>
				</label>

				<label className="block" htmlFor="character-lookup-name">
					<span className="mb-1.5 block text-xs font-medium text-muted-foreground">
						Character
					</span>
					<input
						id="character-lookup-name"
						value={name}
						onChange={(e) => setName(e.target.value)}
						placeholder="Name"
						autoComplete="off"
						className={fieldClass}
					/>
				</label>
			</div>

			<Button
				type="submit"
				className="mt-4 h-11 bg-primary px-5 text-primary-foreground"
			>
				Look up
				<ArrowRight className="size-4" />
			</Button>
		</motion.form>
	);
};
