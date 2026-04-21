import '@/styles/globals.css';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Manrope, Space_Grotesk } from 'next/font/google';
import type { AppProps } from 'next/app';
import { useState } from 'react';

import { AppShell } from '@/components/app-shell';

const bodyFont = Manrope({
  subsets: ['latin'],
  variable: '--font-body',
});

const headingFont = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-heading',
});

export default function App({ Component, pageProps }: AppProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            refetchOnWindowFocus: false,
            retry: 1,
          },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <div
        className={`${bodyFont.variable} ${headingFont.variable} min-h-screen bg-transparent font-sans text-slate-950`}
      >
        <AppShell>
          <Component {...pageProps} />
        </AppShell>
      </div>
    </QueryClientProvider>
  );
}
