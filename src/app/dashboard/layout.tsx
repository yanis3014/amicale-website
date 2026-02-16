import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Espace Membre - Amicale Pharmacie',
  description: 'Accédez à votre profil, vos inscriptions et vos événements',
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
