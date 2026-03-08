import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers/Providers";
import { LayoutShell } from "@/components/layout/LayoutShell";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
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
