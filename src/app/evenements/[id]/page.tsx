'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  CalendarDays,
} from 'lucide-react';
import { getEvent } from '@/lib/api/events';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import { useAuth } from '@/contexts/AuthContext';
import type { ApiEvent } from '@/lib/api/types';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { RegisterEventModal } from '@/components/events/RegisterEventModal';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const { isAdherent } = useAuth();
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [loading, setLoading] = useState(true);
  const [registerModalOpen, setRegisterModalOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    getEvent(id)
      .then((data) => {
        if (!cancelled) setEvent(data);
      })
      .catch(() => {
        if (!cancelled) setEvent(null);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-600">Événement introuvable</p>
        <Link href="/evenements" className="text-primary-600 font-semibold hover:underline">
          Retour aux événements
        </Link>
      </div>
    );
  }

  const eventDate = new Date(event.date);
  const formattedDate = eventDate.toLocaleDateString('fr-FR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
  const formattedTime = eventDate.toLocaleTimeString('fr-FR', {
    hour: '2-digit',
    minute: '2-digit',
  });
  const placesPct =
    event.capacite > 0
      ? (event.places_restantes / event.capacite) * 100
      : 0;
  const prixAdherent = event.prix_adherent ?? event.prix;
  const showAdherentPrice =
    isAdherent && event.prix > 0 && prixAdherent != null && prixAdherent < event.prix;
  const fewPlaces = event.places_restantes > 0 && event.places_restantes < 10;
  const imageUrl = getImageUrl(event.image_url);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={event.titre}
            fill
            className="object-cover"
            priority
            sizes="100vw"
            unoptimized={imageUrl.startsWith('http') && imageUrl.includes('localhost')}
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-primary-700 to-forest-800 flex items-center justify-center">
            <CalendarDays className="w-24 h-24 text-white/40" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-4 md:p-8 container mx-auto">
          <Link
            href="/evenements"
            className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-xl bg-white/20 backdrop-blur-md text-white font-medium hover:bg-white/30 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Retour aux événements
          </Link>
          <nav className="text-white/80 text-sm mb-2">
            <Link href="/evenements" className="hover:underline">
              Événements
            </Link>
            <span className="mx-2">/</span>
            <span className="text-white">{event.titre}</span>
          </nav>
          <h1 className="font-display text-3xl md:text-4xl font-bold text-white">
            {event.titre}
          </h1>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <Card variant="elevated" className="p-6">
              <h2 className="text-xl font-display font-bold text-neutral-900 mb-4">
                Informations pratiques
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Date</p>
                    <p className="font-semibold text-neutral-900">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Clock className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Heure</p>
                    <p className="font-semibold text-neutral-900">{formattedTime}</p>
                  </div>
                </div>
                {event.lieu && (
                  <div className="flex items-start gap-3 sm:col-span-2">
                    <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-primary-600" />
                    </div>
                    <div>
                      <p className="text-sm text-neutral-500">Lieu</p>
                      <p className="font-semibold text-neutral-900">{event.lieu}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <Users className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Places</p>
                    <p className="font-semibold text-neutral-900">
                      {event.places_restantes} / {event.capacite} places
                    </p>
                  </div>
                </div>
              </div>
            </Card>

            {event.long_description && (
              <Card variant="elevated" className="p-6 md:p-8">
                <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
                  À propos de cet événement
                </h2>
                <div className="prose prose-neutral max-w-none">
                  {event.long_description.split('\n\n').map((paragraph, index) => (
                    <p
                      key={index}
                      className="text-neutral-700 leading-relaxed mb-5 font-body whitespace-pre-line"
                    >
                      {paragraph}
                    </p>
                  ))}
                </div>
              </Card>
            )}
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card
                variant="elevated"
                className={fewPlaces ? 'animate-pulse-glow' : ''}
              >
                <h3 className="text-lg font-display font-bold text-neutral-900 mb-4">
                  Inscription
                </h3>
                <div className="mb-6">
                  {showAdherentPrice ? (
                    <div className="flex flex-wrap items-center gap-2 mb-1">
                      <span className="text-2xl font-display font-bold text-primary-600">
                        {prixAdherent} DT
                      </span>
                      <Badge variant="gold" size="sm">
                        Tarif membre
                      </Badge>
                      <span className="text-neutral-400 line-through text-lg">
                        {event.prix} DT
                      </span>
                    </div>
                  ) : (
                    <p className="text-3xl md:text-4xl font-display font-bold text-primary-600">
                      {event.prix === 0 ? 'Gratuit' : `${event.prix} DT`}
                    </p>
                  )}
                </div>
                <div className="mb-4">
                  <div className="flex justify-between text-sm text-neutral-600 mb-2">
                    <span>Places restantes</span>
                    <span className="font-semibold">{event.places_restantes}</span>
                  </div>
                  <div className="h-2 bg-neutral-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${
                        placesPct > 50
                          ? 'bg-primary-500'
                          : placesPct > 20
                          ? 'bg-amber-500'
                          : 'bg-red-500'
                      }`}
                      style={{ width: `${Math.min(100, placesPct)}%` }}
                    />
                  </div>
                </div>
                {event.places_restantes === 0 && (
                  <p className="text-sm text-red-600 font-medium mb-4">
                    Événement complet
                  </p>
                )}
                {fewPlaces && event.places_restantes > 0 && (
                  <p className="text-sm text-amber-700 font-medium mb-4">
                    Plus que {event.places_restantes} places !
                  </p>
                )}
                <Button
                  variant="primary"
                  size="xl"
                  className="w-full"
                  disabled={event.places_restantes === 0}
                  onClick={() => setRegisterModalOpen(true)}
                >
                  {event.places_restantes === 0
                    ? 'Complet'
                    : "S'inscrire"}
                </Button>
                <p className="text-xs text-neutral-500 text-center mt-4">
                  Confirmation par email
                </p>
              </Card>

              <Card variant="bordered" className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  Bon à savoir
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li>Confirmation par email</li>
                  <li>Billet électronique à présenter</li>
                  <li>Annulation gratuite jusqu&apos;à 48h avant</li>
                  <li>Support disponible</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <RegisterEventModal
        event={event}
        isOpen={registerModalOpen}
        onClose={() => setRegisterModalOpen(false)}
      />
    </div>
  );
}
