'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getEvents } from '@/lib/api/events';
import type { ApiEvent } from '@/lib/api/types';

function formatDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function excerpt(text: string | null | undefined, max = 160): string {
  if (!text) return "Compte rendu, informations et ressources publiées par l'amicale.";
  if (text.length <= max) return text;
  return `${text.slice(0, max).trim()}...`;
}

export const AnnoncesSection: React.FC = () => {
  const [items, setItems] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getEvents({ upcoming: false, past: true })
      .then((data) => {
        if (!cancelled) {
          setItems((data ?? []).slice(0, 4));
        }
      })
      .catch(() => {
        if (!cancelled) setItems([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="py-24 bg-[var(--bg)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10">
          <div className="font-mono text-[12px] tracking-[0.08em] text-[var(--accent)]">— 04</div>
          <p className="mt-2 text-[13px] text-[var(--ink-3)]">Communications</p>
          <h2 className="mt-2 [font-family:'Newsreader',serif] text-[clamp(32px,4vw,48px)] leading-tight font-normal text-[var(--ink)]">
            Annonces récentes
          </h2>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[var(--line)]">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="p-8 border-b border-[var(--line)] md:[&:nth-child(odd)]:border-r md:border-[var(--line)]">
                <div className="h-32 rounded-xl skeleton-shimmer" />
              </div>
            ))}
          </div>
        ) : items.length === 0 ? (
          <div className="border-y border-[var(--line)] py-16 text-center text-[var(--ink-3)]">
            Aucune annonce récente pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 border-t border-[var(--line)]">
            {items.map((item, index) => (
              <article
                key={item.id}
                className={`p-8 border-b border-[var(--line)] ${index % 2 === 0 ? 'md:border-r' : ''}`}
              >
                <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
                  Annonce · {formatDate(item.date)}
                </div>
                <h3 className="mt-4 [font-family:'Newsreader',serif] text-[24px] leading-tight font-medium text-[var(--ink)]">
                  {item.titre}
                </h3>
                <p className="mt-4 text-[15px] leading-relaxed text-[var(--ink-2)]">
                  {excerpt(item.description)}
                </p>
                <Link
                  href={`/annonces/${item.id}`}
                  className="mt-6 inline-flex items-center text-[14px] font-medium text-[var(--ink-2)] hover:text-[var(--ink)]"
                >
                  Lire l&apos;annonce →
                </Link>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
