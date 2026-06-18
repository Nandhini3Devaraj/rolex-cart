import type { Metadata } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ReactQueryProvider from '../providers/ReactQueryProvider';
import ThemeProvider from '../providers/ThemeProvider';
import AuthProvider from '../providers/AuthProvider';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
});

export const metadata: Metadata = {
  title: 'RoleX Cart - Multi Role E-Commerce Admin Dashboard',
  description: 'A premium glassmorphic dashboard for managing orders, products, and users across multiple business roles.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable}`} style={{ colorScheme: 'dark' }}>
      <body className="antialiased">
        <ReactQueryProvider>
          <ThemeProvider>
            <AuthProvider>{children}</AuthProvider>
          </ThemeProvider>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
