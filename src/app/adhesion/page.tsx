'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Loader2 } from 'lucide-react';
import { getAvantages } from '@/lib/api/avantages';
import type { ApiAvantage } from '@/lib/api/types';
import { Card } from '@/components/ui/Card';

export default function AdhesionPage() {
  const [avantages, setAvantages] = useState<ApiAvantage[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    getAvantages()
      .then((data) => {
        if (!cancelled) setAvantages(data);
      })
      .catch(() => {
        if (!cancelled) setAvantages([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => { cancelled = true; };
  }, []);

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      <div className="bg-[var(--bg)] pt-16">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 pb-8">
          <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">— REJOINDRE L&apos;AMICALE</p>
          <h1 className="mt-3 [font-family:'Newsreader',serif] text-[clamp(48px,6vw,80px)] leading-[0.98] font-normal text-[var(--ink)]">
            Adhésion
          </h1>
          <p className="mt-4 text-[17px] leading-relaxed text-[var(--ink-2)] max-w-2xl">
            Rejoignez l&apos;Amicale des Enseignants de la Faculté de Pharmacie de Monastir
            et bénéficiez d&apos;avantages réservés aux membres.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Principe de l'adhésion */}
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="[font-family:'Newsreader',serif] text-2xl md:text-3xl font-medium text-[var(--ink)] mb-6">
            Principe de l&apos;adhésion
          </h2>
          <div className="prose prose-neutral text-[var(--ink-2)] space-y-4 font-body">
            <p className="leading-relaxed">
              L&apos;<strong>Amicale</strong> rassemble les enseignants de la Faculté de Pharmacie de Monastir
              autour de la vie associative, des événements scientifiques et de la solidarité entre pairs.
            </p>
            <p className="leading-relaxed">
              En adhérant, vous devenez membre à part entière : vous participez aux décisions,
              vous avez accès aux activités (ateliers, formations, journées scientifiques) et
              vous bénéficiez des avantages négociés par l&apos;Amicale pour ses adhérents.
            </p>
            <p className="leading-relaxed">
              L&apos;adhésion se fait par une cotisation annuelle. Une fois votre dossier validé
              par le Bureau, vous accédez à votre espace membre et à l&apos;ensemble des avantages
              listés ci-dessous.
            </p>
          </div>
        </section>

        {/* Avantages (définis par l'admin dans le dashboard) */}
        <section className="max-w-4xl mx-auto mb-16">
          <h2 className="[font-family:'Newsreader',serif] text-2xl md:text-3xl font-medium text-[var(--ink)] mb-6">
            Les avantages adhérent
          </h2>
          <p className="text-[var(--ink-2)] mb-8 font-body">
            Les avantages ci-dessous sont accordés aux membres à jour de leur cotisation.
            Ils sont définis et mis à jour par l&apos;Amicale.
          </p>

          {loading ? (
            <div className="flex items-center justify-center gap-2 text-neutral-500 py-12">
              <Loader2 className="w-6 h-6 animate-spin" />
              <span>Chargement des avantages…</span>
            </div>
          ) : avantages.length === 0 ? (
            <Card variant="bordered" className="p-8 text-center">
              <p className="text-neutral-500 font-body">
                Aucun avantage n&apos;est affiché pour le moment. Les avantages sont configurés
                par l&apos;équipe de l&apos;Amicale et apparaîtront ici une fois définis.
              </p>
            </Card>
          ) : (
            <ul className="border-t border-[var(--line)]">
              {avantages.map((a, index) => (
                <li key={a.id} className="grid grid-cols-[56px_1fr] gap-4 border-b border-[var(--line)] py-5">
                  <span className="font-mono text-[12px] tracking-[0.08em] text-[var(--accent)]">
                    {String(index + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <span className="text-[11px] uppercase tracking-[0.08em] text-[var(--ink-3)]">
                      {a.type_avantage === 'reduction' ? 'Réduction' : a.type_avantage === 'autre' ? 'Autre' : 'Avantage'}
                    </span>
                    <p className="mt-2 text-[16px] text-[var(--ink)]">{a.libelle}</p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* CTA Devenir membre */}
        <section className="max-w-5xl mx-auto">
          <div
            className="p-10 md:p-[72px] text-[var(--bg)]"
            style={{ background: 'var(--accent-deep)', borderRadius: 'var(--radius-xl, 28px)' }}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-end">
              <div>
                <h2 className="[font-family:'Newsreader',serif] text-[clamp(36px,4.5vw,54px)] leading-[1.02] font-normal mb-4">
                  Devenez membre de l&apos;
                  <span className="italic text-[var(--gold)]">amicale</span>.
                </h2>
                <p className="text-[15px] leading-relaxed opacity-85">
                  Enseignant à la FPHM ? Créez votre compte et soumettez votre demande d&apos;adhésion.
                </p>
              </div>
              <div className="flex flex-wrap gap-3 md:justify-end">
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium transition-colors"
                  style={{ background: 'var(--bg)', color: 'var(--accent-deep)' }}
                >
                  Créer un compte et adhérer
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-full px-6 py-3 text-[14px] font-medium border transition-colors"
                  style={{ borderColor: 'rgba(255,255,255,0.3)' }}
                >
                  Se connecter
                </Link>
              </div>
            </div>
            <p className="text-sm opacity-70 mt-8">
              Enseignant à la FPHM ? Créez votre compte et soumettez votre demande d&apos;adhésion.
              Après validation de votre cotisation, vous aurez accès à votre espace membre et à tous les avantages.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
