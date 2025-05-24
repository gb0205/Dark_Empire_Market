
import { Orbitron } from 'next/font/google';
import { GeistSans } from 'geist/font/sans';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/contexts/AuthContext';
import { CartProvider } from '@/contexts/CartContext';
import { TwinklingStars } from '@/components/layout/TwinklingStars';
import { DeathStarBackground } from '@/components/effects/DeathStarBackground';
import { ClientLayout } from '@/components/layout/ClientLayout';

const orbitron = Orbitron({
  subsets: ['latin'],
  variable: '--font-orbitron',
  weight: ['400', '700'],
});

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <head>
        <title>Dark Empire Market</title>
        <meta name="description" content="Purveyors of the finest goods from across the galaxy, for those who appreciate true power." />
        
        {/* Favicons */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="16x16" href="/icons/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/icons/favicon-32x32.png" />
        
        {/* Mobile Icons */}
        <link rel="apple-touch-icon" sizes="180x180" href="/icons/apple-touch-icon.png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#000000" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black" />
      </head>
      <body className={`${orbitron.variable} ${GeistSans.variable} antialiased flex flex-col min-h-screen bg-background relative overflow-x-hidden`}>
        {/* Background Elements Order: Nebulas (-z-30) -> Death Star (-z-20) -> Stars (-z-10) */}
        <div className="nebula-background -z-30"></div> {/* Nebula Layer */}
        
        {/* Death Star Layer */}
        <DeathStarBackground />

        <TwinklingStars className="-z-10" /> {/* Stars Layer - in front of Death Star & Nebula */}

        <AuthProvider>
          <CartProvider>
            <Navbar />
            <div className="relative z-0 flex-grow flex flex-col">
              <ClientLayout>
                {children}
              </ClientLayout>
            </div>
            <Footer />
            <Toaster />
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
