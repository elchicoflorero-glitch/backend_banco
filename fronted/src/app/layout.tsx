import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/providers';
import { Navbar } from '@/components/Navbar';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'BancoPeru - Sistema Bancario Digital',
  description: 'Sistema de banca digital seguro y confiable',
  icons: {
    icon: '/favicon.svg',
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="es">
      <head>
        <link rel="icon" href="/favicon.svg" type="image/svg+xml" />
      </head>
      <body className={inter.className}>
        <Providers>
          <Navbar />
          <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
        </Providers>
      </body>
    </html>
  );
}
