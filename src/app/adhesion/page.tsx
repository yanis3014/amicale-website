'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Gift, ArrowRight, Users, CheckCircle2, Loader2 } from 'lucide-react';
import { getAvantages } from '@/lib/api/avantages';
import type { ApiAvantage } from '@/lib/api/types';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

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
    <div className="min-h-screen bg-neutral-50">
      {/* Hero */}
      <div className="relative bg-gradient-to-br from-primary-600 to-forest-700 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/pattern.svg')] opacity-5" aria-hidden />
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24 relative z-10">
          <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg">
            Adhésion
          </h1>
          <p className="text-lg md:text-xl text-primary-100 max-w-2xl">
            Rejoignez l&apos;Amicale des Enseignants de la Faculté de Pharmacie de Monastir
            et bénéficiez d&apos;avantages réservés aux membres.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        {/* Principe de l'adhésion */}
        <section className="max-w-3xl mx-auto mb-16">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <Users className="w-8 h-8 text-primary-600" />
            Principe de l&apos;adhésion
          </h2>
          <div className="prose prose-neutral text-neutral-600 space-y-4 font-body">
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
          <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-6 flex items-center gap-3">
            <Gift className="w-8 h-8 text-primary-600" />
            Les avantages adhérent
          </h2>
          <p className="text-neutral-600 mb-8 font-body">
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
            <ul className="space-y-4">
              {avantages.map((a) => (
                <li key={a.id}>
                  <Card variant="default" className="p-4 flex items-start gap-4">
                    <span
                      className={`shrink-0 rounded-lg px-2.5 py-1 text-sm font-medium ${
                        a.type_avantage === 'reduction'
                          ? 'bg-amber-100 text-amber-800'
                          : a.type_avantage === 'autre'
                            ? 'bg-neutral-100 text-neutral-700'
                            : 'bg-primary-100 text-primary-700'
                      }`}
                    >
                      {a.type_avantage === 'reduction' ? 'Réduction' : a.type_avantage === 'autre' ? 'Autre' : 'Avantage'}
                    </span>
                    <span className="flex items-center gap-2 text-neutral-800 font-body">
                      <CheckCircle2 className="w-5 h-5 text-primary-600 shrink-0" />
                      {a.libelle}
                    </span>
                  </Card>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* CTA Devenir membre */}
        <section className="max-w-2xl mx-auto text-center">
          <Card variant="bordered" className="p-8 md:p-12">
            <h2 className="font-display text-2xl font-bold text-neutral-900 mb-3">
              Devenir membre
            </h2>
            <p className="text-neutral-600 mb-6 font-body">
              Enseignant à la FPHM ? Créez votre compte et soumettez votre demande d&apos;adhésion.
              Après validation de votre cotisation, vous aurez accès à votre espace membre et à tous les avantages.
            </p>
            <Link href="/register">
              <Button
                size="xl"
                className="inline-flex items-center gap-2 bg-primary-500 text-white hover:bg-primary-600"
              >
                Créer un compte et adhérer
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <p className="text-sm text-neutral-500 mt-6 font-body">
              Vous avez déjà un compte ?{' '}
              <Link href="/login" className="text-primary-600 font-medium hover:underline">
                Se connecter
              </Link>
            </p>
          </Card>
        </section>
      </div>
    </div>
  );
}
