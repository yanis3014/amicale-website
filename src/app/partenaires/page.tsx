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
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="pt-16 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">
            — AMICALE FPHM
          </p>
          <h1 className="mt-3 [font-family:'Newsreader',serif] text-[clamp(48px,6vw,80px)] leading-[0.98] font-normal text-[var(--ink)]">
            Nos <span className="italic text-[var(--accent)]">partenaires</span>
          </h1>
          <p className="mt-6 max-w-2xl text-[15px] leading-relaxed text-[var(--ink-2)]">
            Les partenaires de l&apos;Amicale de la Faculté de Pharmacie de Monastir.
          </p>
          <div className="mt-8 border-b border-[var(--line)]" />
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
                      <span className="text-xl font-display font-bold text-[var(--accent)]">
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
                      <span className="text-xl font-display font-bold text-[var(--accent)]">
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
