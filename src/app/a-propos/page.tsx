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
      <div className="pt-16 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">
            — AMICALE FPHM
          </p>
          <h1 className="mt-3 [font-family:'Newsreader',serif] text-[clamp(36px,8vw,80px)] leading-[0.98] font-normal text-[var(--ink)]">
            À <span className="italic text-[var(--accent)]">propos</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-2)]">
            L&apos;Amicale des Enseignants de la Faculté de Pharmacie de Monastir.
          </p>
          <div className="mt-8 border-b border-[var(--line)]" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-16">
        <p className="max-w-2xl mx-auto text-center text-neutral-600 font-body text-base md:text-lg mb-10 md:mb-14">
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
