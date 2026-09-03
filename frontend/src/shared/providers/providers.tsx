'use client';

import { QueryClientProvider } from '@tanstack/react-query';
import { useState } from 'react';
import { createQueryClient } from '@/shared/api/query-client';
import { Toaster } from '@/shared/ui/sonner';

export function Providers({ children }: { children: React.ReactNode }) {
	const [queryClient] = useState(createQueryClient);

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			<Toaster />
		</QueryClientProvider>
	);
}
