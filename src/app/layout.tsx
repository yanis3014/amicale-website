import type { Metadata } from "next";
import { Newsreader, Inter, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { LayoutShell } from "@/components/layout/LayoutShell";

const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-heading',
  weight: ['400', '500', '600', '700'],
  style: ['normal', 'italic'],
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  weight: ['400', '500'],
  display: 'swap',
});

/** Évite la pré-génération statique au build (l’API backend n’est pas disponible sur Vercel). */
export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Amicale de la Faculté de Pharmacie",
  description: "L'Amicale des Enseignants de la Faculté de Pharmacie de Monastir - Association des enseignants, congrès, journées scientifiques et vie associative",
  icons: {
    icon: "/amicale-logo.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body
        className={`${newsreader.variable} ${inter.variable} ${jetbrainsMono.variable} antialiased`}
        suppressHydrationWarning
      >
        {/* suppressHydrationWarning: évite les avertissements quand une extension (ex. Bitwarden) injecte des attributs comme bis_skin_checked dans le DOM avant l'hydratation */}
        <div suppressHydrationWarning>
          <Providers>
            <LayoutShell>{children}</LayoutShell>
          </Providers>
        </div>
      </body>
    </html>
  );
}
