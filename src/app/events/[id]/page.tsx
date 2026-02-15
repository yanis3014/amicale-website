import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Clock, MapPin,Users, ArrowLeft, ShoppingCart } from 'lucide-react';
import type { Metadata } from 'next';
import { mockEvents } from '@/lib/mockData';
import { CategoryBadge } from '@/components/home/CategoryBadge';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = mockEvents.find((e) => e.id === id);
  
  if (!event) {
    return {
      title: 'Événement non trouvé',
    };
  }

  return {
    title: `${event.titre} - Amicale Pharmacie`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = mockEvents.find((e) => e.id === id);

  if (!event) {
    notFound();
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

  return (
    <div className="min-h-screen bg-neutral-bg">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Back Button */}
        <Link 
          href="/events"
          className="inline-flex items-center gap-2 text-brand-blue hover:text-brand-blue-600 font-medium mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Retour aux événements
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - 2/3 */}
          <div className="lg:col-span-2">
            {/* Event Image */}
            <div className="relative w-full h-96 bg-gradient-to-br from-brand-blue-100 to-brand-green-100 rounded-2xl overflow-hidden mb-8">
              {event.image_url ? (
                <Image
                  src={event.image_url}
                  alt={event.titre}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <div className="text-center p-8">
                    <ShoppingCart className="w-24 h-24 text-brand-blue-300 mx-auto mb-4" />
                    <p className="text-gray-400 text-lg">Image de l'événement</p>
                  </div>
                </div>
              )}
              
              {/* Category Badge Overlay */}
              <div className="absolute top-4 right-4">
                <CategoryBadge category={event.categorie as any} />
              </div>
            </div>

            {/* Event Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {event.titre}
            </h1>

            {/* Event Details */}
            <div className="bg-white rounded-xl p-6 shadow-sm mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                📅 Informations pratiques
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start gap-3">
                  <Calendar className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="font-medium text-gray-900">{formattedDate}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Heure</p>
                    <p className="font-medium text-gray-900">{formattedTime}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="w-5 h-5 text-brand-blue flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Lieu</p>
                    <p className="font-medium text-gray-900">{event.lieu}</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Users className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-sm text-gray-500">Places disponibles</p>
                    <p className="font-medium text-gray-900">
                      {event.places_restantes} / {event.capacite} places
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Event Description */}
            <div className="bg-white rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">
                À propos de cet événement
              </h2>
              <div className="prose prose-lg max-w-none">
                {event.longDescription.split('\n\n').map((paragraph, index) => (
                  <p key={index} className="text-gray-700 mb-4 leading-relaxed whitespace-pre-line">
                    {paragraph}
                  </p>
                ))}
              </div>
            </div>
          </div>

          {/* Sidebar - 1/3 */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="bg-white rounded-xl shadow-lg p-6 border-2 border-brand-blue-100">
                <div className="text-center mb-6">
                  <p className="text-sm text-gray-500 uppercase tracking-wide mb-2">
                    Tarif
                  </p>
                  <p className="text-4xl font-bold text-brand-blue">
                    {event.prix === 0 ? 'Gratuit' : `${event.prix} DT`}
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Places restantes</span>
                    <span className="font-semibold text-gray-900">
                      {event.places_restantes}
                    </span>
                  </div>
                  
                  {event.places_restantes < 10 && event.places_restantes > 0 && (
                    <div className="bg-orange-50 border border-orange-200 rounded-lg p-3">
                      <p className="text-sm text-orange-700 font-medium">
                        ⚠️ Plus que {event.places_restantes} places disponibles !
                      </p>
                    </div>
                  )}
                  
                  {event.places_restantes === 0 && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                      <p className="text-sm text-red-700 font-medium">
                        ❌ Événement complet
                      </p>
                    </div>
                  )}
                </div>

                <Link href={`/checkout/${event.id}`} className="block">
                  <button
                    disabled={event.places_restantes === 0}
                    className={`w-full px-6 py-4 rounded-lg font-bold text-white transition-all text-lg ${
                      event.places_restantes === 0
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-brand-green hover:bg-brand-green-600 hover:shadow-lg transform hover:-translate-y-0.5'
                    }`}
                  >
                    {event.places_restantes === 0 ? 'Complet' : 'S\'inscrire et Payer'}
                  </button>
                </Link>

                <p className="text-xs text-gray-500 text-center mt-4">
                  🔒 Paiement sécurisé • Confirmation par email
                </p>
              </div>

              {/* Additional Info */}
              <div className="bg-blue-50 rounded-xl p-6 mt-6">
                <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                  ℹ️ Bon à savoir
                </h3>
                <ul className="space-y-2 text-sm text-gray-700">
                  <li>✓ Confirmation immédiate par email</li>
                  <li>✓ Billet électronique à présenter</li>
                  <li>✓ Annulation gratuite jusqu'à 48h avant</li>
                  <li>✓ Support disponible 24/7</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
