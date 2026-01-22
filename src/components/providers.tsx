'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '@/lib/react-query';
import '@/i18n/i18n';

export function Providers({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return <>{children}</>;
    }

    return (
        <QueryClientProvider client={queryClient}>
            <NextThemesProvider attribute="class" defaultTheme="dark" enableSystem>
                {children}
            </NextThemesProvider>
        </QueryClientProvider>
    );
}
