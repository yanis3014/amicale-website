'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { getActivity, getActivities } from '@/lib/api/activities';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiActivity } from '@/lib/api/types';
import type { ActivityCategory } from '@/lib/api/activities';
import { Card } from '@/components/ui/Card';
import { ActivityGallery } from '@/components/activites/ActivityGallery';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

const categoryLabels: Record<ActivityCategory, string> = {
  projet: 'Projet',
  vie_etudiante: "Vie de l'Amicale",
  flash_info: 'Flash Info',
  evenement: 'Événement',
  partenariat: 'Partenariat',
};

export default function ActivityDetailPage() {
  const params = useParams();
  const id = params?.id as string;
  const [activity, setActivity] = useState<ApiActivity | null>(null);
  const [allActivities, setAllActivities] = useState<ApiActivity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    Promise.all([getActivity(id), getActivities()])
      .then(([single, list]) => {
        if (!cancelled) {
          setActivity(single);
          setAllActivities(list);
        }
      })
      .catch(() => {
        if (!cancelled) setActivity(null);
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

  if (!activity) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-600">Activité introuvable</p>
        <Link href="/annonces" className="text-primary-600 font-semibold hover:underline">
          Retour aux activités
        </Link>
      </div>
    );
  }

  const currentIndex = allActivities.findIndex((a) => String(a.id) === String(id));
  const previousActivity =
    currentIndex > 0 ? allActivities[currentIndex - 1] : null;
  const nextActivity =
    currentIndex >= 0 && currentIndex < allActivities.length - 1
      ? allActivities[currentIndex + 1]
      : null;

  const galleryUrls =
    activity.gallery_images?.map((path) => getImageUrl(path)).filter(Boolean) ?? [];
  const mainImageUrl = getImageUrl(activity.main_image);

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden">
        {mainImageUrl ? (
          <img
            src={mainImageUrl}
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-primary-100 to-primary-50 flex items-center justify-center">
            <Tag className="w-32 h-32 text-primary-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold bg-white/20 backdrop-blur-sm text-white border border-white/30 mb-4">
              {categoryLabels[activity.category]}
            </span>
            <h1 className="font-display text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto drop-shadow-lg">
              {activity.title}
            </h1>
            {activity.published_at && (
              <div className="flex items-center justify-center gap-2 text-white/90">
                <Calendar className="w-5 h-5" />
                <time dateTime={activity.published_at} className="text-lg">
                  {new Date(activity.published_at).toLocaleDateString('fr-FR', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </time>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link
          href="/annonces"
          className="inline-flex items-center gap-2 text-primary-600 hover:text-primary-700 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux activités
        </Link>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-16">
        <div className="max-w-3xl mx-auto">
          {activity.summary && (
            <p className="text-xl text-neutral-600 font-medium italic mb-10 font-body">
              {activity.summary}
            </p>
          )}

          {activity.content && (
            <article className="prose prose-neutral prose-lg max-w-none font-body">
              <ReactMarkdown>{activity.content}</ReactMarkdown>
            </article>
          )}

          {galleryUrls.length > 0 && (
            <ActivityGallery
              images={galleryUrls}
              title={activity.title}
            />
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-8 border-t border-neutral-200">
            {previousActivity ? (
              <Link
                href={`/annonces/${previousActivity.id}`}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-primary-50 border-2 border-transparent hover:border-primary-500 transition-all"
              >
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors">
                  <ChevronLeft className="w-5 h-5 text-primary-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm text-neutral-500 mb-1">Article précédent</p>
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {previousActivity.title}
                  </h3>
                </div>
              </Link>
            ) : (
              <div />
            )}
            {nextActivity ? (
              <Link
                href={`/annonces/${nextActivity.id}`}
                className="group flex items-center gap-4 p-6 rounded-2xl bg-primary-50 border-2 border-transparent hover:border-primary-500 transition-all md:text-right"
              >
                <div className="flex-1 min-w-0 md:order-2">
                  <p className="text-sm text-neutral-500 mb-1">Article suivant</p>
                  <h3 className="font-semibold text-neutral-900 group-hover:text-primary-600 transition-colors line-clamp-2">
                    {nextActivity.title}
                  </h3>
                </div>
                <div className="w-10 h-10 rounded-full bg-primary-100 flex items-center justify-center flex-shrink-0 group-hover:bg-primary-200 transition-colors md:order-1">
                  <ChevronRight className="w-5 h-5 text-primary-600" />
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
