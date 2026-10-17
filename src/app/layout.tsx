import './global.css';
import { RootProvider } from 'fumadocs-ui/provider';
import SearchDialog from '@/components/search';
import { Inter } from 'next/font/google';
import type { ReactNode } from 'react';
import type { Metadata } from 'next';

const inter = Inter({
  subsets: ['latin'],
});

export const metadata: Metadata = {
  metadataBase: new URL('https://panasaurus.com'),
  title: {
    default: 'Panasaurus Documentation',
    template: '%s — Panasaurus',
  },
  description:
    'Documentation for Panasaurus — the dino-strong game server management platform. A Docker-native panel with Blueprint built in, a Rust Wings daemon, and container images on ghcr.io.',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '48x48' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: '/apple-touch-icon.png',
  },
  manifest: '/site.webmanifest',
};

export default function Layout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={inter.className} suppressHydrationWarning>
      <body className="flex flex-col min-h-screen">
        <RootProvider
          search={{
            SearchDialog,
          }}
        >
          {children}
        </RootProvider>
      </body>
    </html>
  );
}
