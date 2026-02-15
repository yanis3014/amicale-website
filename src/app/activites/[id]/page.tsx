import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Calendar, Tag, ChevronLeft, ChevronRight } from 'lucide-react';
import type { Metadata } from 'next';
import { mockActivities, type ActivityCategory } from '@/lib/mockActivities';

type Props = {
  params: Promise<{ id: string }>;
};

const categoryLabels: Record<ActivityCategory, string> = {
  projet: 'Projet',
  vie_etudiante: 'Vie Étudiante',
  flash_info: 'Flash Info',
  evenement: 'Événement',
  partenariat: 'Partenariat',
};

const categoryColors: Record<ActivityCategory, string> = {
  projet: 'bg-purple-100 text-purple-700 border-purple-200',
  vie_etudiante: 'bg-green-100 text-green-700 border-green-200',
  flash_info: 'bg-orange-100 text-orange-700 border-orange-200',
  evenement: 'bg-brand-blue-50 text-brand-blue border-brand-blue-200',
  partenariat: 'bg-yellow-100 text-yellow-700 border-yellow-200',
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const activity = mockActivities.find((a) => a.id === id);

  if (!activity) {
    return {
      title: 'Activité non trouvée',
    };
  }

  return {
    title: `${activity.title} - Activités Amicale`,
    description: activity.summary,
  };
}

export default async function ActivityDetailPage({ params }: Props) {
  const { id } = await params;
  const activity = mockActivities.find((a) => a.id === id);

  if (!activity) {
    notFound();
  }

  // Trouver l'index actuel
  const currentIndex = mockActivities.findIndex((a) => a.id === id);
  const previousActivity = currentIndex > 0 ? mockActivities[currentIndex - 1] : null;
  const nextActivity = currentIndex < mockActivities.length - 1 ? mockActivities[currentIndex + 1] : null;

  return (
    <div className="min-h-screen bg-neutral-bg">
      {/* Hero Image avec titre superposé */}
      <div className="relative h-[50vh] bg-gradient-to-br from-slate-200 to-slate-100 overflow-hidden">
        {activity.main_image ? (
          <img 
            src={activity.main_image} 
            alt={activity.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Tag className="w-32 h-32 text-slate-300" />
          </div>
        )}
        
        {/* Overlay sombre */}
        <div className="absolute inset-0 bg-black/60"></div>
        
        {/* Contenu superposé */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            {/* Badge Catégorie */}
            <div className="mb-4">
              <span 
                className={`inline-block px-4 py-2 rounded-full text-sm font-semibold border-2 ${categoryColors[activity.category]}`}
              >
                {categoryLabels[activity.category]}
              </span>
            </div>
            
            {/* Titre */}
            <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-4xl mx-auto drop-shadow-lg">
              {activity.title}
            </h1>
            
            {/* Date */}
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

      {/* Bouton Retour */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Link 
          href="/activites"
          className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-600 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux activités
        </Link>
      </div>

      {/* Corps de l'article */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="max-w-4xl mx-auto">
          {/* Résumé */}
          <div className="bg-brand-blue-50 border-l-4 border-brand-blue p-6 rounded-r-lg mb-8">
            <p className="text-lg text-gray-700 font-medium leading-relaxed">
              {activity.summary}
            </p>
          </div>

          {/* Contenu principal */}
          <article className="bg-white rounded-xl shadow-sm p-8 md:p-12 mb-12">
            <div className="prose prose-lg max-w-none">
              {activity.content.split('\n\n').map((paragraph, index) => {
                // Gestion des titres markdown
                if (paragraph.startsWith('**') && paragraph.endsWith('**')) {
                  const title = paragraph.replace(/\*\*/g, '');
                  return (
                    <h2 key={index} className="text-2xl font-bold text-gray-900 mt-8 mb-4">
                      {title}
                    </h2>
                  );
                }
                
                // Gestion des listes avec tirets
                if (paragraph.includes('\n-')) {
                  const items = paragraph.split('\n').filter(line => line.startsWith('-'));
                  return (
                    <ul key={index} className="list-disc list-inside space-y-2 mb-6 text-gray-700">
                      {items.map((item, i) => (
                        <li key={i} className="leading-relaxed">
                          {item.substring(2).replace(/\*\*/g, '')}
                        </li>
                      ))}
                    </ul>
                  );
                }
                
                // Paragraphes normaux
                return (
                  <p key={index} className="text-gray-700 mb-6 leading-relaxed whitespace-pre-line">
                    {paragraph.replace(/\*\*/g, '')}
                  </p>
                );
              })}
            </div>
          </article>

          {/* Galerie Photos */}
          {activity.gallery_images && activity.gallery_images.length > 0 && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📸 Galerie Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {activity.gallery_images.map((image, index) => (
                  <div 
                    key={index}
                    className="aspect-square bg-slate-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow cursor-pointer group"
                  >
                    <img 
                      src={image} 
                      alt={`Photo ${index + 1} - ${activity.title}`}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Placeholder galerie si aucune image */}
          {(!activity.gallery_images || activity.gallery_images.length === 0) && (
            <div className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                📸 Galerie Photos
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i}
                    className="aspect-square bg-slate-200 rounded-lg overflow-hidden flex items-center justify-center"
                  >
                    <span className="text-slate-400 text-sm">Photo {i}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Navigation Précédent/Suivant */}
          <div className="border-t border-gray-200 pt-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Précédent */}
              {previousActivity ? (
                <Link 
                  href={`/activites/${previousActivity.id}`}
                  className="group flex items-start gap-4 p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all"
                >
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 mb-1">Article précédent</p>
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-2">
                      {previousActivity.title}
                    </h3>
                  </div>
                </Link>
              ) : (
                <div></div>
              )}

              {/* Suivant */}
              {nextActivity ? (
                <Link 
                  href={`/activites/${nextActivity.id}`}
                  className="group flex items-start gap-4 p-6 bg-white rounded-lg border-2 border-gray-200 hover:border-brand-blue hover:shadow-lg transition-all text-right"
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-gray-500 mb-1">Article suivant</p>
                    <h3 className="font-semibold text-gray-900 group-hover:text-brand-blue transition-colors line-clamp-2">
                      {nextActivity.title}
                    </h3>
                  </div>
                  <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-brand-blue group-hover:text-white transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </div>
                </Link>
              ) : (
                <div></div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
