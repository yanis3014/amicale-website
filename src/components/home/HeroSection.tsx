'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import type { ApiEvent } from '@/lib/api/types';

const DEFAULT_HERO_TITLE = "L'amicale qui / *fédère* les / enseignants de la / Faculté de Pharmacie.";
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
        <span key={i} className="inline-block italic font-medium text-[var(--accent)]">
          {word}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function splitTitleLines(title: string): string[] {
  return title
    .split('/')
    .map((line) => line.trim())
    .filter(Boolean);
}

function extractMembersValue(text: string): string {
  const match = text.trim().match(/^([0-9]+(?:\+)*)/);
  return match ? match[1] : text.trim();
}

interface HeroSectionProps {
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
  nextEvent,
  heroImageUrl,
  heroTitle: heroTitleProp,
  heroText: heroTextProp,
  membersCountText: membersCountTextProp,
}) => {
  const heroTitle = heroTitleProp?.trim() || DEFAULT_HERO_TITLE;
  const heroText = heroTextProp?.trim() || DEFAULT_HERO_TEXT;
  const membersCountText = membersCountTextProp?.trim() || DEFAULT_MEMBERS_COUNT_TEXT;
  const heroSrc = heroImageUrl ? getImageUrl(heroImageUrl) : null;
  const titleLines = splitTitleLines(heroTitle);
  const membersValue = extractMembersValue(membersCountText);
  const eventsPerYearValue = nextEvent ? '12+' : '10+';

  return (
    <section className="bg-[var(--bg)] pt-16 pb-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-10 lg:gap-14 items-start">
          <div>
            <h1 className="[font-family:'Newsreader',serif] text-[clamp(56px,7.5vw,104px)] leading-[0.98] font-normal text-[var(--ink)]">
              {titleLines.map((line, index) => (
                <span key={`${line}-${index}`} className="block">
                  {parseHeroTitle(line)}
                </span>
              ))}
            </h1>

            <div className="mt-10 flex flex-wrap gap-4">
              <Link href="/register">
                <span className="group inline-flex items-center justify-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium bg-[var(--accent)] text-[var(--bg)] hover:bg-[var(--accent-deep)] transition-all duration-200">
                  Devenir membre
                  <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-[3px]" />
                </span>
              </Link>
              <Link href="/evenements">
                <span className="inline-flex items-center justify-center rounded-full px-6 py-3 text-[14px] font-medium border border-[var(--line-strong)] text-[var(--ink-2)] hover:bg-[var(--surface)] transition-all duration-200">
                  Voir les archives
                </span>
              </Link>
            </div>
          </div>

          <div>
            <div
              className="h-[280px] border border-[var(--line)] overflow-hidden bg-[var(--surface)]"
              style={{ borderRadius: 'var(--radius-lg, 28px)' }}
            >
              {heroSrc ? (
                <div className="relative h-full w-full">
                  <Image
                    src={heroSrc}
                    alt="Communauté Amicale FPHM"
                    fill
                    className="object-cover"
                    sizes="(min-width: 1024px) 40vw, 100vw"
                    priority
                  />
                </div>
              ) : (
                <div
                  className="h-full w-full"
                  style={{
                    background:
                      'repeating-linear-gradient(135deg, var(--accent-tint) 0 8px, var(--surface-2) 8px 16px)',
                  }}
                />
              )}
            </div>

            <p className="mt-8 text-[19px] leading-relaxed text-[var(--ink-2)] max-w-[42ch]">
              {heroText}
            </p>
            <div className="mt-10 grid grid-cols-2 border border-[var(--line)] rounded-xl overflow-hidden">
              {[
                { label: 'Membres', value: membersValue },
                { label: 'Événements/an', value: eventsPerYearValue },
                { label: 'Fondée en', value: '1975' },
                { label: 'Départements', value: '05' },
              ].map((item, index) => (
                <div
                  key={item.label}
                  className={`p-5 ${index % 2 === 1 ? 'border-l border-[var(--line)]' : ''} ${index > 1 ? 'border-t border-[var(--line)]' : ''}`}
                >
                  <div className="[font-family:'Newsreader',serif] text-[32px] leading-none text-[var(--accent)]">
                    {item.value}
                  </div>
                  <div className="mt-2 text-[12px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                    {item.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
