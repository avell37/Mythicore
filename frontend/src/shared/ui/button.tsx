import { type ButtonHTMLAttributes } from 'react';
import { cn } from '@/shared/lib/utils';

export const Button = ({ className, type = 'button', ...props }: ButtonHTMLAttributes<HTMLButtonElement>) => (
	<button
		type={type}
		className={cn(
			'inline-flex items-center justify-center gap-2 rounded-md text-sm font-semibold transition-[filter,transform,colors] hover:brightness-110 active:translate-y-px',
			'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
			'disabled:pointer-events-none disabled:opacity-50',
			className,
		)}
		{...props}
	/>
);
