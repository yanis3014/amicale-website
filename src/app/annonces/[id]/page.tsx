import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import { mockActivities, type ActivityCategory } from '@/lib/mockActivities';
import { Card } from '@/components/ui/Card';
import { ActivityGallery } from '@/components/annonces/ActivityGallery';

type Props = {
  params: Promise<{ id: string }>;
};

const categoryLabels: Record<ActivityCategory, string> = {
  projet: 'Projet',
  vie_etudiante: 'Vie de l\'Amicale',
  flash_info: 'Flash Info',
  evenement: 'Événement',
  partenariat: 'Partenariat',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const activity = mockActivities.find((a) => a.id === id);
  if (!activity) return { title: 'Activité non trouvée' };
  return {
    title: `${activity.title} - Activités Amicale`,
    description: activity.summary,
  };
}

export default async function ActivityDetailPage({ params }: Props) {
  const { id } = await params;
  const activity = mockActivities.find((a) => a.id === id);

  if (!activity) notFound();

  const currentIndex = mockActivities.findIndex((a) => a.id === id);
  const previousActivity =
    currentIndex > 0 ? mockActivities[currentIndex - 1] : null;
  const nextActivity =
    currentIndex < mockActivities.length - 1
      ? mockActivities[currentIndex + 1]
      : null;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero 55vh */}
      <div className="relative h-[55vh] min-h-[320px] w-full overflow-hidden">
        {activity.main_image ? (
          <img
            src={activity.main_image}
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
          <p className="text-xl text-neutral-600 font-medium italic mb-10 font-body">
            {activity.summary}
          </p>

          <article className="activity-prose">
            {activity.content.split('\n\n').map((paragraph, index) => {
              if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                const title = paragraph.replace(/\*\*/g, '');
                return (
                  <h2
                    key={index}
                    className="font-display text-2xl text-forest-800 border-b border-primary-200 pb-2 mt-10 mb-4"
                  >
                    {title}
                  </h2>
                );
              }
              if (paragraph.includes('\n-')) {
                const lines = paragraph.split('\n');
                const items = lines.filter((line) => line.startsWith('-'));
                return (
                  <ul
                    key={index}
                    className="list-disc text-neutral-700 space-y-2 pl-6 mb-5 font-body"
                  >
                    {items.map((item, i) => (
                      <li key={i} className="leading-relaxed">
                        {item.substring(2).replace(/\*\*/g, '')}
                      </li>
                    ))}
                  </ul>
                );
              }
              return (
                <p
                  key={index}
                  className="text-neutral-700 leading-relaxed mb-5 font-body"
                >
                  {paragraph.split('\n').map((line, i) => {
                    const strongMatch = line.match(/\*\*(.+?)\*\*/g);
                    if (strongMatch) {
                      let rest = line;
                      const parts: React.ReactNode[] = [];
                      strongMatch.forEach((match) => {
                        const idx = rest.indexOf(match);
                        if (idx > 0)
                          parts.push(rest.slice(0, idx));
                        parts.push(
                          <strong
                            key={parts.length}
                            className="text-forest-800 font-semibold"
                          >
                            {match.replace(/\*\*/g, '')}
                          </strong>
                        );
                        rest = rest.slice(idx + match.length);
                      });
                      if (rest) parts.push(rest);
                      return <span key={i}>{parts}</span>;
                    }
                    return <span key={i}>{line}</span>;
                  })}
                </p>
              );
            })}
          </article>

          {activity.gallery_images && activity.gallery_images.length > 0 && (
            <ActivityGallery
              images={activity.gallery_images}
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
                  <p className="text-sm text-neutral-500 mb-1">
                    Article précédent
                  </p>
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
                  <p className="text-sm text-neutral-500 mb-1">
                    Article suivant
                  </p>
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
