'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, ArrowRight, Tag, Sparkles } from 'lucide-react';
import { mockActivities, type ActivityCategory } from '@/lib/mockActivities';

const categoryLabels: Record<ActivityCategory, string> = {
  projet: 'Projet',
  vie_etudiante: 'Vie Étudiante',
  flash_info: 'Flash Info',
  evenement: 'Événement',
  partenariat: 'Partenariat',
};

const categoryColors: Record<ActivityCategory, string> = {
  projet: 'bg-purple-100/80 text-purple-700',
  vie_etudiante: 'bg-green-100/80 text-green-700',
  flash_info: 'bg-orange-100/80 text-orange-700',
  evenement: 'bg-blue-100/80 text-blue-700',
  partenariat: 'bg-yellow-100/80 text-yellow-700',
};

// Skeleton Loader Component
function CardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden h-full">
      <div className="h-64 bg-slate-200 animate-pulse"></div>
      <div className="p-6 space-y-4">
        <div className="h-4 bg-slate-200 rounded animate-pulse w-24"></div>
        <div className="h-6 bg-slate-200 rounded animate-pulse w-3/4"></div>
        <div className="h-4 bg-slate-200 rounded animate-pulse w-full"></div>
        <div className="h-4 bg-slate-200 rounded animate-pulse w-2/3"></div>
      </div>
    </div>
  );
}

export default function ActivitesPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ActivityCategory | 'all'>('all');
  const [isLoading, setIsLoading] = useState(false);

  // Article featured (le plus récent)
  const featuredArticle = mockActivities[0];

  // Autres articles (exclure le featured)
  const otherActivities = mockActivities.slice(1);

  // Filtrer les activités
  const filteredActivities = otherActivities.filter((activity) => {
    const matchesSearch = activity.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         activity.summary.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || activity.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Header compact */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-3">
              Activités & Actualités
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Toute l'actualité de l'Amicale en temps réel
            </p>
          </div>
        </div>
      </div>

      {/* Barre de Recherche et Filtres - Design élégant */}
      <div className="sticky top-0 z-20 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Recherche élégante */}
            <div className="w-full md:max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-2.5 border border-slate-200 rounded-xl focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20 focus:outline-none transition-all text-gray-900 placeholder-gray-400 bg-white hover:border-slate-300"
              />
            </div>

            {/* Filtres élégants */}
            <div className="flex gap-2 flex-wrap items-center">
              <button
                onClick={() => setSelectedCategory('all')}
                className={`px-5 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                  selectedCategory === 'all'
                    ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                    : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                }`}
              >
                Toutes
              </button>
              {(Object.keys(categoryLabels) as ActivityCategory[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl font-semibold text-sm transition-all duration-300 ${
                    selectedCategory === cat
                      ? 'bg-brand-blue text-white shadow-lg shadow-brand-blue/30'
                      : 'bg-slate-100 text-gray-700 hover:bg-slate-200'
                  }`}
                >
                  {categoryLabels[cat]}
                </button>
              ))}
            </div>
          </div>

          {/* Compteur */}
          <div className="mt-3 text-sm text-gray-500">
            {filteredActivities.length} {filteredActivities.length > 1 ? 'articles' : 'article'}
            {selectedCategory !== 'all' && ` dans "${categoryLabels[selectedCategory]}"`}
          </div>
        </div>
      </div>

      {/* Section Featured - Article à la Une */}
      <div className="bg-white border-b border-slate-200">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex items-center gap-2 mb-6">
            <Sparkles className="w-5 h-5 text-brand-blue" />
            <h2 className="text-sm font-bold uppercase tracking-wide text-brand-blue">
              À la Une
            </h2>
          </div>

          <Link href={`/activites/${featuredArticle.id}`} className="group">
            <article className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-2xl hover:border-slate-200 transition-all duration-500">
              {/* Image */}
              <div className="relative h-80 md:h-auto bg-gradient-to-br from-brand-blue-100 to-brand-green-100 overflow-hidden">
                {featuredArticle.main_image ? (
                  <img
                    src={featuredArticle.main_image}
                    alt={featuredArticle.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Tag className="w-24 h-24 text-brand-blue-300" />
                  </div>
                )}
                
                {/* Badge Catégorie */}
                <div className="absolute top-6 left-6">
                  <span className={`px-4 py-2 rounded-full text-sm font-bold backdrop-blur-sm ${categoryColors[featuredArticle.category]}`}>
                    {categoryLabels[featuredArticle.category]}
                  </span>
                </div>
              </div>

              {/* Contenu */}
              <div className="p-8 md:p-12 flex flex-col justify-center">
                {/* Date */}
                <div className="flex items-center gap-2 text-sm text-gray-400 mb-4">
                  <Calendar className="w-4 h-4" />
                  <time dateTime={featuredArticle.published_at}>
                    {new Date(featuredArticle.published_at).toLocaleDateString('fr-FR', {
                      day: 'numeric',
                      month: 'long',
                      year: 'numeric',
                    })}
                  </time>
                </div>

                {/* Titre */}
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4 group-hover:text-brand-blue transition-colors leading-tight">
                  {featuredArticle.title}
                </h2>

                {/* Résumé */}
                <p className="text-lg text-gray-600 mb-6 leading-relaxed">
                  {featuredArticle.summary}
                </p>

                {/* CTA */}
                <div className="flex items-center gap-3 text-brand-blue font-bold text-lg group-hover:gap-4 transition-all">
                  <span>Lire l'article complet</span>
                  <ArrowRight className="w-5 h-5" />
                </div>
              </div>
            </article>
          </Link>
        </div>
      </div>

      {/* Grille des Activités - Design Magazine */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {isLoading ? (
          // Skeleton Loaders
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <CardSkeleton key={i} />
            ))}
          </div>
        ) : filteredActivities.length === 0 ? (
          // État vide
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 mb-6">
              Essayez de modifier vos filtres ou votre recherche
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="px-6 py-3 bg-brand-blue text-white rounded-xl font-semibold hover:bg-brand-blue-600 transition-colors"
            >
              Réinitialiser les filtres
            </button>
          </div>
        ) : (
          // Grille Articles
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredActivities.map((activity) => (
              <Link 
                key={activity.id} 
                href={`/activites/${activity.id}`}
                className="group"
              >
                <article className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 hover:-translate-y-1 transition-all duration-300 h-full flex flex-col">
                  {/* Image - 60% de la hauteur avec zoom */}
                  <div className="relative h-64 bg-gradient-to-br from-slate-200 to-slate-100 overflow-hidden">
                    {activity.main_image ? (
                      <img 
                        src={activity.main_image} 
                        alt={activity.title}
                        className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Tag className="w-16 h-16 text-slate-300" />
                      </div>
                    )}
                    
                    {/* Badge Catégorie - Position élégante */}
                    <div className="absolute top-4 left-4">
                      <span className={`px-3 py-1.5 rounded-full text-xs font-bold backdrop-blur-sm ${categoryColors[activity.category]}`}>
                        {categoryLabels[activity.category]}
                      </span>
                    </div>
                  </div>

                  {/* Contenu - 40% restant */}
                  <div className="p-6 flex-1 flex flex-col">
                    {/* Date avec icône élégante */}
                    <div className="flex items-center gap-2 text-sm text-gray-400 mb-3">
                      <Calendar className="w-4 h-4" />
                      <time dateTime={activity.published_at}>
                        {new Date(activity.published_at).toLocaleDateString('fr-FR', {
                          day: 'numeric',
                          month: 'short',
                          year: 'numeric',
                        })}
                      </time>
                    </div>

                    {/* Titre */}
                    <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors line-clamp-2 leading-tight">
                      {activity.title}
                    </h2>

                    {/* Résumé */}
                    <p className="text-gray-600 mb-4 line-clamp-3 flex-1 leading-relaxed">
                      {activity.summary}
                    </p>

                    {/* CTA avec animation fluide */}
                    <div className="flex items-center gap-2 text-brand-blue font-semibold group-hover:gap-3 transition-all duration-300">
                      <span>Lire plus</span>
                      <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </article>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
