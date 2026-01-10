import './globals.css';
import type { Metadata } from 'next';
import type { ReactNode } from 'react';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';

export const metadata: Metadata = {
  title: {
    default: 'FarmHelp - Empowering Agriculture',
    template: '%s | FarmHelp',
  },
  description:
    'FarmHelp bridges the gap between traditional farming and modern digital services. Crop prediction, farmer management, and seamless administrative tools.',
  applicationName: 'FarmHelp',
  authors: [{ name: 'FarmHelp Engineering Team' }],
  keywords: [
    'Agriculture',
    'Farming',
    'Crop Prediction',
    'Farm Management',
    'AgriTech',
    'India',
  ],
  metadataBase: new URL('https://farmhelp-alpha.vercel.app'),
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'FarmHelp - Empowering Agriculture',
    description:
      'Join the revolution in smart farming. Access real-time crop predictions, find service centers, and manage farmer data efficiently.',
    url: 'https://farmhelp-alpha.vercel.app',
    siteName: 'FarmHelp',
    images: [
      {
        url: 'https://res.cloudinary.com/ddya4o2yl/image/upload/v1768027684/hero-farm_ciaeve.png',
        width: 1200,
        height: 630,
        alt: 'FarmHelp Platform Preview',
      },
    ],
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FarmHelp - Empowering Agriculture',
    description:
      'Smart farming solutions for a better tomorrow. Crop prediction, management, and more.',
    images: [
      'https://res.cloudinary.com/ddya4o2yl/image/upload/v1768027684/hero-farm_ciaeve.png',
    ],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="flex min-h-screen flex-col bg-white text-gray-900 transition-colors duration-300 dark:bg-gray-950 dark:text-gray-100">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <Navbar />
          <main className="flex-grow">{children}</main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  );
}
