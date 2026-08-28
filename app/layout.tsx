import type { ReactNode } from 'react';

import type { Metadata } from 'next';
import { Cormorant_Garamond, Inter } from 'next/font/google';
import { Toaster } from 'sonner';

import { ConsoleMessage } from '@/components/ConsoleMessage';

import './globals.css';

export const metadata: Metadata = {
  title: 'Minea — seu momento de cuidado',
  description: 'Agende seus procedimentos de beleza e autocuidado.',
  icons: {
    icon: '/icon.ico',
  },
  manifest: '/manifest.webmanifest',
};

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
});

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <body className={`${cormorant.variable} ${inter.variable}`}>
        {children}
        <ConsoleMessage />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
