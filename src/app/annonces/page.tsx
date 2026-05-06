'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents, getFeaturedEvents } from '@/lib/api/events';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiEvent } from '@/lib/api/types';

export default function AnnoncesPage() {
  const [featuredEvent, setFeaturedEvent] = useState<ApiEvent | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    Promise.all([
      getFeaturedEvents(),
      getEvents({
        upcoming: true,
        categorie: selectedCategory === 'all' ? undefined : selectedCategory,
      }),
    ])
      .then(([featured, allUpcoming]) => {
        if (!cancelled) {
          setFeaturedEvent(featured.length > 0 ? featured[0] : null);
          const featuredId = featured.length > 0 ? featured[0].id : null;
          setEvents(allUpcoming.filter((e) => e.id !== featuredId));
        }
      })
      .catch(() => {
        if (!cancelled) {
          setFeaturedEvent(null);
          setEvents([]);
        }
      })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [selectedCategory]);

  const categories = ['all', ...Array.from(new Set(events.map((e) => e.categorie || 'Autre')))];
  const gridEvents = events;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="pt-16 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">— PROGRAMME 2025-2026</p>
          <h1 className="mt-3 [font-family:'Newsreader',serif] text-[clamp(36px,8vw,80px)] leading-[0.98] font-normal text-[var(--ink)]">
            Les <span className="italic text-[var(--accent)]">événements</span> et inscriptions
          </h1>
          <div className="mt-8 border-b border-[var(--line)] pb-6">
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`rounded-full px-4 py-2 text-[13px] font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-[var(--ink)] text-[var(--bg)] border border-[var(--ink)]'
                      : 'bg-transparent text-[var(--ink-2)] border border-[var(--line-strong)] hover:bg-[var(--surface)]'
                  }`}
                >
                  {cat === 'all' ? 'Tout' : cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {featuredEvent && !loading && (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-10">
          <h2 className="font-mono text-[12px] tracking-[0.08em] text-[var(--accent)] mb-5">
            MIS EN AVANT
          </h2>
          <Link href={`/annonces/${featuredEvent.id}`} className="group block">
            <div className="overflow-hidden border border-[var(--line)] rounded-[28px] bg-[var(--surface)]">
              <div className="grid grid-cols-1 lg:grid-cols-[40%_60%]">
                <div className="h-[220px] sm:h-[260px] lg:h-[300px] overflow-hidden border-b lg:border-b-0 lg:border-r border-[var(--line)]">
                  {featuredEvent.image_url ? (
                    <img
                      src={getImageUrl(featuredEvent.image_url)}
                      alt={featuredEvent.titre}
                      className="w-full h-full object-cover group-hover:scale-[1.02] transition-transform duration-500"
                    />
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
                <div className="p-5 sm:p-6 md:p-10">
                  <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
                    {featuredEvent.categorie ?? 'Autre'} · {new Date(featuredEvent.date).toLocaleDateString('fr-FR', {
                      day: '2-digit',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </div>
                  <h3 className="mt-4 md:mt-5 [font-family:'Newsreader',serif] text-[26px] md:text-[32px] leading-tight font-medium text-[var(--ink)]">
                    {featuredEvent.titre}
                  </h3>
                  <p className="mt-5 text-[15px] leading-relaxed text-[var(--ink-2)] line-clamp-4">
                    {featuredEvent.description || "Retrouvez le détail du programme et les modalités d'inscription."}
                  </p>
                  <span className="mt-7 inline-flex items-center gap-2 text-[14px] font-medium text-[var(--ink-2)] group-hover:text-[var(--ink)]">
                    Voir et s&apos;inscrire
                    <span className="transition-transform duration-200 group-hover:translate-x-[3px]">→</span>
                  </span>
                </div>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="h-[220px] border border-[var(--line)] rounded-[18px] skeleton-shimmer" />
            ))}
          </div>
        ) : gridEvents.length === 0 && !featuredEvent ? (
          <div className="border-y border-[var(--line)] py-16 text-center text-[var(--ink-3)]">
            Aucun événement en cours.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {gridEvents.map((event) => (
              <Link
                key={event.id}
                href={`/annonces/${event.id}`}
                className="group border border-[var(--line)] rounded-[18px] bg-[var(--surface)] p-6 hover:border-[var(--line-strong)] transition-colors"
              >
                <div className="font-mono text-[12px] uppercase tracking-[0.08em] text-[var(--accent)]">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <h3 className="mt-4 [font-family:'Newsreader',serif] text-[24px] leading-tight font-medium text-[var(--ink)]">
                  {event.titre}
                </h3>
                <p className="mt-4 text-[15px] text-[var(--ink-2)] line-clamp-3">
                  {event.description || "Consultez l'événement complet et les modalités de participation."}
                </p>
                <div className="mt-6 text-[18px] text-[var(--ink-2)] transition-transform duration-200 group-hover:translate-x-[3px]">
                  →
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
