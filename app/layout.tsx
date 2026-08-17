import './globals.css'
import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { Cormorant_Garamond, Inter } from 'next/font/google'

export const metadata: Metadata = {
  title: 'Bella Care — seu momento de cuidado',
  description: 'Agende seus procedimentos de beleza e autocuidado.',
}

const cormorant = Cormorant_Garamond({
  subsets: ['latin'],
  variable: '--font-display',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
})

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
})

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
        <link
          href="https://fonts.googleapis.com/css2?family=Quicksand:wght@400;500;600;700&family=Caveat:wght@600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${cormorant.variable} ${inter.variable}`}>{children}</body>
    </html>
  )
}
