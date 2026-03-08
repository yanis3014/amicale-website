'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Search, Calendar, ArrowRight } from 'lucide-react';
import { getEvents, getFeaturedEvents } from '@/lib/api/events';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiEvent } from '@/lib/api/types';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';

export default function AnnoncesPage() {
  const [featuredEvent, setFeaturedEvent] = useState<ApiEvent | null>(null);
  const [events, setEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const searchQuery = useDebounce(searchInput, 300);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const hasSearch = !!searchQuery.trim();
    if (hasSearch) {
      getEvents({ upcoming: true, search: searchQuery })
        .then((data) => {
          if (!cancelled) {
            setFeaturedEvent(null);
            setEvents(data);
          }
        })
        .catch(() => {
          if (!cancelled) {
            setFeaturedEvent(null);
            setEvents([]);
          }
        })
        .finally(() => { if (!cancelled) setLoading(false); });
    } else {
      Promise.all([getFeaturedEvents(), getEvents({ upcoming: true })])
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
    }
    return () => { cancelled = true; };
  }, [searchQuery]);

  const gridEvents = events;

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
              Annonces
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-body">
              Prochains événements — inscrivez-vous
            </p>
          </div>
        </div>
      </div>

      <div className="sticky top-[4rem] z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="w-full max-w-md mx-auto">
            <Input
              placeholder="Rechercher un événement..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              leftIcon={<Search className="w-5 h-5" />}
            />
          </div>
        </div>
      </div>

      {featuredEvent && !loading && (
        <div className="border-b border-neutral-100 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <h2 className="text-sm font-bold uppercase tracking-wide text-primary-600 mb-6">
              À la une
            </h2>
            <Link href={`/annonces/${featuredEvent.id}`} className="group block">
              <Card variant="elevated" className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-80 md:h-auto min-h-[280px] overflow-hidden">
                    {featuredEvent.image_url ? (
                      <img
                        src={getImageUrl(featuredEvent.image_url)}
                        alt={featuredEvent.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                        <Calendar className="w-24 h-24 text-primary-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      {new Date(featuredEvent.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <h2 className="font-display text-3xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                      {featuredEvent.titre}
                    </h2>
                    <p className="text-neutral-600 mb-6 leading-relaxed line-clamp-3">
                      {featuredEvent.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary-600 font-bold group-hover:gap-3 transition-all">
                      Voir et s&apos;inscrire
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  </div>
                </div>
              </Card>
            </Link>
          </div>
        </div>
      )}

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : gridEvents.length === 0 && !featuredEvent ? (
          <EmptyState
            icon={<Calendar className="w-12 h-12" />}
            title="Aucun prochain événement"
            description="Les annonces (prochains événements) s'afficheront ici."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridEvents.map((event) => (
              <Link
                key={event.id}
                href={`/annonces/${event.id}`}
                className="group block"
              >
                <Card
                  variant="elevated"
                  hover
                  className="overflow-hidden h-full flex flex-col"
                >
                  <div className="relative h-56 overflow-hidden">
                    {event.image_url ? (
                      <img
                        src={getImageUrl(event.image_url)}
                        alt={event.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                        <Calendar className="w-14 h-14 text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <h2 className="font-display text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {event.titre}
                    </h2>
                    <p className="text-neutral-600 text-sm line-clamp-3 flex-1 mb-4">
                      {event.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                      Voir et s&apos;inscrire
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
