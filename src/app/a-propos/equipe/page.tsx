'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Users, Mail, Linkedin, ArrowRight } from 'lucide-react';
import { getEnseignants } from '@/lib/api/enseignants';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiEnseignant } from '@/lib/api/types';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';

function getInitials(nom: string, titre?: string | null): string {
  const n = (nom || '').trim().split(/\s+/);
  if (n.length >= 2) return (n[0][0] + n[n.length - 1][0]).toUpperCase();
  if (n[0]) return n[0].slice(0, 2).toUpperCase();
  return '?';
}

export default function EquipePage() {
  const [enseignants, setEnseignants] = useState<ApiEnseignant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEnseignants()
      .then((data) => {
        if (!cancelled) {
          setEnseignants(data);
        }
      })
      .catch(() => {
        if (!cancelled) setEnseignants([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="pt-16 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">
            — À PROPOS
          </p>
          <h1 className="mt-3 [font-family:'Newsreader',serif] text-[clamp(36px,8vw,80px)] leading-[0.98] font-normal text-[var(--ink)]">
            Équipe
          </h1>
          <p className="mt-4 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-2)]">
            Le Bureau et le Conseil d&apos;Administration qui font vivre l&apos;Amicale.
          </p>
          <div className="mt-8 border-b border-[var(--line)]" />
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-12">
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : enseignants.length === 0 ? (
          <EmptyState
            icon={<Users className="w-12 h-12" />}
            title="Aucun enseignant"
            description="La liste des enseignants sera bientôt disponible."
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {enseignants.map((ens) => {
              const photoUrl = getImageUrl(ens.photo_url);
              return (
                <Card
                  key={ens.id}
                  variant="elevated"
                  hover
                  className="overflow-hidden flex flex-col h-full"
                >
                  <div className="h-1 bg-gradient-to-r from-primary-500 to-forest-500" />
                  <div className="p-6 flex-1 flex flex-col items-center text-center">
                    <div className="relative w-32 h-32 rounded-full overflow-hidden bg-primary-100 mb-4 flex-shrink-0">
                      {photoUrl ? (
                        <img
                          src={photoUrl}
                          alt={ens.nom}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="w-full h-full flex items-center justify-center text-3xl font-display font-bold text-[var(--accent)]">
                          {getInitials(ens.nom, ens.titre)}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-lg font-bold text-neutral-900 mb-1">
                      {ens.nom}
                    </h2>
                    {ens.titre && (
                      <p className="text-sm text-[var(--accent)] font-medium mb-2">
                        {ens.titre}
                      </p>
                    )}
                    {ens.specialite && (
                      <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
                        {ens.specialite}
                      </p>
                    )}
                    <div className="mt-auto flex flex-wrap gap-2 justify-center">
                      {ens.email && (
                        <a
                          href={`mailto:${ens.email}`}
                          className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-primary-700 font-medium"
                          aria-label={`Email ${ens.nom}`}
                        >
                          <Mail className="w-4 h-4" />
                          <span className="hidden sm:inline">Email</span>
                        </a>
                      )}
                      {ens.linkedin && (
                        <a
                          href={ens.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 text-sm text-[var(--accent)] hover:text-primary-700 font-medium"
                          aria-label={`LinkedIn ${ens.nom}`}
                        >
                          <Linkedin className="w-4 h-4" />
                          <span className="hidden sm:inline">LinkedIn</span>
                        </a>
                      )}
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}

        {/* CTA section */}
        <div className="mt-16 text-center">
          <Card variant="bordered" className="p-6 md:p-12 inline-block">
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
              Rejoindre l&apos;Amicale
            </h2>
            <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
              Enseignant à la FPHM ? Rejoignez l&apos;Amicale pour accéder aux événements et avantages réservés aux membres.
            </p>
            <Link
              href="/adhesion"
              className="inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold px-6 py-3 text-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-deep)] shadow-sm transition-all"
            >
              Devenir membre
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Card>
        </div>
      </div>
    </div>
  );
}
