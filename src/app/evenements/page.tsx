'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Search,
  Calendar,
  MapPin,
  Users,
  ArrowRight,
  CalendarDays,
} from 'lucide-react';
import { mockEvents } from '@/lib/mockData';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';

type Category = 'all' | 'Social' | 'Académique' | 'Formation' | 'Autre';

const categoryLabels: Category[] = ['all', 'Social', 'Académique', 'Formation', 'Autre'];
const categoryLabelMap: Record<Category, string> = {
  all: 'Tout',
  Social: 'Social',
  Académique: 'Académique',
  Formation: 'Formation',
  Autre: 'Autre',
};

function getPlacesColor(restantes: number, capacite: number) {
  const ratio = capacite > 0 ? restantes / capacite : 1;
  if (ratio > 0.5) return 'bg-primary-500';
  if (ratio > 0.2) return 'bg-amber-500';
  return 'bg-red-500';
}

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');
  const [loading] = useState(false);

  const featuredEvent = mockEvents[0];
  const filteredEvents = mockEvents.slice(1).filter((event) => {
    const matchesSearch = event.titre
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const cat = (event.categorie || 'Autre') as Category;
    const matchesCategory =
      selectedCategory === 'all' || cat === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Header */}
      <div className="relative bg-white overflow-hidden">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-96 h-96 opacity-30 pointer-events-none">
          <div className="absolute inset-0 rounded-full border-4 border-primary-100" />
          <div className="absolute inset-8 rounded-full border-4 border-primary-100" />
          <div className="absolute inset-16 rounded-full border-4 border-primary-100" />
        </div>
        <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
          <h1 className="font-display text-5xl font-bold text-neutral-900">
            Nos Événements
          </h1>
        </div>
      </div>

      {/* Sticky filters */}
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
              {categoryLabels.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-semibold transition-all ${
                    selectedCategory === cat
                      ? 'bg-primary-500 text-white'
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {categoryLabelMap[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Featured event */}
        {featuredEvent && (
          <Link href={`/evenements/${featuredEvent.id}`} className="block mb-12">
            <Card variant="elevated" className="overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-[40%_60%]">
                <div className="relative h-64 md:h-auto min-h-[280px] overflow-hidden">
                  {featuredEvent.image_url ? (
                    <img
                      src={featuredEvent.image_url}
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
                      {featuredEvent.categorie}
                    </Badge>
                    {(featuredEvent as { ouvert_etudiants?: boolean }).ouvert_etudiants && (
                      <Badge variant="info" size="sm">Ouvert aux étudiants</Badge>
                    )}
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
                  <div className="flex items-center gap-4 text-sm text-neutral-600 mb-4">
                    <span className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {featuredEvent.places_restantes} / {featuredEvent.capacite}{' '}
                      places
                    </span>
                  </div>
                  <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden mb-4">
                    <div
                      className={`h-full rounded-full ${getPlacesColor(
                        featuredEvent.places_restantes,
                        featuredEvent.capacite
                      )}`}
                      style={{
                        width: `${(featuredEvent.places_restantes / featuredEvent.capacite) * 100}%`,
                      }}
                    />
                  </div>
                  <Button variant="primary" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                    S&apos;inscrire
                  </Button>
                </div>
              </div>
            </Card>
          </Link>
        )}

        {/* Events grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        ) : filteredEvents.length === 0 ? (
          <EmptyState
            icon={<Calendar className="w-12 h-12" />}
            title="Aucun événement trouvé"
            description="Modifiez vos filtres ou votre recherche."
            action={{
              label: 'Voir tous les événements',
              onClick: () => {
                setSearchQuery('');
                setSelectedCategory('all');
              },
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const placesPct =
                event.capacite > 0
                  ? (event.places_restantes / event.capacite) * 100
                  : 0;
              return (
                <Link key={event.id} href={`/evenements/${event.id}`} className="group">
                  <Card variant="elevated" hover className="overflow-hidden h-full flex flex-col">
                    <div className="relative h-48 overflow-hidden">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.titre}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                          <Calendar className="w-12 h-12 text-primary-300" />
                        </div>
                      )}
                      <div className="absolute top-3 left-3 flex flex-wrap gap-2">
                        <Badge variant="primary" size="sm">
                          {event.categorie}
                        </Badge>
                        {(event as { ouvert_etudiants?: boolean }).ouvert_etudiants && (
                          <Badge variant="info" size="sm">Ouvert aux étudiants</Badge>
                        )}
                        <span className="px-2.5 py-1 bg-white rounded-lg text-sm font-mono font-semibold text-neutral-700 shadow-sm">
                          {event.prix === 0 ? 'Gratuit' : `${event.prix} DT`}
                        </span>
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
                      <div className="flex items-center gap-2 text-sm text-neutral-600 mb-2">
                        <MapPin className="w-4 h-4 flex-shrink-0" />
                        <span className="line-clamp-1">{event.lieu}</span>
                      </div>
                      <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden mb-4">
                        <div
                          className={`h-full rounded-full ${getPlacesColor(
                            event.places_restantes,
                            event.capacite
                          )}`}
                          style={{ width: `${placesPct}%` }}
                        />
                      </div>
                      <span className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                        Découvrir
                        <ArrowRight className="w-5 h-5" />
                      </span>
                    </div>
                  </Card>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
