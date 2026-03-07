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

export default function EnseignantsPage() {
  const [enseignants, setEnseignants] = useState<ApiEnseignant[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEnseignants()
      .then((data) => {
        if (!cancelled) setEnseignants(data);
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
    <div className="min-h-screen bg-neutral-50">
      {/* Hero overlay dégradé */}
      <div className="relative bg-gradient-to-br from-primary-700 to-forest-800 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Nos Enseignants
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Découvrez les enseignants et membres de l&apos;Amicale de la Faculté de Pharmacie de Monastir.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
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
                        <span className="w-full h-full flex items-center justify-center text-3xl font-display font-bold text-primary-600">
                          {getInitials(ens.nom, ens.titre)}
                        </span>
                      )}
                    </div>
                    <h2 className="font-display text-lg font-bold text-neutral-900 mb-1">
                      {ens.nom}
                    </h2>
                    {ens.titre && (
                      <p className="text-sm text-primary-600 font-medium mb-2">
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
                          className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
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
                          className="inline-flex items-center gap-1.5 text-sm text-primary-600 hover:text-primary-700 font-medium"
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
          <Card variant="bordered" className="p-8 md:p-12 inline-block">
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-2">
              Rejoindre l&apos;Amicale
            </h2>
            <p className="text-neutral-600 mb-6 max-w-xl mx-auto">
              Enseignant à la FPHM ? Rejoignez l&apos;Amicale pour accéder aux événements et avantages réservés aux membres.
            </p>
            <Link
              href="/adhesion"
              className="inline-flex items-center justify-center gap-2 rounded-xl font-body font-semibold px-6 py-3 text-lg bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-glow transition-all"
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
