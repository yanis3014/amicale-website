'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  MapPin,
  ArrowRight,
  CalendarDays,
} from 'lucide-react';
import { getEvents } from '@/lib/api/events';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiEvent } from '@/lib/api/types';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getEvents({
      search: searchQuery || undefined,
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
  }, [searchQuery, selectedCategory]);

  const categories = ['all', ...Array.from(new Set(events.map((e) => e.categorie || 'Autre')))];
  const featuredEvent = events[0];
  const gridEvents = events.slice(1);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="relative bg-white overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-30 pointer-events-none">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
          <div className="absolute inset-8 rounded-full border-4 border-primary-100" />
          <div className="absolute inset-16 rounded-full border-4 border-primary-100" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="font-display text-5xl font-bold text-neutral-900">
            Événements
          </h1>
          <p className="mt-2 text-lg text-neutral-600 max-w-2xl">
            Passés et galeries photos
          </p>
        </div>
      </div>

      <div className="sticky top-[4rem] z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:max-w-md">
              <Input
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {categoryLabelMap[cat] ?? cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {featuredEvent && !loading && (
          <Link href={`/evenements/${featuredEvent.id}`} className="block mb-12">
            <Card variant="elevated" className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
                <div className="relative h-64 md:h-auto min-h-[280px] overflow-hidden">
                  {(featuredEvent.image_url || featuredEvent.gallery_images?.[0]) ? (
                    <img
                      src={getImageUrl(featuredEvent.image_url || featuredEvent.gallery_images?.[0] || '')}
                      alt={featuredEvent.titre}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                      <CalendarDays className="w-16 h-16 text-primary-300" />
                    </div>
                  )}
                </div>
                <div className="p-6 md:p-8 flex flex-col justify-center">
                  <div className="flex flex-wrap gap-2 mb-3">
                    <Badge variant="primary">À la une</Badge>
                    <Badge variant="neutral" size="sm">
                      {featuredEvent.categorie ?? 'Autre'}
                    </Badge>
                    <span className="text-sm text-neutral-500">
                      {new Date(featuredEvent.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </span>
                  </div>
                  <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-2">
                    {featuredEvent.titre}
                  </h2>
                  <p className="text-neutral-600 mb-4 line-clamp-2">
                    {featuredEvent.description}
                  </p>
                  <span className="inline-flex items-center gap-2 text-primary-600 font-bold">
                    Voir la galerie photos
                    <ArrowRight className="w-5 h-5" />
                  </span>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : gridEvents.length === 0 && !featuredEvent ? (
          <EmptyState
            icon={<Calendar className="w-12 h-12" />}
            title="Aucun événement passé"
            description="Les événements passés et leurs galeries s'afficheront ici."
            action={{
              label: 'Réinitialiser les filtres',
              onClick: () => {
                setSearchQuery('');
                setSelectedCategory('all');
              },
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridEvents.map((event) => (
              <Link key={event.id} href={`/evenements/${event.id}`} className="group">
                <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col">
                  <div className="relative h-48 overflow-hidden">
                    {(event.image_url || event.gallery_images?.[0]) ? (
                      <img
                        src={getImageUrl(event.image_url || event.gallery_images?.[0] || '')}
                        alt={event.titre}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                        <Calendar className="w-12 h-12 text-primary-300" />
                      </div>
                    )}
                    <div className="absolute top-3 left-3">
                      <Badge variant="primary" size="sm">
                        {event.categorie ?? 'Autre'}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      {new Date(event.date).toLocaleDateString('fr-FR', {
                        day: 'numeric',
                        month: 'long',
                        year: 'numeric',
                      })}
                    </div>
                    <h2 className="font-display text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {event.titre}
                    </h2>
                    <p className="text-neutral-600 text-sm line-clamp-2 flex-1 mb-4">
                      {event.description}
                    </p>
                    {event.lieu && (
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.lieu}</span>
                      </div>
                    )}
                    <span className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                      Voir la galerie
                      <ArrowRight className="w-5 h-5" />
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
