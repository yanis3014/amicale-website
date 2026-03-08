import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Adhésion - Amicale FPHM',
  description:
    "Rejoignez l'Amicale des Enseignants de la Faculté de Pharmacie de Monastir. Découvrez le principe de l'adhésion et les avantages réservés aux membres.",
};

export default function AdhesionLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
