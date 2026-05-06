'use client';

import { useEffect, useState, useRef } from 'react';
import { Home, Upload, ImageIcon } from 'lucide-react';
import { getPageSetting, setPageSetting, uploadHomeHeroImage, HOME_SETTING_KEYS } from '@/lib/api/settings';
import { getImageUrl } from '@/lib/api/utils/imageUrl';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

type HomeKey = (typeof HOME_SETTING_KEYS)[number];

const LABELS: Record<HomeKey, string> = {
  home_banderole: 'Banderole défilante (haut de page)',
  home_video_url: 'URL de la vidéo (YouTube, Vimeo ou lien direct)',
  home_annee_universitaire: 'Année universitaire (ex. 2025-2026)',
  home_hero_image: 'Image de la hero (carte à droite)',
  home_hero_text: 'Texte de présentation (hero)',
  home_hero_title: 'Titre de la hero',
  home_members_count_text: 'Texte du nombre de membres inscrits',
};

export default function AdminAccueilPage() {
  const [values, setValues] = useState<Record<string, string>>({});
  const [edits, setEdits] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [uploadingHero, setUploadingHero] = useState(false);
  const heroInputRef = useRef<HTMLInputElement | null>(null);
  const toast = useToast();

  const load = () => {
    setLoading(true);
    Promise.all(HOME_SETTING_KEYS.map((k) => getPageSetting(k)))
      .then((results) => {
        const next: Record<string, string> = {};
        const nextEdits: Record<string, string> = {};
        HOME_SETTING_KEYS.forEach((k, i) => {
          const v = results[i]?.value ?? '';
          next[k] = v;
          nextEdits[k] = v;
        });
        setValues(next);
        setEdits(nextEdits);
      })
      .catch(() => toast.error('Erreur lors du chargement'))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const handleSave = async (key: string) => {
    setSaving(key);
    try {
      await setPageSetting(key, edits[key] ?? '');
      setValues((prev) => ({ ...prev, [key]: edits[key] ?? '' }));
      toast.success('Enregistré');
    } catch {
      toast.error('Erreur lors de l\'enregistrement');
    } finally {
      setSaving(null);
    }
  };

  const handleHeroImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !file.type.startsWith('image/')) {
      toast.error('Veuillez sélectionner une image (JPG, PNG, etc.)');
      e.target.value = '';
      return;
    }
    setUploadingHero(true);
    uploadHomeHeroImage(file)
      .then((res) => {
        setValues((prev) => ({ ...prev, home_hero_image: res.value }));
        setEdits((prev) => ({ ...prev, home_hero_image: res.value }));
        toast.success('Image hero mise à jour');
      })
      .catch((err) => toast.error(err instanceof Error ? err.message : 'Erreur upload'))
      .finally(() => {
        setUploadingHero(false);
        e.target.value = '';
      });
  };

  if (loading) {
    return (
      <div className="p-6 md:p-10">
        <h1 className="font-display text-2xl font-bold text-neutral-900 mb-6">Page d&apos;accueil</h1>
        <div className="flex items-center gap-3 text-neutral-600">
          <LoadingSpinner />
          <span>Chargement…</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-10">
      <h1 className="font-display text-2xl font-bold text-neutral-900 mb-2 flex items-center gap-2">
        <Home className="w-6 h-6 text-[var(--accent)]" />
        Page d&apos;accueil
      </h1>
      <p className="text-neutral-600 mb-8">
        Banderole en haut, année universitaire, vidéo, image de la hero, texte de présentation et texte du nombre de membres. L&apos;événement le plus proche et les partenaires sont gérés ailleurs (Événements, Partenaires).
      </p>

      <div className="space-y-8 max-w-2xl">
        {/* Banderole */}
        <section className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-2">{LABELS.home_banderole}</h2>
          <p className="text-sm text-neutral-500 mb-3">Texte qui défile en haut de la page d&apos;accueil.</p>
          <textarea
            value={edits.home_banderole ?? ''}
            onChange={(e) => setEdits((prev) => ({ ...prev, home_banderole: e.target.value }))}
            rows={3}
            className="w-full px-4 py-3 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="Ex. Congrès National 2026 — Inscriptions ouvertes. • Journée Scientifique — 20 mars 2026."
          />
          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => handleSave('home_banderole')}
              disabled={saving === 'home_banderole' || (edits.home_banderole ?? '') === (values.home_banderole ?? '')}
              leftIcon={saving === 'home_banderole' ? <LoadingSpinner /> : undefined}
            >
              {saving === 'home_banderole' ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </section>

        {/* Titre hero */}
        <section className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-2">{LABELS.home_hero_title}</h2>
          <p className="text-sm text-neutral-500 mb-3">Titre principal affiché en haut de la page d&apos;accueil. Mettez un mot entre *astérisques* pour le surligner (ex. L&apos;Amicale qui *fédère* les enseignants...).</p>
          <input
            type="text"
            value={edits.home_hero_title ?? ''}
            onChange={(e) => setEdits((prev) => ({ ...prev, home_hero_title: e.target.value }))}
            className="w-full px-4 py-3 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="L'Amicale qui *fédère* les enseignants de la Faculté de Pharmacie"
          />
          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => handleSave('home_hero_title')}
              disabled={saving === 'home_hero_title' || (edits.home_hero_title ?? '') === (values.home_hero_title ?? '')}
              leftIcon={saving === 'home_hero_title' ? <LoadingSpinner /> : undefined}
            >
              {saving === 'home_hero_title' ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </section>

        {/* Texte hero (présentation) */}
        <section className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-2">{LABELS.home_hero_text}</h2>
          <p className="text-sm text-neutral-500 mb-3">Paragraphe affiché sous le titre principal sur la page d&apos;accueil (hero). Si vide, un texte par défaut est utilisé.</p>
          <textarea
            value={edits.home_hero_text ?? ''}
            onChange={(e) => setEdits((prev) => ({ ...prev, home_hero_text: e.target.value }))}
            rows={4}
            className="w-full px-4 py-3 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="L'association des enseignants de la FPHM : congrès, journées scientifiques..."
          />
          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => handleSave('home_hero_text')}
              disabled={saving === 'home_hero_text' || (edits.home_hero_text ?? '') === (values.home_hero_text ?? '')}
              leftIcon={saving === 'home_hero_text' ? <LoadingSpinner /> : undefined}
            >
              {saving === 'home_hero_text' ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </section>

        {/* Texte nombre de membres */}
        <section className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-2">{LABELS.home_members_count_text}</h2>
          <p className="text-sm text-neutral-500 mb-3">Texte affiché pour le nombre de membres (ex. &quot;120+ Enseignants membres&quot;). Si vide, le texte par défaut est utilisé.</p>
          <input
            type="text"
            value={edits.home_members_count_text ?? ''}
            onChange={(e) => setEdits((prev) => ({ ...prev, home_members_count_text: e.target.value }))}
            className="w-full px-4 py-3 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="120+ Enseignants membres"
          />
          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => handleSave('home_members_count_text')}
              disabled={saving === 'home_members_count_text' || (edits.home_members_count_text ?? '') === (values.home_members_count_text ?? '')}
              leftIcon={saving === 'home_members_count_text' ? <LoadingSpinner /> : undefined}
            >
              {saving === 'home_members_count_text' ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </section>

        {/* Année universitaire */}
        <section className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-2">{LABELS.home_annee_universitaire}</h2>
          <p className="text-sm text-neutral-500 mb-3">Affichée dans la hero. Si vide, l&apos;année courante sera utilisée (ex. 2025-2026).</p>
          <input
            type="text"
            value={edits.home_annee_universitaire ?? ''}
            onChange={(e) => setEdits((prev) => ({ ...prev, home_annee_universitaire: e.target.value }))}
            className="w-full px-4 py-3 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="2025-2026"
          />
          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => handleSave('home_annee_universitaire')}
              disabled={saving === 'home_annee_universitaire' || (edits.home_annee_universitaire ?? '') === (values.home_annee_universitaire ?? '')}
              leftIcon={saving === 'home_annee_universitaire' ? <LoadingSpinner /> : undefined}
            >
              {saving === 'home_annee_universitaire' ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </section>

        {/* Vidéo */}
        <section className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-2">{LABELS.home_video_url}</h2>
          <p className="text-sm text-neutral-500 mb-3">Lien YouTube (format partage ou embed), Vimeo ou URL directe d&apos;une vidéo.</p>
          <input
            type="url"
            value={edits.home_video_url ?? ''}
            onChange={(e) => setEdits((prev) => ({ ...prev, home_video_url: e.target.value }))}
            className="w-full px-4 py-3 border border-[var(--line)] rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 text-sm"
            placeholder="https://www.youtube.com/watch?v=..."
          />
          <div className="mt-3 flex justify-end">
            <Button
              onClick={() => handleSave('home_video_url')}
              disabled={saving === 'home_video_url' || (edits.home_video_url ?? '') === (values.home_video_url ?? '')}
              leftIcon={saving === 'home_video_url' ? <LoadingSpinner /> : undefined}
            >
              {saving === 'home_video_url' ? 'Enregistrement…' : 'Enregistrer'}
            </Button>
          </div>
        </section>

        {/* Image hero */}
        <section className="bg-white rounded-xl border border-[var(--line)] shadow-sm p-6">
          <h2 className="font-display font-semibold text-neutral-900 mb-2 flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[var(--accent)]" />
            {LABELS.home_hero_image}
          </h2>
          <p className="text-sm text-neutral-500 mb-3">Image affichée dans la carte à droite du titre sur la page d&apos;accueil.</p>
          <div className="flex flex-wrap items-center gap-4">
            {values.home_hero_image ? (
              <div className="relative w-48 h-36 rounded-xl overflow-hidden bg-neutral-100 border border-[var(--line)]">
                <img
                  src={getImageUrl(values.home_hero_image)}
                  alt="Hero"
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="w-48 h-36 rounded-xl bg-neutral-100 border border-[var(--line)] flex items-center justify-center text-neutral-400">
                <ImageIcon className="w-12 h-12" />
              </div>
            )}
            <input
              ref={heroInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleHeroImageUpload}
            />
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => heroInputRef.current?.click()}
              disabled={uploadingHero}
              leftIcon={uploadingHero ? <LoadingSpinner /> : <Upload className="w-4 h-4" />}
            >
              {uploadingHero ? 'Envoi…' : values.home_hero_image ? "Changer l'image" : 'Ajouter une image'}
            </Button>
          </div>
        </section>
      </div>
    </div>
  );
}
