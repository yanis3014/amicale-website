'use client';

import React from 'react';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiPartenaire } from '@/lib/api/types';

interface PartnersSectionProps {
  partenaires: ApiPartenaire[];
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partenaires }) => {
  if (partenaires.length === 0) return null;
  const marqueeItems = [...partenaires, ...partenaires];

  return (
    <section className="bg-[var(--surface)] border-t border-[var(--line)] py-16">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-center text-[13px] text-[var(--ink-3)] mb-10">
          Avec le soutien de nos partenaires institutionnels
        </p>

        <div
          className="relative overflow-hidden"
          style={{
            maskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 12%, black 88%, transparent 100%)',
          }}
        >
          <div className="flex w-max gap-14 animate-marquee" style={{ animationDuration: '40s' }}>
            {marqueeItems.map((p, index) => (
              <div
                key={`${p.id}-${index}`}
                className="flex min-w-[210px] items-center justify-center gap-3 text-[var(--ink-3)]"
              >
                {p.url ? (
                  <a
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 no-underline text-inherit hover:text-[var(--ink-2)] transition-colors"
                  >
                    {p.logo_url ? (
                      <img
                        src={getImageUrl(p.logo_url)}
                        alt={p.nom}
                        className="max-h-12 w-auto object-contain opacity-90"
                      />
                    ) : null}
                    <span className="[font-family:'Newsreader',serif] italic text-[22px] font-medium text-[var(--ink-3)]">
                      {p.nom}
                    </span>
                  </a>
                ) : (
                  <>
                    {p.logo_url ? (
                      <img
                        src={getImageUrl(p.logo_url)}
                        alt={p.nom}
                        className="max-h-12 w-auto object-contain opacity-90"
                      />
                    ) : null}
                    <span className="[font-family:'Newsreader',serif] italic text-[22px] font-medium text-[var(--ink-3)]">
                      {p.nom}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
