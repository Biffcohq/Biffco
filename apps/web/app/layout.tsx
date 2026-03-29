import type { ReactNode, ReactElement } from "react";
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
  weight: ["400", "500", "600", "700"],
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-mono',
  weight: ["400", "500"],
});

export const metadata = {
  title: 'BIFFCO — Trust Infrastructure for Global Value Chains',
  description: 'Infraestructura de confianza criptográfica para cualquier cadena de valor global. El core no sabe qué es una vaca ni qué es un mineral, solo criptografía inmutable.',
};

export default function RootLayout({ children }: { children: ReactNode }): ReactElement {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      {/* El atributo bg de surface lo agregamos al body, así como el scroll sutil */}
      <body className="font-sans antialiased bg-[var(--color-bg)] text-[var(--color-text-primary)] min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
