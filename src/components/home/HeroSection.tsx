import React from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';
import { StatCard } from './StatCard';
import { CheckCircle2 } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="bg-neutral-bg py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div>
            <div className="inline-block px-3 py-1 bg-blue-50 text-brand-blue text-sm font-medium rounded-full mb-4">
              AMICALE PHARMACEUTIQUE ESTUDIANTINE
            </div>
            
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Bienvenue dans votre{' '}
              <span className="text-brand-blue">famille Pharma</span>
            </h1>
            
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              L'Amicale de la Faculté de Pharmacie t'accompagne et te professionnalise 
              pour t'offrir la faculté de la parenthèse pharmaceutique pour construire ensemble  
              votre avenir et l'avenir de vos études.
            </p>
            
            <div className="flex flex-wrap gap-4 mb-12">
              <Button 
                variant="primary" 
                size="lg"
                className="bg-brand-blue hover:bg-brand-blue-600"
              >
                Découvrir Plus
              </Button>
              <button className="flex items-center gap-2 text-gray-700 hover:text-brand-blue transition-colors">
                <CheckCircle2 className="w-5 h-5" />
                <span className="font-medium">Voir la vidéo</span>
              </button>
            </div>
            
            {/* Statistics */}
            <div className="grid grid-cols-3 gap-8 pt-8 border-t border-gray-200">
              <StatCard value="100+" label="Membres" />
              <StatCard value="50+" label="Événements" />
              <StatCard value="100%" label="Engagement" />
            </div>
          </div>
          
          {/* Right Image */}
          <div className="relative">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl">
              <img 
                src="/images/hero2.jpeg" 
                alt="Amicale Pharmaceutique" 
                className="w-full h-full object-cover aspect-[4/3]"
              />
            </div>

            
            
            
          </div>
        </div>
      </div>
    </section>
  );
};
