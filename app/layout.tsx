import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import { getUserOrNull } from '@/lib/auth';
import AuthenticatedLayout from './components/AuthenticatedLayout';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'CDIL Education App',
  description: 'Educational application',
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const user = await getUserOrNull();

  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {user ? (
          <AuthenticatedLayout user={user}>{children}</AuthenticatedLayout>
        ) : (
          children
        )}
      </body>
    </html>
  );
}
