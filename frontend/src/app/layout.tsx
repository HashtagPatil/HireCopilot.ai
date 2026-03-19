import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Sidebar } from '@/components/Sidebar';
import { Toaster } from '@/components/ui/sonner';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'HireCopilot.ai',
  description: 'AI-Powered Recruiter Copilot SaaS',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex h-screen bg-background text-foreground antialiased`}>
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
        <Toaster />
      </body>
    </html>
  );
}
