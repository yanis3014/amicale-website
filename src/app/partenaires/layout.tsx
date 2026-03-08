import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Partenaires - Amicale FPHM',
  description: 'Partenaires de l\'Amicale des Enseignants de la FPHM',
};

export default function PartenairesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
