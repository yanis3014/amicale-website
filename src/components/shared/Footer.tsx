'use client';

import React from 'react';
import Link from 'next/link';
import { Facebook, Instagram, Mail, MapPin, Phone, ArrowRight } from 'lucide-react';

const PharmaCrossPattern = () => (
  <svg
    className="absolute inset-0 w-full h-full opacity-5 pointer-events-none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern
        id="pharma-pattern"
        width="24"
        height="24"
        patternUnits="userSpaceOnUse"
      >
        <path
          d="M12 2v4M12 18v4M2 12h4M18 12h4M6 6l2.8 2.8M15.2 15.2L18 18M6 18l2.8-2.8M15.2 8.8L18 6"
          stroke="currentColor"
          strokeWidth="0.5"
          fill="none"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#pharma-pattern)" />
  </svg>
);

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();

  const footerLinkClass =
    'text-sm text-neutral-300 hover:text-primary-300 transition-colors inline-flex items-center gap-1 group';

  return (
    <footer className="relative bg-forest-900 text-neutral-300 overflow-hidden">
      {/* Top gradient line */}
      <div
        className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-primary-500 to-transparent"
        aria-hidden
      />
      <PharmaCrossPattern />

      <div className="relative container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12">
          {/* Column 1 - Brand */}
          <div>
            <Link href="/" className="inline-flex items-center gap-2 mb-4">
              <span className="font-display font-bold text-white text-xl">
                Amicale
              </span>
              <span className="font-display font-normal text-primary-400 text-xl">
                FPHM
              </span>
            </Link>
            <p className="text-primary-300 italic text-sm mb-6 max-w-xs">
              Unis pour l&apos;excellence de l&apos;enseignement pharmaceutique
            </p>
            <div className="flex gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500/30 transition-colors text-white"
                aria-label="Facebook"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary-500/30 transition-colors text-white"
                aria-label="Instagram"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Column 2 - Navigation principale */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-4">
              Navigation
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/" className={footerLinkClass}>
                  Accueil
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className={footerLinkClass}>
                  À propos
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/evenements" className={footerLinkClass}>
                  Événements
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/annonces" className={footerLinkClass}>
                  Annonces
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/adhesion" className={footerLinkClass}>
                  Adhésion
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/partenaires" className={footerLinkClass}>
                  Partenaires
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 3 - À propos (sous-pages) */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-4">
              À propos
            </h3>
            <ul className="space-y-3">
              <li>
                <Link href="/a-propos/mot-du-president" className={footerLinkClass}>
                  Mot du président
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/a-propos/presentation" className={footerLinkClass}>
                  Présentation
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/a-propos/equipe" className={footerLinkClass}>
                  Équipe
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
              <li>
                <Link href="/a-propos/documents" className={footerLinkClass}>
                  Documents administratifs
                  <ArrowRight className="w-4 h-4 opacity-0 -ml-1 group-hover:opacity-100 group-hover:ml-1 transition-all" />
                </Link>
              </li>
            </ul>
          </div>

          {/* Column 4 - Contact */}
          <div>
            <h3 className="text-xs font-semibold uppercase tracking-wider text-primary-400 mb-4">
              Contact
            </h3>
            <div className="space-y-4 text-sm">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-primary-400 flex-shrink-0 mt-0.5" />
                <span>
                  Rue Avicenne - Monastir
                  <br />
                  5000 Monastir
                </span>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="mailto:asso.fphm@gmail.com"
                  className="hover:text-primary-300 transition-colors"
                >
                  asso.fphm@gmail.com
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-primary-400 flex-shrink-0" />
                <a
                  href="tel:+21673461000"
                  className="hover:text-primary-300 transition-colors"
                >
                  +216 73 46 10 00
                </a>
              </div>
              <p className="text-neutral-400 text-xs mt-2">
                Bureau : Lun - Ven 9h - 17h
              </p>
            </div>
          </div>
        </div>

        {/* Separator & Copyright */}
        <div className="mt-12 pt-8 border-t border-white/10">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-neutral-400">
              © {currentYear} Amicale de la Faculté de Pharmacie de Monastir
            </p>
            <div className="flex gap-6 text-sm">
              <Link
                href="/mentions-legales"
                className="text-neutral-400 hover:text-primary-300 transition-colors"
              >
                Mentions légales
              </Link>
              <span className="text-white/20">|</span>
              <Link
                href="/confidentialite"
                className="text-neutral-400 hover:text-primary-300 transition-colors"
              >
                Confidentialité
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
