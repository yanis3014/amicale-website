'use client';

import React from 'react';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiPartenaire } from '@/lib/api/types';

interface PartnersSectionProps {
  partenaires: ApiPartenaire[];
}

export const PartnersSection: React.FC<PartnersSectionProps> = ({ partenaires }) => {
  if (partenaires.length === 0) return null;

  return (
    <section className="py-16 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <h3 className="text-center text-sm font-semibold text-neutral-400 uppercase tracking-wide mb-8">
          Nos Partenaires
        </h3>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 items-center justify-items-center">
          {partenaires.map((p) => (
            <div
              key={p.id}
              className="flex items-center justify-center h-20 px-6 text-neutral-500 hover:text-primary-600 transition-colors duration-300 grayscale hover:grayscale-0"
            >
              {p.url ? (
                <a
                  href={p.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex flex-col items-center justify-center gap-2 no-underline text-inherit hover:opacity-90"
                >
                  {p.logo_url ? (
                    <img
                      src={getImageUrl(p.logo_url)}
                      alt={p.nom}
                      className="max-h-14 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-base font-bold text-current">{p.nom}</span>
                  )}
                </a>
              ) : (
                <>
                  {p.logo_url ? (
                    <img
                      src={getImageUrl(p.logo_url)}
                      alt={p.nom}
                      className="max-h-14 w-auto object-contain"
                    />
                  ) : (
                    <span className="text-base font-bold text-current">{p.nom}</span>
                  )}
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
