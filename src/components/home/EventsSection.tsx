'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents, getFeaturedEvents } from '@/lib/api/events';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiEvent } from '@/lib/api/types';

type Categorie = 'Social' | 'Académique' | 'Formation' | 'Autre';

function mapToEventCardEvent(e: ApiEvent) {
  const categorie = (e.categorie || 'Autre') as Categorie;
  const validCategorie = ['Social', 'Académique', 'Formation', 'Autre'].includes(categorie)
    ? categorie
    : 'Autre';
  return {
    id: String(e.id),
    href: `/annonces/${e.id}`,
    titre: e.titre,
    date: e.date,
    lieu: e.lieu ?? '',
    prix: Number(e.prix ?? 0),
    image: e.image_url ? getImageUrl(e.image_url) : undefined,
    categorie: validCategorie as Categorie,
    description: e.description ?? undefined,
    capacite: e.capacite ?? 0,
    places_restantes: e.places_restantes ?? 0,
  };
}

function formatEventDate(date: string): string {
  return new Date(date).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    Promise.all([
      getFeaturedEvents(),
      getEvents({ upcoming: true }),
    ])
      .then(([featured, upcoming]) => {
        if (cancelled) return;
        // Priorité aux événements "à la une", puis fallback sur les prochains événements publiés.
        const merged: ApiEvent[] = [];
        const seen = new Set<number>();
        [...featured, ...upcoming].forEach((e) => {
          if (!seen.has(e.id)) {
            seen.add(e.id);
            merged.push(e);
          }
        });
        setEvents(merged);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  const mappedEvents = events.slice(0, 3).map(mapToEventCardEvent);
  const featuredEvent = mappedEvents[0];
  const secondaryEvents = mappedEvents.slice(1, 3);

  return (
    <section className="py-16 bg-[var(--bg)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-10 flex items-end justify-between gap-4">
          <div>
            <div className="font-mono text-[12px] tracking-[0.08em] text-[var(--accent)]">— 02</div>
            <p className="mt-2 text-[13px] text-[var(--ink-3)]">Programme</p>
            <h2 className="mt-2 [font-family:'Newsreader',serif] text-[clamp(32px,4vw,48px)] font-normal leading-tight text-[var(--ink)]">
              Prochains événements
            </h2>
          </div>
          <Link
            href="/annonces"
            className="hidden md:inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-2.5 text-[14px] font-medium text-[var(--ink-2)] hover:bg-[var(--surface)] transition-all duration-200"
          >
            Tout le programme →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[420px] rounded-[28px] border border-[var(--line)] bg-[var(--surface-2)] skeleton-shimmer" />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-[var(--ink-3)]">
            <p>Aucun événement à la une pour le moment.</p>
            <Link href="/annonces" className="mt-2 inline-block text-[var(--accent)] font-medium hover:underline">
              Tout le programme →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr_1fr] gap-6">
            {featuredEvent && (
              <Link
                href={featuredEvent.href}
                className="group overflow-hidden rounded-[28px] border border-[var(--line)] bg-[var(--surface)] transition-all duration-250 hover:border-[var(--line-strong)] hover:shadow-[0_8px_30px_rgba(26,32,28,0.06)]"
              >
                <div className="h-[220px] sm:h-[260px] lg:h-[280px] overflow-hidden border-b border-[var(--line)]">
                  {featuredEvent.image ? (
                    <img src={featuredEvent.image} alt={featuredEvent.titre} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]" />
                  ) : (
                    <div
                      className="h-full w-full"
                      style={{
                        background:
                          'repeating-linear-gradient(135deg, var(--accent-tint) 0 8px, var(--surface-2) 8px 16px)',
                      }}
                    />
                  )}
                </div>
                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="mb-5 flex flex-wrap gap-2">
                    <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                      {featuredEvent.categorie}
                    </span>
                    <span className="rounded-full border border-[var(--line)] px-3 py-1 text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                      {featuredEvent.prix > 0 ? 'Payant' : 'Accès libre'}
                    </span>
                  </div>
                  <h3 className="[font-family:'Newsreader',serif] text-[24px] sm:text-[28px] leading-tight font-medium text-[var(--ink)]">
                    {featuredEvent.titre}
                  </h3>
                  <div className="mt-5 text-[13px] text-[var(--ink-2)]">
                    {formatEventDate(featuredEvent.date)}
                    {featuredEvent.lieu ? ` · ${featuredEvent.lieu}` : ''}
                  </div>
                </div>
              </Link>
            )}

            {secondaryEvents.map((event) => (
              <Link
                key={event.id}
                href={event.href}
                className="group flex min-h-[320px] md:min-h-[420px] flex-col rounded-[28px] border border-[var(--line)] bg-[var(--surface)] p-5 sm:p-6 lg:p-7 transition-all duration-250 hover:border-[var(--line-strong)] hover:shadow-[0_8px_30px_rgba(26,32,28,0.06)]"
              >
                <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
                  {formatEventDate(event.date)}
                </div>
                <h3 className="mt-5 [font-family:'Newsreader',serif] text-[22px] leading-tight font-medium text-[var(--ink)]">
                  {event.titre}
                </h3>
                <div className="mt-auto border-t border-[var(--line)] pt-4">
                  <div className="text-[13px] text-[var(--ink-2)]">
                    {event.lieu || 'Faculté de Pharmacie de Monastir'}
                  </div>
                  <div className="mt-4 flex justify-end text-[20px] text-[var(--ink-2)] transition-transform duration-200 group-hover:translate-x-[3px]">
                    →
                  </div>
                </div>
              </Link>
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/annonces"
            className="inline-flex items-center justify-center rounded-full border border-[var(--line-strong)] px-5 py-2.5 text-[14px] font-medium text-[var(--ink-2)] hover:bg-[var(--surface)] transition-all duration-200"
          >
            Tout le programme →
          </Link>
        </div>
      </div>
    </section>
  );
};
