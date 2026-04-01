import './globals.css';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata = {
  title: 'Biffco Verify',
  description: 'Public Asset Verification Portal',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} antialiased font-sans`}>
      <body className="min-h-screen bg-[#F9FAFB] dark:bg-[#0C111D]">
        {children}
      </body>
    </html>
  );
}
