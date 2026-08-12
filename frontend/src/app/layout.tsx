import type { Metadata } from 'next';
import { Fira_Sans } from 'next/font/google';
import { AppShell } from '@/widgets/sidebar/ui/AppShell';
import { Providers } from '../shared/providers/providers';
import './globals.css';

const firaSans = Fira_Sans({
	variable: '--font-sans',
	subsets: ['latin', 'cyrillic'],
	weight: ['300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
	title: 'Mythicore',
	description: 'WoW character lookup and class meta',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
	return (
		<html lang="en" className={`${firaSans.variable} dark h-full antialiased`}>
			<body className="flex min-h-full flex-col font-sans">
				<Providers>
					<AppShell>{children}</AppShell>
				</Providers>
			</body>
		</html>
	);
}
