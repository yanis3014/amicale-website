'use client';

import React from 'react';
import { X } from 'lucide-react';

export const PulseBar: React.FC = () => {
  const [isVisible, setIsVisible] = React.useState(true);

  if (!isVisible) return null;

  return (
    <div className="bg-pulse-bar text-white py-2 px-4 relative overflow-hidden">
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex-1 overflow-hidden">
          <div className="animate-marquee whitespace-nowrap text-sm">
            📢 Inscription pour le Gala annuel de la Pharmacie ouverture le 15 Mars ! Réservez votre place maintenant
          </div>
        </div>
        <button
          onClick={() => setIsVisible(false)}
          className="ml-4 hover:opacity-75 transition-opacity flex-shrink-0"
          aria-label="Fermer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <style jsx>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          animation: marquee 20s linear infinite;
        }
      `}</style>
    </div>
  );
};
