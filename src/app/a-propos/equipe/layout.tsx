import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Équipe - Amicale FPHM',
  description:
    "Le Bureau et le Conseil d'Administration de l'Amicale des Enseignants de la FPHM",
};

export default function EquipeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
