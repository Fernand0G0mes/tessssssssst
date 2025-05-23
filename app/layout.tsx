import './globals.css';
import { ReactNode } from 'react';
import { Montserrat } from 'next/font/google';

const montserrat = Montserrat({
  subsets: ['latin'],
  variable: '--font-montserrat',
});

export const metadata = {
  title: 'Nutrana',
  description: 'Plan nutricional personalizado en 2 minutos',
  manifest: '/manifest.json',
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/icon-192.png', type: 'image/png', sizes: '192x192' },
      { url: '/icon-512.png', type: 'image/png', sizes: '512x512' }
    ],
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png'
  }
}

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="es" className={montserrat.variable}>
      <body className="font-sans antialiased min-h-screen m-0 p-0 bg-white">
        {children}
      </body>
    </html>
  );
}
