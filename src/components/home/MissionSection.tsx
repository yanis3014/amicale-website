'use client';

import React from 'react';

function renderMissionTitle(title: string): React.ReactNode {
  const parts = title.split(/(\*[^*]*\*)/g);
  return parts.map((part, index) => {
    if (part.startsWith('*') && part.endsWith('*')) {
      return (
        <span key={index} className="italic font-medium text-[var(--accent)]">
          {part.slice(1, -1)}
        </span>
      );
    }
    return <React.Fragment key={index}>{part}</React.Fragment>;
  });
}

const MISSION_ITEMS = [
  {
    title: 'Solidarité professionnelle',
    description:
      "Renforcer les liens entre enseignantes et enseignants, partager les ressources et accompagner les parcours académiques.",
  },
  {
    title: 'Excellence scientifique',
    description:
      "Promouvoir la formation continue, la recherche collaborative et la diffusion des meilleures pratiques pédagogiques.",
  },
  {
    title: 'Engagement collectif',
    description:
      "Porter des actions concrètes au service de la faculté et encourager l'implication active dans la vie institutionnelle.",
  },
  {
    title: 'Ouverture internationale',
    description:
      'Développer les partenariats, les mobilités et les échanges académiques avec les réseaux nationaux et internationaux.',
  },
];

export const MissionSection: React.FC = () => {
  return (
    <section className="bg-[var(--surface-2)] py-24">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.6fr] gap-10 lg:gap-16">
          <div className="lg:sticky lg:top-28 self-start">
            <div className="font-mono text-[12px] tracking-[0.08em] text-[var(--accent)]">— 03</div>
            <p className="mt-2 text-[13px] text-[var(--ink-3)]">Mission</p>
            <h2 className="mt-4 [font-family:'Newsreader',serif] text-[clamp(34px,4.4vw,56px)] leading-[1.02] font-normal text-[var(--ink)]">
              {renderMissionTitle("Quatre *engagements* qui guident l'amicale.")}
            </h2>
          </div>

          <div>
            {MISSION_ITEMS.map((item, index) => (
              <article
                key={item.title}
                className="grid grid-cols-[60px_1fr] gap-5 border-t border-[var(--line)] py-7 first:pt-2 last:border-b"
              >
                <div className="font-mono text-[13px] tracking-[0.06em] text-[var(--accent)]">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <div>
                  <h3 className="[font-family:'Newsreader',serif] text-[26px] leading-tight font-medium text-[var(--ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-[16px] leading-relaxed text-[var(--ink-2)]">{item.description}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
