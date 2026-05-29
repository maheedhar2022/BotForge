import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import './globals.css';
import { AuthProvider } from '@/lib/AuthContext';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'BotForge — AI Chatbot Platform for Businesses',
  description:
    'Give your business a 24/7 AI-powered assistant. Deploy a smart, customizable chatbot on your website in minutes — no coding required.',
  keywords: ['AI chatbot', 'customer support', 'SaaS', 'business chatbot', 'lead generation'],
  openGraph: {
    title: 'BotForge — AI Chatbot Platform',
    description: '24/7 AI-powered customer support for any business.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body className={`${inter.variable} ${outfit.variable} antialiased`}>
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}
