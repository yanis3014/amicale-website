'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Search, Calendar, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { getActivities } from '@/lib/api/activities';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiActivity } from '@/lib/api/types';
import type { ActivityCategory } from '@/lib/api/activities';
import { Input } from '@/components/ui/Input';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { SkeletonCard } from '@/components/ui/Skeleton';

const categoryLabels: Record<ActivityCategory, string> = {
  projet: 'Projet',
  vie_etudiante: "Vie de l'Amicale",
  flash_info: 'Flash Info',
  evenement: 'Événement',
  partenariat: 'Partenariat',
};

const categoryButtonColors: Record<ActivityCategory, string> = {
  projet: 'bg-purple-500 hover:bg-purple-600',
  vie_etudiante: 'bg-primary-500 hover:bg-primary-600',
  flash_info: 'bg-orange-500 hover:bg-orange-600',
  evenement: 'bg-teal-500 hover:bg-teal-600',
  partenariat: 'bg-gold-500 hover:bg-gold-600',
};

const categoryBandColors: Record<ActivityCategory, string> = {
  projet: 'bg-purple-500',
  vie_etudiante: 'bg-primary-500',
  flash_info: 'bg-orange-500',
  evenement: 'bg-teal-500',
  partenariat: 'bg-gold-500',
};

export default function ActivitesPage() {
  const [activities, setActivities] = useState<ApiActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchInput, setSearchInput] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');

  const searchQuery = useDebounce(searchInput, 300);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    getActivities({
      category: selectedCategory === 'all' ? undefined : selectedCategory,
      search: searchQuery || undefined,
    })
      .then((data) => {
        if (!cancelled) setActivities(data);
      })
      .catch(() => {
        if (!cancelled) setActivities([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [searchQuery, selectedCategory]);

  const featuredArticle = activities[0];
  const gridActivities = activities.slice(1);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="bg-white border-b border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="font-display text-4xl md:text-5xl font-bold text-neutral-900 mb-3">
              Activités & Actualités
            </h1>
            <p className="text-lg text-neutral-600 max-w-2xl mx-auto font-body">
              Toute l&apos;actualité de l&apos;Amicale en temps réel
            </p>
          </div>
        </div>
      </div>

      <div className="sticky top-[4rem] z-20 bg-white/95 backdrop-blur-sm border-b border-neutral-100">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="w-full md:max-w-md">
              <Input
                placeholder="Rechercher..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                leftIcon={<Search className="w-5 h-5" />}
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all ${
                  selectedCategory === 'all'
                    ? 'bg-primary-500 text-white'
                    : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                }`}
              >
                Toutes
              </button>
              {(Object.keys(categoryLabels) as ActivityCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm text-white transition-all ${
                    selectedCategory === cat
                      ? `${categoryButtonColors[cat]} text-white`
                      : 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {featuredArticle && !loading && (
        <div className="border-b border-neutral-100 bg-white">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-2 mb-6">
              <Sparkles className="w-5 h-5 text-primary-600" />
              <h2 className="text-sm font-bold uppercase tracking-wide text-primary-600">
                À la Une
              </h2>
            </div>

            <Link href={`/annonces/${featuredArticle.id}`} className="group block">
              <Card variant="elevated" className="overflow-hidden">
                <div className="grid md:grid-cols-2">
                  <div className="relative h-80 md:h-auto min-h-[280px] overflow-hidden">
                    {featuredArticle.main_image ? (
                      <img
                        src={getImageUrl(featuredArticle.main_image)}
                        alt={featuredArticle.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
                        <Tag className="w-24 h-24 text-primary-300" />
                      </div>
                    )}
                    <div className="absolute top-6 left-6">
                      <Badge
                        variant={
                          featuredArticle.category === 'projet'
                            ? 'purple'
                            : featuredArticle.category === 'vie_etudiante'
                            ? 'primary'
                            : featuredArticle.category === 'flash_info'
                            ? 'orange'
                            : featuredArticle.category === 'evenement'
                            ? 'teal'
                            : 'gold'
                        }
                      >
                        {categoryLabels[featuredArticle.category]}
                      </Badge>
                    </div>
                  </div>
                  <div className="p-8 md:p-10 flex flex-col justify-center">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-4">
                      <Calendar className="w-4 h-4" />
                      {featuredArticle.published_at &&
                        new Date(featuredArticle.published_at).toLocaleDateString(
                          'fr-FR',
                          {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          }
                        )}
                    </div>
                    <h2 className="font-display text-3xl font-bold text-neutral-900 mb-4 group-hover:text-primary-600 transition-colors leading-tight">
                      {featuredArticle.title}
                    </h2>
                    <p className="text-neutral-600 mb-6 leading-relaxed line-clamp-3">
                      {featuredArticle.summary}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary-600 font-bold group-hover:gap-3 transition-all">
                      Lire l&apos;article complet
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
        ) : gridActivities.length === 0 && !featuredArticle ? (
          <EmptyState
            icon={<Search className="w-12 h-12" />}
            title="Aucun article trouvé"
            description="Modifiez vos filtres ou votre recherche."
            action={{
              label: 'Réinitialiser les filtres',
              onClick: () => {
                setSearchInput('');
                setSelectedCategory('all');
              },
            }}
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {gridActivities.map((activity) => (
              <Link
                key={activity.id}
                href={`/annonces/${activity.id}`}
                className="group block"
              >
                <Card
                  variant="elevated"
                  hover
                  className="overflow-hidden h-full flex flex-col"
                >
                  <div
                    className={`h-1 ${categoryBandColors[activity.category]}`}
                  />
                  <div className="relative h-56 overflow-hidden">
                    {activity.main_image ? (
                      <img
                        src={getImageUrl(activity.main_image)}
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-neutral-100 to-neutral-50 flex items-center justify-center">
                        <Tag className="w-14 h-14 text-neutral-300" />
                      </div>
                    )}
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="flex items-center gap-2 text-sm text-neutral-500 mb-2">
                      <Calendar className="w-4 h-4" />
                      {activity.published_at &&
                        new Date(activity.published_at).toLocaleDateString(
                          'fr-FR',
                          {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          }
                        )}
                    </div>
                    <h2 className="font-display text-xl font-bold text-neutral-900 mb-2 group-hover:text-primary-600 transition-colors line-clamp-2">
                      {activity.title}
                    </h2>
                    <p className="text-neutral-600 text-sm line-clamp-3 flex-1 mb-4">
                      {activity.summary}
                    </p>
                    <span className="inline-flex items-center gap-2 text-primary-600 font-semibold group-hover:gap-3 transition-all">
                      Lire plus
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
