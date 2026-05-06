'use client';

import React from 'react';
import Link from 'next/link';

export const Footer: React.FC = () => {
  const currentYear = new Date().getFullYear();
  const eyebrowClass = 'font-mono text-[11px] uppercase tracking-[0.12em] opacity-60';
  const linkClass = 'text-[14px] opacity-85 hover:opacity-100 transition-opacity';
  const textClass = 'text-[14px] opacity-85';

  return (
    <footer className="bg-[var(--accent-deep)] text-[var(--bg)]">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-7">
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-[1.4fr_1fr_1fr_1fr] gap-10">
          <div>
            <Link href="/" className="inline-block [font-family:'Newsreader',serif] italic text-[22px] font-medium leading-tight">
              Amicale
              <br />
              des Enseignants
            </Link>
            <p className="mt-5 max-w-sm text-[14px] leading-relaxed opacity-75">
              Association des enseignants de la Faculté de Pharmacie de Monastir, au service de la vie scientifique,
              institutionnelle et collective.
            </p>
          </div>

          <div>
            <p className={eyebrowClass}>Navigation</p>
            <ul className="space-y-3">
              <li>
                <Link href="/" className={linkClass}>Accueil</Link>
              </li>
              <li>
                <Link href="/a-propos" className={linkClass}>À propos</Link>
              </li>
              <li>
                <Link href="/annonces" className={linkClass}>Événements</Link>
              </li>
              <li>
                <Link href="/evenements" className={linkClass}>Archives</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className={eyebrowClass}>Espace adhérent</p>
            <ul className="space-y-3">
              <li>
                <Link href="/login" className={linkClass}>Connexion</Link>
              </li>
              <li>
                <Link href="/adhesion" className={linkClass}>Adhésion</Link>
              </li>
              <li>
                <Link href="/membres" className={linkClass}>Espace membres</Link>
              </li>
              <li>
                <Link href="/a-propos/documents" className={linkClass}>Documents</Link>
              </li>
            </ul>
          </div>

          <div>
            <p className={eyebrowClass}>Contact</p>
            <ul className="space-y-3">
              <li className={textClass}>Décanat FPHM</li>
              <li className={textClass}>Avenue Avicenne</li>
              <li className={textClass}>5000 Monastir</li>
              <li>
                <a href="mailto:asso.fphm@gmail.com" className={linkClass}>asso.fphm@gmail.com</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-[rgba(255,255,255,0.12)]">
          <div className="flex flex-col md:flex-row justify-between items-center gap-3">
            <p className="text-[13px] opacity-60">
              © {currentYear} Amicale de la Faculté de Pharmacie de Monastir
            </p>
            <p className="font-mono text-[12px] opacity-60">v.2026.1 — Refonte</p>
          </div>
        </div>
      </div>
    </footer>
  );
};
