import type { Metadata } from 'next';
import { Sora, Inter } from 'next/font/google';
import { AuthProvider } from '@/context/AuthContext';
import './globals.css';

const sora = Sora({ subsets: ['latin'], variable: '--font-sora', weight: ['500', '600', '700'] });
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Weekly Reports',
  description: 'Weekly report generator and team dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${sora.variable} ${inter.variable}`}>
      <body className="font-sans bg-brand-bg text-gray-900">
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}