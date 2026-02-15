import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { DateBadge } from './DateBadge';
import { CategoryBadge } from './CategoryBadge';

interface EventCardProps {
  event: {
    id: string;
    titre: string;
    date: string;
    heure: string;
    lieu: string;
    prix: number;
    image?: string;
    categorie: 'Social' | 'Académique' | 'Formation' | 'Autre';
    description?: string;
  };
}

export const EventCard: React.FC<EventCardProps> = ({ event }) => {
  return (
    <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {/* Image Section */}
      <div className="relative h-48 bg-gradient-to-br from-gray-100 to-gray-50">
        {/* Badge de date en haut à gauche */}
        <div className="absolute top-4 left-4 z-10">
          <DateBadge date={event.date} />
        </div>
        
        {/* Badge de catégorie en haut à droite */}
        <div className="absolute top-4 right-4 z-10">
          <CategoryBadge category={event.categorie} />
        </div>
        
        {/* Placeholder image - À remplacer par Next Image */}
        <div className="w-full h-full flex items-center justify-center bg-gray-200">
          {event.image ? (
            <img src={event.image} alt={event.titre} className="w-full h-full object-cover" />
          ) : (
            <span className="text-gray-400">Image événement</span>
          )}
        </div>
      </div>
      
      {/* Content Section */}
      <div className="p-6">
        <h3 className="text-xl font-bold text-gray-900 mb-3 line-clamp-2">
          {event.titre}
        </h3>
        
        {event.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {event.description}
          </p>
        )}
        
        <div className="space-y-2 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Clock className="w-4 h-4 mr-2 text-brand-blue" />
            {event.heure}
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <MapPin className="w-4 h-4 mr-2 text-brand-blue" />
            {event.lieu}
          </div>
        </div>
        
        {/* Footer with price and button */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <div className="text-lg font-bold text-gray-900">
            {event.prix === 0 ? 'Gratuit' : `${event.prix} DT`}
          </div>
          <button className="px-6 py-2 bg-brand-green text-white rounded-lg font-semibold hover:bg-brand-green-600 transition-colors">
            S'inscrire
          </button>
        </div>
      </div>
    </div>
  );
};
