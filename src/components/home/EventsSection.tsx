import React from 'react';
import Link from 'next/link';
import { EventCard } from './EventCard';

// Mock data - À remplacer par des données Supabase
const upcomingEvents = [
  {
    id: '1',
    titre: '50 eme anniversaire FPHM',
    date: '2025-10-15',
    heure: '08h00 - 23h00',
    lieu: 'Faculté de Pharmacie de Monastir',
    prix: 25,
    image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&q=80',
    categorie: 'Social' as const,
    description: 'La soirée la plus attendue de l\'année pour célébrer nos étudiants et notre communauté pharmaceutique.',
  },
  {
    id: '2',
    titre: 'Conférence Carrière',
    date: '2026-03-20',
    heure: '14h00 - 17h00',
    lieu: 'Amphi A',
    prix: 0,
    image: 'https://images.unsplash.com/photo-1591115765373-5207764f72e7?w=800&q=80',
    categorie: 'Académique' as const,
    description: 'Rencontrez des professionnels de l\'industrie pharmaceutique et découvrez les opportunités de carrière.',
  },
  {
    id: '3',
    titre: 'Atelier Premiers Secours',
    date: '2026-04-05',
    heure: '10h00 - 16h00',
    lieu: 'Salle de formation',
    prix: 15,
    image: 'https://images.unsplash.com/photo-1584432743501-7d5c27a39189?w=800&q=80',
    categorie: 'Formation' as const,
    description: 'Formation certifiante aux gestes de premiers secours dispensée par des professionnels.',
  },
];

export const EventsSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
              Prochains Événements
            </h2>
            <p className="text-gray-600">
              Ne manquez pas les temps forts de la Vie étudiante de la communauté
            </p>
          </div>
          <Link 
            href="/events" 
            className="hidden md:block text-brand-blue font-semibold hover:text-brand-blue-600 transition-colors"
          >
            Voir tout le calendrier →
          </Link>
        </div>
        
        {/* Events Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
        
        {/* Mobile "See all" link */}
        <div className="mt-8 text-center md:hidden">
          <Link 
            href="/events" 
            className="text-brand-blue font-semibold hover:text-brand-blue-600 transition-colors"
          >
            Voir tout le calendrier →
          </Link>
        </div>
      </div>
    </section>
  );
};
