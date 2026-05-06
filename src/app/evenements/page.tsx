'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getEvents } from '@/lib/api/events';
import type { ApiEvent } from '@/lib/api/types';

type Category = 'all' | string;

const categoryLabelMap: Record<string, string> = {
  all: 'Tout',
  Social: 'Social',
  Académique: 'Académique',
  Formation: 'Formation',
  Autre: 'Autre',
};

export default function EventsPage() {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEvents({
      categorie: selectedCategory === 'all' ? undefined : selectedCategory,
      past: true,
    })
      .then((data) => {
        if (!cancelled) setEvents(data);
      })
      .catch(() => {
        if (!cancelled) setEvents([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [selectedCategory]);

  const categories = ['all', ...Array.from(new Set(events.map((e) => e.categorie || 'Autre')))];
  const rowEvents = events;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="pt-16 bg-[var(--bg)]">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">— PROGRAMME 2025-2026</p>
          <h1 className="mt-3 [font-family:'Newsreader',serif] text-[clamp(48px,6vw,80px)] leading-[0.98] font-normal text-[var(--ink)]">
            Les <span className="italic text-[var(--accent)]">archives</span> de l&apos;amicale
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
                  {categoryLabelMap[cat] ?? cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {loading ? (
          <div className="border-t border-[var(--line)]">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 border-b border-[var(--line)] skeleton-shimmer" />
            ))}
          </div>
        ) : rowEvents.length === 0 ? (
          <div className="border-y border-[var(--line)] py-16 text-center text-[var(--ink-3)]">
            Aucune archive pour le moment.
          </div>
        ) : (
          <div className="border-t border-[var(--line)]">
            {rowEvents.map((event) => (
              <Link
                key={event.id}
                href={`/evenements/${event.id}`}
                className="group grid grid-cols-1 md:grid-cols-[200px_1fr_220px_140px_40px] items-center gap-4 border-b border-[var(--line)] py-5 px-1 hover:bg-[var(--surface)] transition-colors"
              >
                <div className="font-mono text-[13px] uppercase tracking-[0.06em] text-[var(--accent)]">
                  {new Date(event.date).toLocaleDateString('fr-FR', {
                    day: '2-digit',
                    month: 'short',
                    year: 'numeric',
                  })}
                </div>
                <h2 className="[font-family:'Newsreader',serif] text-[20px] font-medium leading-tight text-[var(--ink)]">
                  {event.titre}
                </h2>
                <div className="text-[13px] text-[var(--ink-3)]">
                  {event.lieu || 'Faculté de Pharmacie de Monastir'}
                </div>
                <div>
                  <span className="inline-flex rounded-full border border-[var(--line-strong)] px-3 py-1 text-[12px] text-[var(--ink-2)]">
                    {event.categorie ?? 'Autre'}
                  </span>
                </div>
                <div className="text-[20px] text-[var(--ink-2)] transition-transform duration-200 group-hover:translate-x-[3px]">
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
