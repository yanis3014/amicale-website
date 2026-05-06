import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileText,
  Users,
  Target,
  Heart,
  History,
  UserCircle,
  FolderOpen,
} from 'lucide-react';
import { Card } from '@/components/ui/Card';

export const metadata: Metadata = {
  title: 'À propos - Amicale FPHM',
  description:
    "Découvrez l'Amicale des Enseignants de la Faculté de Pharmacie de Monastir : qui nous sommes, notre histoire, nos missions et nos valeurs",
};

const rubriques = [
  { href: '/a-propos/mot-du-president', label: 'Mot du président', icon: UserCircle },
  { href: '/a-propos/presentation', label: 'Présentation', icon: FileText },
  { href: '/a-propos/historique', label: 'Historique', icon: History },
  { href: '/a-propos/equipe', label: 'Équipe', icon: Users },
  { href: '/a-propos/missions-visions', label: 'Missions & Visions', icon: Target },
  { href: '/a-propos/valeurs', label: 'Valeurs', icon: Heart },
  {
    href: '/a-propos/documents',
    label: 'Documents administratifs',
    icon: FolderOpen,
    description: 'Statuts, JORT, RNE, RIB…',
  },
];

export default function AProposIndexPage() {
  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="relative h-[40vh] min-h-[280px] w-full overflow-hidden">
        <img
          src="/images/enseignants.jpeg"
          alt="Amicale FPHM"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div
          className="absolute inset-0 bg-gradient-to-br from-forest-900/70 via-primary-800/50 to-primary-800/40"
          aria-hidden
        />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
          <h1 className="font-display text-4xl md:text-6xl font-black text-white mb-3 drop-shadow-lg">
            À propos
          </h1>
          <p className="text-primary-200 italic text-lg max-w-2xl">
            L&apos;Amicale des Enseignants de la Faculté de Pharmacie de Monastir
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <p className="max-w-2xl mx-auto text-center text-neutral-600 font-body text-lg mb-14">
          Découvrez notre association, notre équipe, notre histoire et nos engagements.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {rubriques.map(({ href, label, icon: Icon, description }) => (
            <Link key={href} href={href} className="group block">
              <Card variant="default" hover className="h-full p-6">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl bg-primary-100 text-[var(--accent)] flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <h2 className="font-display font-bold text-neutral-900 text-lg group-hover:text-[var(--accent)] transition-colors">
                      {label}
                    </h2>
                    {description && (
                      <p className="text-neutral-500 text-sm mt-1">{description}</p>
                    )}
                  </div>
                </div>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
