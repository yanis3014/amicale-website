'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { getFeaturedEvents } from '@/lib/api/events';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiEvent } from '@/lib/api/types';
import { EventCard } from './EventCard';
import { SkeletonCard } from '@/components/ui/Skeleton';

type Categorie = 'Social' | 'Académique' | 'Formation' | 'Autre';

function mapToEventCardEvent(e: ApiEvent) {
  const categorie = (e.categorie || 'Autre') as Categorie;
  const validCategorie = ['Social', 'Académique', 'Formation', 'Autre'].includes(categorie)
    ? categorie
    : 'Autre';
  return {
    id: String(e.id),
    titre: e.titre,
    date: e.date,
    lieu: e.lieu ?? '',
    prix: Number(e.prix),
    image: e.image_url ? getImageUrl(e.image_url) : undefined,
    categorie: validCategorie as Categorie,
    description: e.description ?? undefined,
    capacite: e.capacite ?? 0,
    places_restantes: e.places_restantes ?? 0,
  };
}

export const EventsSection: React.FC = () => {
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getFeaturedEvents()
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
  }, []);

  return (
    <section className="py-16 md:py-20 bg-neutral-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-12">
          <div className="border-l-4 border-primary-500 pl-4">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-neutral-900 mb-2">
              Prochains Événements
            </h2>
            <p className="text-neutral-600 font-body">
              Les événements organisés par et pour l&apos;Amicale
            </p>
          </div>
          <Link
            href="/evenements"
            className="hidden md:block text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Voir tout le calendrier →
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-12 text-neutral-500">
            <p>Aucun événement à la une pour le moment.</p>
            <Link href="/evenements" className="mt-2 inline-block text-primary-600 font-semibold hover:underline">
              Voir le calendrier →
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {events.map((event) => (
              <EventCard key={event.id} event={mapToEventCardEvent(event)} />
            ))}
          </div>
        )}

        <div className="mt-8 text-center md:hidden">
          <Link
            href="/evenements"
            className="text-primary-600 font-semibold hover:text-primary-700 transition-colors"
          >
            Voir tout le calendrier →
          </Link>
        </div>
      </div>
    </section>
  );
};
