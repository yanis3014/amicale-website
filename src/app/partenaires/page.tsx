'use client';

import { useState, useEffect } from 'react';
import { getPartenaires } from '@/lib/api/partenaires';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiPartenaire } from '@/lib/api/types';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';
import { Handshake } from 'lucide-react';

export default function PartenairesPage() {
  const [partenaires, setPartenaires] = useState<ApiPartenaire[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getPartenaires()
      .then((data) => {
        if (!cancelled) setPartenaires(data);
      })
      .catch(() => {
        if (!cancelled) setPartenaires([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="relative bg-gradient-to-br from-primary-700 to-forest-800 text-white py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-black/20" />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4">
            Partenaires
          </h1>
          <p className="text-lg text-primary-100 max-w-2xl">
            Les partenaires de l&apos;Amicale de la Faculté de Pharmacie de Monastir.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : partenaires.length === 0 ? (
          <EmptyState
            icon={<Handshake className="w-12 h-12" />}
            title="Aucun partenaire"
            description="Les partenaires seront bientôt affichés ici."
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {partenaires.map((p) => (
              <Card
                key={p.id}
                variant="elevated"
                hover
                className="flex flex-col items-center justify-center p-6 h-full min-h-[140px]"
              >
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center w-full h-full justify-center gap-3 no-underline text-inherit hover:opacity-90 transition-opacity"
                  >
                    {p.logo_url ? (
                      <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
                        <img
                          src={getImageUrl(p.logo_url)}
                          alt={p.nom}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-xl font-display font-bold text-primary-600">
                        {p.nom.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="font-semibold text-neutral-900 text-center text-sm">
                      {p.nom}
                    </span>
                  </a>
                ) : (
                  <div className="flex flex-col items-center w-full h-full justify-center gap-3">
                    {p.logo_url ? (
                      <div className="w-20 h-20 flex items-center justify-center flex-shrink-0">
                        <img
                          src={getImageUrl(p.logo_url)}
                          alt={p.nom}
                          className="max-w-full max-h-full object-contain"
                        />
                      </div>
                    ) : (
                      <span className="text-xl font-display font-bold text-primary-600">
                        {p.nom.slice(0, 2).toUpperCase()}
                      </span>
                    )}
                    <span className="font-semibold text-neutral-900 text-center text-sm">
                      {p.nom}
                    </span>
                  </div>
                )}
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
