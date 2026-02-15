import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone } from 'lucide-react';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* À Propos - Amicale Pharma */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">
              <span className="text-brand-blue">🏛️</span> Amicale Pharma
            </h3>
            <p className="text-sm leading-relaxed mb-4">
              L'Amicale de la Faculté de Pharmacie accompagne les étudiants dans leur parcours académique et professionnel à travers des événements, formations et activités.
            </p>
            <div className="flex space-x-3">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-blue transition-colors"
                aria-label="Facebook"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-9 h-9 bg-gray-800 rounded-full flex items-center justify-center hover:bg-brand-blue transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Navigation</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/" className="text-sm hover:text-brand-blue transition-colors">
                  Accueil
                </Link>
              </li>
              <li>
                <Link href="/events" className="text-sm hover:text-brand-blue transition-colors">
                  Évènements
                </Link>
              </li>
              <li>
                <Link href="/enseignants" className="text-sm hover:text-brand-blue transition-colors">
                  Nos Enseignants
                </Link>
              </li>
              <li>
                <Link href="/actualites" className="text-sm hover:text-brand-blue transition-colors">
                  Activités
                </Link>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Ressources</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/guides" className="text-sm hover:text-brand-blue transition-colors">
                  Guides
                </Link>
              </li>
              <li>
                <Link href="/bibliotheque" className="text-sm hover:text-brand-blue transition-colors">
                  Bibliothèque
                </Link>
              </li>
              <li>
                <Link href="/offres-emploi" className="text-sm hover:text-brand-blue transition-colors">
                  Offres d'emploi
                </Link>
              </li>
              <li>
                <Link href="/faq" className="text-sm hover:text-brand-blue transition-colors">
                  FAQ
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-bold text-lg mb-4">Contact</h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-green flex-shrink-0 mt-0.5" />
                <span className="text-sm">
                  📍 Rue Avicenne - Monastir<br />
                  5000 Monastir
                </span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-green flex-shrink-0" />
                <a href="mailto:asso.fphm@gmail.com" className="text-sm hover:text-brand-blue transition-colors">
                  asso.fphm@gmail.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-green flex-shrink-0" />
                <span className="text-sm">+216 73 46 10 00</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-8 border-t border-gray-800">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-center md:text-left">
              © {currentYear} Amicale de la Faculté de Pharmacie. All rights reserved.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/mentions-legales" className="hover:text-brand-blue transition-colors">
                Mentions légales
              </Link>
              <Link href="/confidentialite" className="hover:text-brand-blue transition-colors">
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
