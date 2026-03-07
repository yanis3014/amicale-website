import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  ArrowLeft,
  CalendarDays,
} from 'lucide-react';
import type { Metadata } from 'next';
import { mockEvents } from '@/lib/mockData';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const event = mockEvents.find((e) => e.id === id);
  if (!event) return { title: 'Événement non trouvé' };
  return {
    title: `${event.titre} - Amicale FPHM`,
    description: event.description,
  };
}

export default async function EventDetailPage({ params }: Props) {
  const { id } = await params;
  const event = mockEvents.find((e) => e.id === id);

  if (!event) notFound();

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
  const isAdherent = false;
  const prixAdherent = (event as { prix_adherent?: number }).prix_adherent ?? event.prix;
  const showAdherentPrice = isAdherent && event.prix > 0 && prixAdherent < event.prix;
  const fewPlaces = event.places_restantes > 0 && event.places_restantes < 10;

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Hero - Image 50vh */}
      <div className="relative h-[50vh] min-h-[320px] w-full overflow-hidden">
        {event.image_url ? (
          <Image
            src={event.image_url}
            alt={event.titre}
            fill
            className="object-cover"
            priority
            sizes="100vw"
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
          {(event as { ouvert_etudiants?: boolean }).ouvert_etudiants && (
            <p className="mt-2 text-primary-200 text-sm font-medium">
              Ouvert aux étudiants — inscription possible sans compte membre
            </p>
          )}
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left - 2/3 */}
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
                <div className="flex items-start gap-3 sm:col-span-2">
                  <div className="w-10 h-10 rounded-xl bg-primary-100 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5 text-primary-600" />
                  </div>
                  <div>
                    <p className="text-sm text-neutral-500">Lieu</p>
                    <p className="font-semibold text-neutral-900">{event.lieu}</p>
                  </div>
                </div>
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

            <Card variant="elevated" className="p-6 md:p-8">
              <h2 className="text-2xl font-display font-bold text-neutral-900 mb-6">
                À propos de cet événement
              </h2>
              <div className="prose prose-neutral max-w-none">
                {event.longDescription.split('\n\n').map((paragraph, index) => (
                  <p
                    key={index}
                    className="text-neutral-700 leading-relaxed mb-5 font-body whitespace-pre-line"
                  >
                    {paragraph}
                  </p>
                ))}
              </div>
            </Card>
          </div>

          {/* Right - 1/3 Sticky */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-6">
              <Card
                variant="elevated"
                className={`p-6 ${fewPlaces ? 'animate-pulse-glow' : ''}`}
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
                <Link href={`/adhesion?event=${event.id}`} className="block">
                  <Button
                    variant="primary"
                    size="xl"
                    className="w-full"
                    disabled={event.places_restantes === 0}
                  >
                    {event.places_restantes === 0
                      ? 'Complet'
                      : "S'inscrire et payer"}
                  </Button>
                </Link>
                <p className="text-xs text-neutral-500 text-center mt-4">
                  Paiement sécurisé • Confirmation par email
                </p>
              </Card>

              <Card variant="bordered" className="p-6">
                <h3 className="font-semibold text-neutral-900 mb-3 flex items-center gap-2">
                  Bon à savoir
                </h3>
                <ul className="space-y-2 text-sm text-neutral-700">
                  <li>Confirmation immédiate par email</li>
                  <li>Billet électronique à présenter</li>
                  <li>Annulation gratuite jusqu&apos;à 48h avant</li>
                  <li>Support disponible</li>
                </ul>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
