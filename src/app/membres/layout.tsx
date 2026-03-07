import type { Metadata } from 'next';
import ProtectedMembres from './ProtectedMembres';

export const metadata: Metadata = {
  title: 'Espace Membre - Amicale FPHM',
  description: 'Accédez à votre profil, vos inscriptions et vos événements',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedMembres>{children}</ProtectedMembres>;
}
