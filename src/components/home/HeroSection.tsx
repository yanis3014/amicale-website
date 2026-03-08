'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { ArrowRight, Play } from 'lucide-react';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiEvent } from '@/lib/api/types';

const DEFAULT_HERO_TITLE = "L'Amicale qui *fédère* les enseignants de la Faculté de Pharmacie";
const DEFAULT_HERO_TEXT =
  "L'association des enseignants de la FPHM : congrès, journées scientifiques, formations continues et réseau professionnel au service de l'excellence de l'enseignement pharmaceutique.";
const DEFAULT_MEMBERS_COUNT_TEXT = '120+ Enseignants membres';

/** Découpe un titre contenant *mot* pour afficher "mot" en surligné. */
function parseHeroTitle(title: string): React.ReactNode {
  const parts = title.split(/(\*[^*]*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      const word = part.slice(1, -1);
      return (
        <span key={i} className="relative inline-block text-primary-500">
          {word}
          <svg
            className="absolute -bottom-1 left-0 w-full"
            viewBox="0 0 200 8"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden
          >
            <path
              d="M1 5.5C25 2 75 2 100 5.5S175 2 199 5.5"
              stroke="currentColor"
              strokeWidth="3"
              strokeLinecap="round"
              className="text-primary-500"
            />
          </svg>
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

interface HeroSectionProps {
  anneeUniversitaire: string;
  nextEvent: ApiEvent | null;
  heroImageUrl: string | null;
  /** Titre principal de la hero (soutien *mot* pour le surligner). Si null, utilise le texte par défaut. */
  heroTitle?: string | null;
  /** Texte de présentation sous le titre (hero). Si null, utilise le texte par défaut. */
  heroText?: string | null;
  /** Texte affiché pour le nombre de membres (ex. "120+ Enseignants membres"). Si null, utilise le texte par défaut. */
  membersCountText?: string | null;
}

export const HeroSection: React.FC<HeroSectionProps> = ({
  anneeUniversitaire,
  nextEvent,
  heroImageUrl,
  heroTitle: heroTitleProp,
  heroText: heroTextProp,
  membersCountText: membersCountTextProp,
}) => {
  const heroTitle = heroTitleProp?.trim() || DEFAULT_HERO_TITLE;
  const heroText = heroTextProp?.trim() || DEFAULT_HERO_TEXT;
  const membersCountText = membersCountTextProp?.trim() || DEFAULT_MEMBERS_COUNT_TEXT;
  const heroSrc = heroImageUrl ? getImageUrl(heroImageUrl) : '/images/hero2.jpeg';
  const eventDate = nextEvent?.date
    ? new Date(nextEvent.date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' })
    : null;

  return (
    <section className="bg-neutral-50 py-16 md:py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[55%_45%] gap-12 lg:gap-16 items-center">
          {/* Left Content */}
          <div>
            <div
              className="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 text-primary-700 rounded-full text-sm font-medium mb-6 animate-fade-up"
              style={{ animationDelay: '0ms' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary-500" />
              </span>
              Année universitaire {anneeUniversitaire}
            </div>

            <h1
              className="font-display text-5xl md:text-7xl font-extrabold leading-tight text-neutral-900 mb-6 animate-fade-up"
              style={{ animationDelay: '150ms' }}
            >
              {parseHeroTitle(heroTitle)}
            </h1>

            <p
              className="text-lg text-neutral-500 max-w-md font-body mb-8 animate-fade-up"
              style={{ animationDelay: '300ms' }}
            >
              {heroText}
            </p>

            <div
              className="flex flex-wrap gap-4 mb-12 animate-fade-up"
              style={{ animationDelay: '450ms' }}
            >
              <Link href="/register">
                <Button variant="primary" size="xl" rightIcon={<ArrowRight className="w-5 h-5" />}>
                  Devenir membre
                </Button>
              </Link>
              <Link href="/evenements">
                <Button variant="ghost" size="xl" rightIcon={<Play className="w-5 h-5" />}>
                  Voir les événements
                </Button>
              </Link>
            </div>

            {/* Stats row */}
            <div
              className="flex flex-wrap items-center gap-4 pt-8 border-t border-neutral-200 animate-fade-up"
              style={{ animationDelay: '600ms' }}
            >
              <span className="font-display text-primary-600 font-bold text-lg">
                {membersCountText}
              </span>
              <span className="text-neutral-300">|</span>
              <span className="font-display text-primary-600 font-bold text-lg">
                50+ Événements
              </span>
              <span className="text-neutral-300">|</span>
              <span className="font-display text-primary-600 font-bold text-lg">
                Depuis 1974
              </span>
            </div>
          </div>

          {/* Right - Image + Floating card (prochain événement) */}
          <div
            className="relative animate-fade-up"
            style={{ animationDelay: '200ms' }}
          >
            <div className="relative rounded-3xl overflow-hidden shadow-card-lg bg-white">
              <div className="relative aspect-[4/3] w-full">
                {heroImageUrl ? (
                  <img
                    src={heroSrc}
                    alt="Communauté Amicale FPHM"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <Image
                    src={heroSrc}
                    alt="Communauté Amicale FPHM"
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    priority
                  />
                )}
              </div>
              {nextEvent && (
                <div className="absolute bottom-4 left-4 right-4 md:right-auto md:w-64 bg-white/80 backdrop-blur-md rounded-2xl p-4 shadow-card border border-white/50">
                  <p className="text-xs font-semibold text-neutral-500 mb-1">
                    Prochain événement
                  </p>
                  <Link href={`/evenements/${nextEvent.id}`} className="block hover:opacity-90">
                    <p className="font-display font-bold text-neutral-900">
                      {nextEvent.titre}
                    </p>
                  </Link>
                  <p className="text-sm text-neutral-500">{eventDate}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
