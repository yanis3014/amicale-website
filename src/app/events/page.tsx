'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Search, Calendar, MapPin, Users, ArrowRight, Sparkles } from 'lucide-react';
import { mockEvents } from '@/lib/mockData';

type Category = 'all' | 'social' | 'scientifique' | 'formation';

const categoryLabels: Record<Category, string> = {
  all: 'Tout',
  social: 'Social',
  scientifique: 'Scientifique',
  formation: 'Formation',
};

// Map des catégories mockEvents vers nos catégories
const mapCategory = (cat: string): Category => {
  if (cat === 'social') return 'social';
  if (cat === 'conference') return 'scientifique';
  if (cat === 'formation') return 'formation';
  return 'social';
};

export default function EventsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category>('all');

  // Événement à la une (le premier événement)
  const featuredEvent = mockEvents[0];

  // Filtrer les événements (exclure le featured)
  const filteredEvents = mockEvents.slice(1).filter((event) => {
    const matchesSearch = event.titre.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || mapCategory(event.categorie) === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  // Calculer le pourcentage de places restantes
  const getPlacesPercentage = (placesRestantes: number, capacite: number) => {
    return (placesRestantes / capacite) * 100;
  };

  // Déterminer la couleur de la barre de progression
  const getProgressColor = (percentage: number) => {
    if (percentage > 50) return 'bg-green-500';
    if (percentage > 20) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 to-white">
      {/* Événement à la Une */}
      <div className="relative h-[70vh] bg-gradient-to-br from-brand-blue to-brand-blue-800 overflow-hidden">
        {/* Image de fond (placeholder gradient) */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/50 via-purple-900/30 to-brand-blue/50">
          <div className="absolute inset-0 opacity-20">
            <svg className="w-full h-full" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                  <path d="M 10 0 L 0 0 0 10" fill="none" stroke="white" strokeWidth="0.5" />
                </pattern>
              </defs>
              <rect width="100" height="100" fill="url(#grid)" />
            </svg>
          </div>
        </div>

        {/* Contenu */}
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-3xl">
            {/* Badge "À la Une" */}
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full text-white mb-6">
              <Sparkles className="w-4 h-4" />
              <span className="font-semibold text-sm">Événement à la Une</span>
            </div>

            <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {featuredEvent?.titre}
            </h1>

            <p className="text-xl text-blue-100 mb-8 leading-relaxed max-w-2xl">
              {featuredEvent?.description}
            </p>

            <div className="flex flex-wrap gap-4 text-white/90 mb-8">
              <div className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <span className="font-medium">
                  {featuredEvent && new Date(featuredEvent.date).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-5 h-5" />
                <span className="font-medium">{featuredEvent?.lieu}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                <span className="font-medium">
                  {featuredEvent?.places_restantes} / {featuredEvent?.capacite} places
                </span>
              </div>
            </div>

            <Link
              href={`/events/${featuredEvent?.id}`}
              className="inline-flex items-center gap-2 px-8 py-4 bg-white text-brand-blue rounded-xl font-bold text-lg hover:bg-blue-50 hover:shadow-2xl transition-all duration-300 group"
            >
              S'inscrire maintenant
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Barre de Recherche et Filtres */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200 shadow-sm">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            {/* Recherche */}
            <div className="w-full md:max-w-md relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Rechercher un événement..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 border-2 border-slate-100 rounded-xl focus:border-brand-blue focus:outline-none transition-colors text-gray-900 placeholder-gray-400 bg-slate-50 hover:bg-white"
              />
            </div>

            {/* Filtres Catégories */}
            <div className="flex gap-2 flex-wrap">
              {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-5 py-2.5 rounded-xl font-semibold transition-all duration-300 ${
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

          {/* Compteur de résultats */}
          <div className="mt-4 text-sm text-gray-600">
            {filteredEvents.length} {filteredEvents.length > 1 ? 'événements trouvés' : 'événement trouvé'}
          </div>
        </div>
      </div>

      {/* Grille des Événements */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {filteredEvents.length === 0 ? (
          <div className="text-center py-16">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-slate-100 rounded-full mb-4">
              <Search className="w-10 h-10 text-slate-400" />
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              Aucun événement trouvé
            </h3>
            <p className="text-gray-600">
              Essayez de modifier vos filtres ou votre recherche
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredEvents.map((event) => {
              const placesPercentage = getPlacesPercentage(event.places_restantes, event.capacite);
              const progressColor = getProgressColor(placesPercentage);
              const isPrix = event.prix > 0;

              return (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="group"
                >
                  <article className="bg-white rounded-2xl border border-slate-100 overflow-hidden hover:shadow-xl hover:border-slate-200 transition-all duration-300 h-full flex flex-col">
                    {/* Image */}
                    <div className="relative h-48 bg-gradient-to-br from-brand-blue-100 to-brand-green-100 overflow-hidden">
                      {event.image_url ? (
                        <img
                          src={event.image_url}
                          alt={event.titre}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <Calendar className="w-16 h-16 text-brand-blue-300" />
                        </div>
                      )}
                      
                      {/* Badge catégorie */}
                      <div className="absolute top-4 right-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold backdrop-blur-sm ${
                            event.categorie === 'social'
                              ? 'bg-green-100/80 text-green-700'
                              : event.categorie === 'conference'
                              ? 'bg-blue-100/80 text-blue-700'
                              : 'bg-purple-100/80 text-purple-700'
                          }`}
                        >
                          {categoryLabels[mapCategory(event.categorie)]}
                        </span>
                      </div>

                      {/* Badge Prix */}
                      <div className="absolute bottom-4 left-4">
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-bold backdrop-blur-sm ${
                            isPrix
                              ? 'bg-white/90 text-brand-blue'
                              : 'bg-green-100/90 text-green-700'
                          }`}
                        >
                          {isPrix ? `${event.prix} DT` : 'Gratuit'}
                        </span>
                      </div>
                    </div>

                    {/* Contenu */}
                    <div className="p-6 flex-1 flex flex-col">
                      {/* Date */}
                      <div className="flex items-center gap-2 text-sm text-gray-500 mb-3">
                        <Calendar className="w-4 h-4" />
                        <time dateTime={event.date}>
                          {new Date(event.date).toLocaleDateString('fr-FR', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </time>
                      </div>

                      {/* Titre */}
                      <h2 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-brand-blue transition-colors line-clamp-2">
                        {event.titre}
                      </h2>

                      {/* Description */}
                      <p className="text-gray-600 mb-4 line-clamp-2 flex-1">
                        {event.description}
                      </p>

                      {/* Lieu */}
                      <div className="flex items-center gap-2 text-sm text-gray-600 mb-4">
                        <MapPin className="w-4 h-4" />
                        <span>{event.lieu}</span>
                      </div>

                      {/* Places restantes avec barre de progression */}
                      <div className="mb-4">
                        <div className="flex items-center justify-between text-sm mb-2">
                          <div className="flex items-center gap-2 text-gray-700">
                            <Users className="w-4 h-4" />
                            <span className="font-semibold">
                              {event.places_restantes} / {event.capacite} places
                            </span>
                          </div>
                          <span
                            className={`text-xs font-semibold ${
                              placesPercentage > 50
                                ? 'text-green-600'
                                : placesPercentage > 20
                                ? 'text-orange-600'
                                : 'text-red-600'
                            }`}
                          >
                            {Math.round(placesPercentage)}%
                          </span>
                        </div>
                        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full ${progressColor} rounded-full transition-all duration-500`}
                            style={{ width: `${placesPercentage}%` }}
                          ></div>
                        </div>
                      </div>

                      {/* Bouton Découvrir */}
                      <div className="flex items-center gap-2 text-brand-blue font-bold group-hover:gap-3 transition-all">
                        Découvrir
                        <ArrowRight className="w-5 h-5" />
                      </div>
                    </div>
                  </article>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
