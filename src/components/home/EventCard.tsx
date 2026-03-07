'use client';

import React from 'react';
import Link from 'next/link';
import { Clock, MapPin } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface EventCardProps {
  event: {
    id: string;
    titre: string;
    date: string;
    heure?: string;
    lieu: string;
    prix: number;
    image?: string;
    categorie: 'Social' | 'Académique' | 'Formation' | 'Autre';
    description?: string;
    capacite?: number;
    places_restantes?: number;
    ouvert_etudiants?: boolean;
  };
}

const categoryVariant = {
  Social: 'primary' as const,
  Académique: 'info' as const,
  Formation: 'teal' as const,
  Autre: 'neutral' as const,
};

function getPlacesColor(restantes: number, capacite: number) {
  const ratio = capacite > 0 ? restantes / capacite : 1;
  if (ratio > 0.5) return 'bg-primary-500';
  if (ratio > 0.2) return 'bg-amber-500';
  return 'bg-red-500';
}

function getTimeDisplay(event: EventCardProps['event']): string {
  if (event.heure) return event.heure;
  if (event.date) {
    return new Date(event.date).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
    });
  }
  return '—';
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  const capacite = event.capacite ?? 100;
  const restantes = event.places_restantes ?? 50;
  const placesRatio = capacite > 0 ? (restantes / capacite) * 100 : 50;
  const timeDisplay = getTimeDisplay(event);

  return (
    <Card variant="elevated" hover className="overflow-hidden group">
      <Link href={`/evenements/${event.id}`} className="block">
        <div className="relative h-48 overflow-hidden bg-neutral-100">
          {event.image ? (
            <img
              src={event.image}
              alt={event.titre}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
              <span className="text-neutral-400 text-sm">Image événement</span>
            </div>
          )}
          <div className="absolute top-3 left-3 flex flex-wrap gap-2">
            <Badge variant={categoryVariant[event.categorie] ?? 'neutral'} size="sm">
              {event.categorie}
            </Badge>
            {event.ouvert_etudiants && (
              <Badge variant="info" size="sm">Ouvert aux étudiants</Badge>
            )}
          </div>
          <div className="absolute top-3 right-3">
            <span className="px-2.5 py-1 bg-white rounded-lg text-sm font-mono font-semibold text-neutral-700 shadow-sm">
              {event.prix === 0 ? 'Gratuit' : `${event.prix} DT`}
            </span>
          </div>
        </div>
        <div className="p-6">
          <h3 className="text-xl font-display font-bold text-neutral-900 mb-3 line-clamp-2 group-hover:text-primary-600 transition-colors">
            {event.titre}
          </h3>
          {event.description && (
            <p className="text-sm text-neutral-600 mb-4 line-clamp-2">
              {event.description}
            </p>
          )}
          <div className="space-y-2 mb-4">
            <div className="flex items-center text-sm text-neutral-600">
              <Clock className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
              {timeDisplay}
            </div>
            <div className="flex items-center text-sm text-neutral-600">
              <MapPin className="w-4 h-4 mr-2 text-primary-500 flex-shrink-0" />
              <span className="line-clamp-1">{event.lieu}</span>
            </div>
          </div>
          {/* Barre places */}
          <div className="h-1.5 bg-neutral-200 rounded-full overflow-hidden mb-4">
            <div
              className={`h-full rounded-full transition-all ${getPlacesColor(restantes, capacite)}`}
              style={{ width: `${Math.max(0, Math.min(100, placesRatio))}%` }}
            />
          </div>
          <span className="inline-flex items-center justify-center w-full px-6 py-3 text-lg rounded-xl font-body font-semibold bg-primary-500 text-white hover:bg-primary-600 shadow-sm hover:shadow-glow transition-all duration-200">
            S&apos;inscrire
          </span>
        </div>
      </Link>
    </Card>
  );
};
