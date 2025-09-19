import type { Metadata } from 'next';
import { Inter, Poppins } from 'next/font/google';
import { Providers } from './providers';
import { ErrorBoundary } from '@/components/ui/ErrorBoundary';
import './globals.css';
import '../styles/animations.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const poppins = Poppins({ 
  subsets: ['latin'], 
  weight: ['400', '500', '600', '700'],
  variable: '--font-poppins' 
});

export const metadata: Metadata = {
  title: 'Lumina Africa - Découvrez et réservez vos sorties',
  description: 'Plateforme de découverte et réservation d\'événements en Afrique. Restaurants, cinémas, lounges, concerts et plus encore.',
  keywords: ['événements', 'réservation', 'Afrique', 'sorties', 'restaurants', 'concerts'],
  authors: [{ name: 'Lumina Africa Team' }],
  openGraph: {
    title: 'Lumina Africa',
    description: 'Découvrez et réservez vos sorties en Afrique',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="fr" className={`${inter.variable} ${poppins.variable}`} suppressHydrationWarning>
      <body className="font-sans antialiased">
        <ErrorBoundary>
          <Providers>
            {children}
          </Providers>
        </ErrorBoundary>
      </body>
    </html>
  );
}

