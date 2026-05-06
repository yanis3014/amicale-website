'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import { ArrowRight, FileText, FolderOpen, Heart, History, Target, UserCircle, Users } from 'lucide-react';
import { getPageSetting } from '@/lib/api/settings';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import { Card } from '@/components/ui/Card';

const PLACEHOLDER = 'Contenu à venir.';

/** Pages « À propos » pour le bloc « Découvrir aussi » (exclure la page courante via excludeSettingKey). */
const PAGES_POUR_DECOUVRIR: { settingKey: string; href: string; label: string; icon: typeof UserCircle }[] = [
  { settingKey: 'mot_du_president', href: '/a-propos/mot-du-president', label: 'Mot du président', icon: UserCircle },
  { settingKey: 'presentation', href: '/a-propos/presentation', label: 'Présentation', icon: FileText },
  { settingKey: 'historique', href: '/a-propos/historique', label: 'Historique', icon: History },
  { settingKey: 'equipe', href: '/a-propos/equipe', label: 'Équipe', icon: Users },
  { settingKey: 'missions_visions', href: '/a-propos/missions-visions', label: 'Missions & Visions', icon: Target },
  { settingKey: 'valeurs', href: '/a-propos/valeurs', label: 'Valeurs', icon: Heart },
  { settingKey: 'documents', href: '/a-propos/documents', label: 'Documents administratifs', icon: FolderOpen },
];

interface DynamicPageContentProps {
  settingKey: string;
  pageTitle: string;
  placeholder?: string;
  /** Clé du réglage pour l'image de la page. Si fournie, l'image s'affiche en en-tête. */
  imageKey?: string;
  /** Clé de la page courante pour l'exclure du bloc « Découvrir aussi ». */
  excludeFromRelated?: string;
}

export function DynamicPageContent({
  settingKey,
  pageTitle,
  placeholder = PLACEHOLDER,
  imageKey,
  excludeFromRelated,
}: DynamicPageContentProps) {
  const [content, setContent] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const promises: Promise<unknown>[] = [getPageSetting(settingKey).then((s) => {
      if (!cancelled) setContent(s.value?.trim() || '');
    })];
    if (imageKey) {
      promises.push(
        getPageSetting(imageKey).then((s) => {
          if (!cancelled) setImageUrl(s.value?.trim() || null);
        })
      );
    }
    Promise.all(promises).catch(() => {
      if (!cancelled) setContent('');
    }).finally(() => {
      if (!cancelled) setLoading(false);
    });
    return () => { cancelled = true; };
  }, [settingKey, imageKey]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--bg)]">
        {imageKey && (
          <div className="h-[40vh] min-h-[240px] bg-neutral-200 animate-pulse" />
        )}
        <div className="py-16 container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="h-10 w-48 bg-neutral-200 animate-pulse rounded mb-6" />
          <div className="space-y-3 max-w-3xl">
            <div className="h-4 bg-neutral-200 animate-pulse rounded w-full" />
            <div className="h-4 bg-neutral-200 animate-pulse rounded w-5/6" />
            <div className="h-4 bg-neutral-200 animate-pulse rounded w-4/6" />
          </div>
          <div className="mt-8 flex justify-center">
            <LoadingSpinner />
          </div>
        </div>
      </div>
    );
  }

  const bannerUrl = imageUrl ? getImageUrl(imageUrl) : '';
  const relatedPages = excludeFromRelated
    ? PAGES_POUR_DECOUVRIR.filter((p) => p.settingKey !== excludeFromRelated)
    : PAGES_POUR_DECOUVRIR;

  return (
    <div className="min-h-screen bg-[var(--bg)]">
      {/* Bannière */}
      {bannerUrl && (
        <div className="relative min-h-screen flex flex-col justify-end overflow-hidden text-white">
          <img
            src={bannerUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" aria-hidden />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 pb-20 md:pb-28 pt-24">
            <h1 className="font-display text-4xl md:text-6xl font-bold mb-4 drop-shadow-lg max-w-4xl">
              {pageTitle}
            </h1>
          </div>
        </div>
      )}

      <div className={`container mx-auto px-4 sm:px-6 lg:px-8 ${bannerUrl ? 'py-12 md:py-16' : 'pt-16 pb-12 md:pb-16'}`}>
        {/* Titre si pas de bannière */}
        {!bannerUrl && (
          <>
            <p className="font-mono text-[12px] tracking-[0.1em] text-[var(--accent)]">— À PROPOS</p>
            <h1 className="[font-family:'Newsreader',serif] text-[48px] leading-[1.02] font-normal text-[var(--ink)] mt-3 mb-8">
              {pageTitle}
            </h1>
          </>
        )}

        <div className="py-4 md:py-6 mb-16 max-w-4xl">
          <div className="prose prose-neutral max-w-none prose-headings:[font-family:'Newsreader',serif] prose-headings:text-[var(--ink)] prose-p:text-[17px] prose-p:text-[var(--ink-2)] prose-p:leading-[1.65] prose-a:text-[var(--accent)] prose-a:no-underline hover:prose-a:underline prose-ul:text-[var(--ink-2)] prose-ol:text-[var(--ink-2)] prose-li:leading-[1.65]">
            {content ? <ReactMarkdown>{content}</ReactMarkdown> : <p>{placeholder}</p>}
          </div>
        </div>

        {/* Découvrir aussi — autres pages À propos */}
        <section className="mb-20" aria-label="Découvrir aussi">
          <h2 className="[font-family:'Newsreader',serif] text-2xl md:text-3xl font-medium text-[var(--ink)] mb-6 text-center">
            Découvrir aussi
          </h2>
          <p className="text-[var(--ink-2)] text-center max-w-2xl mx-auto mb-8">
            Explorez les autres rubriques pour mieux connaître l&apos;Amicale.
          </p>
          <div className="max-w-5xl mx-auto border-y border-[var(--line)]">
            {relatedPages.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className="group flex items-center gap-3 border-b border-[var(--line)] last:border-b-0 px-4 py-4 sm:px-5 hover:bg-[var(--surface)] transition-colors"
              >
                <Icon className="w-4 h-4 text-[var(--ink-3)] flex-shrink-0" />
                <span className="text-[15px] text-[var(--ink-2)] group-hover:text-[var(--accent)] transition-colors">{label}</span>
                <span className="ml-auto text-[18px] text-[var(--ink-3)] group-hover:text-[var(--accent)] transition-colors">→</span>
              </Link>
            ))}
          </div>
        </section>

        {/* CTA — Rejoindre l'Amicale */}
        <section className="text-center" aria-label="Rejoindre l'Amicale">
          <Card variant="bordered" className="p-8 md:p-12 inline-block max-w-2xl">
            <h2 className="font-display text-2xl md:text-3xl font-bold text-neutral-900 mb-3">
              Rejoindre l&apos;Amicale
            </h2>
            <p className="text-neutral-600 mb-6 text-lg">
              Enseignant à la FPHM ? Rejoignez l&apos;Amicale pour accéder aux événements, aux annonces et aux avantages réservés aux membres.
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link
                href="/adhesion"
                className="inline-flex items-center justify-center gap-2 rounded-full font-body font-semibold px-6 py-3 text-lg bg-[var(--accent)] text-white hover:bg-[var(--accent-deep)] shadow-sm transition-all"
              >
                Devenir membre
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href="/evenements"
                className="inline-flex items-center justify-center gap-2 rounded-xl font-body font-semibold px-6 py-3 text-lg border-2 border-primary-500 text-[var(--accent)] hover:bg-primary-50 transition-all"
              >
                Voir les événements
              </Link>
            </div>
          </Card>
        </section>
      </div>
    </div>
  );
}
