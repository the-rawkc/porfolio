import type { Metadata } from 'next';
import './globals.css';
import { PortfolioProvider } from '@/components/PortfolioContext';

export const metadata: Metadata = {
  metadataBase: new URL('https://rawkc.dev'),
  title: 'RAWKC® — Ravi Mohan Rohela | Software Engineer',
  description:
    'Portfolio of Ravi Mohan Rohela (RAWKC) — Software Engineer and Full-Stack Developer focused on backend systems, APIs, and building useful products.',
  keywords: [
    'Ravi Mohan Rohela',
    'RAWKC',
    'software engineer',
    'full stack developer',
    'backend developer',
    'React',
    'Node.js',
    'portfolio',
  ],
  authors: [{ name: 'Ravi Mohan Rohela', url: 'https://rawkc.dev' }],
  creator: 'Ravi Mohan Rohela',
  openGraph: {
    type: 'website',
    title: 'RAWKC® — Ravi Mohan Rohela | Software Engineer',
    description:
      'Software Engineer and Full-Stack Developer building useful products and reliable backend systems.',
    siteName: 'RAWKC Portfolio',
    locale: 'en_IN',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'RAWKC — Ravi Mohan Rohela Portfolio',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RAWKC® — Ravi Mohan Rohela | Software Engineer',
    description: 'Software Engineer & Full-Stack Developer. Building things that work.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <PortfolioProvider>{children}</PortfolioProvider>
      </body>
    </html>
  );
}
