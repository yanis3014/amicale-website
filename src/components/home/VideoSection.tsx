import React from 'react';
import { Play } from 'lucide-react';

export const VideoSection: React.FC = () => {
  return (
    <section className="py-16 md:py-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 h-[400px] md:h-[500px]">
          {/* Background Image */}
          <div className="absolute inset-0">
            <img 
              src="https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&q=80" 
              alt="Congrès National"
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/50"></div>
          </div>
          
          {/* Play Button */}
          <div className="absolute inset-0 flex items-center justify-center">
            <button 
              className="w-20 h-20 bg-white/90 rounded-full flex items-center justify-center hover:bg-white hover:scale-110 transition-all duration-300 shadow-2xl group"
              aria-label="Lire la vidéo"
            >
              <Play className="w-8 h-8 text-brand-blue ml-1 group-hover:text-brand-blue-600" fill="currentColor" />
            </button>
          </div>
          
          {/* Text Content */}
          <div className="absolute bottom-8 left-8 right-8 text-white">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">
              Retour sur le Congrès National 2023
            </h2>
            <p className="text-lg text-gray-200 max-w-2xl">
              Revivez les meilleurs moments, les interventions inspirantes et l'excellence 
              académique de notre dernier rassemblement national.
            </p>
          </div>
          
          {/* Duration Badge */}
          <div className="absolute top-6 right-6 bg-black/60 backdrop-blur-sm px-3 py-1 rounded-full text-white text-sm font-medium">
            📅 Amical, Le 12 Dec 2023
          </div>
        </div>
      </div>
    </section>
  );
};
