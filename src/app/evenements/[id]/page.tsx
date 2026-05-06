'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, MapPin, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { getEvent, getEvents } from '@/lib/api/events';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiEvent } from '@/lib/api/types';
import { ActivityGallery } from '@/components/activites/ActivityGallery';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function EventDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [event, setEvent] = useState<ApiEvent | null>(null);
  const [pastEvents, setPastEvents] = useState<ApiEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getEvent(id), getEvents({ past: true })])
      .then(([single, list]) => {
        if (!cancelled) {
          setEvent(single);
          setPastEvents(list);
        }
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
        <p className="text-neutral-600">Archive introuvable</p>
        <Link href="/evenements" className="text-[var(--accent)] font-semibold hover:underline">
          Retour aux archives
        </Link>
      </div>
    );
  }

  const currentIndex = pastEvents.findIndex((e) => String(e.id) === String(id));
  const previousEvent =
    currentIndex > 0 ? pastEvents[currentIndex - 1] : null;
  const nextEvent =
    currentIndex >= 0 && currentIndex < pastEvents.length - 1
      ? pastEvents[currentIndex + 1]
      : null;

  const galleryUrls =
    event.gallery_images?.map((path) => getImageUrl(path)).filter(Boolean) ?? [];
  const heroImage = event.image_url || event.gallery_images?.[0];

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="relative h-[42vh] sm:h-[48vh] md:h-[55vh] min-h-[260px] sm:min-h-[320px] w-full overflow-hidden">
        {heroImage ? (
          <img
            src={getImageUrl(heroImage)}
            alt={event.titre}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
            <Images className="w-32 h-32 text-primary-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h1 className="font-display text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto drop-shadow-lg">
              {event.titre}
            </h1>
            <div className="flex items-center justify-center gap-4 text-white/90 flex-wrap">
              <span className="inline-flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                <time dateTime={event.date} className="text-sm sm:text-base md:text-lg">
                  {new Date(event.date).toLocaleString('fr-FR', {
                    dateStyle: 'long',
                    timeStyle: 'short',
                  })}
                </time>
              </span>
              {event.lieu && (
                <span className="inline-flex items-center gap-2">
                  <MapPin className="w-5 h-5" />
                  {event.lieu}
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/evenements"
          className="inline-flex items-center gap-2 text-[var(--accent)] hover:text-primary-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux archives
        </Link>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          {event.description && (
            <p className="text-lg md:text-xl text-neutral-600 font-medium mb-10 font-body">
              {event.description}
            </p>
          )}

          {event.long_description && (
            <div className="prose prose-neutral prose-lg max-w-none font-body mb-10">
              {event.long_description}
            </div>
          )}

          {galleryUrls.length > 0 && (
            <ActivityGallery
              images={galleryUrls}
              title={event.titre}
            />
          )}

          {galleryUrls.length === 0 && (
            <p className="text-neutral-500 text-center py-8">
              Aucune photo en galerie pour le moment.
            </p>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-[var(--line)]">
            {previousEvent ? (
              <Link
                href={`/evenements/${previousEvent.id}`}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-primary-50 border-2 border-transparent hover:border-primary-500 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-[var(--accent)]" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-500 mb-1">Événement précédent</p>
                  <h3 className="font-semibold text-neutral-900 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {previousEvent.titre}
                  </h3>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextEvent ? (
              <Link
                href={`/evenements/${nextEvent.id}`}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-primary-50 border-2 border-transparent hover:border-primary-500 transition-all md:text-right"
              >
                <div className="flex-1 min-w-0 md:order-2">
                  <p className="text-sm text-neutral-500 mb-1">Événement suivant</p>
                  <h3 className="font-semibold text-neutral-900 group-hover:text-[var(--accent)] transition-colors line-clamp-2">
                    {nextEvent.titre}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors md:order-1">
                  <ChevronRight className="w-5 h-5 text-[var(--accent)]" />
                </div>
              </Link>
            ) : (
              <div />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
